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
      <label>Puntos Acumulados</label>
      <input type="number" name="accumulatedPoints" value={user.accumulatedPoints} onChange={handleInputChange} />
      <button>Actualizar usuario</button>
      <button onClick={() => setEditing(false)} className="button muted-button">
        Cancelar
      </button>
    </form>
  );
};

export default EditUserForm;
