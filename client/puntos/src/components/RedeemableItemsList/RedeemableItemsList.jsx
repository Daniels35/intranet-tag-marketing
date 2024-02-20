// RedeemableItemsList.js
import React from 'react';

const RedeemableItemsList = ({ redeemableItems, editRedeemableItem, deleteRedeemableItem }) => (
  <div>
    <h2>Lista de Items Canjeables</h2>
    <ul>
      {redeemableItems.map(item => (
        <li key={item.id}>
          {item.name} - {item.costInPoints} puntos - Stock: {item.stock}
          <button onClick={() => editRedeemableItem(item)}>Editar</button>
          <button onClick={() => deleteRedeemableItem(item.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  </div>
);

export default RedeemableItemsList;
