// src/App.js

import React, { useEffect } from 'react'; // <-- IMPORTADO useEffect
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom'; // <-- IMPORTADOS useLocation y useNavigate
import Home from './pages/Home/Home';
import DocumentsPage from './pages/Documents/DocumentsPage'; 
import Admin from './pages/Admin/Admin';
import Header from '../src/components/Header/Header';
import Login from '../src/pages/Login/Login';
import TransactionHistory from '../src/pages/TransactionHistory/TransactionHistory';
import Tools from '../src/pages/Tools/Tools';
import Profile from '../src/components/Profile/Profile'; 
import ProtectedRoute from '../src/components/ProtectedRoute/ProtectedRoute';
import QRGenerator from '../src/components/QRGenerator/QRGenerator';

// --- NUEVO: Componente "Guardia" para corregir la ruta vieja /home ---
const LegacyRouteGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Si la ruta actual es exactamente '/home'
    if (location.pathname === '/home') {
      // Navega a la nueva ruta '/inicio' y reemplaza la entrada en el historial.
      navigate('/inicio', { replace: true });
    }
  }, [location, navigate]); // Se ejecuta cada vez que cambia la URL

  return null; // Este componente no renderiza nada visualmente
};

function App() {
  return (
    <Router>
      {/* --- NUEVO: Añadimos el componente guardia aquí --- */}
      <LegacyRouteGuard /> 
      
      <Header />
      <Routes>
        <Route path="/" 
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/inicio" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="/documentos" element={<DocumentsPage />} />
        <Route path="/documentos/:categoryId" element={<DocumentsPage />} />
        <Route path="/documentos/:categoryId/:subcategoryId" element={<DocumentsPage />} />
        <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
        <Route path="/tools/QRGenerator" element={<ProtectedRoute><QRGenerator /></ProtectedRoute>} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactionHistory" 
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;