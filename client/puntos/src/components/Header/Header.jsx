import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

import logo from '../../assets/logoOrange.png';
import profileIcon from '../../assets/profilePlaceholder.png'; // Asegúrate de tener esta imagen

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // No renderizar el Header en la ruta '/'
  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/home"><img src={logo} alt="Logo" /></Link>
        </div>
        <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/home">Inicio</Link>
            </li>
            <li className={location.pathname === '/tools' ? 'active' : ''}>
              <Link to="/tools">Herramientas</Link>
            </li>
            <li className={location.pathname === '/mi' ? 'active' : ''}>
              <Link to="/home#">Mi Cuenta</Link>
            </li>
          </ul>
          <div className="profile">
            <img src={profileIcon} alt="Perfil" />
          </div>
        </nav>
        <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </header>
      <div className="header-line"></div>
    </>
  );
};

export default Header;
