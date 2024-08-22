import React from 'react';
import EditUserForm from '../EditUserForm/EditUserForm'; 

const UsersAdmin = ({ editing, setEditing, currentUser, updateUser }) => {
  return (
    <div className="users-admin-container">
      {editing ? (
        <div>
          <h2>Editar Colaborador</h2>
          <EditUserForm
            currentUser={currentUser}
            setEditing={setEditing}
            updateUser={updateUser}
          />
        </div>
      ) : null}
    </div>
  );
};

export default UsersAdmin;
