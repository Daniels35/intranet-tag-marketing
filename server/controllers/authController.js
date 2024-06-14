const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');  // Asegúrate de importar uuidv4
require('dotenv').config();

const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    console.log('ID Token recibido:', idToken);

    // Verifica el token de ID proporcionado por el cliente
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token decodificado:', decodedToken);
    
    const { email, uid, name } = decodedToken;

    // Verifica si el correo pertenece a la organización
    if (email.endsWith('@tagdigital.com.co')) {
      // Lógica para encontrar o crear un usuario en la base de datos
      console.log('Iniciando consulta SELECT...');
      const [rows] = await db.execute('SELECT * FROM users WHERE googleId = ?', [uid]);
      console.log('Resultado de la consulta SELECT:', rows);

      if (rows.length === 0) {
        console.log('Iniciando consulta INSERT...');
        const [result] = await db.execute('INSERT INTO users (id, googleId, email, name) VALUES (?, ?, ?, ?)', [
          uuidv4(),
          uid,
          email,
          name
        ]);
        console.log('Resultado de la consulta INSERT:', result);

        user = {
          id: uuidv4(),  // Asegúrate de usar uuidv4 para id
          googleId: uid,
          email,
          name
        };
      } else {
        user = rows[0];
      }

      // Genera un token JWT para la sesión
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ token });
      console.log({ message: 'Correct email domain' });

    } else {
      res.status(403).json({ message: 'Invalid email domain' });
      console.log({ message: 'Invalid email domain' });
    }
  } catch (error) {
    console.error('Error verificando el token de ID:', error);
    res.status(500).json({ message: 'Error verifying ID token', error });
  }
};

module.exports = {
  googleAuth,
};
