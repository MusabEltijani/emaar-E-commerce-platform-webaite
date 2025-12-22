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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
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
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-300 group"
                >
                  <div className="w-16 h-16 mb-3 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-primary-50 transition-colors">
                    {category.icon ? (
                      <span className="text-3xl">{category.icon}</span>
                    ) : (
                      <img
                        src={category.image || '/placeholder.png'}
                        alt={categoryName}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                  <span className="text-xs text-center text-gray-700 group-hover:text-primary-600 font-medium transition-colors">
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

