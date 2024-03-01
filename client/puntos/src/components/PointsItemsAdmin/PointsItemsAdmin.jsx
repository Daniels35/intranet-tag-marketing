import React, { useEffect, useState } from 'react';
import PointsItemsList from '../PointsItemsList/PointsItemsList'; 
import AddPointsItemForm from '../AddPointsItemForm/AddPointsItemForm';
import EditPointsItemForm from '../EditPointsItemForm/EditPointsItemForm';

const PointsItemsAdmin = () => {
    const [pointsItems, setPointsItems] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ id: null, name: '', points: 0, description: '', image: '' });

    useEffect(() => {
        fetchPointsItems();
    }, []);

    const fetchPointsItems = async () => {
        try {
          const response = await fetch('http://localhost:3027/pointsItems');
          const data = await response.json();
          setPointsItems(data);
        } catch (error) {
          console.error('Error al obtener los pointsItems:', error);
        }
      };
      

      const addPointsItem = async (item) => {
        try {
          await fetch('http://localhost:3027/pointsItems', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          });
          fetchPointsItems(); // Recarga la lista de items para mostrar el nuevo item
        } catch (error) {
          console.error('Error al agregar el pointsItem:', error);
        }
      };
      

      const deletePointsItem = async (id) => {
        try {
          await fetch(`http://localhost:3027/pointsItems/${id}`, {
            method: 'DELETE',
          });
          setPointsItems(pointsItems.filter(item => item.id !== id)); // Actualiza el estado eliminando el item
        } catch (error) {
          console.error('Error al eliminar el pointsItem:', error);
        }
      };
      

    const updatePointsItem = async (id, updatedItem) => {
        try {
          await fetch(`http://localhost:3027/pointsItems/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
          });
          setEditing(false);
          fetchPointsItems(); 
        } catch (error) {
          console.error('Error al actualizar el pointsItem:', error);
        }
      };
      

    const editPointsItem = (item) => {
        setEditing(true);
        setCurrentItem(item);
    };

    return (
        <div className="form-container">
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
