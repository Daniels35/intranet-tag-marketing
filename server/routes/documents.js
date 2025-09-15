// routes/documents.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const documentsController = require('../controllers/documentsController');

// --- CONFIGURACIÓN DE MULTER (Tu código original) ---

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads/images/');
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const uploadImage = multer({ storage: imageStorage });

const uploadDocumentAndImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let dest;
            if (file.fieldname === 'pdfFile') {
                dest = path.join(__dirname, '../uploads/documents/');
            } else { // imageFile o 'image'
                dest = path.join(__dirname, '../uploads/images/');
            }
            fs.mkdirSync(dest, { recursive: true });
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        }
    })
});

// --- RUTAS DE LA API PARA DOCUMENTOS ---

// GET - Obtener toda la estructura anidada
router.get('/documents/structure', documentsController.getStructure);

// --- RUTAS DE CATEGORÍAS ---
// POST - Crear una nueva categoría
router.post('/documents/categories', uploadImage.single('image'), documentsController.createCategory);

// DELETE - Eliminar una categoría
router.delete('/documents/categories/:id', documentsController.deleteCategory);

// PUT (NUEVO) - Actualizar una categoría
router.put('/documents/categories/:id', uploadImage.single('image'), documentsController.updateCategory);


// --- RUTAS DE SUBCATEGORÍAS ---
// POST - Crear una nueva subcategoría
router.post('/documents/subcategories', uploadImage.single('image'), documentsController.createSubcategory);

// DELETE - Eliminar una subcategoría
router.delete('/documents/subcategories/:id', documentsController.deleteSubcategory);

// PUT (NUEVO) - Actualizar una subcategoría
router.put('/documents/subcategories/:id', uploadImage.single('image'), documentsController.updateSubcategory);

// PATCH (NUEVO) - Mover una subcategoría
router.patch('/documents/subcategories/:id/move', documentsController.moveSubcategory);


// --- RUTAS DE DOCUMENTOS ---
// POST - Subir un nuevo documento
router.post(
    '/documents/upload',
    uploadDocumentAndImage.fields([
        { name: 'pdfFile', maxCount: 1 },
        { name: 'imageFile', maxCount: 1 }
    ]),
    documentsController.uploadDocument
);

// DELETE - Eliminar un documento
router.delete('/documents/:id', documentsController.deleteDocument);

// PUT (NUEVO) - Actualizar un documento
router.put(
    '/documents/:id',
    uploadDocumentAndImage.fields([
        { name: 'pdfFile', maxCount: 1 },
        { name: 'imageFile', maxCount: 1 }
    ]),
    documentsController.updateDocument
);

// PATCH - Mover un documento
router.patch('/documents/:id/move', documentsController.moveDocument);

module.exports = router;