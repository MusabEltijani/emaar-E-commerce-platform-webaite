import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { categoriesAPI } from '../services/api/categories';
import Loader from '../components/common/Loader';
import Skeleton from '../components/common/Skeleton';
import Image from '../components/common/Image';

const Categories = () => {
  const { t, i18n } = useTranslation();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
    retry: 1,
  });

  // Helper function to safely extract data array from API response
  const getDataArray = (response) => {
    if (!response?.data) return [];
    
    // Handle different response structures
    if (response.data.data?.items && Array.isArray(response.data.data.items)) {
      return response.data.data.items;
    }
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data?.data && Array.isArray(response.data.data.data)) {
      return response.data.data.data;
    }
    
    return [];
  };

  const categoriesList = getDataArray(categories);

  return (
    <>
      <Helmet>
        <title>{t('home.categories')} - Emaar E-commerce</title>
        <meta name="description" content={t('categories.description') || 'Explore all product categories'} />
      </Helmet>
      
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                {t('home.categories')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                {t('categories.description') || 'اكتشف جميع فئات المنتجات المتاحة لدينا'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-64 rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500 text-lg mb-4">{t('common.error')}</p>
                <p className="text-gray-600">{error.message}</p>
              </div>
            ) : categoriesList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {categoriesList.map((category, index) => {
                  const categoryName = i18n.language === 'ar' && category.name_ar ? category.name_ar : category.name;
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ y: -8 }}
                    >
                      <Link
                        to={`/products?category_id=${category.id}`}
                        className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-300 group"
                      >
                        {/* Category Image */}
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={categoryName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              lazy={true}
                              fallback="/placeholder.png"
                            />
                          ) : category.icon ? (
                            <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                              <span className="text-8xl">{category.icon}</span>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                              <span className="text-6xl font-bold text-primary-600">
                                {categoryName.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Category Name Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white text-xl font-bold mb-2">{categoryName}</h3>
                            <p className="text-white/90 text-sm">
                              {t('categories.explore') || 'استكشف المنتجات'}
                            </p>
                          </div>
                        </div>

                        {/* Category Info */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                            {categoryName}
                          </h3>
                          {category.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {i18n.language === 'ar' && category.description_ar 
                                ? category.description_ar 
                                : category.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-primary-600 font-semibold text-sm group-hover:text-primary-700 transition-colors">
                              {t('categories.explore') || 'استكشف'} →
                            </span>
                            {category.product_count !== undefined && (
                              <span className="text-gray-500 text-xs">
                                {category.product_count} {t('common.products')}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">{t('categories.noCategories') || 'لا توجد فئات متاحة'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {t('categories.needHelp') || 'هل تحتاج مساعدة؟'}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('categories.helpDescription') || 'إذا لم تجد الفئة التي تبحث عنها، تواصل معنا وسنكون سعداء لمساعدتك'}
              </p>
              <Link
                to="/contact"
                className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 font-semibold transition-colors text-lg"
              >
                {t('common.contact')}
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Categories;

