import React from 'react';
import { useSweets } from '../../context/SweetsContext';
import './Notification.css';

const Notification = () => {
  const { notification } = useSweets();

  if (!notification) {
    return null;
  }

  return (
    <div
      className={`notification ${notification.isError ? 'error' : 'success'}`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;