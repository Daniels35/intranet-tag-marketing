const express = require('express');
const multer = require('multer');
const router = express.Router();
const redeemableItemsController = require('../controllers/redeemableItemsController');

// Configurar multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para obtener todos los items
router.get('/redeemableItems', redeemableItemsController.getAllItems);

// Ruta para obtener un item por su ID
router.get('/redeemableItems/:id', redeemableItemsController.getItemById);

// Ruta para crear un nuevo item (incluye subida de archivo)
router.post('/redeemableItems', upload.single('image'), redeemableItemsController.createItem);

// Ruta para actualizar un item por su ID
router.put('/redeemableItems/:id', upload.single('image'), redeemableItemsController.updateItem);

// Ruta para eliminar un item por su ID
router.delete('/redeemableItems/:id', redeemableItemsController.deleteItem);

module.exports = router;
