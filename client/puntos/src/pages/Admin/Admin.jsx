import React, { useEffect, useState } from 'react';
import UsersList from '../../components/UsersList/UsersList';
import AddUserForm from '../../components/AddUserForm/AddUserForm';
import EditUserForm from '../../components/EditUserForm/EditUserForm'; 

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', identificationCard: '', accumulatedPoints: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost:3027/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
  };

  const addUser = user => {
    // Implementa la lógica para agregar un nuevo usuario mediante tu API
  };

  const deleteUser = id => {
    // Implementa la lógica para eliminar un usuario mediante tu API
  };

  const editUser = user => {
    setEditing(true);
    setCurrentUser(user);
  };

  const updateUser = (id, updatedUser) => {

  };

  return (
    <div className="admin-container">
      <h2>Administración de Usuarios</h2>
      {editing ? (
        <div>
          <h2>Editar Usuario</h2>
          <EditUserForm
            currentUser={currentUser}
            setEditing={setEditing}
            updateUser={updateUser}
          />
        </div>
      ) : (
        <div>
          <h2>Agregar Usuario</h2>
          <AddUserForm addUser={addUser} />
        </div>
      )}
      <UsersList users={users} editUser={editUser} deleteUser={deleteUser} />
    </div>
  );
};

export default Admin;
