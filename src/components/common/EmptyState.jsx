import React from 'react';
import { FiPackage, FiShoppingBag, FiSearch } from 'react-icons/fi';

const EmptyState = ({ 
  icon = 'package', 
  title, 
  message, 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  const icons = {
    package: FiPackage,
    shopping: FiShoppingBag,
    search: FiSearch,
  };

  const Icon = icons[icon] || FiPackage;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <Icon className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

