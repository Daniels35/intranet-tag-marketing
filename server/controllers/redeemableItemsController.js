const RedeemableItemsModel = require('../models/redeemableItemsModel');

exports.getAllItems = (req, res) => {
  RedeemableItemsModel.getAll((err, items) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los items' });
    res.json(items);
  });
};

exports.getItemById = (req, res) => {
  const id = req.params.id;
  RedeemableItemsModel.getById(id, (err, item) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el item' });
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(item);
  });
};

exports.createItem = (req, res) => {
  const newItem = req.body;
  if (!newItem.name || !newItem.costInPoints || !newItem.description) {
    return res.status(400).json({ error: 'Nombre, costo en puntos y descripción son requeridos' });
  }

  RedeemableItemsModel.create(newItem, (err, item) => {
    if (err) return res.status(500).json({ error: 'Error al crear el item' });
    res.status(201).json({ message: 'Item creado con éxito', item });
  });
};

exports.updateItem = (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;

  RedeemableItemsModel.update(id, updatedItem, (err, item) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el item' });
    res.json({ message: 'Item actualizado con éxito', item: { ...updatedItem, id } });
  });
};

exports.deleteItem = (req, res) => {
  const id = req.params.id;

  RedeemableItemsModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el item' });
    if (result === 0) return res.status(404).json({ error: 'Item no encontrado' });
    res.json({ message: 'Item eliminado con éxito' });
  });
};
