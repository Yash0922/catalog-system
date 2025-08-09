import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { formatPriceRange, convertUSDToINR } from '../utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  const getPriceRange = () => {
    if (product.variants.length === 0) return 'No variants';
    
    const prices = product.variants.map(v => convertUSDToINR(v.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return formatPriceRange(minPrice, maxPrice);
  };

  const getProductTypeBadgeClass = () => {
    const typeName = product.productType.name.toLowerCase();
    switch (typeName) {
      case 'food':
        return 'product-type-badge food-badge';
      case 'apparel':
        return 'product-type-badge apparel-badge';
      case 'electronics':
        return 'product-type-badge electronics-badge';
      default:
        return 'product-type-badge';
    }
  };

  const hasAddOns = product.addOns && product.addOns.length > 0;
  const isFood = product.productType.name.toLowerCase() === 'food';

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        <img
          src={product.images[0] || 'https://via.placeholder.com/350x250?text=No+Image'}
          alt={product.name}
          className="product-image"
        />
        <span className={getProductTypeBadgeClass()}>
          {product.productType.name}
        </span>
        <div className="product-overlay">
          <div className="overlay-content">
            <span className="view-details">View Details →</span>
          </div>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description || 'No description available'}
        </p>
        
        <div className="product-features">
          {product.variants.length > 0 && (
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span className="feature-text">
                {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {isFood && hasAddOns && (
            <div className="feature-item">
              <span className="feature-icon">➕</span>
              <span className="feature-text">Customizable</span>
            </div>
          )}
        </div>
        
        <div className="product-meta">
          <div className="price-container">
            <span className="price-label">From</span>
            <span className="price-range">{getPriceRange()}</span>
          </div>
          <div className="action-button">
            <span>Explore</span>
          </div>
        </div>
      </div>
    </div>
  );
};