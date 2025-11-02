import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SweetsProvider } from './context/SweetsContext'; // <-- 1. IMPORT
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SweetsProvider> {/* <-- 2. WRAP APP */}
          <App />
        </SweetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);