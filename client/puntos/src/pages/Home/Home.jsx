import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedeemableItems, fetchPointsItems } from '../../redux/userSlice';
import './Home.css';
import profilePlaceholder from '../../assets/profilePlaceholder.png'; // Ruta a la imagen de perfil placeholder
import triangleIcon from '../../assets/triangleIcon.png'; // Ruta a la imagen del triángulo
import itemIcon from '../../assets/itemIcon.png'; // Ruta a la imagen del icono de items

const Home = () => {
  const dispatch = useDispatch();
  const { userInfo, redeemableItems, pointsItems, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchRedeemableItems());
      dispatch(fetchPointsItems());
      console.log("User ", userInfo);
    }
  }, [dispatch, token]);

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
      <img src={profilePlaceholder} alt="Perfil" className="profile-image-home" />
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
