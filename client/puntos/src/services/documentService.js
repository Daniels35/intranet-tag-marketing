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
    const response = await fetch(`${API_URL}/documents`, {
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