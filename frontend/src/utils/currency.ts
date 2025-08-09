// Currency utility functions for Indian Rupees

/**
 * Format price in Indian Rupees with proper formatting
 * @param price - Price in number format
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted price string with ₹ symbol
 */
export const formatINR = (price: number, showDecimals: boolean = true): string => {
  if (showDecimals) {
    return `₹${price.toFixed(2)}`;
  }
  return `₹${Math.round(price)}`;
};

/**
 * Format price range in Indian Rupees
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
  if (minPrice === maxPrice) {
    return formatINR(minPrice);
  }
  return `${formatINR(minPrice)} - ${formatINR(maxPrice)}`;
};

/**
 * Convert USD to INR (approximate conversion)
 * @param usdPrice - Price in USD
 * @param exchangeRate - USD to INR exchange rate (default: 83)
 * @returns Price in INR
 */
export const convertUSDToINR = (usdPrice: number, exchangeRate: number = 83): number => {
  return usdPrice * exchangeRate;
};

/**
 * Format large numbers in Indian numbering system (Lakhs, Crores)
 * @param price - Price in number format
 * @returns Formatted price with Indian numbering system
 */
export const formatINRWithIndianSystem = (price: number): string => {
  if (price >= 10000000) { // 1 Crore
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) { // 1 Lakh
    return `₹${(price / 100000).toFixed(1)} L`;
  } else if (price >= 1000) { // 1 Thousand
    return `₹${(price / 1000).toFixed(1)}K`;
  }
  return formatINR(price);
};