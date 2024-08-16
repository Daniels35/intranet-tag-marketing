import React, { useState, useEffect } from 'react';

const AddPointsComponent = ({ user, onClose, refreshUsers }) => {
  const [pointsItems, setPointsItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    const fetchPointsItems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/pointsItems`);
        const data = await response.json();
        setPointsItems(data);
        if (data.length > 0) {
          setSelectedItem(data[0].id); // Establece el id del primer ítem como seleccionado por defecto
        }
      } catch (error) {
        console.error('Error al obtener los ítems de puntos:', error);
      }
    };
  
    fetchPointsItems();
  }, []);
  

  const handleSubmit = async () => {
    // Encuentra el ítem seleccionado basado en el ID almacenado en selectedItem
    const selectedPointItem = pointsItems.find(item => item.id === selectedItem);
    console.log("Producto seleccionado: ", selectedItem);
    const pointsToAdd = selectedPointItem ? selectedPointItem.points : 0; // Obtiene los puntos del ítem seleccionado o 0 si no se encuentra
  
    // Aquí agregamos el console.log para ver los puntos a enviar
    console.log(`Enviando ${pointsToAdd} puntos al usuario ${user.name} con ID ${user.id}`);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}/addPoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: pointsToAdd }),
      });
  
      if (response.ok) {
        console.log("Puntos agregados exitosamente");
        refreshUsers(); // Refresca la lista de usuarios después de agregar puntos
        onClose(); // Cierra el modal
        // Aquí podrías realizar alguna acción adicional, como cerrar un modal o actualizar la vista
      } else {
        console.error("Error al agregar puntos");
      }
    } catch (error) {
      console.error('Error al agregar puntos al usuario:', error);
    }
  };
  

  return (
    <div>
      <h2>Agregar Puntos a {user.name}</h2>
      <div>ID de Usuario: {user.identificationCard}</div>
      <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
        {pointsItems.map(item => (
          <option key={item.id} value={item.id}>
            {item.name} - {item.points} Puntos
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Confirmar</button>
    </div>
  );
};

export default AddPointsComponent;