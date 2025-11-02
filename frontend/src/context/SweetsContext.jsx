import React, { createContext, useReducer, useContext, useCallback } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
  sweets: [],
  isLoading: true,
  error: null,
  notification: null,
};

// Reducer actions
const SweetsReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_START':
      return { ...state, isLoading: true, error: null };
    case 'REQUEST_FAIL':
      return { ...state, isLoading: false, error: action.payload };
    case 'GET_SWEETS_SUCCESS':
      return { ...state, isLoading: false, sweets: action.payload };
    
    // NEW: For creating a sweet
    case 'CREATE_SWEET_SUCCESS':
      return {
        ...state,
        sweets: [action.payload, ...state.sweets], // Add new sweet to top
      };

    // RENAMED: Handles purchase, update, and restock
    case 'UPDATE_SWEET_SUCCESS':
      return {
        ...state,
        sweets: state.sweets.map((sweet) =>
          sweet._id === action.payload._id ? action.payload : sweet
        ),
      };

    // NEW: For deleting a sweet
    case 'DELETE_SWEET_SUCCESS':
      return {
        ...state,
        sweets: state.sweets.filter(
          (sweet) => sweet._id !== action.payload
        ),
      };

    case 'ADD_NOTIFICATION':
      return { ...state, notification: action.payload };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notification: null };
    default:
      return state;
  }
};

// Create Context
const SweetsContext = createContext(initialState);

// Provider Component
export const SweetsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SweetsReducer, initialState);

  // --- Notification Helper ---
  const showNotification = (message, isError = false) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message, isError } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION' });
    }, 3000); // Remove after 3 seconds
  };

  // --- API Actions ---

  // Get all sweets
  const getSweets = useCallback(async () => {
    dispatch({ type: 'REQUEST_START' });
    try {
      const res = await api.get('/sweets');
      dispatch({ type: 'GET_SWEETS_SUCCESS', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'REQUEST_FAIL', payload: 'Failed to fetch sweets' });
    }
  }, []);

  // Search sweets
  const searchSweets = async (params) => {
    dispatch({ type: 'REQUEST_START' });
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null && v !== '')
      );
      const res = await api.get('/sweets/search', { params: cleanParams });
      dispatch({ type: 'GET_SWEETS_SUCCESS', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'REQUEST_FAIL', payload: 'Failed to search sweets' });
    }
  };

  // Purchase a sweet
  const purchaseSweet = async (id) => {
    try {
      const res = await api.post(`/sweets/${id}/purchase`);
      dispatch({ type: 'UPDATE_SWEET_SUCCESS', payload: res.data.data });
      showNotification('Purchase successful!');
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || 'Purchase failed. Try again.';
      showNotification(errorMsg, true);
    }
  };

  // --- NEW ADMIN FUNCTIONS ---

  // Create a new sweet
  const createSweet = async (sweetData) => {
    try {
      const res = await api.post('/sweets', sweetData);
      dispatch({ type: 'CREATE_SWEET_SUCCESS', payload: res.data.data });
      showNotification('Sweet created successfully!');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to create sweet.', true);
    }
  };

  // Update a sweet
  const updateSweet = async (id, sweetData) => {
    try {
      const res = await api.put(`/sweets/${id}`, sweetData);
      dispatch({ type: 'UPDATE_SWEET_SUCCESS', payload: res.data.data });
      showNotification('Sweet updated successfully!');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to update sweet.', true);
    }
  };

  // Delete a sweet
  const deleteSweet = async (id) => {
    try {
      await api.delete(`/sweets/${id}`);
      dispatch({ type: 'DELETE_SWEET_SUCCESS', payload: id });
      showNotification('Sweet deleted successfully!');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to delete sweet.', true);
    }
  };

  // Restock a sweet
  const restockSweet = async (id, amount) => {
    try {
      const res = await api.post(`/sweets/${id}/restock`, { amount });
      dispatch({ type: 'UPDATE_SWEET_SUCCESS', payload: res.data.data });
      showNotification('Sweet restocked!');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to restock.', true);
    }
  };


  return (
    <SweetsContext.Provider
      value={{
        ...state,
        getSweets,
        searchSweets,
        purchaseSweet,
        // --- EXPORT NEW FUNCTIONS ---
        createSweet,
        updateSweet,
        deleteSweet,
        restockSweet,
      }}
    >
      {children}
    </SweetsContext.Provider>
  );
};

// Custom Hook to use SweetsContext
export const useSweets = () => {
  return useContext(SweetsContext);
};