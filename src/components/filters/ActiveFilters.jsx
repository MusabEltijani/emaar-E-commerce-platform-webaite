import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

const ActiveFilters = ({ filters, onRemove, className = '' }) => {
  const { t } = useTranslation();

  const activeFilters = [];

  // Add availability filter if not 'all'
  if (filters.availability && filters.availability !== 'all') {
    activeFilters.push({
      id: 'availability',
      label: filters.availability === 'in_stock' ? t('products.inStockOnly') : t('products.outOfStock'),
      value: filters.availability,
    });
  }

  // Add selected brands
  if (filters.selectedBrands && filters.selectedBrands.length > 0) {
    filters.selectedBrands.forEach((brand) => {
      activeFilters.push({
        id: `brand-${brand.id}`,
        label: brand.name,
        value: brand,
        type: 'brand',
      });
    });
  }

  // Add price range if different from default
  if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 10000)) {
    activeFilters.push({
      id: 'priceRange',
      label: `${filters.priceRange.min} - ${filters.priceRange.max}`,
      value: filters.priceRange,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center flex-wrap gap-2 mb-2">
        <span className="text-sm font-semibold text-gray-700">{t('products.activeFilters')}:</span>
        {activeFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onRemove(filter)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors group"
          >
            <span>{filter.label}</span>
            <FiX className="w-3.5 h-3.5 group-hover:text-primary-900" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;
