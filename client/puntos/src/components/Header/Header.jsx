import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import tools from '../../pages/Tools/toolsList';
import './Header.css';
import logo from '../../assets/logoOrange.png';
import profilePlaceholder from '../../assets/profilePlaceholder.png';
import { logout } from '../../redux/userSlice';
import { fetchDocumentStructure } from '../../redux/documentSlice'; 

const Header = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { structure: documentStructure } = useSelector((state) => state.documents); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchDocumentStructure());
    }
  }, [dispatch, userInfo]);

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
          <Link to="/inicio" onClick={closeMenu}><img src={logo} alt="Logo" /></Link>
        </div>
        <nav className={`custom-navigation ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={location.pathname === '/inicio' ? 'active' : ''}>
              <Link to="/inicio" onClick={closeMenu}>Inicio</Link>
            </li>
            
            {/* --- INICIO: NUEVO MENÚ DE DOCUMENTOS --- */}
            <li className={`custom-tools-dropdown ${location.pathname.startsWith('/documentos') ? 'active' : ''}`}>
              <Link to="/documentos" onClick={closeMenu}>Documentos</Link>
              <div className="custom-tools-dropdown-content">
                {documentStructure && documentStructure.map((category) => (
                  <div key={category.id} className="custom-dropdown-category">
                     {/* El enlace principal de la categoría podría llevar a una vista de esa categoría */}
                    <Link to={`/documentos/${category.id}`} onClick={closeMenu} className="category-link">
                      {category.name}
                    </Link>
                    <div className="custom-dropdown-subcategory-content">
                      {category.subcategories.map((subcategory) => (
                        <Link to={`/documentos/${category.id}/${subcategory.id}`} key={subcategory.id} onClick={closeMenu}>
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
              <Link to="/profile" onClick={closeMenu}>Perfil</Link>
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
