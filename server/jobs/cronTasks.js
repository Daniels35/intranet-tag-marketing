// Archivo cronTasks.js
const cron = require('node-cron');
const UsersModel = require('../models/usersModel');
const EmailReminderController = require('../controllers/emailReminderController');

// Tarea programada a las 6:00 AM
cron.schedule('0 6 * * *', async () => {
    try {
        const birthdayUsers = await UsersModel.getUsersByDateOfBirth();
        const entryAnniversaryUsers = await UsersModel.getUsersByEntryDate();
        const allUsers = await UsersModel.getAll(); // Obtener todos los usuarios

        // Enviar correos individuales de cumpleaños
        for (const user of birthdayUsers) {
            await EmailReminderController.sendBirthdayEmail(user);
        }

        // Enviar correos individuales de aniversario
        for (const user of entryAnniversaryUsers) {
            await EmailReminderController.sendEntryAnniversaryEmail(user);
        }

        // Enviar correo global informando sobre cumpleaños
        if (birthdayUsers.length > 0) {
            await EmailReminderController.sendGlobalBirthdayEmail(allUsers, birthdayUsers);
        }

        // Enviar correo global informando sobre aniversarios
        if (entryAnniversaryUsers.length > 0) {
            await EmailReminderController.sendGlobalAnniversaryEmail(allUsers, entryAnniversaryUsers);
        }

        console.log('Correos de cumpleaños, aniversarios y globales enviados.');
    } catch (error) {
        console.error('Error en la tarea cron:', error.message);
    }
}, {
    timezone: 'America/Bogota'
});

console.log('Cron tasks inicializadas.');
