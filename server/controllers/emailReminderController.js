const transporter = require('../config/transporter');

// Calcular años cumplidos
const calculateYears = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return today.getFullYear() - targetDate.getFullYear();
};

const EmailReminderController = {};

// Función para enviar correos
const sendEmail = async (email, subject, text) => {
    const mailOptions = {
        from: `"Notificaciones Tag Marketing Digital" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${email}: ${info.response}`);
    } catch (error) {
        console.error(`Error enviando correo a ${email}:`, error.message);
        throw error;
    }
};

// Enviar correo cuando se suman puntos con el nombre del remitente
sendPointsAddedEmail = async (recipient, sender, points, description) => {
    const subject = '🎉 ¡Te han enviado puntos! 🎉';
    const text = `Hola ${recipient.name},\n\n${sender.name} te ha enviado ${points} puntos.\nDescripción: ${description}\n\nGracias por ser parte de nuestro equipo.\n\nSaludos,\nTag Marketing Digital.`;

    await sendEmail(recipient.email, subject, text);
};

// Enviar correo cuando se remiden puntos con el nombre del remitente

sendPointsRemovedEmail = async (recipient, sender, points, description) => {
    const subject = '⚠️ Puntos Redimidos ⚠️';
    const text = `Hola ${recipient.name},\n\n${sender.name} ha redimido ${points} puntos de tu cuenta.\nDescripción: ${description}\n\nSi tienes dudas, por favor contácta a ${sender.name}.\n\nSaludos,\nTag Marketing Digital.`;

    await sendEmail(recipient.email, subject, text);
};



// Enviar correo de cumpleaños
EmailReminderController.sendBirthdayEmail = async (reqOrUser) => {
    const { email, name, dateOfBirth } = reqOrUser.body || reqOrUser;
    const years = calculateYears(dateOfBirth);

    const subject = `¡Feliz cumpleaños, ${name}!`;
    const text = `Hola ${name},\n\nHoy es tu cumpleaños número ${years}. 🎉\n\n¡Todo el equipo te desea un día espectacular lleno de felicidad y éxitos!\n\n¡Que tengas un excelente día!`;

    await sendEmail(email, subject, text);
};

// Enviar correo de aniversario en la empresa
EmailReminderController.sendEntryAnniversaryEmail = async (reqOrUser) => {
    const { email, name, entryDate } = reqOrUser.body || reqOrUser;
    const years = calculateYears(entryDate);

    const subject = `¡Feliz aniversario en la empresa, ${name}!`;
    const text = `Hola ${name},\n\nHoy cumples ${years} años con nosotros en la empresa. 🎉\n\nGracias por tu dedicación y esfuerzo durante estos ${years} años.\n\n¡Esperamos seguir construyendo grandes logros juntos!\n\n¡Que tengas un excelente día!`;

    await sendEmail(email, subject, text);
};

// Enviar correo global informando sobre cumpleaños
EmailReminderController.sendGlobalBirthdayEmail = async (users, birthdayUsers) => {
    if (birthdayUsers.length === 0) {
        console.log('No hay cumpleaños hoy, no se enviará el correo global.');
        return;
    }

    // Excluir a los usuarios que están de cumpleaños
    const filteredUsers = users.filter(user => !birthdayUsers.some(birthday => birthday.email === user.email));

    if (filteredUsers.length === 0) {
        console.log('No hay usuarios para enviar el correo global después de excluir a los cumpleañeros.');
        return;
    }

    const recipients = filteredUsers.map(user => user.email).join(',');
    const names = birthdayUsers.map(user => user.name).join(', ');

    const subject = '🎉 Hoy es un día especial 🎂';
    const text = `Hola equipo,\n\nNuestro(s) compañero(s) ${names} está(n) de cumpleaños hoy. ¡No olvides desearles un feliz día! 🎉`;

    await sendEmail(recipients, subject, text);
};

// Enviar correo global informando sobre aniversarios
EmailReminderController.sendGlobalAnniversaryEmail = async (users, anniversaryUsers) => {
    if (anniversaryUsers.length === 0) {
        console.log('No hay aniversarios hoy, no se enviará el correo global.');
        return;
    }

    // Excluir a los usuarios que están de aniversario
    const filteredUsers = users.filter(user => !anniversaryUsers.some(anniversary => anniversary.email === user.email));

    if (filteredUsers.length === 0) {
        console.log('No hay usuarios para enviar el correo global después de excluir a los que están de aniversario.');
        return;
    }

    const recipients = filteredUsers.map(user => user.email).join(',');
    const anniversaryMessages = anniversaryUsers.map(user => {
        const years = calculateYears(user.entryDate);
        return `${user.name} celebra su ${years}º aniversario en la empresa.`;
    }).join('\n');

    const subject = '🎉 Aniversarios en la empresa 🎉';
    const text = `Hola equipo,\n\nHoy celebramos los logros de nuestros compañeros:\n\n${anniversaryMessages}\n\n¡Agradecemos su dedicación y esfuerzo! 🎉`;

    await sendEmail(recipients, subject, text);
};

module.exports = {
    sendPointsAddedEmail,
    sendPointsRemovedEmail,
    sendBirthdayEmail: EmailReminderController.sendBirthdayEmail,
    sendEntryAnniversaryEmail: EmailReminderController.sendEntryAnniversaryEmail,
    sendGlobalBirthdayEmail: EmailReminderController.sendGlobalBirthdayEmail,
    sendGlobalAnniversaryEmail: EmailReminderController.sendGlobalAnniversaryEmail
};

