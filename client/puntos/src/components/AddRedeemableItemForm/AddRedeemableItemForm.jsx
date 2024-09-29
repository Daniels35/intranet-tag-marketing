// AddRedeemableItemForm.js
import React, { useState } from 'react';

const AddRedeemableItemForm = ({ addRedeemableItem }) => {
  const initialFormState = { id: null, name: '', costInPoints: 0, description: '', stock: 9999, image: '' };
  const [item, setItem] = useState(initialFormState);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (!item.name || item.costInPoints <= 0) return;

        addRedeemableItem(item);
        setItem(initialFormState);
      }}
    >
      <label>Nombre</label>
      <input type="text" name="name" value={item.name} onChange={handleInputChange} />
      <label>Costo en Puntos</label>
      <input type="number" name="costInPoints" value={item.costInPoints} onChange={handleInputChange} />
      <label>Descripción</label>
      <textarea name="description" value={item.description} onChange={handleInputChange} />
      <label>Stock</label>
      <input type="number" name="stock" value={item.stock} onChange={handleInputChange} />
      <label>Imagen (URL)</label>
      <input type="text" name="image" value={item.image} onChange={handleInputChange} />
      <button className='button-user-principal'>Agregar Item Canjeable</button>
    </form>
  );
};

export default AddRedeemableItemForm;
