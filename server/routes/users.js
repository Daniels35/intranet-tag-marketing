const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

// Ruta para obtener todos los usuarios
router.get('/users', usersController.getAllUsers);

// Ruta para obtener un usuario por su ID
router.get('/users/:id', usersController.getUserById);

// Ruta para crear un nuevo usuario
router.post('/users', usersController.createUser);

// Ruta para actualizar un usuario por su ID
router.put('/users/:id', usersController.updateUser);

// Ruta para actualizar la cédula de un usuario por su ID
router.put('/users/:id/identificationCard', usersController.updateIdentificationCard);

// Ruta para actualizar la fecha de nacimiento de un usuario por su ID
router.put('/users/:id/dateOfBirth', usersController.updateDateOfBirth);

// Ruta para eliminar un usuario por su ID
router.delete('/users/:id', usersController.deleteUser);

// Ruta para sumar puntos a un usuario
router.post('/users/:id/addPoints', usersController.addPointsToUser);

// Ruta para restar puntos a un usuario
router.post('/users/:id/removePoints', usersController.removePointsFromUser);

// Ruta para obtener la información del usuario autenticado
router.get('/user', authController.getUserInfo);

// Ruta para actualizar la fecha de entrada de un usuario por su ID
router.put('/users/:id/entryDate', usersController.updateEntryDate);


module.exports = router;
