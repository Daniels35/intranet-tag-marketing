import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import profilePlaceholder from '../../assets/profilePlaceholder.png';
import axios from 'axios';
import { fetchUserInfo } from '../../redux/userSlice';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [identificationCard, setIdentificationCard] = useState('');
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("link imagen", userInfo.image );
    if (userInfo) {
      setDateOfBirth(userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toISOString().split('T')[0] : '');
      setEntryDate(userInfo.entryDate ? new Date(userInfo.entryDate).toISOString().split('T')[0] : '');
      setIdentificationCard(userInfo.identificationCard || '');
      setImage(userInfo.imageProfile || profilePlaceholder);
      setPreviewImage(userInfo.imageProfile || profilePlaceholder);
    }
  }, [userInfo]);

  const handleFieldChange = (field, value) => {
    if (field === 'dateOfBirth') setDateOfBirth(value);
    if (field === 'identificationCard') setIdentificationCard(value);
    if (field === 'image') setPreviewImage(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    setEditingField(null);
    setImage(previewImage);
    setShowImagePopup(false);

    try {
      if (editingField === 'identificationCard') {
        await axios.put(`${API_URL}/users/${userInfo.id}/identificationCard`, {
          identificationCard,
        });
      } else if (editingField === 'dateOfBirth') {
        await axios.put(`${API_URL}/users/${userInfo.id}/dateOfBirth`, {
          dateOfBirth,
        });
      }

      // Actualiza el estado global después de guardar
      dispatch(fetchUserInfo());
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }

    // Aquí puedes añadir la lógica para enviar los datos actualizados al backend
    console.log({
      dateOfBirth,
      identificationCard,
      image: previewImage,
    });
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setShowImagePopup(false);
    setPreviewImage(image);
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">{userInfo.name}</h2>
      <div className="profile-info">
        <div className="profile-image-container">
          <img src={image} alt="Perfil" className="profile-image" />
          <FaEdit className="edit-icon edit-icon-imagen-profile" onClick={() => setShowImagePopup(true)} />
        </div>
        <form onSubmit={handleSaveClick} className="profile-form">
          <div className="profile-field">
            <label htmlFor="email">Correo Electrónico:</label>
            <div className="editable-field">
              <span>{userInfo.email}</span>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="position">Posición:</label>
            <div className="editable-field">
              <span>{userInfo.position}</span>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="accumulatedPoints">Puntos Acumulados:</label>
            <div className="editable-field">
              <span>{userInfo.accumulatedPoints}</span>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="identificationCard">Cédula de Identidad:</label>
            <div className="editable-field">
              {editingField === 'identificationCard' ? (
                <>
                  <input
                    type="text"
                    id="identificationCard"
                    value={identificationCard}
                    onChange={(e) => handleFieldChange('identificationCard', e.target.value)}
                  />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={handleCancelClick}>Cancelar</button>
                </>
              ) : (
                <>
                  <span>{identificationCard}</span>
                  <FaEdit className="edit-icon" onClick={() => handleEditClick('identificationCard')} />
                </>
              )}
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="dateOfBirth">Fecha de Nacimiento:</label>
            <div className="editable-field">
              {editingField === 'dateOfBirth' ? (
                <>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                  />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={handleCancelClick}>Cancelar</button>
                </>
              ) : (
                <>
                  <span>{dateOfBirth}</span>
                  <FaEdit className="edit-icon" onClick={() => handleEditClick('dateOfBirth')} />
                </>
              )}
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="entryDate">Fecha de Ingreso:</label>
            <div className="editable-field">
              <span>{entryDate}</span>
            </div>
          </div>
        </form>
      </div>
      {showImagePopup && (
        <div className="image-popup">
          <div className="image-popup-content">
            <h3>Actualizar Imagen de Perfil</h3>
            <img src={previewImage} alt="Vista previa de perfil" className="profile-image-preview" />
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
            <button type="button" onClick={handleSaveClick}>Guardar</button>
            <button type="button" onClick={handleCancelClick}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
