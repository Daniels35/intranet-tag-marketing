import React, { useState, useEffect } from 'react';
import './EditItemForm.css';

const EditRedeemableItemForm = ({ currentItem, setEditing, updateRedeemableItem }) => {
  const [item, setItem] = useState(currentItem);
  const [preview, setPreview] = useState(currentItem.image || null);

  useEffect(() => {
    setItem(currentItem);
    setPreview(currentItem.image || null);
  }, [currentItem]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setItem({ ...item, image: file });
      setPreview(URL.createObjectURL(file)); // Genera una vista previa
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('costInPoints', item.costInPoints);
    formData.append('description', item.description);
    formData.append('stock', item.stock);
    if (item.image instanceof File) {
      formData.append('icon', item.image); // ✅ Usa "icon" porque el backend lo espera
    }

    updateRedeemableItem(item.id, formData);
    setEditing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre</label>
      <input type="text" name="name" value={item.name} onChange={handleInputChange} />

      <label>Costo en Puntos</label>
      <input type="number" name="costInPoints" value={item.costInPoints} onChange={handleInputChange} />

      <label>Descripción</label>
      <textarea name="description" value={item.description} onChange={handleInputChange} />

      <label>Stock</label>
      <input type="number" name="stock" value={item.stock} onChange={handleInputChange} />

      <label>Imagen</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && <img src={preview} alt="Previsualización" style={{ width: '100px', marginTop: '10px' }} />}

      <div className='container-button-admin-items'>
        <button className='button-admin-item-update'>Actualizar Item Canjeable</button>
        <button className='button-admin-item-cancel' onClick={() => setEditing(false)}>Cancelar</button>
      </div>
    </form>
  );
};

export default EditRedeemableItemForm;
