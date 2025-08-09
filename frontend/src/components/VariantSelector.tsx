import React, { useMemo, useCallback } from "react";
import { Variant } from "../types";
import { formatINR, convertUSDToINR } from "../utils/currency";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
  productType?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  productType,
}) => {
  // Memoize expensive calculations
  const variantData = useMemo(() => {
    const hasSize = variants.some((v) => v.size);
    const hasColor = variants.some((v) => v.color);
    
    const sizes: string[] = hasSize ? [...new Set(variants.map(v => v.size).filter((size): size is string => Boolean(size)))] : [];
    const colors: string[] = hasColor ? [...new Set(variants.map(v => v.color).filter((color): color is string => Boolean(color)))] : [];
    
    // Create a lookup map for faster variant finding
    const variantMap = new Map<string, Variant>();
    variants.forEach(variant => {
      const key = `${variant.size || 'null'}-${variant.color || 'null'}`;
      variantMap.set(key, variant);
    });

    return { hasSize, hasColor, sizes, colors, variantMap };
  }, [variants]);

  // Memoize color label
  const colorLabel = useMemo(() => {
    return productType?.toLowerCase() === "electronics" ? "Processor" : "Color";
  }, [productType]);

  // Optimized variant finder using the lookup map
  const getVariantByAttributes = useCallback((size?: string, color?: string) => {
    const key = `${size || 'null'}-${color || 'null'}`;
    return variantData.variantMap.get(key);
  }, [variantData.variantMap]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSizeChange = useCallback((size: string) => {
    const variant = getVariantByAttributes(size, selectedVariant?.color);
    if (variant && variant.stock > 0) {
      onVariantChange(variant);
    }
  }, [getVariantByAttributes, selectedVariant?.color, onVariantChange]);

  const handleColorChange = useCallback((color: string) => {
    const variant = getVariantByAttributes(selectedVariant?.size, color);
    if (variant && variant.stock > 0) {
      onVariantChange(variant);
    }
  }, [getVariantByAttributes, selectedVariant?.size, onVariantChange]);

  const handleVariantClick = useCallback((variant: Variant) => {
    if (variant.stock > 0) {
      onVariantChange(variant);
    }
  }, [onVariantChange]);

  const { hasSize, hasColor, sizes, colors } = variantData;

  if (variants.length === 1) {
    return (
      <div className="variant-single">
        <div className="variant-card selected">
          <div className="variant-info">
            {variants[0].size && <span>Size: {variants[0].size}</span>}
            {variants[0].color && (
              <span>
                {colorLabel}: {variants[0].color}
              </span>
            )}
            <span className="variant-price">
              {formatINR(convertUSDToINR(variants[0].price))}
            </span>
          </div>
          <div className="variant-stock">
            {variants[0].stock > 0
              ? `${variants[0].stock} in stock`
              : "Out of stock"}
          </div>
        </div>
      </div>
    );
  }

  if (hasSize && hasColor) {
    // Complex variant selection with both size and color
    return (
      <div className="variant-complex">
        <div className="variant-attributes">
          <div className="attribute-group">
            <label>Size:</label>
            <div className="attribute-options">
              {sizes.map((size) => {
                const variant = getVariantByAttributes(size, selectedVariant?.color);
                const isAvailable = variant ? variant.stock > 0 : false;
                const isSelected = selectedVariant?.size === size;
                
                return (
                  <button
                    key={size}
                    type="button"
                    className={`attribute-option ${isSelected ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`}
                    onClick={() => handleSizeChange(size)}
                    disabled={!isAvailable}
                    aria-pressed={isSelected}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="attribute-group">
            <label>{colorLabel}:</label>
            <div className="attribute-options">
              {colors.map((color) => {
                const variant = getVariantByAttributes(selectedVariant?.size, color);
                const isAvailable = variant ? variant.stock > 0 : false;
                const isSelected = selectedVariant?.color === color;
                
                return (
                  <button
                    key={color}
                    type="button"
                    className={`attribute-option ${isSelected ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`}
                    onClick={() => handleColorChange(color)}
                    disabled={!isAvailable}
                    aria-pressed={isSelected}
                    aria-label={`Select ${colorLabel.toLowerCase()} ${color}`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {selectedVariant && (
          <div className="selected-variant-info">
            <div className="variant-details">
              <span className="variant-price">
                {formatINR(convertUSDToINR(selectedVariant.price))}
              </span>
              <span className="variant-sku">SKU: {selectedVariant.sku}</span>
            </div>
            <div className="variant-stock">
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : "Out of stock"}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Simple variant selection (size or color only, or just price differences)
  return (
    <div className="variant-simple">
      <div className="variant-grid">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className={`variant-card ${
              selectedVariant?.id === variant.id ? "selected" : ""
            } ${variant.stock === 0 ? "out-of-stock" : ""}`}
            onClick={() => handleVariantClick(variant)}
            role="button"
            tabIndex={variant.stock > 0 ? 0 : -1}
            aria-label={`Select variant: ${variant.size || ''} ${variant.color || ''} - ${formatINR(convertUSDToINR(variant.price))}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleVariantClick(variant);
              }
            }}
          >
            <div className="variant-info">
              {variant.size && (
                <span className="variant-size">{variant.size}</span>
              )}
              {variant.color && (
                <span className="variant-color">{variant.color}</span>
              )}
              <span className="variant-price">
                {formatINR(convertUSDToINR(variant.price))}
              </span>
            </div>
            <div className="variant-stock">
              {variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
