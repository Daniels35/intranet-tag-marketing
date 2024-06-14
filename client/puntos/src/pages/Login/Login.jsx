import React from 'react';
import './Login.css';
import logo from '../../assets/logoWhite.png';
import rocket from '../../assets/rocket.png';
import { FaGoogle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate(); // Utiliza useNavigate

  const handleLogin = () => {
    dispatch(loginUser())
      .unwrap()
      .then(() => {
        navigate('/home'); // Redirige a /home después de un inicio de sesión exitoso
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="TAG Marketing Digital" className="logo" />
      </div>
      <div className="login-right">
        <h2>Inicio de sesión</h2>
        <button className="google-login-button" onClick={handleLogin} disabled={loading}>
          <FaGoogle className="icon" />
          {loading ? 'Cargando...' : 'Iniciar sesión con Google'}
        </button>
        {error && <p className="error-message">{error.message}</p>}
        <img src={rocket} alt="Rocket" className="rocket-image" />
      </div>
    </div>
  );
};

export default Login;
