import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    // Redirect non-logged-in users to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // Redirect non-admin users to the homepage
    return <Navigate to="/" replace />;
  }

  // If authenticated and is an admin, render the child route
  return <Outlet />;
};

export default AdminRoute;