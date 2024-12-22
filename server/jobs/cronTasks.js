const cron = require('node-cron');
const UsersModel = require('../models/usersModel');
const EmailReminderController = require('../controllers/emailReminderController');

// Tarea programada a las 8:00 AM
cron.schedule('0 8 * * *', async () => {
    try {
        const birthdayUsers = await UsersModel.getUsersByDateOfBirth();
        const entryAnniversaryUsers = await UsersModel.getUsersByEntryDate();

        // Correos de cumpleaños
        for (const user of birthdayUsers) {
            await EmailReminderController.sendBirthdayEmail(user);
        }

        // Correos de aniversario
        for (const user of entryAnniversaryUsers) {
            await EmailReminderController.sendEntryAnniversaryEmail(user);
        }

        console.log('Correos de cumpleaños y aniversario enviados.');
    } catch (error) {
        console.error('Error en la tarea cron:', error.message);
    }
}, {
    timezone: 'America/Bogota'
});

console.log('Cron tasks inicializadas.');
