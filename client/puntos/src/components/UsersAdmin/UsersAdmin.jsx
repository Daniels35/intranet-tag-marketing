import React from 'react';
import EditUserForm from '../EditUserForm/EditUserForm';
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../redux/userSlice';
import './UsersAdmin.css';

const API_URL = process.env.REACT_APP_API_URL;

const UsersAdmin = ({ editing, setEditing, currentUser, updateUser, refreshUsers }) => {
  
  const dispatch = useDispatch();

  const deleteUser = async (id) => {
    // Primera confirmación
    const firstConfirm = window.confirm("¿Estás seguro de que quieres eliminar este colaborador?");
    if (!firstConfirm) return;

    // Confirmación final con mensaje crítico
    const finalConfirm = window.confirm("🚨 Última confirmación: Se eliminarán todos los datos de este colaborador. ¿Continuar?");
    if (!finalConfirm) return;

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      alert("✅ Colaborador eliminado exitosamente.");
      setEditing(false); // Cerrar la vista de edición tras eliminar al usuario
      dispatch(fetchUserInfo());
      refreshUsers();  // Llamamos a refreshUsers para actualizar la lista

    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("❌ Hubo un problema al eliminar el colaborador.");
    }
  };

  return (
    <div className="users-admin-container">
      {editing ? (
        <>
          <div>
            <h2>Editar Colaborador</h2>
            <EditUserForm
              currentUser={currentUser}
              setEditing={setEditing}
              updateUser={updateUser}
            />
          </div>
          <button 
            className="delete-button-user-admin"
            onClick={() => deleteUser(currentUser.id)}
          >
            🗑️ Eliminar Colaborador Definitivamente
          </button>
        </>
      ) : null}
    </div>
  );
};

export default UsersAdmin;
