import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  console.log('Location:', location.pathname);

  if (!token && location.pathname !== '/') {
    return <Navigate to="/" />;
  }

  if (token && location.pathname === '/') {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
