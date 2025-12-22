import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api/products';
import { categoriesAPI } from '../services/api/categories';
import { brandsAPI } from '../services/api/brands';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Skeleton, { SkeletonProductCard } from '../components/common/Skeleton';
import HeroBanner from '../components/home/HeroBanner';
import PromotionalBanner from '../components/home/PromotionalBanner';
import CategoryIcons from '../components/home/CategoryIcons';
import CustomerReviews from '../components/home/CustomerReviews';
import BlogSection from '../components/home/BlogSection';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { data: featuredProducts, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getProducts({ limit: 8 }),
    retry: 1,
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
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
  const productsList = getDataArray(featuredProducts);

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
        {/* Hero Banner 1 */}
        <HeroBanner
          title="أفضل التخفيضات 2022"
          subtitle="اكتشف أفضل العروض والخصومات الحصرية على أحدث المنتجات"
          buttonText="تسوق الآن"
          buttonLink="/products"
          image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
        />

        {/* Featured Product Banners Row 1 */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PromotionalBanner
                title="أفضل صوت نقي"
                image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
                bgColor="bg-white"
              />
              <PromotionalBanner
                title="أفضل صوت نقي"
                image="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
                bgColor="bg-white"
              />
              <PromotionalBanner
                title="أفضل صوت نقي"
                image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                bgColor="bg-white"
              />
            </div>
          </div>
        </section>

        {/* Featured Products Section 1 */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.featuredProducts')}</h2>
              <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg flex items-center gap-2 transition-colors">
                {t('common.viewAll')} <span>→</span>
              </Link>
            </div>
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsList.length > 0 ? (
                  productsList.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    <p>{productsError ? 'Error loading products' : 'No products available'}</p>
                    {productsError && <p className="text-sm text-red-500 mt-2">{productsError.message}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Hero Banner 2 */}
        <HeroBanner
          title="أفضل التخفيضات 2022"
          subtitle="اكتشف أفضل العروض والخصومات الحصرية على أحدث المنتجات"
          buttonText="تسوق الآن"
          buttonLink="/products"
          image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
        />

        {/* Category Icons */}
        {categoriesLoading ? (
          <Loader size="lg" className="py-12" />
        ) : (
          <CategoryIcons categories={categoriesList} />
        )}

        {/* Promotional Banners Row 2 */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PromotionalBanner
                title="أفضل صوت نقي"
                image="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400"
                bgColor="bg-yellow-400"
                textColor="text-gray-900"
              />
              <PromotionalBanner
                title="أفضل صوت نقي"
                image="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"
                bgColor="bg-blue-900"
                textColor="text-white"
              />
              <PromotionalBanner
                title="أفضل صوت نقي"
                image="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"
                bgColor="bg-orange-500"
                textColor="text-white"
              />
              <PromotionalBanner
                title="أفضل صوت نقي"
                image="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400"
                bgColor="bg-gray-900"
                textColor="text-white"
              />
            </div>
          </div>
        </section>

        {/* Featured Products Section 2 */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.featuredProducts')}</h2>
              <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg flex items-center gap-2 transition-colors">
                {t('common.viewAll')} <span>→</span>
              </Link>
            </div>
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsList.length > 0 ? (
                  productsList.slice(4, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    <p>{productsError ? 'Error loading products' : 'No products available'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Hero Banner 3 */}
        <HeroBanner
          title="أفضل التخفيضات 2022"
          subtitle="اكتشف أفضل العروض والخصومات الحصرية على أحدث المنتجات"
          buttonText="تسوق الآن"
          buttonLink="/products"
          bgColor="bg-blue-600"
          image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
        />

        {/* Featured Products Section 3 */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.featuredProducts')}</h2>
              <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg flex items-center gap-2 transition-colors">
                {t('common.viewAll')} <span>→</span>
              </Link>
            </div>
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsList.length > 0 ? (
                  productsList.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    <p>{productsError ? 'Error loading products' : 'No products available'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* VR Promotional Banner */}
        <section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800"
                  alt="VR Experience"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                    <svg className="w-10 h-10 text-white mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">رؤية واضحة للعالم</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  اكتشف تجربة الواقع الافتراضي المذهلة مع أحدث الأجهزة والتقنيات. استمتع برؤية واضحة للعالم الرقمي.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section 4 */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.featuredProducts')}</h2>
              <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg flex items-center gap-2 transition-colors">
                {t('common.viewAll')} <span>→</span>
              </Link>
            </div>
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsList.length > 0 ? (
                  productsList.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    <p>{productsError ? 'Error loading products' : 'No products available'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* Blog Section */}
        <BlogSection />

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

