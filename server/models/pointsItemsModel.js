const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const PointsItemsModel = {};

// Crear la tabla de pointsItems si no existe
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS pointsItems (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        points INT NOT NULL,
        description TEXT,
        image VARCHAR(255)
      )
    `);
    console.log('The pointsItems table was created successfully.');
  } catch (err) {
    console.error('Error creating the pointsItems table: ' + err);
  }
})();

// Obtener todos los items
PointsItemsModel.getAll = async () => {
  try {
    const [items] = await db.query('SELECT * FROM pointsItems');
    return items;
  } catch (err) {
    throw err;
  }
};

// Obtener un item por su ID
PointsItemsModel.getById = async (id) => {
  try {
    const [items] = await db.query('SELECT * FROM pointsItems WHERE id = ?', [id]);
    return items[0];
  } catch (err) {
    throw err;
  }
};

// Crear un nuevo item
PointsItemsModel.create = async (newItem) => {
  newItem.id = uuidv4();
  try {
    await db.query('INSERT INTO pointsItems SET ?', newItem);
    return newItem;
  } catch (err) {
    throw err;
  }
};

// Actualizar un item por su ID
PointsItemsModel.update = async (id, updatedItem) => {
  try {
    await db.query('UPDATE pointsItems SET ? WHERE id = ?', [updatedItem, id]);
    return { ...updatedItem, id };
  } catch (err) {
    throw err;
  }
};

// Eliminar un item por su ID
PointsItemsModel.delete = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM pointsItems WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

module.exports = PointsItemsModel;
