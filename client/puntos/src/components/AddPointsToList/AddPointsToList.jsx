import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import AddPointsComponent from '../AddPointsModal/AddPointsModal'
import './AddPointsToList.css'
const API_URL = process.env.REACT_APP_API_URL;

const AddPointsToList = ({ user}) => {

    const [users, setUsers] = useState([]);
    const [userOpen, setUserOpen] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedUser, setSelectedUser] = useState(null);


    useEffect(() => {
        fetchUsers();
      }, []);
    
      const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();
            setUsers(data);
          } catch (error) {
            console.error('Error al obtener los usuarios:', error);
          }
      };

      useEffect(() => {
        fetchUsers();
      }, [fetchUsers]);
    
      // Pasar esta función a AddPointsComponent para que pueda llamarla después de actualizar puntos
      const refreshUsers = () => {
        fetchUsers();
      };


  return (
    <>
    <div className='container-addPoints-list-users'>
      <h3>Lista de Colaboradores</h3>
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
                <td>
                  <button onClick={() => { setSelectedUser(user); setUserOpen(true); }}>Agregar Puntos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay colaboradores para mostrar.</p>
      )}
    </div>
    <Modal isVisible={userOpen} onClose={() => setUserOpen(false)}>
        <AddPointsComponent user={selectedUser} onClose={() => setUserOpen(false)} refreshUsers={refreshUsers} />
      </Modal>

        

    </>
  );
};

export default AddPointsToList;
