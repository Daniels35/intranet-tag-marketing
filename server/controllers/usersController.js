const UsersModel = require('../models/usersModel');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UsersModel.getUserById(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Crear nuevo usuario
exports.createUser = async (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.identificationCard) {
    return res.status(400).json({ error: 'Nombre y Número de Identificación son requeridos' });
  }
  try {
    const user = await UsersModel.createUser(newUser);
    res.json({ message: 'Usuario agregado con éxito', user });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Actualizar usuario por ID
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  try {
    const user = await UsersModel.updateUser(id, updatedUser);
    res.json({ message: 'Usuario actualizado con éxito', user });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Eliminar usuario por ID
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await UsersModel.deleteUser(id);
    res.json({ message: 'Usuario eliminado con éxito', result });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// Sumar puntos a un usuario
exports.addPointsToUser = async (req, res) => {
  const userId = req.params.id;
  const pointsToAdd = parseInt(req.body.points, 10);
  try {
    const result = await UsersModel.addPoints(userId, pointsToAdd);
    if (result > 0) {
      res.json({ message: 'Puntos agregados exitosamente.' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al sumar puntos', details: err.message });
  }
};

// Actualizar cédula por ID
exports.updateIdentificationCard = async (req, res) => {
  const id = req.params.id;
  const { identificationCard } = req.body;
  try {
    const updatedUser = await UsersModel.updateUser(id, { identificationCard, identificationCardModified: true });
    res.json({ message: 'Cédula actualizada con éxito', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la cédula' });
  }
};

// Actualizar fecha de nacimiento por ID
exports.updateDateOfBirth = async (req, res) => {
  const id = req.params.id;
  const { dateOfBirth } = req.body;
  try {
    const updatedUser = await UsersModel.updateUser(id, { dateOfBirth, dateOfBirthModified: true });
    res.json({ message: 'Fecha de nacimiento actualizada con éxito', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la fecha de nacimiento' });
  }
};