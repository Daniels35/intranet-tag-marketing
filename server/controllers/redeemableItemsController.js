const RedeemableItemsModel = require('../models/redeemableItemsModel');

exports.getAllItems = async (req, res) => {
  try {
    const items = await RedeemableItemsModel.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los items' });
  }
};

exports.getItemById = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await RedeemableItemsModel.getById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el item' });
  }
};

exports.createItem = async (req, res) => {
  const newItem = req.body;

  if (!newItem.name || !newItem.costInPoints) {
    return res.status(400).json({ error: 'Nombre y puntos son requeridos' });
  }

  try {
    const item = await RedeemableItemsModel.create(newItem);
    res.status(201).json({ message: 'Item creado con éxito', item });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el item' });
  }
};

exports.updateItem = async (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;

  try {
    const item = await RedeemableItemsModel.update(id, updatedItem);
    res.json({ message: 'Item actualizado con éxito', item });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el item' });
  }
};

exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await RedeemableItemsModel.delete(id);
    if (result === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ message: 'Item eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el item' });
  }
};
