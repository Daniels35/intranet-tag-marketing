import React, { useEffect, useState } from 'react';
import { FaPlus, FaMinus, FaEdit } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';
import AddPointsComponent from '../AddPointsModal/AddPointsModal';
import RemovePointsComponent from '../RemovePointsModal/RemovePointsModal';
import UsersAdmin from '../UsersAdmin/UsersAdmin';
import './AddPointsToList.css';

const API_URL = process.env.REACT_APP_API_URL;

const AddPointsToList = () => {
  const [users, setUsers] = useState([]);
  const [userOpen, setUserOpen] = useState(false);
  const [removeUserOpen, setRemoveUserOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
  
      // Filtrar al usuario del sistema por su nombre o email
      const filteredUsers = data.filter(user => user.name !== "Tag Marketing Digital (Sistema)" && user.email !== "notification@intranettag.website");
  
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };
  
  const refreshUsers = () => {
    fetchUsers();
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setEditing(true);
    setEditOpen(true);
  };

  const updateUser = async (id, updatedUser) => {
    try {
      const userToSend = {
        ...updatedUser,
        dateOfBirth: new Date(updatedUser.dateOfBirth).toISOString(),
        entryDate: new Date(updatedUser.entryDate).toISOString(),
      };
      console.log("FECHAS CAMBIADA: ", userToSend);
      
      await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToSend),
      });
  
      setEditing(false);
      setEditOpen(false);
      setUsers(users.map(user => (user.id === id ? updatedUser : user)));
    } catch (error) {
      console.error('Error al actualizar el colaborador:', error);
    }
  };
  
  

  return (
    <>
      <div className='container-addPoints-list-users'>
        <h3>Lista de Colaboradores</h3>
        <div className='container-addPoints-list-users-information'>
          <span>
            <FaPlus /> Agregar Puntos
          </span>
          <span>
            <FaMinus /> Eliminar Puntos
          </span>
          <span>
            <FaEdit /> Editar
          </span>
        </div>
        {users.length > 0 ? (
          <table className='table-users-list'>
            <thead className='table-users-list-header'>
              <tr>
                <th>Nombre</th>
                <th>Identificación</th>
                <th>Correo</th>
                <th>Puntos Acumulados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.identificationCard}</td>
                  <td>{user.email}</td>
                  <td>{user.accumulatedPoints}</td>
                  <td className='container-addPoints-list-users-container-buttons'>
                  <button className='container-addPoints-list-users-buttons' onClick={() => { setSelectedUser(user); setUserOpen(true); }}>
                      <FaPlus />
                    </button>
                    <button className='container-addPoints-list-users-buttons' onClick={() => { setSelectedUser(user); setRemoveUserOpen(true); }}>
                      <FaMinus />
                    </button>
                    <button className='container-addPoints-list-users-buttons' onClick={() => editUser(user)}>
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay colaboradores para mostrar.</p>
        )}
      </div>
      
      {/* Modal para agregar puntos */}
      <Modal isVisible={userOpen} onClose={() => setUserOpen(false)}>
        <AddPointsComponent user={selectedUser} onClose={() => setUserOpen(false)} refreshUsers={refreshUsers} />
      </Modal>

      {/* Modal para eliminar puntos */}
      <Modal isVisible={removeUserOpen} onClose={() => setRemoveUserOpen(false)}>
        <RemovePointsComponent user={selectedUser} onClose={() => setRemoveUserOpen(false)} refreshUsers={refreshUsers} />
      </Modal>

      {/* Modal para editar usuario */}
      {/* Modal para editar usuario */}
      <Modal isVisible={editOpen} onClose={() => setEditOpen(false)}>
        <UsersAdmin
          editing={editing}
          setEditing={setEditing}
          currentUser={selectedUser}
          updateUser={updateUser}
          refreshUsers={refreshUsers}  // Pasamos la función refreshUsers
        />
      </Modal>
    </>
  );
};

export default AddPointsToList;
