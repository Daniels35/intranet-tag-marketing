const express = require('express');
const multer = require('multer');
const path = require('path'); // Cambia 'path' por require('path')
const fs = require('fs');   
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const documentsController = require('../controllers/documentsController');

// --- CONFIGURACIÓN DE MULTER ---

// Almacenamiento para Imágenes (jpg, png, etc.)
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

// Almacenamiento para Documentos (PDF)
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads/documents/');
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
            } else { // imageFile
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

// POST - Crear una nueva categoría (con imagen opcional)
router.post('/documents/categories', uploadImage.single('image'), documentsController.createCategory);

// DELETE - Eliminar una categoría
router.delete('/documents/categories/:id', documentsController.deleteCategory);

// POST - Crear una nueva subcategoría (con imagen opcional)
router.post('/documents/subcategories', uploadImage.single('image'), documentsController.createSubcategory);

// DELETE - Eliminar una subcategoría
router.delete('/documents/subcategories/:id', documentsController.deleteSubcategory);

// POST - Subir un nuevo documento PDF (con imagen opcional)
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

// PATCH - Mover un documento a una nueva subcategoría
router.patch('/documents/:id/move', documentsController.moveDocument);

module.exports = router;