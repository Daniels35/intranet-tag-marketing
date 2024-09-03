import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../redux/userSlice';

const API_URL = process.env.REACT_APP_API_URL;

const EditUserForm = ({ setEditing, currentUser, updateUser }) => {
  const [user, setUser] = useState(currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      const formattedDateOfBirth = currentUser.dateOfBirth
        ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0]
        : '';
      const formattedEntryDate = currentUser.entryDate
        ? new Date(currentUser.entryDate).toISOString().split('T')[0]
        : '';

      setUser({
        ...currentUser,
        dateOfBirth: formattedDateOfBirth,
        entryDate: formattedEntryDate,
      });

      console.log("Información usuario admin: ", user);
    }
  }, [currentUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let updateMessage = '';

      if (user.identificationCard !== currentUser.identificationCard) {
        const response = await axios.put(`${API_URL}/users/${user.id}/identificationCard`, {
          identificationCard: user.identificationCard,
        });
        updateMessage += response.data.message + '\n';
      }

      if (user.dateOfBirth !== currentUser.dateOfBirth) {
        const response = await axios.put(`${API_URL}/users/${user.id}/dateOfBirth`, {
          dateOfBirth: user.dateOfBirth,
        });
        updateMessage += response.data.message + '\n';
      }

      if (user.entryDate !== currentUser.entryDate) {
        const response = await axios.put(`${API_URL}/users/${user.id}/entryDate`, {
          entryDate: user.entryDate,
        });
        updateMessage += response.data.message + '\n';
      }

      // Refresca la información del usuario después de actualizar
      dispatch(fetchUserInfo());

      // Muestra una alerta con el mensaje de actualización
      if (updateMessage) {
        alert(updateMessage);
      } else {
        alert('No se realizaron cambios.');
      }

      setEditing(false); // Cierra el formulario de edición
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Hubo un error al actualizar el usuario.');
    }
  };

  return (
    <div className="form-container"> 
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input type="text" name="name" value={user.name} onChange={handleInputChange} disabled />

        <label>Número de Identificación</label>
        <input type="text" name="identificationCard" value={user.identificationCard} onChange={handleInputChange} />

        <label>Correo Electrónico</label>
        <input type="email" name="email" value={user.email} onChange={handleInputChange} disabled />

        <label>Rol</label>
        <select name="role" value={user.role} onChange={handleInputChange} disabled>
          <option value="admin">Administrador</option>
          <option value="active_employee">Colaborador Activo</option>
          <option value="inactive_employee">Colaborador Inactivo</option>
          <option value="guest">Invitado</option>
        </select>

        <label>Puntos Acumulados</label>
        <input type="number" name="accumulatedPoints" value={user.accumulatedPoints} onChange={handleInputChange} disabled />

        <label>Fecha de Nacimiento</label>
        <input type="date" name="dateOfBirth" value={user.dateOfBirth} onChange={handleInputChange} />

        <label>Fecha de Ingreso</label>
        <input type="date" name="entryDate" value={user.entryDate} onChange={handleInputChange} />

        <div className='container-button-user-add'>
          <button type="submit" className='button-user-principal'>Actualizar usuario</button>
          <button onClick={() => setEditing(false)} className="button muted-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
