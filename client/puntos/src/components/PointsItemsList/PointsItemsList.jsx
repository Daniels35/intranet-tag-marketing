// PointsItemsList.js
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './pointsItemActionsAdmin.css'

const PointsItemsList = ({ pointsItems, editPointsItem, deletePointsItem }) => (
  
  <div>
    <h2>Lista de Items de Puntos</h2>
    <div className='points-item-actions-admin'>
             <span>
                <FaEdit className='points-item-icon' /> Editar
              </span> 
              <span>
                <FaTrash className='points-item-icon' /> Eliminar
              </span>
      </div>
    <ul>
      {pointsItems.map(item => (
        <li key={item.id}>
          {item.name} - {item.points} puntos
            <button className='points-item-btn' onClick={() => editPointsItem(item)}>
              <FaEdit className='points-item-icon' />
            </button>
            <button className='points-item-btn' onClick={() => deletePointsItem(item.id)}>
              <FaTrash className='points-item-icon' />
            </button>
        </li>
      ))}
    </ul>
  </div>
);

export default PointsItemsList;
