import React from 'react';

const UsersList = ({ users, editUser, deleteUser }) => (
  <div>
    <h2>Lista de Usuarios</h2>
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.identificationCard} - Puntos: {user.accumulatedPoints}
          <button onClick={() => editUser(user)}>Editar</button>
          <button onClick={() => deleteUser(user.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  </div>
);

export default UsersList;
