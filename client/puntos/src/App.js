import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/documents/:categoryId" element={<DocumentsPage />} />
        <Route path="/documents/:categoryId/:subcategoryId" element={<DocumentsPage />} />
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
