import React, { useEffect, useState, useRef  } from 'react';
import PointsItemsList from '../PointsItemsList/PointsItemsList'; 
import AddPointsItemForm from '../AddPointsItemForm/AddPointsItemForm';
import EditPointsItemForm from '../EditPointsItemForm/EditPointsItemForm';

const API_URL = process.env.REACT_APP_API_URL;

const PointsItemsAdmin = () => {
    const [pointsItems, setPointsItems] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ id: null, name: '', points: 0, description: '', image: '' });

    const formContainerRef = useRef(null);

    useEffect(() => {
        fetchPointsItems();
    }, []);

    const fetchPointsItems = async () => {
        try {
          const response = await fetch(`${API_URL}/pointsItems`);
          const data = await response.json();
          setPointsItems(data);
        } catch (error) {
          console.error('Error al obtener los pointsItems:', error);
        }
      };
      

      const addPointsItem = async (formData) => {
        try {
          await fetch(`${API_URL}/pointsItems`, {
            method: 'POST',
            body: formData, // 🔥 Enviar `FormData`, sin `headers`
          });
          fetchPointsItems(); // Recarga la lista
          window.alert(`Nuevo Item agregado correctamente`);
        } catch (error) {
          console.error('Error al agregar el pointsItem:', error);
        }
    };
    
      
      const deletePointsItem = async (id, name) => {
        const confirmDelete = window.confirm(`¿Realmente quieres eliminar el item "${name}"?`);
        if (confirmDelete) {
            try {
              await fetch(`${API_URL}/pointsItems/${id}`, {
                method: 'DELETE',
              });
              setPointsItems(pointsItems.filter(item => item.id !== id));
              window.alert(`Item "${name}" eliminado correctamente`)
            } catch (error) {
              console.error('Error al eliminar el pointsItem:', error);
            }
        }
    };
      

    const updatePointsItem = async (id, formData) => {
      try {
        await fetch(`${API_URL}/pointsItems/${id}`, {
          method: 'PUT',
          body: formData, // 🔥 Enviar `FormData`, sin `headers`
        });
        setEditing(false);
        fetchPointsItems(); 
        window.alert(`Item actualizado correctamente`);
      } catch (error) {
        console.error('Error al actualizar el pointsItem:', error);
      }
  };
  
      

    const editPointsItem = (item) => {
        setEditing(true);
        setCurrentItem(item);
        formContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div ref={formContainerRef} className="form-container">
            <h2>Administración de Items de Puntos</h2>
            {editing ? (
                <div>
                    <h2>Editar Item</h2>
                    <EditPointsItemForm
                        currentItem={currentItem}
                        setEditing={setEditing}
                        updatePointsItem={updatePointsItem}
                    />
                </div>
            ) : (
                <div>
                    <h2>Agregar Item</h2>
                    <AddPointsItemForm addPointsItem={addPointsItem} />
                </div>
            )}
            <PointsItemsList pointsItems={pointsItems} editPointsItem={editPointsItem} deletePointsItem={deletePointsItem} />
        </div>
    );
};

export default PointsItemsAdmin;
