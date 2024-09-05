import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedeemableItems, fetchPointsItems, fetchUserInfo } from '../../redux/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import triangleIcon from '../../assets/triangleIcon.png';
import itemIcon from '../../assets/itemIcon.png';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const dispatch = useDispatch();
  const { userInfo, redeemableItems, pointsItems, token } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false); 

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo());
      dispatch(fetchRedeemableItems());
      dispatch(fetchPointsItems());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userInfo && userInfo.id) {
        try {
          const response = await fetch(`${API_URL}/transactionHistory/recipient/${userInfo.id}`);
          const data = await response.json();
          setTransactions(data);
        } catch (error) {
          console.error('Error al obtener las transacciones:', error);
        }
      }
    };

    fetchTransactions();
  }, [userInfo]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Bogota',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString('es-CO', options);
  };

  const toggleTransactions = () => {
    setShowTransactions(!showTransactions);
  };

  return (
    <div className="home-container">
      <div className="user-profile">
        <div className='container-information-user'>
          <h2>Bienvenido</h2>
          <div className='container-name-and-imagen'>
            <h1>{userInfo.name}</h1> 
            <img src={userInfo.imageProfile} alt="Perfil" className="profile-image-home" />
          </div>
          <div className="points-tag">
            <p>Haz acumulado un total de </p>
            <span> {userInfo.accumulatedPoints} PUNTOS TAG</span>
            <img src={triangleIcon} alt="Puntos TAG" className="triangle-icon" />

          </div>
        </div>

          <div className="transaction-history-section">
            <div className='transaction-history-section-container-title'>
            <h2>Historial de Puntos</h2>
            <button onClick={toggleTransactions} className="toggle-history-btn">
              {showTransactions ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>
        {showTransactions && (
            <ul>
              {transactions.map(transaction => (
                <li key={transaction.id} className={`transaction-item ${transaction.transactionType}`}>
                  <div>
                    <strong>Fecha:</strong> {formatDate(transaction.date)}
                  </div>
                  <div>
                    {transaction.initiatorName} le 
                    {transaction.transactionType === 'grant' ? ' agregó ' : ' revocó '}
                    {transaction.points} puntos a {transaction.recipientName}.
                  </div>
                  <div>
                    <strong>Descripción:</strong> {transaction.description}
                  </div>
                </li>
              ))}
            </ul>
        )}
          </div>
      </div>

      <div className='section'>
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

        <div className="section items-section">
          <h2>Items Canjeables</h2>
          <ul className="items-list">
            {redeemableItems.map(item => (
              <li key={item.id} className="list-item">
                <img src={itemIcon} alt="Item Icon" className="item-icon" />
                <div>
                <span>{item.name}</span>
                <br/>
                <span>{item.costInPoints} Puntos</span>
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
