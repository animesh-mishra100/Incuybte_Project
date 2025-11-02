// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Notification from './components/layout/Notification';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import './App.css';
// We will create these pages in Phase 5
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/routing/AdminRoute';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Notification />
      <div className="container" style={{ padding: '1rem' }}>
        <Routes>
          {/* Public Routes - ADD THESE TWO LINES BACK! */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (for all logged-in users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            {/* Add more user routes here, e.g., /profile */}
          </Route>

          {/* Admin Routes (we will build AdminRoute in Phase 5) */}
          {
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          }

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;