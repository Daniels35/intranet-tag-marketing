import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../redux/userSlice';
import '../AddPointsToList/ModalAddPointsToList.css';

const API_URL = process.env.REACT_APP_API_URL;

const AddPointsComponent = ({ user, onClose, refreshUsers }) => {
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
        finalDescription = `Puntos agregados: ${pointsToAdd}`;
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

  const confirmAddPoints = window.confirm(`¿Realmente quieres agregarle ${pointsToAdd} puntos a ${user.name} ?`);
    console.log(`Enviando ${pointsToAdd} puntos al usuario ${user.name} con ID ${user.id} desde el usuario con ID ${currentUser.id}`);

    if (confirmAddPoints) {
      try {
        const response = await fetch(`${API_URL}/users/${user.id}/addPoints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            initiatorID: currentUser.id,
            points: pointsToAdd,
            itemID: useManualPoints ? null : selectedItem,
            description: finalDescription
          }),
        });
        console.log("Datos enviados al backend: ", )

        if (response.ok) {
          dispatch(fetchUserInfo());
          refreshUsers();
          onClose();
          window.alert("Puntos agregados exitosamente");
        } else {
          console.error("Error al agregar puntos");
        }
      } catch (error) {
        console.error('Error al agregar puntos al usuario:', error);
      }
    }
  };

  return (
    <div className='modal-add-points-container'>
    <h2 className='modal-add-points-header'>Agregar Puntos a {user.name}</h2>
    <div className='modal-add-points-user-info'>ID de Usuario: {user.identificationCard}</div>
    <div className='modal-add-points-container-label'>
      <label className='modal-add-points-label'>
        <input 
          type="radio" 
          name="pointsOption" 
          value="item" 
          className='modal-add-points-radio-input'
          checked={!useManualPoints} 
          onChange={() => setUseManualPoints(false)} 
        />
        Seleccionar Ítem
      </label>
      <label className='modal-add-points-label'>
        <input 
          type="radio" 
          name="pointsOption" 
          value="manual" 
          className='modal-add-points-radio-input'
          checked={useManualPoints} 
          onChange={() => setUseManualPoints(true)} 
        />
        Ingresar Puntos Manualmente
      </label>
    </div>
  
    {!useManualPoints && (
      <div>
        <label className='modal-add-points-label'>
          Seleccionar Ítem:
          <select 
            value={selectedItem} 
            onChange={e => setSelectedItem(e.target.value)}
            className='modal-add-points-select'
          >
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
        <label className='modal-add-points-label'>
          Cantidad de Puntos:
          <input 
            type="number" 
            value={manualPoints} 
            onChange={e => setManualPoints(e.target.value)}
            className='modal-add-points-number-input'
            placeholder="Cantidad de puntos"
          />
        </label>
      </div>
    )}
  
    <div>
      <label className='modal-add-points-label'>
        Descripción:
        <input 
          type="text" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className='modal-add-points-text-input'
          placeholder="Descripción de la transacción"
          required 
        />
      </label>
    </div>
  
    <button className='button-user-principal' onClick={handleSubmit}>Confirmar</button>
  </div>
  
  );
};

export default AddPointsComponent;
