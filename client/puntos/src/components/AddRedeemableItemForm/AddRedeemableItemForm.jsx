import React, { useState } from 'react';

const AddRedeemableItemForm = ({ addRedeemableItem }) => {
  const initialFormState = { name: '', costInPoints: 0, description: '', stock: 9999, image: null };
  const [item, setItem] = useState(initialFormState);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setItem({ ...item, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!item.name || !item.costInPoints) return;

    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('costInPoints', item.costInPoints);
    formData.append('description', item.description);
    formData.append('stock', item.stock);
    if (item.image) {
      formData.append('icon', item.image);
    }

    addRedeemableItem(formData);
    setItem(initialFormState);
    setPreview(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre</label>
      <input type="text" name="name" value={item.name} onChange={handleInputChange} required />

      <label>Costo en Puntos</label>
      <input type="number" name="costInPoints" value={item.costInPoints} onChange={handleInputChange} required />

      <label>Descripción</label>
      <textarea name="description" value={item.description} onChange={handleInputChange} />

      <label>Stock</label>
      <input type="number" name="stock" value={item.stock} onChange={handleInputChange} />

      <label>Imagen</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && <img src={preview} alt="Previsualización" style={{ width: '100px', marginTop: '10px' }} />}

      <button className="button-user-principal">Agregar Item</button>
    </form>
  );
};

export default AddRedeemableItemForm;
