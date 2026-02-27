import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from './LoadingState';


const ProtectedRoute: React.FC = () => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div><LoadingState/></div>;
  }
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <><Outlet/></>;
};

export default ProtectedRoute;