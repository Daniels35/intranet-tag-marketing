import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useDropzone } from 'react-dropzone';
import validator from 'validator';
import './QRGenerator.css'; 

const QRGenerator = () => {
  const [qrText, setQrText] = useState('');
  const [logo, setLogo] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleGenerateQRCode = () => {
    if (!qrText) {
      alert('Debe ingresar una URL');
      return;
    }

    const urlOptions = { protocols: ['http', 'https'], require_tld: false, require_protocol: true };

    if (!validator.isURL(qrText, urlOptions)) {
      alert('Debe ingresar una URL válida');
      return;
    }

    if (!logo) {
      if (!window.confirm('No has agregado un logo. ¿Quieres crear un QR sin logo?')) {
        return;
      }
    }

    const canvas = document.getElementById('qrCodeCanvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the QR code
    const qrCodeElement = document.getElementById('qrCode');
    const qrCodeImage = new Image();
    qrCodeImage.src = qrCodeElement.toDataURL();
    qrCodeImage.onload = () => {
      ctx.drawImage(qrCodeImage, 0, 0, 1200, 1200);

      // Draw the logo if uploaded
      if (logo) {
        const logoImage = new Image();
        logoImage.src = logo;
        logoImage.onload = () => {
          const logoSize = 500; // Size of the logo

          // Draw a white background for the logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2, 0, 2 * Math.PI);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.closePath();
          ctx.clip();

          // Draw the logo
          ctx.drawImage(logoImage, (canvas.width - logoSize) / 2, (canvas.height - logoSize) / 2, logoSize, logoSize);
          ctx.restore();

          setQrCodeData(canvas.toDataURL());
          setPreviewVisible(true); // Muestra la vista previa
        };
      } else {
        setQrCodeData(canvas.toDataURL());
        setPreviewVisible(true); // Muestra la vista previa
      }
    };
  };

  return (
    <div className='qr-generator-container-Master'>
      <div className="qr-generator-container">
        <h1 className="qr-generator-title">Generador de Código QR TAG</h1>
        <input
          type="text"
          placeholder="Introduce la URL"
          value={qrText}
          onChange={(e) => setQrText(e.target.value)}
          className="qr-generator-input"
        />
        <div {...getRootProps()} className="qr-generator-dropzone">
          <input {...getInputProps()} />
          <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una imagen</p>
          <p className="qr-generator-recommendation">Recomendación: El tamaño del logo debe ser <strong>500x500 píxeles</strong></p>
        </div>
        <div className="qr-generator-qrcode">
          {logo && <img src={logo} alt="Logo" className="qr-generator-logo-preview" />}
          <QRCodeCanvas id="qrCode" value={qrText} size={1200} level="H" className='qrCode-view-preview'/>
        </div>
        <button onClick={handleGenerateQRCode} className="qr-generator-button">
          Generar Código QR con Logo
        </button>
      </div>
      <div className={previewVisible ? 'qr-generator-preview-container' : 'qr-generator-preview-container-none'}>
        <canvas id="qrCodeCanvas" width="1200" height="1200" style={{ display: 'none' }}></canvas>
        {qrCodeData && (
          <div className="qr-generator-preview">
            <h2>Vista Previa:</h2>
            <img src={qrCodeData} alt="Código QR con Logo" className="qr-generator-preview-image" />
            <a href={qrCodeData} download="qrCodeWithLogo.png" className="qr-generator-download">
              Descargar
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
