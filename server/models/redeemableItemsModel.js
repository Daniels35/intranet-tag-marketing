const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const RedeemableItemsModel = {};

// Crear la tabla de redeemableItems si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS redeemableItems (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    costInPoints INT NOT NULL,
    description TEXT NOT NULL,
    stock INT DEFAULT 9999,
    image VARCHAR(255)
  )
`, (err) => {
  if (err) {
    console.error('Error creating the redeemableItems table: ' + err);
  } else {
    console.log('The redeemableItems table was created successfully.');
  }
});

// Obtener todos los items
RedeemableItemsModel.getAll = callback => {
  db.query('SELECT * FROM redeemableItems', (err, items) => {
    if (err) return callback(err, null);
    callback(null, items);
  });
};

// Obtener un item por su ID
RedeemableItemsModel.getById = (id, callback) => {
  db.query('SELECT * FROM redeemableItems WHERE id = ?', [id], (err, item) => {
    if (err) return callback(err, null);
    callback(null, item[0]);
  });
};

// Crear un nuevo item
RedeemableItemsModel.create = (newItem, callback) => {
  newItem.id = uuidv4(); // Genera un nuevo UUID para el item
  db.query('INSERT INTO redeemableItems SET ?', newItem, (err, result) => {
    if (err) return callback(err, null);
    callback(null, newItem);
  });
};

// Actualizar un item por su ID
RedeemableItemsModel.update = (id, updatedItem, callback) => {
  db.query('UPDATE redeemableItems SET ? WHERE id = ?', [updatedItem, id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, { ...updatedItem, id });
  });
};

// Eliminar un item por su ID
RedeemableItemsModel.delete = (id, callback) => {
  db.query('DELETE FROM redeemableItems WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result.affectedRows);
  });
};

module.exports = RedeemableItemsModel;
