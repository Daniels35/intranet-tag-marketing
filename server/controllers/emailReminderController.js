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

module.exports = EmailReminderController;
