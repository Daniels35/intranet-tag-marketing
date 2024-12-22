const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const TransactionHistoryModel = require('./transactionHistoryModel');

const UsersModel = {};

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

UsersModel.getAll = async () => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    return users;
  } catch (err) {
    throw err;
  }
};

UsersModel.getUserById = async (id) => {
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return user[0];
  } catch (err) {
    throw err;
  }
};

UsersModel.createUser = async (newUser) => {
  newUser.id = uuidv4();
  try {
    await db.query('INSERT INTO users SET ?', newUser);
    return newUser;
  } catch (err) {
    throw err;
  }
};

UsersModel.updateUser = async (id, updatedUser) => {
  try {
    console.log('Actualizando usuario con id:', id, 'y datos:', updatedUser);
    await db.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id]);
    updatedUser.id = id;
    return updatedUser;
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    throw err;
  }
};


UsersModel.deleteUser = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

UsersModel.addPoints = async (initiatorID, recipientID, pointsToAdd, description, itemID = null) => {
  try {
    const [results] = await db.query('SELECT accumulatedPoints FROM users WHERE id = ?', [recipientID]);
    if (results.length > 0) {
      const currentPoints = results[0].accumulatedPoints;
      const newPoints = currentPoints + pointsToAdd;
      const [result] = await db.query('UPDATE users SET accumulatedPoints = ? WHERE id = ?', [newPoints, recipientID]);
      
      if (result.affectedRows > 0) {
        const transactionDescription = description || `Puntos agregados: ${pointsToAdd}`;

        const transaction = {
          initiatorID: initiatorID,  // ID del usuario que inicia la transacción
          recipientID: recipientID,  // ID del usuario que recibe los puntos
          itemID: itemID,            // ID del ítem, si se proporciona
          transactionType: 'grant',  // Siempre será 'grant' para agregar puntos
          points: pointsToAdd,
          description: transactionDescription  // Descripción basada en la lógica de itemID
        };
        await TransactionHistoryModel.addTransaction(transaction);
      }
      
      return result.affectedRows;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (err) {
    throw err;
  }
};

UsersModel.removePoints = async (initiatorID, recipientID, pointsToRemove, description, itemID = null) => {
  try {
    const [results] = await db.query('SELECT accumulatedPoints FROM users WHERE id = ?', [recipientID]);
    if (results.length > 0) {
      const currentPoints = results[0].accumulatedPoints;

      if (currentPoints < pointsToRemove) {
        throw new Error('No hay suficientes puntos para retirar.');
      }

      const newPoints = currentPoints - pointsToRemove;
      const [result] = await db.query('UPDATE users SET accumulatedPoints = ? WHERE id = ?', [newPoints, recipientID]);

      if (result.affectedRows > 0) {
        const transactionDescription = description || `Points retirados: ${pointsToRemove}`;

        const transaction = {
          initiatorID: initiatorID,  
          recipientID: recipientID,  
          itemID: itemID,            
          transactionType: 'revoke',
          points: pointsToRemove,
          description: transactionDescription 
        };
        await TransactionHistoryModel.addTransaction(transaction);
      }

      return result.affectedRows;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (err) {
    throw err;
  }
};

// Actualizar fecha de entrada por ID
UsersModel.updateEntryDate = async (id, entryDate) => {
  try {
    const [result] = await db.query('UPDATE users SET entryDate = ? WHERE id = ?', [entryDate, id]);
    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

// Consultar usuarios que cumplen años hoy
UsersModel.getUsersByDateOfBirth = async () => {
  const today = new Date().toISOString().slice(5, 10); // Formato MM-DD
  const query = `SELECT id, email, name, dateOfBirth FROM users WHERE DATE_FORMAT(dateOfBirth, '%m-%d') = ?`;

  try {
    const [results] = await db.query(query, [today]);
    console.log('Usuarios que cumplen años hoy:', results); // Console log para verificar los datos
    return results;
  } catch (error) {
    console.error('Error al consultar cumpleaños:', error);
    return [];
  }
};

// Consultar usuarios que cumplen aniversario de entrada hoy
UsersModel.getUsersByEntryDate = async () => {
  const today = new Date().toISOString().slice(5, 10); // Formato MM-DD
  const query = `SELECT id, email, name, entryDate FROM users WHERE DATE_FORMAT(entryDate, '%m-%d') = ?`;

  try {
    const [results] = await db.query(query, [today]);
    console.log('Usuarios que cumplen aniversario hoy:', results); // Console log para verificar los datos
    return results;
  } catch (error) {
    console.error('Error al consultar aniversarios:', error);
    return [];
  }
};


module.exports = UsersModel;
