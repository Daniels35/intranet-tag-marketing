import React, { useEffect, useState } from 'react';
import UsersList from '../UsersList/UsersList';
import AddUserForm from '../AddUserForm/AddUserForm'; 
import EditUserForm from '../EditUserForm/EditUserForm'; 

const UsersAdmin = () => {

    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: null, name: '', identificationCard: '', accumulatedPoints: 0 });
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
        }
    };
  
    const addUser = async (user) => {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        fetchUsers();
      } catch (error) {
        console.error('Error al agregar el usuario:', error);
      }
    };
    
  
    const deleteUser = async (id) => {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          method: 'DELETE',
        });
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    };
  
    const updateUser = async (id, updatedUser) => {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });
        setEditing(false);
        setUsers(users.map(user => (user.id === id ? updatedUser : user)));
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    };  
    
  
    const editUser = user => {
      setEditing(true);
      setCurrentUser(user);
    };



  return (
    <div className="users-admin-container">
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

export default UsersAdmin;
