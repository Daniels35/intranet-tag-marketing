import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token, userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  console.log('Location:', location.pathname);

  // Redirigir a la página de login si no hay token y no estamos en la ruta de login
  if (!token && location.pathname !== '/') {
    return <Navigate to="/" />;
  }

  // Redirigir a la página principal si hay token y estamos en la ruta de login
  if (token && location.pathname === '/') {
    return <Navigate to="/inicio" />;
  }

  // Verificar si la ruta es admin o transactionHistory y el usuario no es admin
  const adminRoutes = ['/admin', '/transactionHistory'];
  if (adminRoutes.includes(location.pathname) && userInfo?.role !== 'admin') {
    return <Navigate to="/inicio" />;
  }

  return children;
};

export default ProtectedRoute;
