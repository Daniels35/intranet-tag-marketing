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

// Función para obtener todas las transacciones
TransactionHistoryModel.getAllTransactions = async () => {
  try {
    const [transactions] = await db.query('SELECT * FROM transactionHistory');
    return transactions;
  } catch (err) {
    throw err;
  }
};

// Función para obtener una transacción por ID
TransactionHistoryModel.getTransactionById = async (id) => {
  try {
    const [transaction] = await db.query('SELECT * FROM transactionHistory WHERE id = ?', [id]);
    return transaction[0];
  } catch (err) {
    throw err;
  }
};

// Función para obtener transacciones por iniciador
TransactionHistoryModel.getTransactionsByInitiator = async (initiatorID) => {
  try {
    const [transactions] = await db.query('SELECT * FROM transactionHistory WHERE initiatorID = ?', [initiatorID]);
    return transactions;
  } catch (err) {
    throw err;
  }
};

// Función para obtener transacciones por destinatario
TransactionHistoryModel.getTransactionsByRecipient = async (recipientID) => {
  try {
    const [transactions] = await db.query('SELECT * FROM transactionHistory WHERE recipientID = ?', [recipientID]);
    return transactions;
  } catch (err) {
    throw err;
  }
};

module.exports = TransactionHistoryModel;
