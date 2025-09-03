// src/pages/Documents/DocumentsPage.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchDocumentStructure } from '../../redux/documentSlice';
import * as documentService from '../../services/documentService';

import './DocumentsPage.css';
// Asegúrate de tener una imagen en esta ruta para usarla como placeholder
import defaultImage from '../../assets/defaultDocumentImage.png';

// Componente Modal (sin cambios)
const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                {children}
            </div>
        </div>
    );
};

const DocumentsPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const dispatch = useDispatch();
    const { userInfo, token } = useSelector((state) => state.user);
    const { structure, status } = useSelector((state) => state.documents);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null); // 'addCategory', 'addSubcategory', 'addDocument'

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDocumentStructure());
        }
    }, [status, dispatch]);

    const handleRefresh = () => {
        dispatch(fetchDocumentStructure());
    };

    const handleDelete = async (type, id, name) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`)) {
            try {
                await documentService.deleteItem(type, id, token);
                alert('Elemento eliminado con éxito.');
                handleRefresh();
            } catch (error) {
                alert(`Error al eliminar: ${error.message}`);
            }
        }
    };

    const selectedCategory = categoryId ? structure.find(c => c.id === categoryId) : null;
    const selectedSubcategory = selectedCategory && subcategoryId ? selectedCategory.subcategories.find(s => s.id === subcategoryId) : null;
    
    // --- Renderizado de Vistas ---

    const renderDocuments = (documents) => (
        <div className="items-grid">
            {documents.length === 0 ? <p>No hay documentos en esta sección.</p> : (
                documents.map(doc => (
                    <div key={doc.id} className="grid-item-wrapper">
                        <a 
                            href={doc.path} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="grid-item"
                            style={{ backgroundImage: `url(${doc.image || defaultImage})` }}
                        >
                            <div className="overlay"></div>
                            <span>{doc.title}</span>
                        </a>
                        {userInfo?.role === 'admin' && (
                            <button className="delete-btn" onClick={() => handleDelete('document', doc.id, doc.title)}>🗑️</button>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    const renderSubcategories = (category) => (
         <div className="subcategory-list">
             <h2>{category.name}</h2>
             <p>Selecciona una subcategoría para ver los documentos.</p>
             {userInfo?.role === 'admin' && (
                <button className="add-button" onClick={() => { setModalContent('addSubcategory'); setModalOpen(true); }}>+ Añadir Subcategoría</button>
            )}
             <div className="items-grid">
                {category.subcategories.map(sub => (
                    <div key={sub.id} className="grid-item-wrapper">
                        <Link 
                            to={`/documentos/${category.id}/${sub.id}`} 
                            className="grid-item"
                            style={{ backgroundImage: `url(${sub.image || defaultImage})` }}
                        >
                            <div className="overlay"></div>
                            <span>{sub.name}</span>
                        </Link>
                         {userInfo?.role === 'admin' && (
                            <button className="delete-btn" onClick={() => handleDelete('subcategory', sub.id, sub.name)}>🗑️</button>
                        )}
                    </div>
                ))}
             </div>
        </div>
    );
    
    const renderAllCategories = () => (
        <div className="category-list">
            <h1>Documentos</h1>
            <p>Navega por las categorías para encontrar los documentos que necesitas.</p>
            {userInfo?.role === 'admin' && (
                <button className="add-button" onClick={() => { setModalContent('addCategory'); setModalOpen(true); }}>+ Añadir Categoría</button>
            )}
            <div className="items-grid">
                {structure.map(cat => (
                    <div key={cat.id} className="grid-item-wrapper">
                        <Link 
                            to={`/documentos/${cat.id}`} 
                            className="grid-item"
                            style={{ backgroundImage: `url(${cat.image || defaultImage})` }}
                        >
                            <div className="overlay"></div>
                            <span>{cat.name}</span>
                        </Link>
                         {userInfo?.role === 'admin' && (
                            <button className="delete-btn" onClick={() => handleDelete('category', cat.id, cat.name)}>🗑️</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // --- Lógica de renderizado principal ---

    if (status === 'loading') return <div>Cargando...</div>;
    if (status === 'failed') return <div>Error al cargar los documentos.</div>;
    
    let content;
    if (selectedSubcategory) {
        content = (
            <div>
                <h2>{selectedSubcategory.name}</h2>
                 {userInfo?.role === 'admin' && (
                    <button className="add-button" onClick={() => { setModalContent('addDocument'); setModalOpen(true); }}>+ Subir Documento</button>
                )}
                {renderDocuments(selectedSubcategory.documents)}
            </div>
        );
    } else if (selectedCategory) {
        content = renderSubcategories(selectedCategory);
    } else {
        content = renderAllCategories();
    }

    return (
        <div className="documents-container">
            <div className="breadcrumbs">
                <Link to="/documentos">Documentos</Link>
                {selectedCategory && ` > `}
                {selectedCategory && <Link to={`/documents/${categoryId}`}>{selectedCategory.name}</Link>}
                {selectedSubcategory && ` > `}
                {selectedSubcategory && <span>{selectedSubcategory.name}</span>}
            </div>

            {content}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {modalContent === 'addCategory' && <AddCategoryForm token={token} onFinished={() => { setModalOpen(false); handleRefresh(); }} />}
                {modalContent === 'addSubcategory' && <AddSubcategoryForm token={token} categoryId={categoryId} categories={structure} onFinished={() => { setModalOpen(false); handleRefresh(); }} />}
                {modalContent === 'addDocument' && <AddDocumentForm token={token} subcategoryId={subcategoryId} onFinished={() => { setModalOpen(false); handleRefresh(); }} />}
            </Modal>
        </div>
    );
};


// --- Formularios para los Modales (sin cambios) ---

const AddCategoryForm = ({ token, onFinished }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (image) formData.append('image', image);
        try {
            await documentService.createCategory(formData, token);
            alert('Categoría creada!');
            onFinished();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Nueva Categoría</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la categoría" required />
            <input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" />
            <button type="submit">Crear</button>
        </form>
    );
};

const AddSubcategoryForm = ({ token, categoryId, categories, onFinished }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [selectedCat, setSelectedCat] = useState(categoryId || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category_id', selectedCat);
        if (image) formData.append('image', image);

        try {
            await documentService.createSubcategory(formData, token);
            alert('Subcategoría creada!');
            onFinished();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Nueva Subcategoría</h2>
            <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} required>
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la subcategoría" required />
            <input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" />
            <button type="submit">Crear</button>
        </form>
    );
};

const AddDocumentForm = ({ token, subcategoryId, onFinished }) => {
    const [title, setTitle] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('subcategory_id', subcategoryId);
        if (pdfFile) formData.append('pdfFile', pdfFile);
        if (imageFile) formData.append('imageFile', imageFile);

        try {
            await documentService.uploadDocument(formData, token);
            alert('Documento subido!');
            onFinished();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Subir Documento</h2>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del documento" required />
            <label>Archivo PDF (requerido)</label>
            <input type="file" onChange={e => setPdfFile(e.target.files[0])} accept=".pdf" required />
            <label>Imagen de previsualización (opcional)</label>
            <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
            <button type="submit">Subir</button>
        </form>
    );
};

export default DocumentsPage;