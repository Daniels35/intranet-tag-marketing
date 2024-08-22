const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const UsersModel = {};

// Crear la tabla de usuarios si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    googleId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    identificationCard VARCHAR(255) DEFAULT '',
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'active_employee', 'inactive_employee') NOT NULL DEFAULT 'active_employee',
    image TEXT,
    imageProfile TEXT,
    uploadedProfileImage TEXT, 
    accumulatedPoints INT DEFAULT 0,
    position VARCHAR(255) DEFAULT '',
    dateOfBirth DATE DEFAULT '1990-01-01',
    entryDate DATE DEFAULT '2024-01-01',
    identificationCardModified BOOLEAN DEFAULT FALSE,
    dateOfBirthModified BOOLEAN DEFAULT FALSE,
    updateImageAcrossSite BOOLEAN DEFAULT FALSE
  )
`).then(() => {
  console.log('The users table was created successfully.');
}).catch(err => {
  console.error('Error creating the users table: ' + err);
});

// Obtener todos los usuarios
UsersModel.getAll = async () => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    return users;
  } catch (err) {
    throw err;
  }
};

// Obtener un usuario por su ID
UsersModel.getUserById = async (id) => {
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return user[0];
  } catch (err) {
    throw err;
  }
};

// Crear un nuevo usuario
UsersModel.createUser = async (newUser) => {
  newUser.id = uuidv4(); // Genera un nuevo UUID para el usuario
  try {
    await db.query('INSERT INTO users SET ?', newUser);
    return newUser;
  } catch (err) {
    throw err;
  }
};

// Actualizar un usuario por su ID
UsersModel.updateUser = async (id, updatedUser) => {
  try {
    console.log('Actualizando usuario con id:', id, 'y datos:', updatedUser);
    await db.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id]);
    updatedUser.id = id;
    return updatedUser;
  } catch (err) {
    console.error('Error en la consulta SQL:', err); // Log para verificar el error
    throw err;
  }
};


// Eliminar un usuario por su ID
UsersModel.deleteUser = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

// Agregar puntos a un usuario
UsersModel.addPoints = async (userId, pointsToAdd) => {
  try {
    const [results] = await db.query('SELECT accumulatedPoints FROM users WHERE id = ?', [userId]);
    if (results.length > 0) {
      const currentPoints = results[0].accumulatedPoints;
      const newPoints = currentPoints + pointsToAdd;
      const [result] = await db.query('UPDATE users SET accumulatedPoints = ? WHERE id = ?', [newPoints, userId]);
      return result.affectedRows;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (err) {
    throw err;
  }
};

module.exports = UsersModel;
