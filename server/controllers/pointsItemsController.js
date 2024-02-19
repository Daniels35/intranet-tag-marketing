const PointsItemsModel = require('../models/pointsItemsModel');

exports.getAllItems = (req, res) => {
  PointsItemsModel.getAll((err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los items' });
    }
    res.json(items);
  });
};

exports.getItemById = (req, res) => {
  const id = req.params.id;
  PointsItemsModel.getById(id, (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el item' });
    }
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  });
};

exports.createItem = (req, res) => {
  const newItem = req.body;

  if (!newItem.name || !newItem.points) {
    return res.status(400).json({ error: 'Nombre y puntos son requeridos' });
  }

  PointsItemsModel.create(newItem, (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear el item' });
    }
    res.status(201).json({ message: 'Item creado con éxito', item });
  });
};

exports.updateItem = (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;

  PointsItemsModel.update(id, updatedItem, (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar el item' });
    }
    res.json({ message: 'Item actualizado con éxito', item: { ...updatedItem, id } });
  });
};

exports.deleteItem = (req, res) => {
  const id = req.params.id;

  PointsItemsModel.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el item' });
    }
    if (result === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ message: 'Item eliminado con éxito' });
  });
};
