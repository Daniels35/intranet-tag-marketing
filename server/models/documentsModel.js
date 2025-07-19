const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const DocumentsModel = {};

// --- INICIALIZACIÓN DE TABLAS (CON NUEVOS CAMPOS) ---
(async () => {
  try {
    // El SQL se puede copiar de la sección anterior
    await db.query(`
      CREATE TABLE IF NOT EXISTS document_categories (
        id CHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, image_url VARCHAR(500) NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS document_subcategories (
        id CHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, category_id CHAR(36) NOT NULL, image_url VARCHAR(500) NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (category_id) REFERENCES document_categories(id) ON DELETE CASCADE
      );
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id CHAR(36) PRIMARY KEY, title VARCHAR(255) NOT NULL, original_filename VARCHAR(255) NOT NULL, file_path VARCHAR(500) NOT NULL, mime_type VARCHAR(100) NOT NULL, image_url VARCHAR(500) NULL, subcategory_id CHAR(36) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (subcategory_id) REFERENCES document_subcategories(id) ON DELETE CASCADE
      );
    `);
    console.log('Document-related tables are ready (with image support).');
  } catch (err) {
    console.error('Error creating document tables:', err);
  }
})();

// --- CATEGORIES ---
DocumentsModel.createCategory = async (categoryData) => {
  categoryData.id = uuidv4();
  await db.query('INSERT INTO document_categories SET ?', categoryData);
  return categoryData;
};

DocumentsModel.findCategoryById = async (id) => {
    const [categories] = await db.query('SELECT * FROM document_categories WHERE id = ?', [id]);
    return categories[0];
};

DocumentsModel.deleteCategory = async (id) => {
    // ON DELETE CASCADE se encarga del resto en la BD
    const [result] = await db.query('DELETE FROM document_categories WHERE id = ?', [id]);
    return result.affectedRows;
};

// --- SUBCATEGORIES ---
DocumentsModel.createSubcategory = async (subcategoryData) => {
  subcategoryData.id = uuidv4();
  await db.query('INSERT INTO document_subcategories SET ?', subcategoryData);
  return subcategoryData;
};

DocumentsModel.findSubcategoryById = async (id) => {
    const [subcategories] = await db.query('SELECT * FROM document_subcategories WHERE id = ?', [id]);
    return subcategories[0];
};

DocumentsModel.deleteSubcategory = async (id) => {
    const [result] = await db.query('DELETE FROM document_subcategories WHERE id = ?', [id]);
    return result.affectedRows;
};


// --- DOCUMENTS ---
DocumentsModel.createDocument = async (documentData) => {
  documentData.id = uuidv4();
  await db.query('INSERT INTO documents SET ?', documentData);
  return documentData;
};

DocumentsModel.findDocumentById = async (id) => {
    const [docs] = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
    return docs[0];
};

DocumentsModel.deleteDocument = async (id) => {
    const [result] = await db.query('DELETE FROM documents WHERE id = ?', [id]);
    return result.affectedRows;
};

// NUEVA FUNCIÓN: Mover un documento a otra subcategoría
DocumentsModel.moveDocument = async (documentId, newSubcategoryId) => {
    const [result] = await db.query('UPDATE documents SET subcategory_id = ? WHERE id = ?', [newSubcategoryId, documentId]);
    return result.affectedRows;
};


// --- OBTENER ESTRUCTURA COMPLETA ---
DocumentsModel.getStructure = async () => {
  const query = `
    SELECT 
      c.id as category_id, c.name as category_name, c.image_url as category_image,
      s.id as subcategory_id, s.name as subcategory_name, s.image_url as subcategory_image,
      d.id as document_id, d.title as document_title, d.file_path as document_path, d.image_url as document_image
    FROM document_categories c
    LEFT JOIN document_subcategories s ON c.id = s.category_id
    LEFT JOIN documents d ON s.id = d.subcategory_id
    ORDER BY c.name, s.name, d.title;
  `;
  const [rows] = await db.query(query);

  const categories = {};
  rows.forEach(row => {
    if (!row.category_id) return;
    if (!categories[row.category_id]) {
      categories[row.category_id] = {
        id: row.category_id, name: row.category_name, image: row.category_image, subcategories: {}
      };
    }
    if (row.subcategory_id && !categories[row.category_id].subcategories[row.subcategory_id]) {
        categories[row.category_id].subcategories[row.subcategory_id] = {
            id: row.subcategory_id, name: row.subcategory_name, image: row.subcategory_image, documents: []
        };
    }
    if (row.document_id) {
        categories[row.category_id].subcategories[row.subcategory_id].documents.push({
            id: row.document_id, title: row.document_title, path: row.document_path, image: row.document_image
        });
    }
  });

  return Object.values(categories).map(c => ({
      ...c,
      subcategories: Object.values(c.subcategories)
  }));
};

module.exports = DocumentsModel;