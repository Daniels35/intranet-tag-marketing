// Archivo routes/emailTest.js
const express = require('express');
const router = express.Router();
const EmailReminderController = require('../controllers/emailReminderController');
const UsersModel = require('../models/usersModel');

// Ruta para enviar correo de cumpleaños
router.post('/test-birthday-email', EmailReminderController.sendBirthdayEmail);

// Ruta para enviar correo de aniversario
router.post('/test-entry-anniversary-email', EmailReminderController.sendEntryAnniversaryEmail);

// Ruta para probar correos globales de cumpleaños
router.post('/test-global-birthday-email', async (req, res) => {
    try {
        const allUsers = await UsersModel.getAll();
        const birthdayUsers = await UsersModel.getUsersByDateOfBirth();
        await EmailReminderController.sendGlobalBirthdayEmail(allUsers, birthdayUsers);
        res.status(200).json({ message: 'Correo global de cumpleaños enviado.' });
    } catch (error) {
        res.status(500).json({ message: 'Error enviando correo global de cumpleaños.', error: error.message });
    }
});

// Ruta para probar correos globales de aniversarios
router.post('/test-global-anniversary-email', async (req, res) => {
    try {
        const allUsers = await UsersModel.getAll();
        const entryAnniversaryUsers = await UsersModel.getUsersByEntryDate();
        await EmailReminderController.sendGlobalAnniversaryEmail(allUsers, entryAnniversaryUsers);
        res.status(200).json({ message: 'Correo global de aniversarios enviado.' });
    } catch (error) {
        res.status(500).json({ message: 'Error enviando correo global de aniversarios.', error: error.message });
    }
});

module.exports = router;
