const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = 3027;
require('dotenv').config();

// Configurar la base de datos
const db = require('./config/database');

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Servir archivos estáticos de la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/pointsItems'));
app.use('/', require('./routes/redeemableItems'));

// Importar y usar la nueva ruta de autenticación
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// ////////PENDIENTE///////
app.use('/', require('./routes/transactionHistory'));


////email test
const emailTestRoutes = require('./routes/emailTest');
app.use('/api/emails', emailTestRoutes);

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});
