import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api/products';
import { categoriesAPI } from '../services/api/categories';
import { brandsAPI } from '../services/api/brands';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import Skeleton, { SkeletonProductCard } from '../components/common/Skeleton';
import CategoryIcons from '../components/home/CategoryIcons';

const Home = () => {
  const { t, i18n } = useTranslation();

  // Fetch featured products (is_featured=true)
  const { data: featuredProducts, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getProducts({ limit: 8, is_featured: true }),
    retry: 1,
  });

  // Fetch new arrivals (sorted by newest)
  const { data: newArrivals, isLoading: newArrivalsLoading, error: newArrivalsError } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productsAPI.getProducts({ limit: 8, sort: 'newest' }),
    retry: 1,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getCategories(),
    retry: 1,
  });

  const { data: brands, isLoading: brandsLoading, error: brandsError } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.getBrands(),
    retry: 1,
  });

  // Helper function to safely extract data array from API response
  const getDataArray = (response) => {
    if (!response?.data) return [];
    
    // Handle different response structures
    // Structure: { status, message, data: { items: [...], pagination: {...} } } for products
    // Structure: { status, message, data: [...] } for categories/brands
    if (response.data.data?.items && Array.isArray(response.data.data.items)) {
      return response.data.data.items;
    }
    // For categories/brands that might be direct arrays in data.data
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Fallback for other structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data?.data && Array.isArray(response.data.data.data)) {
      return response.data.data.data;
    }
    
    return [];
  };

  const categoriesList = getDataArray(categories);
  const brandsList = getDataArray(brands);
  const featuredProductsList = getDataArray(featuredProducts);
  const newArrivalsList = getDataArray(newArrivals);

  return (
    <>
      <Helmet>
        <title>{t('home.heroTitle')} - Emaar E-commerce</title>
        <meta name="description" content={t('home.heroSubtitle')} />
        <meta property="og:title" content={`${t('home.heroTitle')} - Emaar E-commerce`} />
        <meta property="og:description" content={t('home.heroSubtitle')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div>
        {/* Categories Section */}
        {categoriesLoading ? (
          <Loader size="lg" className="py-12" />
        ) : (
          <CategoryIcons categories={categoriesList} />
        )}

        {/* Featured Products Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.featuredProducts')}</h2>
              <Link to="/products?is_featured=true" className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg flex items-center gap-2 transition-colors">
                {t('common.viewAll')} <span>→</span>
              </Link>
            </div>
            {featuredLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProductsList.length > 0 ? (
                  featuredProductsList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    <p>{featuredError ? 'Error loading featured products' : 'No featured products available'}</p>
                    {featuredError && <p className="text-sm text-red-500 mt-2">{featuredError.message}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.newArrivals') || 'وصل حديثاً'}</h2>
              <Link to="/products?sort=newest" className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg flex items-center gap-2 transition-colors">
                {t('common.viewAll')} <span>→</span>
              </Link>
            </div>
            {newArrivalsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivalsList.length > 0 ? (
                  newArrivalsList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    <p>{newArrivalsError ? 'Error loading new arrivals' : 'No new arrivals available'}</p>
                    {newArrivalsError && <p className="text-sm text-red-500 mt-2">{newArrivalsError.message}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-gray-900">{t('home.brands')}</h2>
            {brandsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-20" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {brandsList.length > 0 ? (
                  brandsList.slice(0, 12).map((brand) => (
                    <Link
                      key={brand.id}
                      to={`/products?brand_id=${brand.id}`}
                      className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-300 group"
                    >
                      <img
                        src={brand.logo || '/placeholder.png'}
                        alt={brand.name || brand.name_ar}
                        className="max-h-20 object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
                      />
                      {brand.name && (
                        <span className="text-sm text-center text-gray-700 group-hover:text-primary-600 font-medium transition-colors">
                          {i18n.language === 'ar' && brand.name_ar ? brand.name_ar : brand.name}
                        </span>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    <p>{brandsError ? 'Error loading brands' : 'No brands available'}</p>
                    {brandsError && <p className="text-sm text-red-500 mt-2">{brandsError.message}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;

