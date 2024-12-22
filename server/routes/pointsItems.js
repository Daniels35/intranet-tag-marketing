const express = require('express');
const multer = require('multer');
const router = express.Router();
const pointsItemsController = require('../controllers/pointsItemsController');

// Configurar multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para obtener todos los items
router.get('/pointsItems', pointsItemsController.getAllItems);

// Ruta para obtener un item por su ID
router.get('/pointsItems/:id', pointsItemsController.getItemById);

// Ruta para crear un nuevo item (incluye subida de archivo)
router.post('/pointsItems', upload.single('icon'), pointsItemsController.createItem);

// Ruta para actualizar un item por su ID
router.put('/pointsItems/:id', upload.single('icon'), pointsItemsController.updateItem);

// Ruta para eliminar un item por su ID
router.delete('/pointsItems/:id', pointsItemsController.deleteItem);

module.exports = router;
