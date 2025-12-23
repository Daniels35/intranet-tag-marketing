import { useState } from 'react';

const AddPointsItemForm = ({ addPointsItem }) => {
  const initialFormState = { name: '', points: 0, description: '', image: null };
  const [item, setItem] = useState(initialFormState);
  const [preview, setPreview] = useState(null);

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
    if (!item.name || !item.points) return;

    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('points', item.points);
    formData.append('description', item.description);
    if (item.image) {
      formData.append('icon', item.image);
    }

    addPointsItem(formData);
    setItem(initialFormState);
    setPreview(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre</label>
      <input type="text" name="name" value={item.name} onChange={handleInputChange} required />

      <label>Puntos</label>
      <input type="number" name="points" value={item.points} onChange={handleInputChange} required />

      <label>Descripción</label>
      <input type="text" name="description" value={item.description} onChange={handleInputChange} />

      <label>Imagen</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {preview && <img src={preview} alt="Previsualización" style={{ width: '100px', marginTop: '10px' }} />}

      <button className='button-user-principal'>Agregar Item</button>
    </form>
  );
};

export default AddPointsItemForm;
