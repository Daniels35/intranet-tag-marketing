const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const UsersModel = {};

// Crear la tabla de usuarios si no existe
db.query(`
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  identificationCard VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('admin', 'active_employee', 'inactive_employee', 'guest') NOT NULL DEFAULT 'guest',
  image VARCHAR(255),
  accumulatedPoints INT DEFAULT 0
)

`, (err) => {
  if (err) {
    console.error('Error creating the users table: ' + err);
  } else {
    console.log('The users table was created successfully.');
  }
});


// Obtener todos los usuarios
UsersModel.getAll = (callback) => {
  db.query('SELECT * FROM users', (err, users) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, users);
  });
};

// Obtener un usuario por su ID
UsersModel.getUserById = (id, callback) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, user[0]);
  });
};

// Crear un nuevo usuario
UsersModel.createUser = (newUser, callback) => {
  newUser.id = uuidv4(); // Genera un nuevo UUID para el usuario
  db.query('INSERT INTO users SET ?', newUser, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, newUser);
  });
};

// Actualizar un usuario por su ID
UsersModel.updateUser = (id, updatedUser, callback) => {
  db.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    updatedUser.id = id;
    callback(null, updatedUser);
  });
};

// Eliminar un usuario por su ID
UsersModel.deleteUser = (id, callback) => {
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result.affectedRows);
  });
};

module.exports = UsersModel;
