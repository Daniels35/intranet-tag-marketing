import React, { useState } from 'react';

const AddUserForm = ({ addUser }) => {
  const initialFormState = { id: null, name: '', identificationCard: '', accumulatedPoints: 0, email: '' }; // Paso 1
  const [user, setUser] = useState(initialFormState);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (!user.name || !user.identificationCard || !user.email) return; // Asegúrate de que el correo también sea obligatorio

        addUser(user);
        setUser(initialFormState);
      }}
    >
      <label>Nombre</label>
      <input type="text" name="name" value={user.name} onChange={handleInputChange} />
      <label>Número de Identificación</label>
      <input type="text" name="identificationCard" value={user.identificationCard} onChange={handleInputChange} />
      <label>Correo Electrónico</label> {/* Paso 2 */}
      <input type="email" name="email" value={user.email} onChange={handleInputChange} /> {/* Paso 2 */}
      <label>Puntos Acumulados</label>
      <input type="number" name="accumulatedPoints" value={user.accumulatedPoints} onChange={handleInputChange} />
      <button>Agregar nuevo usuario</button>
    </form>
  );
};

export default AddUserForm;