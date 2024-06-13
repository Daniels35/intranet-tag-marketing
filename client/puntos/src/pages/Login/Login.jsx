import React from 'react';
import './Login.css';
import logo from '../../assets/logoWhite.png';
import rocket from '../../assets/rocket.png';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-left">
                <img src={logo} alt="TAG Marketing Digital" className="logo" />
            </div>
            <div className="login-right">
                <h2>Inicio de sesión</h2>
                <button className="google-login-button">
                    <FaGoogle className="icon" />
                    Iniciar sesión con Google
                </button>
                <img src={rocket} alt="Rocket" className="rocket-image" />
            </div>
        </div>
    );
};

export default Login;
