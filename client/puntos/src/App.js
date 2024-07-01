import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import Header from '../src/components/Header/Header';
import Login from '../src/pages/Login/Login';
import Tools from '../src/pages/Tools/Tools';
import Profile from '../src/components/Profile/Profile'; // Importamos el componente de perfil
import ProtectedRoute from '../src/components/ProtectedRoute/ProtectedRoute'; // Asegúrate de importar el componente
import QRGenerator from '../src/components/QRGenerator/QRGenerator';

function App() {
  return (
    <Router>
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
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
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
      </Routes>
    </Router>
  );
}

export default App;
