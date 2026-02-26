import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserPage from './pages/UserPage';
import ChangePage from './pages/ChangePage';
import CreateEventPage from './pages/CreateEventPage';
import EventPage from './pages/EventPage';
import OwnEventsPage from './pages/OwnEventsPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
            />
            <Route path="/ChangePage/:modifyUser" element={
              <ProtectedRoute>
                <ChangePage />
              </ProtectedRoute>
            }
            />
            <Route path="/CreateEvent" element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            } />
            <Route path="/Event/:id" element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            } />
            <Route path="/own-events" element={
              <ProtectedRoute>
                <OwnEventsPage />
              </ProtectedRoute>
            } />

          </Route>


          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;