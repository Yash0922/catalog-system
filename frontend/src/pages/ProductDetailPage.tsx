import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Variant, AddOn, SelectedAddOn } from '../types';
import { productService } from '../services/api';
import { VariantSelector } from '../components/VariantSelector';
import { AddOnSelector } from '../components/AddOnSelector';
import { PriceCalculator } from '../components/PriceCalculator';
import '../styles/ProductDetail.css';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await productService.getById(id);
        setProduct(productData);
        
        // Initialize selected variant (cheapest one)
        if (productData.variants.length > 0) {
          const cheapestVariant = productData.variants.reduce((prev, current) => 
            prev.price < current.price ? prev : current
          );
          setSelectedVariant(cheapestVariant);
        }
        
        // Initialize add-ons as unselected
        if (productData.addOns.length > 0) {
          setSelectedAddOns(
            productData.addOns.map(addOn => ({
              addOn,
              selected: false,
            }))
          );
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.map(item =>
        item.addOn.id === addOnId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const calculateTotalPrice = () => {
    let total = selectedVariant ? selectedVariant.price : 0;
    
    selectedAddOns.forEach(item => {
      if (item.selected) {
        total += item.addOn.price;
      }
    });
    
    return total;
  };

  const isFood = product?.productType.name.toLowerCase() === 'food';

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="error">
        {error || 'Product not found'}
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Catalog
      </button>

      <div className="product-detail-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images[currentImageIndex] || 'https://via.placeholder.com/500x400?text=No+Image'}
              alt={product.name}
            />
          </div>
          {product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info-detail">
          <div className="product-header">
            <span className={`product-type-badge ${product.productType.name.toLowerCase()}-badge`}>
              {product.productType.name}
            </span>
            <h1>{product.name}</h1>
            <p className="product-description">{product.description}</p>
          </div>

          {/* Variants Section */}
          {product.variants.length > 0 && (
            <div className="variants-section">
              <h3>Select Variant</h3>
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
                productType={product.productType.name}
              />
            </div>
          )}

          {/* Add-ons Section (Food items only) */}
          {isFood && product.addOns.length > 0 && (
            <div className="addons-section">
              <h3>Add-ons</h3>
              <p className="addons-description">
                Customize your {product.name} with these delicious add-ons:
              </p>
              <AddOnSelector
                addOns={selectedAddOns}
                onAddOnToggle={handleAddOnToggle}
              />
            </div>
          )}

          {/* Price Calculator */}
          <PriceCalculator
            selectedVariant={selectedVariant}
            selectedAddOns={selectedAddOns.filter(item => item.selected)}
            totalPrice={calculateTotalPrice()}
          />

          {/* Stock Information */}
          {selectedVariant && (
            <div className="stock-info">
              <h4>Stock Information</h4>
              <div className="stock-details">
                <span>SKU: {selectedVariant.sku}</span>
                <span className={`stock-status ${selectedVariant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {selectedVariant.stock > 0 
                    ? `${selectedVariant.stock} in stock` 
                    : 'Out of stock'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
