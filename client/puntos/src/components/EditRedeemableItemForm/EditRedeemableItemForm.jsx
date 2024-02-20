// EditRedeemableItemForm.js
import React, { useState, useEffect } from 'react';

const EditRedeemableItemForm = ({ currentItem, setEditing, updateRedeemableItem }) => {
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
        updateRedeemableItem(item.id, item);
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
      <button>Actualizar Item Canjeable</button>
      <button onClick={() => setEditing(false)}>Cancelar</button>
    </form>
  );
};

export default EditRedeemableItemForm;
