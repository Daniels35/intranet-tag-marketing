// src/services/documentService.js

// Asumimos que la URL base de tu API está en una variable de entorno
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3027/api';

// Helper para manejar las respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Algo salió mal');
  }
  return response.json();
};

// Obtener la estructura completa de documentos
export const getStructure = async () => {
  const response = await fetch(`${API_URL}/documents/structure`);
  return handleResponse(response);
};

// Crear una nueva categoría (requiere token de admin)
export const createCategory = async (formData, token) => {
  const response = await fetch(`${API_URL}/documents/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(response);
};

// Crear una nueva subcategoría (requiere token de admin)
export const createSubcategory = async (formData, token) => {
    const response = await fetch(`${API_URL}/documents/subcategories`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
    return handleResponse(response);
};

// Subir un nuevo documento (requiere token de admin)
export const uploadDocument = async (formData, token) => {
    // La ruta correcta debe ser '/documents/upload' como en Postman
    const response = await fetch(`${API_URL}/documents/upload`, { // <-- CAMBIO AQUÍ
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
    return handleResponse(response);
};

// Eliminar un item (categoría, subcategoría o documento)
export const deleteItem = async (type, id, token) => {
    let url;
    switch (type) {
        case 'category':
            url = `${API_URL}/documents/categories/${id}`;
            break;
        case 'subcategory':
            url = `${API_URL}/documents/subcategories/${id}`;
            break;
        case 'document':
            url = `${API_URL}/documents/${id}`;
            break;
        default:
            throw new Error('Tipo de item no válido');
    }

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};


// --- NUEVAS FUNCIONES DE ACTUALIZACIÓN (PUT) ---

export const updateCategory = async (id, formData, token) => {
  const response = await fetch(`${API_URL}/documents/categories/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(response);
};

export const updateSubcategory = async (id, formData, token) => {
  const response = await fetch(`${API_URL}/documents/subcategories/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(response);
};

export const updateDocument = async (id, formData, token) => {
  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(response);
};


// --- NUEVAS FUNCIONES DE MOVIMIENTO (PATCH) ---

export const moveSubcategory = async (id, newCategoryId, token) => {
  const response = await fetch(`${API_URL}/documents/subcategories/${id}/move`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newCategoryId }),
  });
  return handleResponse(response);
};

export const moveDocument = async (id, newSubcategoryId, token) => {
  const response = await fetch(`${API_URL}/documents/${id}/move`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newSubcategoryId }),
  });
  return handleResponse(response);
};