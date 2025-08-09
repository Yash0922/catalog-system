import React from 'react';
import '../styles/LoadingSkeleton.css';

interface LoadingSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton: React.FC = () => (
  <div className="product-card-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
      <div className="skeleton-features">
        <div className="skeleton-feature"></div>
        <div className="skeleton-feature"></div>
      </div>
      <div className="skeleton-meta">
        <div className="skeleton-price"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  </div>
);

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => (
  <div className="products-grid">
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const ProductDetailSkeleton: React.FC = () => (
  <div className="product-detail-skeleton">
    <div className="skeleton-back-button"></div>
    <div className="product-detail-container">
      <div className="skeleton-images">
        <div className="skeleton-main-image"></div>
        <div className="skeleton-thumbnails">
          <div className="skeleton-thumbnail"></div>
          <div className="skeleton-thumbnail"></div>
          <div className="skeleton-thumbnail"></div>
        </div>
      </div>
      <div className="skeleton-info">
        <div className="skeleton-badge"></div>
        <div className="skeleton-product-title"></div>
        <div className="skeleton-product-description"></div>
        <div className="skeleton-variants">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-variant-options">
            <div className="skeleton-variant-option"></div>
            <div className="skeleton-variant-option"></div>
            <div className="skeleton-variant-option"></div>
          </div>
        </div>
        <div className="skeleton-price-calculator"></div>
      </div>
    </div>
  </div>
);