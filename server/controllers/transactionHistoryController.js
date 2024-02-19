const TransactionHistoryModel = require('../models/transactionHistoryModel');

exports.addTransaction = (req, res) => {
  const newTransaction = req.body;
  TransactionHistoryModel.addTransaction(newTransaction, (err, transaction) => {
    if (err) return res.status(500).json({ error: 'Error al registrar la transacción' });
    res.status(201).json({ message: 'Transacción registrada con éxito', transaction });
  });
};

exports.getAllTransactions = (req, res) => {
  TransactionHistoryModel.getAllTransactions((err, transactions) => {
    if (err) return res.status(500).json({ error: 'Error al obtener las transacciones' });
    res.json(transactions);
  });
};

exports.getTransactionById = (req, res) => {
  const id = req.params.id;
  TransactionHistoryModel.getTransactionById(id, (err, transaction) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la transacción' });
    if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(transaction);
  });
};


/////PENDIENTE/////