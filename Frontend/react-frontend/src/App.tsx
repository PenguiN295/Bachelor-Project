import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
  
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
 
    </BrowserRouter>
  );
};

export default App;