import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ViewToggle = ({ viewMode, onViewChange, className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          viewMode === 'grid'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label={t('products.gridView')}
        title={t('products.gridView')}
      >
        <FiGrid className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">{t('products.gridView')}</span>
      </button>
      
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          viewMode === 'list'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label={t('products.listView')}
        title={t('products.listView')}
      >
        <FiList className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">{t('products.listView')}</span>
      </button>
    </div>
  );
};

export default ViewToggle;
