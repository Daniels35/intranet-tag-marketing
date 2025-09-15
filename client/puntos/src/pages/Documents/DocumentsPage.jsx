// src/pages/Documents/DocumentsPage.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchDocumentStructure } from '../../redux/documentSlice';
import * as documentService from '../../services/documentService';
import './DocumentsPage.css';
import defaultImage from '../../assets/defaultDocumentImage.png';

// --- Componente Modal (sin cambios) ---
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


// --- Componente Principal ---
const DocumentsPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const dispatch = useDispatch();
    const { userInfo, token } = useSelector((state) => state.user);
    const { structure, status } = useSelector((state) => state.documents);

    // --- Estados para Modales (ACTUALIZADO) ---
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [currentItem, setCurrentItem] = useState(null); // Almacena el item para editar/mover

    useEffect(() => {
        // Carga la estructura si está vacía o si el estado es 'idle'
        if (status === 'idle' || structure.length === 0) {
            dispatch(fetchDocumentStructure());
        }
    }, [status, dispatch, structure.length]);
    
    // --- Manejadores de Acciones ---
    const handleRefreshAndClose = () => {
        setModalOpen(false);
        setCurrentItem(null); // Limpia el item actual
        dispatch(fetchDocumentStructure()); // Refresca los datos
    };

    const handleDelete = async (type, item) => {
        // Ahora recibe el objeto 'item' completo para obtener el nombre/título
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.name || item.title}"?`)) {
            try {
                await documentService.deleteItem(type, item.id, token);
                alert('Elemento eliminado con éxito.');
                dispatch(fetchDocumentStructure());
            } catch (error) {
                alert(`Error al eliminar: ${error.message}`);
            }
        }
    };
    
    // Función centralizada para abrir cualquier modal
    const openModal = (type, item = null) => {
        setModalContent(type);
        setCurrentItem(item);
        setModalOpen(true);
    };

    const selectedCategory = categoryId ? structure.find(c => c.id === categoryId) : null;
    const selectedSubcategory = selectedCategory && subcategoryId ? selectedCategory.subcategories.find(s => s.id === subcategoryId) : null;
    
    // --- Renderizado de Vistas (con botones nuevos) ---

    const renderDocuments = (documents) => (
        <div className="items-grid">
            {documents.map(doc => (
                <div key={doc.id} className="grid-item-wrapper">
                    <a href={doc.path} target="_blank" rel="noopener noreferrer" className="grid-item" style={{ backgroundImage: `url(${doc.image || defaultImage})` }}>
                        <div className="overlay"></div>
                        <span>{doc.title}</span>
                    </a>
                    {userInfo?.role === 'admin' && (
                        <div className="admin-buttons">
                            <button className="edit-btn" title="Editar" onClick={() => openModal('editDocument', doc)}>✏️</button>
                            <button className="move-btn" title="Mover" onClick={() => openModal('moveDocument', doc)}>✥</button>
                            <button className="delete-btn" title="Eliminar" onClick={() => handleDelete('document', doc)}>🗑️</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const renderSubcategories = (category) => (
         <div>
             <h2>{category.name}</h2>
             {userInfo?.role === 'admin' && <button className="add-button" onClick={() => openModal('addSubcategory', { category_id: category.id })}>+ Añadir Subcategoría</button>}
             <div className="items-grid">
                {category.subcategories.map(sub => (
                    <div key={sub.id} className="grid-item-wrapper">
                        <Link to={`/documentos/${category.id}/${sub.id}`} className="grid-item" style={{ backgroundImage: `url(${sub.image || defaultImage})` }}>
                            <div className="overlay"></div>
                            <span>{sub.name}</span>
                        </Link>
                         {userInfo?.role === 'admin' && (
                            <div className="admin-buttons">
                                <button className="edit-btn" title="Editar" onClick={() => openModal('editSubcategory', sub)}>✏️</button>
                                <button className="move-btn" title="Mover" onClick={() => openModal('moveSubcategory', sub)}>✥</button>
                                <button className="delete-btn" title="Eliminar" onClick={() => handleDelete('subcategory', sub)}>🗑️</button>
                            </div>
                        )}
                    </div>
                ))}
             </div>
        </div>
    );
    
    const renderAllCategories = () => (
        <div>
            <h1>Documentos</h1>
            {userInfo?.role === 'admin' && <button className="add-button" onClick={() => openModal('addCategory')}>+ Añadir Categoría</button>}
            <div className="items-grid">
                {structure.map(cat => (
                    <div key={cat.id} className="grid-item-wrapper">
                        <Link to={`/documentos/${cat.id}`} className="grid-item" style={{ backgroundImage: `url(${cat.image || defaultImage})` }}>
                            <div className="overlay"></div>
                            <span>{cat.name}</span>
                        </Link>
                         {userInfo?.role === 'admin' && (
                            <div className="admin-buttons">
                                <button className="edit-btn" title="Editar" onClick={() => openModal('editCategory', cat)}>✏️</button>
                                <button className="delete-btn" title="Eliminar" onClick={() => handleDelete('category', cat)}>🗑️</button>
                            </div>
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
                 {userInfo?.role === 'admin' && <button className="add-button" onClick={() => openModal('addDocument')}>+ Subir Documento</button>}
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
                {selectedCategory && <Link to={`/documentos/${categoryId}`}>{selectedCategory.name}</Link>}
                {selectedSubcategory && ` > `}
                {selectedSubcategory && <span>{selectedSubcategory.name}</span>}
            </div>
            {content}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {/* Modales de Añadir */}
                {modalContent === 'addCategory' && <AddCategoryForm token={token} onFinished={handleRefreshAndClose} />}
                {modalContent === 'addSubcategory' && <AddSubcategoryForm token={token} categoryId={currentItem?.category_id || categoryId} categories={structure} onFinished={handleRefreshAndClose} />}
                {modalContent === 'addDocument' && <AddDocumentForm token={token} subcategoryId={subcategoryId} onFinished={handleRefreshAndClose} />}
                {/* Modales de Editar */}
                {modalContent === 'editCategory' && <EditItemForm item={currentItem} type="Category" token={token} onFinished={handleRefreshAndClose} />}
                {modalContent === 'editSubcategory' && <EditItemForm item={currentItem} type="Subcategory" token={token} onFinished={handleRefreshAndClose} />}
                {modalContent === 'editDocument' && <EditItemForm item={currentItem} type="Document" token={token} onFinished={handleRefreshAndClose} />}
                {/* Modales de Mover */}
                {modalContent === 'moveSubcategory' && <MoveSubcategoryForm item={currentItem} categories={structure} token={token} onFinished={handleRefreshAndClose} />}
                {modalContent === 'moveDocument' && <MoveDocumentForm item={currentItem} categories={structure} token={token} onFinished={handleRefreshAndClose} />}
            </Modal>
        </div>
    );
};


// --- Formularios para Añadir (los mismos que tenías) ---
const AddCategoryForm = ({ token, onFinished }) => { /* ... tu código sin cambios ... */ };
const AddSubcategoryForm = ({ token, categoryId, categories, onFinished }) => { /* ... tu código sin cambios ... */ };
const AddDocumentForm = ({ token, subcategoryId, onFinished }) => { /* ... tu código sin cambios ... */ };


// --- NUEVOS Formularios para Editar y Mover ---

const EditItemForm = ({ item, type, token, onFinished }) => {
    const [name, setName] = useState(item.name || item.title || '');
    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append(type === 'Document' ? 'title' : 'name', name);
        
        if (type === 'Document') {
            if (imageFile) formData.append('imageFile', imageFile);
            if (pdfFile) formData.append('pdfFile', pdfFile);
        } else {
            if (imageFile) formData.append('image', imageFile);
        }
        
        try {
            switch (type) {
                case 'Category': await documentService.updateCategory(item.id, formData, token); break;
                case 'Subcategory': await documentService.updateSubcategory(item.id, formData, token); break;
                case 'Document': await documentService.updateDocument(item.id, formData, token); break;
                default: throw new Error('Tipo de item inválido');
            }
            alert(`${type} actualizado con éxito!`);
            onFinished();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar {type}</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Subir nueva imagen (opcional)</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
            {type === 'Document' && (
                <>
                    <label>Subir nuevo PDF (opcional)</label>
                    <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} accept=".pdf" />
                </>
            )}
            <button type="submit">Guardar Cambios</button>
        </form>
    );
};

const MoveSubcategoryForm = ({ item, categories, token, onFinished }) => {
    const [targetCategoryId, setTargetCategoryId] = useState('');
    const possibleCategories = categories.filter(c => c.id !== item.category_id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await documentService.moveSubcategory(item.id, targetCategoryId, token);
            alert('Subcategoría movida con éxito!');
            onFinished();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Mover Subcategoría "{item.name}"</h2>
            <select value={targetCategoryId} onChange={e => setTargetCategoryId(e.target.value)} required>
                <option value="" disabled>Selecciona la nueva categoría...</option>
                {possibleCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <button type="submit" disabled={!targetCategoryId}>Mover</button>
        </form>
    );
};

const MoveDocumentForm = ({ item, categories, token, onFinished }) => {
    const [targetSubcategoryId, setTargetSubcategoryId] = useState('');
    const allSubcategories = categories.flatMap(c => c.subcategories);
    const possibleSubcategories = allSubcategories.filter(s => s.id !== item.subcategory_id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await documentService.moveDocument(item.id, targetSubcategoryId, token);
            alert('Documento movido con éxito!');
            onFinished();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Mover Documento "{item.title}"</h2>
            <select value={targetSubcategoryId} onChange={e => setTargetSubcategoryId(e.target.value)} required>
                <option value="" disabled>Selecciona la nueva subcategoría...</option>
                {possibleSubcategories.map(sub => {
                    const parentCategory = categories.find(c => c.subcategories.some(s => s.id === sub.id));
                    return <option key={sub.id} value={sub.id}>{sub.name} (en {parentCategory?.name})</option>
                })}
            </select>
            <button type="submit" disabled={!targetSubcategoryId}>Mover</button>
        </form>
    );
};


export default DocumentsPage;