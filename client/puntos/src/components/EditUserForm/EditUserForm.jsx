import React, { useState, useEffect } from 'react';

const EditUserForm = ({ setEditing, currentUser, updateUser }) => {
  const [user, setUser] = useState(currentUser);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="form-container"> 

    <form
      onSubmit={event => {
        event.preventDefault();
        updateUser(user.id, user);
      }}
    >
      <label>Nombre</label>
      <input type="text" name="name" value={user.name} onChange={handleInputChange} />
      <label>Número de Identificación</label>
      <input type="text" name="identificationCard" value={user.identificationCard} onChange={handleInputChange} />
      <label>Correo Electrónico</label>
      <input type="email" name="email" value={user.email} onChange={handleInputChange} />
      <label>Rol</label>
      <select name="role" value={user.role} onChange={handleInputChange}>
        <option value="admin">Administrador</option>
        <option value="active_employee">Empleado Activo</option>
        <option value="inactive_employee">Empleado Inactivo</option>
        <option value="guest">Invitado</option>
      </select>
      <label>Puntos Acumulados</label>
      <input type="number" name="accumulatedPoints" value={user.accumulatedPoints} onChange={handleInputChange} />
      <div className='container-button-user-add'>
      <button className='button-user-principal'>Actualizar usuario</button>
      <button onClick={() => setEditing(false)} className="button muted-button">
        Cancelar
      </button>
      </div>
    </form>
    </div>
  );
};

export default EditUserForm;

