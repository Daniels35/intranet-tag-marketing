// EditPointsItemForm.js
import React, { useState, useEffect } from 'react';

const EditPointsItemForm = ({ setEditing, currentItem, updatePointsItem }) => {
  const [item, setItem] = useState(currentItem);

  useEffect(() => {
    setItem(currentItem);
  }, [currentItem]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        updatePointsItem(item.id, item);
      }}
    >
      <label>Nombre</label>
      <input type="text" name="name" value={item.name} onChange={handleInputChange} />
      <label>Puntos</label>
      <input type="number" name="points" value={item.points} onChange={handleInputChange} />
      <label>Descripción</label>
      <input type="text" name="description" value={item.description} onChange={handleInputChange} />
      <label>Imagen (URL)</label>
      <input type="text" name="image" value={item.image} onChange={handleInputChange} />
      <div className='container-button-admin-items'>
        <button className='button-admin-item-update'>Actualizar Item</button>
        <button className='button-admin-item-cancel' onClick={() => setEditing(false)} >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditPointsItemForm;
