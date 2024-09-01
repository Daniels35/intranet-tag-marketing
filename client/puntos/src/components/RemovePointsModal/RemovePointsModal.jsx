import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../redux/userSlice';

const API_URL = process.env.REACT_APP_API_URL;

const RemovePointsComponent = ({ user, onClose, refreshUsers }) => {
  const [pointsItems, setPointsItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [manualPoints, setManualPoints] = useState('');
  const [description, setDescription] = useState('');
  const [useManualPoints, setUseManualPoints] = useState(false);

  const currentUser = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPointsItems = async () => {
      try {
        const response = await fetch(`${API_URL}/redeemableItems`);
        const data = await response.json();
        setPointsItems(data);
      } catch (error) {
        console.error('Error al obtener los ítems de puntos:', error);
      }
    };

    fetchPointsItems();
  }, []);

  const handleSubmit = async () => {
    let pointsToRemove = 0;
    let finalDescription = description;

    if (!useManualPoints) {
      const selectedPointItem = pointsItems.find(item => item.id === selectedItem);
      pointsToRemove = selectedPointItem ? selectedPointItem.costInPoints : 0;
      if (!description) {
        finalDescription = `Puntos retirados: ${pointsToRemove}`;
      }
    } else {
      pointsToRemove = parseInt(manualPoints, 10) || 0;
      if (!description) {
        alert('Debe ingresar una descripción.');
        return;
      }
    }

    if (pointsToRemove <= 0) {
      alert('Debe ingresar una cantidad válida de puntos.');
      return;
    }

    console.log(`Quitando ${pointsToRemove} puntos al usuario ${user.name} con ID ${user.id} desde el usuario con ID ${currentUser.id}`);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/removePoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initiatorID: currentUser.id,
          points: pointsToRemove,
          itemID: useManualPoints ? null : selectedItem,
          description: finalDescription
        }),
      });

      if (response.ok) {
        dispatch(fetchUserInfo());
        console.log("Puntos eliminados exitosamente");
        refreshUsers();
        onClose();
      } else {
        console.error("Error al eliminar puntos");
      }
    } catch (error) {
      console.error('Error al eliminar puntos del usuario:', error);
    }
  };

  return (
    <div>
      <h2>Eliminar Puntos a {user.name}</h2>
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
                  {item.name} - {item.costInPoints} Puntos
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

export default RemovePointsComponent;
