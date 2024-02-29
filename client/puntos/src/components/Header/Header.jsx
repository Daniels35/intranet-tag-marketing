import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

import logo from '../../assets/logo.png';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>
      <nav className="navigation">
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Inicio</Link>
          </li>
          <li className={location.pathname === '/admin' ? 'active' : ''}>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
