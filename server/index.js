const express = require('express');
const app = express();
const cors = require('cors');
const port = 3027;

// Configurar la base de datos
const db = require('./config/database');

const allowedOrigins = ['http://localhost:3000', 'http://www.proyectologistica.online'];

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

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/pointsItems'));
app.use('/', require('./routes/redeemableItems'));


////////PENDIENTE///////
app.use('/', require('./routes/transactionHistory'));

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});
