import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const CategoryIcons = ({ categories = [] }) => {
  const { t, i18n } = useTranslation();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.categories')}</h2>
          <Link to="/categories" className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg flex items-center gap-2 transition-colors">
            {t('common.viewAll')} <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.slice(0, 7).map((category, index) => {
            const categoryName = i18n.language === 'ar' && category.name_ar ? category.name_ar : category.name;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/products?category_id=${category.id}`}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary-300 group"
                >
                  <div className="w-20 h-20 mb-3 rounded-xl overflow-hidden bg-gray-100 group-hover:bg-primary-50 transition-colors">
                    <img
                      src={category.icon || category.image || ''}
                      alt={categoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs text-center text-gray-700 group-hover:text-primary-600 font-semibold transition-colors leading-tight">
                    {categoryName}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;

