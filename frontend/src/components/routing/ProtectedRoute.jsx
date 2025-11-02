import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location
    // they were trying to go to
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child route
  return <Outlet />;
};

export default ProtectedRoute;