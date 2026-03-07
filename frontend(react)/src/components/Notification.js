import React, { useEffect } from 'react';

const Notification = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      {message}
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default Notification;
