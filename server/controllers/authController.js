const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    console.log('ID Token recibido:', idToken);

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token decodificado:', decodedToken);
    
    const { email, uid, name, picture } = decodedToken;

    if (email.endsWith('@tagdigital.com.co')) {
      console.log('Iniciando consulta SELECT...');
      const [rows] = await db.execute('SELECT * FROM users WHERE googleId = ?', [uid]);
      console.log('Resultado de la consulta SELECT:', rows);

      let user;
      if (rows.length === 0) {
        console.log('Descargando imagen...');
        const imageResponse = await axios.get(picture, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        const imageName = `${uuidv4()}.jpg`;
        const imagePath = path.join(__dirname, '../uploads', imageName);
        
        fs.writeFileSync(imagePath, imageBuffer);

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageName}`;

        console.log('Iniciando consulta INSERT...');
        const [result] = await db.execute('INSERT INTO users (id, googleId, email, name, image, imageProfile, uploadedProfileImage, updateImageAcrossSite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
          uuidv4(),
          uid,
          email,
          name,
          picture,
          imageUrl,
          '',
          false
        ]);
        console.log('Resultado de la consulta INSERT:', result);

        user = {
          id: uuidv4(),
          googleId: uid,
          email,
          name,
          image: picture,
          imageProfile: imageUrl,
          uploadedProfileImage: '',
          updateImageAcrossSite: false
        };
      } else {
        user = rows[0];
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ token });
      console.log({ message: 'Correct email domain' });

    } else {
      res.status(403).json({ message: 'Dominio de correo electrónico no válido, Ingresa con el correo de Tag Marketing' });
      console.log({ message: 'Invalid email domain' });
    }
  } catch (error) {
    console.error('Error verificando el token de ID:', error);
    res.status(500).json({ message: 'Error verificando el token', error });
  }
};

const getUserInfo = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = {
  googleAuth,
  getUserInfo,
};
