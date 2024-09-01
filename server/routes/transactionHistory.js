const express = require('express');
const router = express.Router();
const transactionHistoryController = require('../controllers/transactionHistoryController');

router.post('/transactionHistory', transactionHistoryController.addTransaction);
router.get('/transactionHistory', transactionHistoryController.getAllTransactions);
router.get('/transactionHistory/:id', transactionHistoryController.getTransactionById);

router.get('/transactionHistory/initiator/:initiatorID', transactionHistoryController.getTransactionsByInitiator);
router.get('/transactionHistory/recipient/:recipientID', transactionHistoryController.getTransactionsByRecipient);


module.exports = router;


/////PENDIENTE////