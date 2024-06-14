require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  // port: 5522, // Descomenta y ajusta si es necesario
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Verificar conexión a la base de datos
db.getConnection()
  .then(connection => {
    console.log('Conexión a la base de datos establecida correctamente.');
    connection.release(); // Liberar la conexión después de la verificación
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = db;
