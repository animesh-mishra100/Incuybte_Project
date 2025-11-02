import React, { createContext, useReducer, useContext, useEffect } from 'react';
import api from '../services/api';

// Initial state: Check localStorage for existing user/token
const initialState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Reducer actions
const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      // Save to state and localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case 'LOGOUT':
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext(initialState);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // --- API Actions ---

  // Login User
  const loginUser = async (email, password) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data, // { token: '...', user: {...} }
      });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Login Failed',
      });
    }
  };

  // Register User
  const registerUser = async (email, password) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    try {
      const res = await api.post('/auth/register', { email, password });
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data, // { token: '...', user: {...} }
      });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.error || 'Registration Failed',
      });
    }
  };

  // Logout User
  const logoutUser = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};