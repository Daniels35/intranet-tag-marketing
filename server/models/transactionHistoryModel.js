const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TransactionHistoryModel = {};


////PENDIENTE/////

// Crear la tabla de transactionHistory si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS transactionHistory (
    id CHAR(36) PRIMARY KEY,
    userID CHAR(36) NOT NULL,
    itemID CHAR(36),
    transactionType ENUM('grant', 'revoke', 'redemption', 'adjustment', 'transfer') NOT NULL,
    points INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating the transactionHistory table: ' + err);
  } else {
    console.log('The transactionHistory table was created successfully.');
  }
});

TransactionHistoryModel.addTransaction = (newTransaction, callback) => {
  newTransaction.id = uuidv4();
  db.query('INSERT INTO transactionHistory SET ?', newTransaction, (err, result) => {
    if (err) return callback(err, null);
    callback(null, newTransaction);
  });
};

TransactionHistoryModel.getAllTransactions = callback => {
  db.query('SELECT * FROM transactionHistory', (err, transactions) => {
    if (err) return callback(err, null);
    callback(null, transactions);
  });
};

TransactionHistoryModel.getTransactionById = (id, callback) => {
  db.query('SELECT * FROM transactionHistory WHERE id = ?', [id], (err, transaction) => {
    if (err) return callback(err, null);
    callback(null, transaction[0]);
  });
};

module.exports = TransactionHistoryModel;
