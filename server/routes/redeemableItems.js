const express = require('express');
const router = express.Router();
const redeemableItemsController = require('../controllers/redeemableItemsController');

router.get('/redeemableItems', redeemableItemsController.getAllItems);
router.get('/redeemableItems/:id', redeemableItemsController.getItemById);
router.post('/redeemableItems', redeemableItemsController.createItem);
router.put('/redeemableItems/:id', redeemableItemsController.updateItem);
router.delete('/redeemableItems/:id', redeemableItemsController.deleteItem);

module.exports = router;
