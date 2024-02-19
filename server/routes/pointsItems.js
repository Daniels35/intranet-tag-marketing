const express = require('express');
const router = express.Router();
const pointsItemsController = require('../controllers/pointsItemsController');

// Ruta para obtener todos los items
router.get('/pointsItems', pointsItemsController.getAllItems);

// Ruta para obtener un item por su ID
router.get('/pointsItems/:id', pointsItemsController.getItemById);

// Ruta para crear un nuevo item
router.post('/pointsItems', pointsItemsController.createItem);

// Ruta para actualizar un item por su ID
router.put('/pointsItems/:id', pointsItemsController.updateItem);

// Ruta para eliminar un item por su ID
router.delete('/pointsItems/:id', pointsItemsController.deleteItem);

module.exports = router;
