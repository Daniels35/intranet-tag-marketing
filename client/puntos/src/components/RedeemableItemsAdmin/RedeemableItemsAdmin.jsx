import React, { useEffect, useState, useRef } from 'react';
import RedeemableItemsList from '../RedeemableItemsList/RedeemableItemsList';
import AddRedeemableItemForm from '../AddRedeemableItemForm/AddRedeemableItemForm';
import EditRedeemableItemForm from '../EditRedeemableItemForm/EditRedeemableItemForm';

const API_URL = process.env.REACT_APP_API_URL;

const RedeemableItemsAdmin = () => {
    const [redeemableItems, setRedeemableItems] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ id: null, name: '', costInPoints: 0, description: '', stock: 9999, image: '' });

    const formContainerRef2 = useRef(null);

    useEffect(() => {
        fetchRedeemableItems();
    }, []);

    const fetchRedeemableItems = async () => {
        try {
          const response = await fetch(`${API_URL}/redeemableItems`);
          const data = await response.json();
          setRedeemableItems(data);
        } catch (error) {
          console.error('Error al obtener los redeemableItems:', error);
        }
      };
      

      const addRedeemableItem = async (formData) => {
        try {
          await fetch(`${API_URL}/redeemableItems`, {
            method: 'POST',
            body: formData,
          });
          fetchRedeemableItems();
          window.alert(`Nuevo Item agregado correctamente`);
        } catch (error) {
          console.error('Error al agregar el redeemableItem:', error);
        }
    };
    
      

      const deleteRedeemableItem = async (id, name) => {
        const confirmDelete = window.confirm(`¿Realmente quieres eliminar el item "${name}"?`);
        if (confirmDelete) {
          try {
            await fetch(`${API_URL}/redeemableItems/${id}`, {
              method: 'DELETE',
            });
            setRedeemableItems(redeemableItems.filter(item => item.id !== id));
          window.alert(`Item "${name}" eliminado correctamente`)
          } catch (error) {
            console.error('Error al eliminar el redeemableItem:', error);
          }
      }
      };
      

      const updateRedeemableItem = async (id, formData) => {
        try {
          await fetch(`${API_URL}/redeemableItems/${id}`, {
            method: 'PUT',
            body: formData,
          });
          setEditing(false);
          fetchRedeemableItems();
          window.alert(`Item actualizado correctamente`);
        } catch (error) {
          console.error('Error al actualizar el redeemableItem:', error);
        }
    };
    
      

    const editRedeemableItem = (item) => {
        setEditing(true);
        setCurrentItem(item);
        formContainerRef2.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div ref={formContainerRef2} className="form-container">
            {editing ? (
                <div>
                    <h2>Editar Item Canjeable</h2>
                    <EditRedeemableItemForm
                        currentItem={currentItem}
                        setEditing={setEditing}
                        updateRedeemableItem={updateRedeemableItem}
                    />
                </div>
            ) : (
                <div>
                    <h2>Agregar Item Canjeable</h2>
                    <AddRedeemableItemForm addRedeemableItem={addRedeemableItem} />
                </div>
            )}
            <RedeemableItemsList redeemableItems={redeemableItems} editRedeemableItem={editRedeemableItem} deleteRedeemableItem={deleteRedeemableItem} />
        </div>
    );
};

export default RedeemableItemsAdmin;
