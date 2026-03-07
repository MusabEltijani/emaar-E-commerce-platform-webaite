import React from 'react';
import { useTranslation } from 'react-i18next';

const StockBadge = ({ stock, className = '', showQuantity = true }) => {
  const { t } = useTranslation();

  // Handle stock - check multiple possible field names
  const stockValue = stock !== null && stock !== undefined ? parseInt(stock, 10) : null;
  
  // If stock is null/undefined, assume in stock without showing quantity
  if (stockValue === null) {
    return (
      <span className={`text-xs font-medium text-green-600 ${className}`}>
        {t('products.inStock')}
      </span>
    );
  }

  // Out of stock
  if (stockValue === 0) {
    return (
      <span className={`text-xs font-semibold text-red-600 ${className}`}>
        {t('products.outOfStock')}
      </span>
    );
  }

  // Low stock (< 10)
  if (stockValue < 10) {
    return (
      <span className={`text-xs font-semibold text-red-600 ${className}`}>
        {t('products.onlyLeft', { count: stockValue })} {showQuantity && `${stockValue}`}
      </span>
    );
  }

  // Medium stock (10-49)
  if (stockValue < 50) {
    return (
      <span className={`text-xs font-medium text-orange-600 ${className}`}>
        {showQuantity ? `${stockValue} ${t('products.itemsInStock')}` : t('products.inStock')}
      </span>
    );
  }

  // High stock (50+)
  return (
    <span className={`text-xs font-medium text-green-600 ${className}`}>
      {showQuantity ? `${stockValue} ${t('products.itemsInStock')}` : t('products.inStock')}
    </span>
  );
};

export default StockBadge;
