// cronTasks.js
const UsersModel = require('../models/usersModel');
const EmailReminderController = require('../controllers/emailReminderController');

console.log('Ejecutando cronTasks.js a las:', new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }));
console.log('Server time:', new Date().toString());


(async () => {
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

        // Enviar correo global de cumpleaños
        if (birthdayUsers.length > 0) {
            await EmailReminderController.sendGlobalBirthdayEmail(allUsers, birthdayUsers);
        }

        // Enviar correo global de aniversarios
        if (entryAnniversaryUsers.length > 0) {
            await EmailReminderController.sendGlobalAnniversaryEmail(allUsers, entryAnniversaryUsers);
        }

        // **Aquí llamamos a la función que manda el correo de notificación**
        await EmailReminderController.sendCronNotificationEmail();

        console.log('✅ Correos enviados correctamente.');
    } catch (error) {
        console.error('❌ Error en la tarea cron:', error.message);
    }
})();