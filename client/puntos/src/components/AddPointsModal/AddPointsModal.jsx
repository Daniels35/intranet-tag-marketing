import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL;

const AddPointsComponent = ({ user, onClose, refreshUsers }) => {
  const [pointsItems, setPointsItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [manualPoints, setManualPoints] = useState(''); // Para ingresar puntos manualmente
  const [description, setDescription] = useState(''); // Para ingresar la descripción manualmente
  const [useManualPoints, setUseManualPoints] = useState(false); // Para manejar la opción seleccionada

  // Obtener la información del usuario logueado desde Redux
  const currentUser = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const fetchPointsItems = async () => {
      try {
        const response = await fetch(`${API_URL}/pointsItems`);
        const data = await response.json();
        setPointsItems(data);
      } catch (error) {
        console.error('Error al obtener los ítems de puntos:', error);
      }
    };

    fetchPointsItems();
  }, []);

  const handleSubmit = async () => {
    let pointsToAdd = 0;
    let finalDescription = description;

    if (!useManualPoints) {
      const selectedPointItem = pointsItems.find(item => item.id === selectedItem);
      pointsToAdd = selectedPointItem ? selectedPointItem.points : 0;
      if (!description) {
        finalDescription = `Puntos agregados: ${pointsToAdd}`; // Descripción por defecto si se selecciona un ítem
      }
    } else {
      pointsToAdd = parseInt(manualPoints, 10) || 0;
      if (!description) {
        alert('Debe ingresar una descripción.');
        return;
      }
    }

    if (pointsToAdd <= 0) {
      alert('Debe ingresar una cantidad válida de puntos.');
      return;
    }

    console.log(`Enviando ${pointsToAdd} puntos al usuario ${user.name} con ID ${user.id} desde el usuario con ID ${currentUser.id}`);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/addPoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          initiatorID: currentUser.id, // ID del usuario que concede los puntos
          points: pointsToAdd,
          itemID: useManualPoints ? null : selectedItem, // Enviar el ID del ítem si se selecciona, de lo contrario null
          description: finalDescription // Descripción final
        }),
      });
      console.log("Datos enviados al backend: ", )

      if (response.ok) {
        console.log("Puntos agregados exitosamente");
        refreshUsers(); // Refresca la lista de usuarios después de agregar puntos
        onClose(); // Cierra el modal
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
      
      <div>
        <label>
          <input 
            type="radio" 
            name="pointsOption" 
            value="item" 
            checked={!useManualPoints} 
            onChange={() => setUseManualPoints(false)} 
          />
          Seleccionar Ítem
        </label>
        <label>
          <input 
            type="radio" 
            name="pointsOption" 
            value="manual" 
            checked={useManualPoints} 
            onChange={() => setUseManualPoints(true)} 
          />
          Ingresar Puntos Manualmente
        </label>
      </div>

      {!useManualPoints && (
        <div>
          <label>
            Seleccionar Ítem:
            <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
              <option value="">-- Seleccionar Ítem --</option>
              {pointsItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.points} Puntos
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {useManualPoints && (
        <div>
          <label>
            Cantidad de Puntos:
            <input 
              type="number" 
              value={manualPoints} 
              onChange={e => setManualPoints(e.target.value)} 
              placeholder="Cantidad de puntos"
            />
          </label>
        </div>
      )}

      <div>
        <label>
          Descripción:
          <input 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Descripción de la transacción"
            required 
          />
        </label>
      </div>

      <button onClick={handleSubmit}>Confirmar</button>
    </div>
  );
};

export default AddPointsComponent;
