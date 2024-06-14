const admin = require('firebase-admin');
const serviceAccount = require('../tag-autentification-firebase-adminsdk-r6fsd-ab09368b1e.json'); // Asegúrate de que la ruta sea correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase Admin initialized');

module.exports = admin;
