const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TransactionHistoryModel = {};

// Crear la tabla de transactionHistory si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS transactionHistory (
    id CHAR(36) PRIMARY KEY,
    initiatorID CHAR(36) NOT NULL,
    recipientID CHAR(36) NOT NULL,
    itemID CHAR(36),
    transactionType ENUM('grant', 'revoke', 'transfer') NOT NULL,
    points INT NOT NULL,
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => {
  console.log('The transactionHistory table was created successfully.');
}).catch(err => {
  console.error('Error creating the transactionHistory table: ' + err);
});

// Función para agregar una transacción
TransactionHistoryModel.addTransaction = async (newTransaction) => {
  try {
    newTransaction.id = uuidv4();
    await db.query('INSERT INTO transactionHistory SET ?', newTransaction);
    return newTransaction;
  } catch (err) {
    throw err;
  }
};

// Función para obtener todas las transacciones (de más recientes a más antiguas)
TransactionHistoryModel.getAllTransactions = async () => {
  try {
    const [transactions] = await db.query(`
      SELECT 
        th.*, 
        u_initiator.name as initiatorName, 
        u_recipient.name as recipientName
      FROM 
        transactionHistory th
      JOIN 
        users u_initiator ON th.initiatorID = u_initiator.id
      JOIN 
        users u_recipient ON th.recipientID = u_recipient.id
      ORDER BY 
        th.date DESC
    `);
    return transactions;
  } catch (err) {
    throw err;
  }
};


// Función para obtener una transacción por ID
TransactionHistoryModel.getTransactionById = async (id) => {
  try {
    const [transaction] = await db.query(`
      SELECT 
        th.*, 
        u_initiator.name as initiatorName, 
        u_recipient.name as recipientName
      FROM 
        transactionHistory th
      JOIN 
        users u_initiator ON th.initiatorID = u_initiator.id
      JOIN 
        users u_recipient ON th.recipientID = u_recipient.id
      WHERE 
        th.id = ?
    `, [id]);
    return transaction[0];
  } catch (err) {
    throw err;
  }
};


// Función para obtener transacciones por iniciador (de más recientes a más antiguas)
TransactionHistoryModel.getTransactionsByInitiator = async (initiatorID) => {
  try {
    const [transactions] = await db.query(`
      SELECT 
        th.*, 
        u_initiator.name as initiatorName, 
        u_recipient.name as recipientName
      FROM 
        transactionHistory th
      JOIN 
        users u_initiator ON th.initiatorID = u_initiator.id
      JOIN 
        users u_recipient ON th.recipientID = u_recipient.id
      WHERE 
        th.initiatorID = ?
      ORDER BY 
        th.date DESC
    `, [initiatorID]);
    return transactions;
  } catch (err) {
    throw err;
  }
};


// Función para obtener transacciones por destinatario (de más recientes a más antiguas) con un límite
TransactionHistoryModel.getTransactionsByRecipient = async (recipientID, limit = 50) => {
  try {
    const [transactions] = await db.query(`
      SELECT 
        th.*, 
        u_initiator.name as initiatorName, 
        u_recipient.name as recipientName
      FROM 
        transactionHistory th
      JOIN 
        users u_initiator ON th.initiatorID = u_initiator.id
      JOIN 
        users u_recipient ON th.recipientID = u_recipient.id
      WHERE 
        th.recipientID = ?
      ORDER BY 
        th.date DESC
      LIMIT ?
    `, [recipientID, limit]);
    return transactions;
  } catch (err) {
    throw err;
  }
};



module.exports = TransactionHistoryModel;
