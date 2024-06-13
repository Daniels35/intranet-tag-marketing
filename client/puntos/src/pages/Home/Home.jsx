import React, { useState, useEffect } from 'react';
import './Home.css';
import profilePlaceholder from '../../assets/profilePlaceholder.png'; // Ruta a la imagen de perfil placeholder
import triangleIcon from '../../assets/triangleIcon.png'; // Ruta a la imagen del triángulo
import itemIcon from '../../assets/itemIcon.png'; // Ruta a la imagen del icono de items

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
      <div className="user-profile">
        <div className='container-information-user'>
          <h2>Bienvenido Colaborador</h2>
          <h1>Daniel Stiven Diaz</h1>
          <p>Haz acumulado un total de</p>
          <div className="points-tag">
            <span>2.500 PUNTOS TAG</span>
            <img src={triangleIcon} alt="Puntos TAG" className="triangle-icon" />
          </div>
        </div>
      </div>
      <img src={profilePlaceholder} alt="Perfil" className="profile-image" />
      <div className='section'>
        <div className="items-section">
          <h2>Items Canjeables</h2>
          <ul className="items-list">
            {redeemableItems.map(item => (
              <li key={item.id} className="list-item">
                <img src={itemIcon} alt="Item Icon" className="item-icon" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="section points-section">
          <h2>¿Qué da puntos?</h2>
          <ul className="items-list">
            {pointsItems.map(item => (
              <li key={item.id} className="list-item">
                <img src={itemIcon} alt="Item Icon" className="item-icon" />
                <div>
                  <span>{item.name}</span>
                  <br />
                  <span>{item.points} Puntos</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
