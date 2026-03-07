import React from 'react';
import { useTranslation } from 'react-i18next';

const AvailabilityFilter = ({ value, onChange, className = '' }) => {
  const { t } = useTranslation();

  const options = [
    { value: 'all', label: t('products.allProducts') },
    { value: 'in_stock', label: t('products.inStockOnly') },
    { value: 'out_of_stock', label: t('products.outOfStock') },
  ];

  return (
    <div className={className}>
      <label className="block text-sm font-semibold mb-3 text-gray-900">
        {t('products.availability')}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="availability"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityFilter;
