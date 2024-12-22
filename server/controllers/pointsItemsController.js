const fs = require('fs');
const path = require('path');
const PointsItemsModel = require('../models/pointsItemsModel');
const { v4: uuidv4 } = require('uuid');

exports.getAllItems = async (req, res) => {
  try {
    const items = await PointsItemsModel.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los items' });
  }
};

exports.getItemById = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await PointsItemsModel.getById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el item' });
  }
};

exports.createItem = async (req, res) => {
  const { name, points, description } = req.body;
  const file = req.file;

  if (!name || !points) {
    return res.status(400).json({ error: 'Nombre y puntos son requeridos' });
  }

  let imageUrl = '';

  if (file) {
    const imageName = `${uuidv4()}_${file.originalname}`;
    const imagePath = path.join(__dirname, '../uploads', imageName);
    fs.writeFileSync(imagePath, file.buffer);
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageName}`;
  }

  const newItem = {
    name,
    points,
    description,
    image: imageUrl,
  };

  try {
    const item = await PointsItemsModel.create(newItem);
    res.status(201).json({ message: 'Item creado con éxito', item });
  } catch (err) {
    console.error('Error al crear el item:', err);
    res.status(500).json({ error: 'Error al crear el item' });
  }
};

exports.updateItem = async (req, res) => {
  const id = req.params.id;
  const { name, points, description } = req.body;
  const file = req.file;

  try {
    // Obtener el ítem actual de la base de datos
    const currentItem = await PointsItemsModel.getById(id);
    if (!currentItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    // Completar los campos faltantes con los valores actuales
    const updatedItem = {
      name: name || currentItem.name,
      points: points || currentItem.points,
      description: description || currentItem.description,
      image: currentItem.image, // Mantener la imagen actual por defecto
    };

    // Si hay un nuevo archivo, actualizar el campo image
    if (file) {
      const imageName = `${uuidv4()}_${file.originalname}`;
      const imagePath = path.join(__dirname, '../uploads', imageName);

      // Guardar la nueva imagen en el servidor
      fs.writeFileSync(imagePath, file.buffer);

      // Eliminar la imagen anterior si existía
      if (currentItem.image) {
        const oldImagePath = path.join(__dirname, '../uploads', path.basename(currentItem.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Eliminar archivo
        }
      }

      updatedItem.image = `${req.protocol}://${req.get('host')}/uploads/${imageName}`;
    }

    // Actualizar en la base de datos
    const item = await PointsItemsModel.update(id, updatedItem);
    res.json({ message: 'Item actualizado con éxito', item });
  } catch (err) {
    console.error('Error al actualizar el item:', err);
    res.status(500).json({ error: 'Error al actualizar el item' });
  }
};



exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await PointsItemsModel.delete(id);
    if (result === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ message: 'Item eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el item' });
  }
};
