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
//import ResourceOwnerRoute from './components/ResourceOwnerRoute';
import EditEventPage from './pages/EditEventPage';
import ResourceOwnerRoute from './components/ResourceOwnerRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserPage />} />
              <Route path="/ChangePage/:modifyUser" element={<ChangePage />} />
              <Route path="/CreateEvent" element={<CreateEventPage />} />
              <Route path="/Event/:id" element={<EventPage />} />
              <Route element = {<ResourceOwnerRoute/>}>
              <Route path="/Event/:id/edit" element={<EditEventPage />} />
              </Route>
              <Route path="/own-events" element={<OwnEventsPage />} />
            </Route>
          </Route>



          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;