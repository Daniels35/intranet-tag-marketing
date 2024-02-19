const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const PointsItemsModel = {};

// Crear la tabla de pointsItems si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS pointsItems (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    points INT NOT NULL,
    description TEXT,
    image VARCHAR(255)
  )
`, (err) => {
  if (err) {
    console.error('Error creating the pointsItems table: ' + err);
  } else {
    console.log('The pointsItems table was created successfully.');
  }
});

// Obtener todos los items
PointsItemsModel.getAll = (callback) => {
  db.query('SELECT * FROM pointsItems', (err, items) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, items);
  });
};

// Obtener un item por su ID
PointsItemsModel.getById = (id, callback) => {
  db.query('SELECT * FROM pointsItems WHERE id = ?', [id], (err, item) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, item[0]);
  });
};

// Crear un nuevo item
PointsItemsModel.create = (newItem, callback) => {
  newItem.id = uuidv4();
  db.query('INSERT INTO pointsItems SET ?', newItem, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, newItem);
  });
};

// Actualizar un item por su ID
PointsItemsModel.update = (id, updatedItem, callback) => {
  db.query('UPDATE pointsItems SET ? WHERE id = ?', [updatedItem, id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, { ...updatedItem, id });
  });
};

// Eliminar un item por su ID
PointsItemsModel.delete = (id, callback) => {
  db.query('DELETE FROM pointsItems WHERE id = ?', [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result.affectedRows);
  });
};

module.exports = PointsItemsModel;
