import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import tools from '../../pages/Tools/toolsList';
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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    closeMenu();
  };

  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      <header className="custom-header">
        <div className="custom-logo">
          <Link to="/home" onClick={closeMenu}><img src={logo} alt="Logo" /></Link>
        </div>
        <nav className={`custom-navigation ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={location.pathname === '/home' ? 'active' : ''}>
              <Link to="/home" onClick={closeMenu}>Inicio</Link>
            </li>
            <li className={`custom-tools-dropdown ${location.pathname.startsWith('/tools') ? 'active' : ''}`}>
              <Link to="/tools" onClick={closeMenu}>Herramientas</Link>
              <div className="custom-tools-dropdown-content">
                {tools.map((tool, index) => (
                  <Link to={`/tools/${tool.component}`} key={index} onClick={closeMenu}>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </li>
            {userInfo?.role === 'admin' && (
              <li className={location.pathname === '/admin' ? 'active' : ''}>
                <Link to="/admin" onClick={closeMenu}>Admin</Link>
              </li>
            )}
            <li className={location.pathname === '/profile' ? 'active' : ''}>
              <Link to="/profile" onClick={closeMenu}>Mi Cuenta</Link>
            </li>
          </ul>
          <div className="custom-profile" onClick={toggleProfileMenu}>
            <img src={userInfo?.imageProfile || profilePlaceholder} alt="Perfil" />
            {profileMenuOpen && (
              <div className="custom-profile-menu">
                <button onClick={handleLogout}>Salir</button>
              </div>
            )}
          </div>
        </nav>
        <div className={`custom-hamburger-menu ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="custom-bar"></div>
          <div className="custom-bar"></div>
          <div className="custom-bar"></div>
        </div>
      </header>
      <div className="custom-header-line"></div>
    </>
  );
};

export default Header;
