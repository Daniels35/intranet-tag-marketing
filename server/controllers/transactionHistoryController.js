const TransactionHistoryModel = require('../models/transactionHistoryModel');

exports.addTransaction = async (req, res) => {
  try {
    const newTransaction = req.body;
    const transaction = await TransactionHistoryModel.addTransaction(newTransaction);
    res.status(201).json({ message: 'Transacción registrada con éxito', transaction });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar la transacción', details: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await TransactionHistoryModel.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las transacciones', details: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await TransactionHistoryModel.getTransactionById(id);
    if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la transacción', details: err.message });
  }
};

exports.getTransactionsByInitiator = async (req, res) => {
  try {
    const initiatorID = req.params.initiatorID;
    const transactions = await TransactionHistoryModel.getTransactionsByInitiator(initiatorID);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las transacciones por iniciador', details: err.message });
  }
};

exports.getTransactionsByRecipient = async (req, res) => {
  try {
    const recipientID = req.params.recipientID;
    const transactions = await TransactionHistoryModel.getTransactionsByRecipient(recipientID);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las transacciones por destinatario', details: err.message });
  }
};
