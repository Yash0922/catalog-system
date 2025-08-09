import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🛍️ Modern Catalog
        </h1>
        <p>Discover amazing products with customizable variants and add-ons</p>
      </div>
    </header>
  );
};
