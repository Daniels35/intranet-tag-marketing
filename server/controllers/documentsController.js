const fs = require('fs');
const path = require('path');
const DocumentsModel = require('../models/documentsModel');

// Helper para obtener URL base
const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// Helper para eliminar un archivo si existe
const deleteFileFromServer = (filePath) => {
    if (filePath) {
        // Extraer la ruta relativa desde la URL completa
        const relativePath = filePath.split(process.env.APP_URL)[1] || filePath.split('localhost:3027')[1] || `/uploads/images/${path.basename(filePath)}`;
        const serverPath = path.join(__dirname, '..', relativePath);
        if (fs.existsSync(serverPath)) {
            fs.unlinkSync(serverPath);
        }
    }
};

// --- ESTRUCTURA ---
exports.getStructure = async (req, res) => {
  try {
    const structure = await DocumentsModel.getStructure();
    res.json(structure);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la estructura de documentos' });
  }
};

// --- CATEGORIES ---
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
  }

  const newCategory = { name };
  if (req.file) {
      newCategory.image_url = `${getBaseUrl(req)}/uploads/images/${req.file.filename}`;
  }

  try {
    const category = await DocumentsModel.createCategory(newCategory);
    res.status(201).json({ message: 'Categoría creada con éxito', category });
  } catch (err) {
    if (req.file) deleteFileFromServer(newCategory.image_url); // Rollback de archivo
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await DocumentsModel.findCategoryById(id);
        if (!category) return res.status(404).json({ error: "Categoría no encontrada" });

        // Borrar imagen asociada (y la de sus hijos, aunque CASCADE se ocupa de los docs)
        deleteFileFromServer(category.image_url);
        // La BD se encarga del resto gracias a ON DELETE CASCADE
        await DocumentsModel.deleteCategory(id);

        res.json({ message: "Categoría y su contenido eliminados con éxito" });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
};

// NUEVO: Actualizar Categoría
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const updateData = {};

    if (name) updateData.name = name;

    try {
        const category = await DocumentsModel.findCategoryById(id);
        if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });

        if (req.file) {
            deleteFileFromServer(category.image_url); // Borra la imagen vieja si existe
            updateData.image_url = `${getBaseUrl(req)}/uploads/images/${req.file.filename}`;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
        }

        await DocumentsModel.updateCategory(id, updateData);
        res.json({ message: 'Categoría actualizada con éxito' });
    } catch (err) {
        if (req.file) deleteFileFromServer(updateData.image_url); // Rollback del archivo nuevo
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};




// --- SUBCATEGORIES ---
exports.createSubcategory = async (req, res) => {
  const { name, category_id } = req.body;
  if (!name || !category_id) {
    return res.status(400).json({ error: 'Nombre y category_id son requeridos' });
  }

  const newSubcategory = { name, category_id };
  if (req.file) {
      newSubcategory.image_url = `${getBaseUrl(req)}/uploads/images/${req.file.filename}`;
  }

  try {
    const subcategory = await DocumentsModel.createSubcategory(newSubcategory);
    res.status(201).json({ message: 'Subcategoría creada con éxito', subcategory });
  } catch (err) {
    if (req.file) deleteFileFromServer(newSubcategory.image_url); // Rollback
    res.status(500).json({ error: 'Error al crear la subcategoría' });
  }
};

exports.deleteSubcategory = async (req, res) => {
    const { id } = req.params;
    try {
        const subcategory = await DocumentsModel.findSubcategoryById(id);
        if (!subcategory) return res.status(404).json({ error: "Subcategoría no encontrada" });

        deleteFileFromServer(subcategory.image_url);
        await DocumentsModel.deleteSubcategory(id);

        res.json({ message: "Subcategoría y sus documentos eliminados con éxito" });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la subcategoría' });
    }
};


// NUEVO: Actualizar Subcategoría
exports.updateSubcategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const updateData = {};

    if (name) updateData.name = name;

    try {
        const subcategory = await DocumentsModel.findSubcategoryById(id);
        if (!subcategory) return res.status(404).json({ error: 'Subcategoría no encontrada' });
        
        if (req.file) {
            deleteFileFromServer(subcategory.image_url);
            updateData.image_url = `${getBaseUrl(req)}/uploads/images/${req.file.filename}`;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
        }
        
        await DocumentsModel.updateSubcategory(id, updateData);
        res.json({ message: 'Subcategoría actualizada con éxito' });
    } catch (err) {
        if (req.file) deleteFileFromServer(updateData.image_url);
        res.status(500).json({ error: 'Error al actualizar la subcategoría' });
    }
};



