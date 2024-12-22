const express = require('express');
const router = express.Router();
const EmailReminderController = require('../controllers/emailReminderController');

// Ruta para enviar correo de cumpleaños
router.post('/test-birthday-email', EmailReminderController.sendBirthdayEmail);

// Ruta para enviar correo de aniversario
router.post('/test-entry-anniversary-email', EmailReminderController.sendEntryAnniversaryEmail);

module.exports = router;
