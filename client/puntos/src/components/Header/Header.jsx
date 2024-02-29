import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
