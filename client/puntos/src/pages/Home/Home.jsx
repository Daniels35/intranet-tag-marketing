import React, { useEffect, useState } from 'react';
import './Home.css';
import profilePlaceholder from '../../assets/profilePlaceholder.png'; // Ruta a la imagen de perfil placeholder
import triangleIcon from '../../assets/triangleIcon.png'; // Ruta a la imagen del triángulo
import itemIcon from '../../assets/itemIcon.png'; // Ruta a la imagen del icono de items
import { useSelector } from 'react-redux';

const Home = () => {
  const { userInfo, token } = useSelector((state) => state.user);
  const [redeemableItems, setRedeemableItems] = useState([]);
  const [pointsItems, setPointsItems] = useState([]);
console.log("Datos user: ", userInfo);
  useEffect(() => {
    const fetchRedeemableItems = async () => {
      try {
        const response = await fetch('http://localhost:3027/redeemableItems', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRedeemableItems(data);
      } catch (error) {
        console.error('Error al obtener los items canjeables:', error);
      }
    };

    const fetchPointsItems = async () => {
      try {
        const response = await fetch('http://localhost:3027/pointsItems', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPointsItems(data);
      } catch (error) {
        console.error('Error al obtener los puntos de items:', error);
      }
    };

    if (token) {
      fetchRedeemableItems();
      fetchPointsItems();
    }
  }, [token]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="user-profile">
        <div className='container-information-user'>
          <h2>Bienvenido</h2>
          <h1>{userInfo.name}</h1>
          <p>Haz acumulado un total de</p>
          <div className="points-tag">
            <span>{userInfo.accumulatedPoints} PUNTOS TAG</span>
            <img src={triangleIcon} alt="Puntos TAG" className="triangle-icon" />
          </div>
        </div>
      </div>
      <div className='container-imagen-position'>
      <img src={profilePlaceholder} alt="Perfil" className="profile-image" />
      <span className='position-profile'>{userInfo.position}</span>
      </div>
      <div className='section'>
        <div className="section items-section">
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
