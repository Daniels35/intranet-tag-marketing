import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './Header.css';
import logo from '../../assets/logoOrange.png';
import profilePlaceholder from '../../assets/profilePlaceholder.png';
import { logout } from '../../redux/userSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

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
          <div className="profile" onClick={toggleProfileMenu}>
            <img src={userInfo?.image || profilePlaceholder} alt="Perfil" />
            {profileMenuOpen && (
              <div className="profile-menu">
                <button onClick={handleLogout}>Salir</button>
              </div>
            )}
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
