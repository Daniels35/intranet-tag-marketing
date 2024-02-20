// AddPointsItemForm.js
import React, { useState } from 'react';

const AddPointsItemForm = ({ addPointsItem }) => {
  const initialFormState = { id: null, name: '', points: 0, description: '', image: '' };
  const [item, setItem] = useState(initialFormState);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (!item.name || !item.points) return;

        addPointsItem(item);
        setItem(initialFormState);
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
      <button>Agregar Item</button>
    </form>
  );
};

export default AddPointsItemForm;
