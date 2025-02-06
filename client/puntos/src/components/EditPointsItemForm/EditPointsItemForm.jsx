import React, { useState, useEffect } from 'react';

const EditPointsItemForm = ({ setEditing, currentItem, updatePointsItem }) => {
  const [item, setItem] = useState(currentItem);
  const [preview, setPreview] = useState(currentItem.image || null);

  useEffect(() => {
    setItem(currentItem);
    setPreview(currentItem.image || null);
  }, [currentItem]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setItem({ ...item, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('points', item.points);
    formData.append('description', item.description);
    if (item.image instanceof File) {
      formData.append('icon', item.image);
    }

    updatePointsItem(item.id, formData);
    setEditing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre</label>
      <input type="text" name="name" value={item.name} onChange={handleInputChange} />

      <label>Puntos</label>
      <input type="number" name="points" value={item.points} onChange={handleInputChange} />

      <label>Descripción</label>
      <input type="text" name="description" value={item.description} onChange={handleInputChange} />

      <label>Imagen</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && <img src={preview} alt="Previsualización" style={{ width: '100px', marginTop: '10px' }} />}

      <div className='container-button-admin-items'>
        <button className='button-admin-item-update'>Actualizar Item</button>
        <button className='button-admin-item-cancel' onClick={() => setEditing(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditPointsItemForm;