// NUEVO: Mover Subcategoría
exports.moveSubcategory = async (req, res) => {
    const { id } = req.params; // ID de la subcategoría a mover
    const { newCategoryId } = req.body;

    if (!newCategoryId) {
        return res.status(400).json({ error: 'El ID de la nueva categoría es requerido' });
    }

    try {
        const affectedRows = await DocumentsModel.moveSubcategory(id, newCategoryId);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Subcategoría no encontrada' });
        }
        res.json({ message: 'Subcategoría movida con éxito' });
    } catch (err) {
        // Puede fallar si newCategoryId no existe (error de foreign key)
        res.status(500).json({ error: 'Error al mover la subcategoría' });
    }
};



// --- DOCUMENTS ---
exports.uploadDocument = async (req, res) => {
  const { title, subcategory_id } = req.body;
  const files = req.files;

  if (!title || !subcategory_id || !files || !files.pdfFile) {
    return res.status(400).json({ error: 'Título, subcategory_id y un archivo PDF son requeridos' });
  }

  const newDocument = {
    title,
    subcategory_id,
    original_filename: files.pdfFile[0].originalname,
    file_path: `${getBaseUrl(req)}/uploads/documents/${files.pdfFile[0].filename}`,
    mime_type: files.pdfFile[0].mimetype,
  };

  if (files.imageFile) {
    newDocument.image_url = `${getBaseUrl(req)}/uploads/images/${files.imageFile[0].filename}`;
  }

  try {
    const document = await DocumentsModel.createDocument(newDocument);
    res.status(201).json({ message: 'Documento subido con éxito', document });
  } catch (err) {
    // Rollback de archivos en caso de error en la BD
    deleteFileFromServer(newDocument.file_path);
    deleteFileFromServer(newDocument.image_url);
    res.status(500).json({ error: 'Error al guardar el documento' });
  }
};

exports.deleteDocument = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await DocumentsModel.findDocumentById(id);
        if (!document) return res.status(404).json({ error: 'Documento no encontrado' });

        deleteFileFromServer(document.file_path);
        deleteFileFromServer(document.image_url);
        await DocumentsModel.deleteDocument(id);
        
        res.json({ message: 'Documento eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el documento' });
    }
};

// NUEVO: Mover un documento
exports.moveDocument = async (req, res) => {
    const { id } = req.params;
    const { newSubcategoryId } = req.body;

    if (!newSubcategoryId) {
        return res.status(400).json({ error: "El ID de la nueva subcategoría es requerido" });
    }

    try {
        const affectedRows = await DocumentsModel.moveDocument(id, newSubcategoryId);
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Documento no encontrado" });
        }
        res.json({ message: "Documento movido con éxito" });
    } catch (err) {
        res.status(500).json({ error: "Error al mover el documento" });
    }
};


// NUEVO: Actualizar Documento
exports.updateDocument = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const updateData = {};
    const files = req.files;

    if (title) updateData.title = title;

    try {
        const document = await DocumentsModel.findDocumentById(id);
        if (!document) return res.status(404).json({ error: 'Documento no encontrado' });

        if (files && files.pdfFile) {
            deleteFileFromServer(document.file_path);
            updateData.file_path = `${getBaseUrl(req)}/uploads/documents/${files.pdfFile[0].filename}`;
            updateData.original_filename = files.pdfFile[0].originalname;
            updateData.mime_type = files.pdfFile[0].mimetype;
        }

        if (files && files.imageFile) {
            deleteFileFromServer(document.image_url);
            updateData.image_url = `${getBaseUrl(req)}/uploads/images/${files.imageFile[0].filename}`;
        }

        if (Object.keys(updateData).length === 0) {
             return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
        }

        await DocumentsModel.updateDocument(id, updateData);
        res.json({ message: 'Documento actualizado con éxito' });

    } catch (err) {
        if (updateData.file_path) deleteFileFromServer(updateData.file_path);
        if (updateData.image_url) deleteFileFromServer(updateData.image_url);
        res.status(500).json({ error: 'Error al actualizar el documento' });
    }
};