import React from "react";
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
  const groupVariantsByAttribute = () => {
    const hasSize = variants.some((v) => v.size);
    const hasColor = variants.some((v) => v.color);

    return { hasSize, hasColor };
  };

  const getUniqueValues = (attribute: "size" | "color") => {
    const values = variants
      .map((v) => v[attribute])
      .filter((value, index, arr) => value && arr.indexOf(value) === index);
    return values as string[];
  };

  const getVariantByAttributes = (size?: string, color?: string) => {
    return variants.find(
      (v) => (!size || v.size === size) && (!color || v.color === color)
    );
  };

  const { hasSize, hasColor } = groupVariantsByAttribute();

  // Determine the label for color attribute based on product type
  const getColorLabel = () => {
    return productType?.toLowerCase() === "electronics" ? "Processor" : "Color";
  };

  if (variants.length === 1) {
    return (
      <div className="variant-single">
        <div className="variant-card selected">
          <div className="variant-info">
            {variants[0].size && <span>Size: {variants[0].size}</span>}
            {variants[0].color && (
              <span>
                {getColorLabel()}: {variants[0].color}
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
    const sizes = getUniqueValues("size");
    const colors = getUniqueValues("color");

    return (
      <div className="variant-complex">
        <div className="variant-attributes">
          <div className="attribute-group">
            <label>Size:</label>
            <div className="attribute-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`attribute-option ${
                    selectedVariant?.size === size ? "selected" : ""
                  }`}
                  onClick={() => {
                    const variant = getVariantByAttributes(
                      size,
                      selectedVariant?.color
                    );
                    if (variant) onVariantChange(variant);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="attribute-group">
            <label>{getColorLabel()}:</label>
            <div className="attribute-options">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`attribute-option ${
                    selectedVariant?.color === color ? "selected" : ""
                  }`}
                  onClick={() => {
                    const variant = getVariantByAttributes(
                      selectedVariant?.size,
                      color
                    );
                    if (variant) onVariantChange(variant);
                  }}
                >
                  {color}
                </button>
              ))}
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
            onClick={() => variant.stock > 0 && onVariantChange(variant)}
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
