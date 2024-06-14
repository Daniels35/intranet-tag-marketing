const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const RedeemableItemsModel = {};

// Crear la tabla de redeemableItems si no existe
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS redeemableItems (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        costInPoints INT NOT NULL,
        description TEXT NOT NULL,
        stock INT DEFAULT 9999,
        image VARCHAR(255)
      )
    `);
    console.log('The redeemableItems table was created successfully.');
  } catch (err) {
    console.error('Error creating the redeemableItems table: ' + err);
  }
})();

// Obtener todos los items
RedeemableItemsModel.getAll = async () => {
  try {
    const [items] = await db.query('SELECT * FROM redeemableItems');
    return items;
  } catch (err) {
    throw err;
  }
};

// Obtener un item por su ID
RedeemableItemsModel.getById = async (id) => {
  try {
    const [items] = await db.query('SELECT * FROM redeemableItems WHERE id = ?', [id]);
    return items[0];
  } catch (err) {
    throw err;
  }
};

// Crear un nuevo item
RedeemableItemsModel.create = async (newItem) => {
  newItem.id = uuidv4(); // Genera un nuevo UUID para el item
  try {
    await db.query('INSERT INTO redeemableItems SET ?', newItem);
    return newItem;
  } catch (err) {
    throw err;
  }
};

// Actualizar un item por su ID
RedeemableItemsModel.update = async (id, updatedItem) => {
  try {
    await db.query('UPDATE redeemableItems SET ? WHERE id = ?', [updatedItem, id]);
    return { ...updatedItem, id };
  } catch (err) {
    throw err;
  }
};

// Eliminar un item por su ID
RedeemableItemsModel.delete = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM redeemableItems WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

module.exports = RedeemableItemsModel;
