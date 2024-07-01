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
      <header className="custom-header">
        <div className="custom-logo">
          <Link to="/home"><img src={logo} alt="Logo" /></Link>
        </div>
        <nav className={`custom-navigation ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={location.pathname === '/home' ? 'active' : ''}>
              <Link to="/home">Inicio</Link>
            </li>
            <li className={`custom-tools-dropdown ${location.pathname.startsWith('/tools') ? 'active' : ''}`}>
              <Link to="/tools">Herramientas</Link>
              <div className="custom-tools-dropdown-content">
                {tools.map((tool, index) => (
                  <Link to={`/tools/${tool.component}`} key={index}>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </li>
            <li className={location.pathname === '/profile' ? 'active' : ''}>
              <Link to="/profile">Mi Cuenta</Link>
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
