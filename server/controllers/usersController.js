const UsersModel = require('../models/usersModel');
const EmailReminderController = require('./emailReminderController');


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
  console.log('Datos recibidos para actualizar:', updatedUser); // Log para verificar los datos
  try {
    const user = await UsersModel.updateUser(id, updatedUser);
    res.json({ message: 'Usuario actualizado con éxito', user });
  } catch (err) {
    console.error('Error en la actualización:', err); // Log para verificar el error
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
    const initiatorID = req.body.initiatorID; // ID del usuario que envía los puntos
    const recipientID = req.params.id;       // ID del usuario que recibe los puntos
    const pointsToAdd = parseInt(req.body.points, 10);
    const description = req.body.description || `Puntos agregados: ${pointsToAdd}`;
    const itemID = req.body.itemID || null;  // ID del ítem, si se proporciona

    try {
        // Agregar puntos en la base de datos
        const result = await UsersModel.addPoints(initiatorID, recipientID, pointsToAdd, description, itemID);
        if (result > 0) {
            // Obtener información del remitente y el receptor
            const sender = await UsersModel.getUserById(initiatorID);
            const recipient = await UsersModel.getUserById(recipientID);

            if (!sender || !recipient) {
                throw new Error('Remitente o receptor no encontrados');
            }

            // Enviar correo al receptor
            await EmailReminderController.sendPointsAddedEmail(recipient, sender, pointsToAdd, description);

            res.json({ message: 'Puntos agregados exitosamente.' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado.' });
        }
    } catch (err) {
        console.error('Error al sumar puntos:', err.message);
        res.status(500).json({ error: 'Error al sumar puntos', details: err.message });
    }
};

// Quitar puntos a un usuario
exports.removePointsFromUser = async (req, res) => {
  const initiatorID = req.body.initiatorID; // ID del usuario que quita los puntos
  const recipientID = req.params.id;       // ID del usuario al que se le quitan los puntos
  const pointsToRemove = parseInt(req.body.points, 10);
  const description = req.body.description || `Puntos retirados: ${pointsToRemove}`;
  const itemID = req.body.itemID || null;  // ID del ítem, si se proporciona

  try {
      // Restar puntos en la base de datos
      const result = await UsersModel.removePoints(initiatorID, recipientID, pointsToRemove, description, itemID);
      if (result > 0) {
          // Obtener información del remitente y el receptor
          const sender = await UsersModel.getUserById(initiatorID);
          const recipient = await UsersModel.getUserById(recipientID);

          if (!sender || !recipient) {
              throw new Error('Remitente o receptor no encontrados');
          }

          // Enviar correo al receptor notificando sobre la resta
          await EmailReminderController.sendPointsRemovedEmail(recipient, sender, pointsToRemove, description);

          res.json({ message: 'Puntos retirados exitosamente.' });
      } else {
          res.status(404).json({ error: 'Usuario no encontrado o puntos insuficientes.' });
      }
  } catch (err) {
      console.error('Error al retirar puntos:', err.message);
      res.status(500).json({ error: 'Error al retirar puntos', details: err.message });
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

// Actualizar fecha de entrada por ID
exports.updateEntryDate = async (req, res) => {
  const id = req.params.id;
  const { entryDate } = req.body;
  try {
    const updatedRows = await UsersModel.updateEntryDate(id, entryDate);
    if (updatedRows > 0) {
      res.json({ message: 'Fecha de entrada actualizada con éxito' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la fecha de entrada', details: err.message });
  }
};
