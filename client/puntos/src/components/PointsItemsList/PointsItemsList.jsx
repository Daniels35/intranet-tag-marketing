// PointsItemsList.js
import React from 'react';

const PointsItemsList = ({ pointsItems, editPointsItem, deletePointsItem }) => (
  <div>
    <h2>Lista de Items de Puntos</h2>
    <ul>
      {pointsItems.map(item => (
        <li key={item.id}>
          {item.name} - {item.points} puntos
          <button onClick={() => editPointsItem(item)}>Editar</button>
          <button onClick={() => deletePointsItem(item.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  </div>
);

export default PointsItemsList;
