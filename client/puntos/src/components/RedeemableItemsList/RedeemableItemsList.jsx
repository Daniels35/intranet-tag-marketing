// RedeemableItemsList.js
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../PointsItemsList/pointsItemActionsAdmin.css'

const RedeemableItemsList = ({ redeemableItems, editRedeemableItem, deleteRedeemableItem }) => (
  <div>
    <h2>Lista de Items Canjeables</h2>
    <div className='points-item-actions-admin'>
             <span>
                <FaEdit className='points-item-icon' /> Editar
              </span> 
              <span>
                <FaTrash className='points-item-icon' /> Eliminar
              </span>
      </div>
    <ul>
      {redeemableItems.map(item => (
        <li key={item.id}>
          {item.name} - {item.costInPoints}
          <button className='points-item-btn' onClick={() => editRedeemableItem(item)}>
            <FaEdit className='points-item-icon' />
          </button>
          <button className='points-item-btn' onClick={() => deleteRedeemableItem(item.id, item.name)}>
            <FaTrash className='points-item-icon' />
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default RedeemableItemsList;
