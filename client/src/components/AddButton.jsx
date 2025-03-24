import React from 'react';
import { FaPlus } from 'react-icons/fa'; // Using react-icons library
import { Link } from 'react-router-dom';

const FloatingButton = ({ onClick }) => {
  return (
    <Link to="/staff/dogs/add">
      <button 
        onClick={onClick}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 0,
        }}
      >
      <FaPlus size={24} />
    </button>
    </Link>
  );
};

export default FloatingButton;