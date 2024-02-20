import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [redeemableItems, setRedeemableItems] = useState([]);
  const [pointsItems, setPointsItems] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3027/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    const fetchRedeemableItems = async () => {
      try {
        const response = await fetch('http://localhost:3027/redeemableItems');
        const data = await response.json();
        setRedeemableItems(data);
      } catch (error) {
        console.error('Error al obtener los items canjeables:', error);
      }
    };

    const fetchPointsItems = async () => {
      try {
        const response = await fetch('http://localhost:3027/pointsItems');
        const data = await response.json();
        setPointsItems(data);
      } catch (error) {
        console.error('Error al obtener los puntos de items:', error);
      }
    };

    fetchUsers();
    fetchRedeemableItems();
    fetchPointsItems();
  }, []);

  return (
    <div className="home-container">
      <div className="section items-section">
        <h2>Items Canjeables</h2>
        <ul className="items-list">
          {redeemableItems.map(item => (
            <li key={item.id} className="list-item">{item.name} - {item.costInPoints} Puntos</li>
          ))}
        </ul>
      </div>
      
      <div className="section users-section">
        <h1>Colaboradores</h1>
        <ul className="users-list">
          {users.map(user => (
            <li key={user.id} className="list-item">{user.name} - Puntos acumulados: {user.accumulatedPoints}</li>
          ))}
        </ul>
      </div>

      <div className="section points-section">
        <h2>Items de Puntos</h2>
        <ul className="items-list">
          {pointsItems.map(item => (
            <li key={item.id} className="list-item">{item.name} - {item.points} Puntos</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
