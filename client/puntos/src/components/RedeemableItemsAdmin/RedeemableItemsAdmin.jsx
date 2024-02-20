import React, { useEffect, useState } from 'react';
import RedeemableItemsList from '../RedeemableItemsList/RedeemableItemsList';
import AddRedeemableItemForm from '../AddRedeemableItemForm/AddRedeemableItemForm';
import EditRedeemableItemForm from '../EditRedeemableItemForm/EditRedeemableItemForm';

const RedeemableItemsAdmin = () => {
    const [redeemableItems, setRedeemableItems] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ id: null, name: '', costInPoints: 0, description: '', stock: 9999, image: '' });

    useEffect(() => {
        fetchRedeemableItems();
    }, []);

    const fetchRedeemableItems = async () => {
        try {
          const response = await fetch('http://localhost:3027/redeemableItems');
          const data = await response.json();
          setRedeemableItems(data);
        } catch (error) {
          console.error('Error al obtener los redeemableItems:', error);
        }
      };
      

      const addRedeemableItem = async (item) => {
        try {
          await fetch('http://localhost:3027/redeemableItems', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          });
          fetchRedeemableItems(); // Recarga la lista de items para mostrar el nuevo item
        } catch (error) {
          console.error('Error al agregar el redeemableItem:', error);
        }
      };
      

      const deleteRedeemableItem = async (id) => {
        try {
          await fetch(`http://localhost:3027/redeemableItems/${id}`, {
            method: 'DELETE',
          });
          setRedeemableItems(redeemableItems.filter(item => item.id !== id)); // Actualiza el estado eliminando el item
        } catch (error) {
          console.error('Error al eliminar el redeemableItem:', error);
        }
      };
      

    const updateRedeemableItem = async (id, updatedItem) => {
        try {
          await fetch(`http://localhost:3027/redeemableItems/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
          });
          setEditing(false); // Oculta el formulario de edición
          fetchRedeemableItems(); // Recarga la lista de items para mostrar los cambios
        } catch (error) {
          console.error('Error al actualizar el redeemableItem:', error);
        }
      };
      

    const editRedeemableItem = (item) => {
        setEditing(true);
        setCurrentItem(item);
    };

    return (
        <div className="redeemable-items-admin-container">
            <h2>Administración de Items Canjeables</h2>
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
