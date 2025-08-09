import React from 'react';
import { Variant, SelectedAddOn } from '../types';
import { formatINR, convertUSDToINR } from '../utils/currency';

interface PriceCalculatorProps {
  selectedVariant: Variant | null;
  selectedAddOns: SelectedAddOn[];
  totalPrice: number;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  selectedVariant,
  selectedAddOns,
  totalPrice,
}) => {
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + convertUSDToINR(item.addOn.price), 0);

  return (
    <div className="price-calculator">
      <h3>Price Breakdown</h3>
      
      <div className="price-breakdown">
        {selectedVariant && (
          <div className="price-item">
            <span className="price-label">
              Base Price
              {selectedVariant.size && ` (${selectedVariant.size})`}
              {selectedVariant.color && ` - ${selectedVariant.color}`}
            </span>
            <span className="price-value">{formatINR(convertUSDToINR(selectedVariant.price))}</span>
          </div>
        )}
        
        {selectedAddOns.length > 0 && (
          <>
            <div className="price-divider"></div>
            <div className="addons-breakdown">
              <h4 className="breakdown-title">Add-ons:</h4>
              {selectedAddOns.map(({ addOn }) => (
                <div key={addOn.id} className="price-item addon-item">
                  <span className="price-label">{addOn.name}</span>
                  <span className="price-value">+{formatINR(convertUSDToINR(addOn.price))}</span>
                </div>
              ))}
              <div className="price-item addon-subtotal">
                <span className="price-label">Add-ons Subtotal:</span>
                <span className="price-value">+{formatINR(addOnsTotal)}</span>
              </div>
            </div>
          </>
        )}
        
        <div className="price-divider"></div>
        
        <div className="price-item total">
          <span className="price-label">Total Price:</span>
          <span className="price-value total-price">{formatINR(convertUSDToINR(totalPrice))}</span>
        </div>
      </div>

      <div className="price-actions">
        <button 
          className="add-to-cart-button"
          disabled={!selectedVariant || selectedVariant.stock === 0}
        >
          {!selectedVariant 
            ? 'Select a variant' 
            : selectedVariant.stock === 0 
              ? 'Out of stock' 
              : 'Add to Cart'
          }
        </button>
        <p className="cart-note">
          * This is a catalog demo - no actual cart functionality
        </p>
      </div>
    </div>
  );
};
