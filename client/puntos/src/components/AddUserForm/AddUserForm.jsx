import React, { useState } from 'react';

const AddUserForm = ({ addUser }) => {
  const initialFormState = { id: null, name: '', identificationCard: '', accumulatedPoints: 0, email: '' };
  const [user, setUser] = useState(initialFormState);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="form-container"> 
      <form
        onSubmit={event => {
          event.preventDefault();
          if (!user.name || !user.identificationCard || !user.email) return;

          addUser(user);
          setUser(initialFormState);
        }}
      >
        <label>Nombre</label>
        <input type="text" name="name" value={user.name} onChange={handleInputChange} />
        <label>Número de Identificación</label>
        <input type="text" name="identificationCard" value={user.identificationCard} onChange={handleInputChange} />
        <label>Correo Electrónico</label>
        <input type="email" name="email" value={user.email} onChange={handleInputChange} />
        <label>Puntos Acumulados</label>
        <input type="number" name="accumulatedPoints" value={user.accumulatedPoints} onChange={handleInputChange} />
        <button className='button-user-principal'>Agregar nuevo usuario</button>
      </form>
    </div>
  );
};

export default AddUserForm;
