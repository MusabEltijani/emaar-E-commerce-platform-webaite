import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { productsAPI } from '../services/api/products';
import { cartAPI } from '../services/api/cart';
import { setCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import ImageGallery from '../components/common/ImageGallery';
import ProductCard from '../components/products/ProductCard';
import ProductRating from '../components/products/ProductRating';
import { CURRENCY_SYMBOL } from '../utils/constants';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProductById(id),
  });

  const product = data?.data;

  // Fetch related products
  const { data: relatedProductsData } = useQuery({
    queryKey: ['related-products', id, product?.category_id],
    queryFn: () => productsAPI.getProducts({ 
      category_id: product?.category_id,
      limit: 4 
    }),
    enabled: !!product?.category_id,
  });
  
  // Helper to extract products array
  const getProductsArray = (response) => {
    if (!response?.data) return [];
    if (response.data.data?.items && Array.isArray(response.data.data.items)) {
      return response.data.data.items.filter(p => p.id !== parseInt(id, 10));
    }
    if (Array.isArray(response.data.data)) {
      return response.data.data.filter(p => p.id !== parseInt(id, 10));
    }
    if (Array.isArray(response.data)) {
      return response.data.filter(p => p.id !== parseInt(id, 10));
    }
    return [];
  };

  const relatedProducts = getProductsArray(relatedProductsData);
  
  const productName = (i18n.language === 'ar' && product?.name_ar) ? product.name_ar : (product?.name || '');
  const productDescription = product?.description || '';
  const productImage = product?.images?.[0] || product?.thumbnail_url || '/placeholder.png';
  const productPrice = parseFloat(product?.discount_price || product?.price || 0).toFixed(2);
  const originalPrice = product?.discount_price ? parseFloat(product.price).toFixed(2) : null;
  
  // Handle stock - check multiple possible field names and handle null/undefined
  // Try common field names: stock, quantity, available_quantity, in_stock, is_available
  const stock = product?.stock ?? product?.quantity ?? product?.available_quantity ?? product?.in_stock ?? 
                (product?.is_available !== undefined ? (product.is_available ? 999 : 0) : null) ??
                (product?.available !== undefined ? (product.available ? 999 : 0) : null);
  const stockValue = stock !== null && stock !== undefined ? parseInt(stock, 10) : null;
  // If stock is null/undefined, assume product is available (default to in stock)
  const isInStock = stockValue === null || stockValue > 0;

  const handleAddToCart = async () => {
    try {
      // Ensure product_id is a number and quantity is valid
      const productId = parseInt(product.id, 10);
      const cartQuantity = parseInt(quantity, 10);
      
      if (isNaN(productId) || productId <= 0) {
        toast.error(t('errors.invalidProduct'));
        return;
      }
      
      if (isNaN(cartQuantity) || cartQuantity < 1) {
        toast.error(t('errors.invalidQuantity'));
        return;
      }
      
      // Check stock availability if stock is known
      if (stockValue !== null && cartQuantity > stockValue) {
        toast.error(t('errors.insufficientStock'));
        return;
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error(t('auth.loginRequired') || 'يجب تسجيل الدخول لإضافة المنتجات إلى السلة');
        navigate('/login');
        return;
      }
      
      const response = await cartAPI.addToCart({
        product_id: productId,
        quantity: cartQuantity,
      });
      
      // Handle different response structures
      // Structure: { data: { cart: {...} } } or { data: { data: { cart: {...} } } } or { data: {...} }
      let cart = null;
      if (response?.data) {
        cart = response.data.cart || response.data.data?.cart || response.data;
      }
      
      if (cart) {
        dispatch(setCart(cart));
        // Invalidate and refetch cart query to sync with server
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        toast.success(t('cart.itemAdded'));
      } else {
        // If no cart in response, fetch cart again to sync state
        try {
          const cartResponse = await cartAPI.getCart();
          if (cartResponse?.data) {
            const updatedCart = cartResponse.data.cart || cartResponse.data.data?.cart || cartResponse.data;
            if (updatedCart) {
              dispatch(setCart(updatedCart));
              queryClient.invalidateQueries({ queryKey: ['cart'] });
              toast.success(t('cart.itemAdded'));
            } else {
              toast.error(t('errors.networkError'));
            }
          } else {
            toast.error(t('errors.networkError'));
          }
        } catch (fetchError) {
          toast.error(t('errors.networkError'));
        }
      }
    } catch (error) {
      // Handle 401 - redirect to login
      if (error.response?.status === 401) {
        toast.error(t('auth.loginRequired') || 'يجب تسجيل الدخول لإضافة المنتجات إلى السلة');
        navigate('/login');
        return;
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          t('errors.networkError');
      toast.error(errorMessage);
      
      // Try to refresh cart state even on error to keep UI in sync
      try {
        const cartResponse = await cartAPI.getCart();
        if (cartResponse?.data) {
          const updatedCart = cartResponse.data.cart || cartResponse.data.data?.cart || cartResponse.data;
          if (updatedCart) {
            dispatch(setCart(updatedCart));
            queryClient.invalidateQueries({ queryKey: ['cart'] });
          }
        }
      } catch (refreshError) {
        // Silently fail cart refresh
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">{t('products.noProducts')}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{productName} - Emaar E-commerce</title>
        <meta name="description" content={productDescription} />
        <meta property="og:title" content={`${productName} - Emaar E-commerce`} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:image" content={productImage} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productName} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={productImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: productName,
            description: productDescription,
            image: product?.images || [productImage],
            offers: {
              '@type': 'Offer',
              price: productPrice,
              priceCurrency: 'SDG',
              availability: isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          })
        }} />
      </Helmet>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 space-x-reverse text-gray-600">
              <li><Link to="/" className="hover:text-primary-600 transition-colors">{t('common.home')}</Link></li>
              <li>/</li>
              <li><Link to="/products" className="hover:text-primary-600 transition-colors">{t('common.products')}</Link></li>
              {product.category && (
                <>
                  <li>/</li>
                  <li><Link to={`/products?category_id=${product.category.id}`} className="hover:text-primary-600 transition-colors">
                    {i18n.language === 'ar' && product.category.name_ar ? product.category.name_ar : product.category.name}
                  </Link></li>
                </>
              )}
              <li>/</li>
              <li className="text-gray-900 font-medium">{productName}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageGallery
                images={product.images || [productImage]}
                alt={productName}
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {/* Product Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                {productName}
              </h1>

              {/* Rating */}
              <div className="mb-6">
                <ProductRating 
                  rating={product.rating || 4.5} 
                  reviewCount={product.review_count || 0}
                />
              </div>

              {/* Price Section */}
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex flex-wrap items-baseline gap-4 mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-primary-600">
                    {CURRENCY_SYMBOL} {productPrice}
                  </span>
                  {originalPrice && (
                    <>
                      <span className="text-xl md:text-2xl text-gray-400 line-through">
                        {CURRENCY_SYMBOL} {originalPrice}
                      </span>
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% {t('common.off')}
                      </span>
                    </>
                  )}
                </div>
                {product.discount_price && (
                  <p className="text-sm text-green-600 font-semibold">
                    {t('products.youSave') || 'وفر'} {CURRENCY_SYMBOL} {(product.price - product.discount_price).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className={`mb-6 p-4 rounded-lg border-2 ${
                isInStock 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {isInStock ? (
                    <>
                      <FiCheck className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-green-800 font-semibold text-lg">
                          {t('products.inStock')}
                        </p>
                        {stockValue !== null && (
                          <p className="text-sm text-green-600">
                            {stockValue} {t('products.itemsAvailable') || 'قطعة متوفرة'}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-red-600"></div>
                      <p className="text-red-800 font-semibold text-lg">
                        {t('products.outOfStock')}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiTruck className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">{t('products.freeShipping') || 'شحن مجاني'}</p>
                    <p className="text-sm font-semibold text-gray-900">{t('products.onOrders') || 'للطلبات'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiShield className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">{t('products.warranty') || 'ضمان'}</p>
                    <p className="text-sm font-semibold text-gray-900">{t('products.oneYear') || 'سنة واحدة'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiRefreshCw className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">{t('products.returns') || 'إرجاع'}</p>
                    <p className="text-sm font-semibold text-gray-900">{t('products.easyReturns') || 'سهل'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {productDescription && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{t('products.description')}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{productDescription}</p>
                </div>
              )}

              {/* Category and Brand Info */}
              {(product.category || product.brand) && (
                <div className="mb-6 flex flex-wrap gap-4">
                  {product.category && (
                    <div>
                      <span className="text-sm text-gray-500">{t('products.category')}:</span>{' '}
                      <Link 
                        to={`/products?category_id=${product.category.id}`}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        {i18n.language === 'ar' && product.category.name_ar ? product.category.name_ar : product.category.name}
                      </Link>
                    </div>
                  )}
                  {product.brand && (
                    <div>
                      <span className="text-sm text-gray-500">{t('products.brand')}:</span>{' '}
                      <Link 
                        to={`/products?brand_id=${product.brand.id}`}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        {i18n.language === 'ar' && product.brand.name_ar ? product.brand.name_ar : product.brand.name}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              {isInStock && (
                <div className="mb-8">
                  <label className="block text-base font-semibold mb-4 text-gray-900">
                    {t('products.quantity')}
                  </label>
                  <div className="flex items-center space-x-4 space-x-reverse w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary-500 transition-colors font-bold text-xl flex items-center justify-center"
                      aria-label={t('common.previous')}
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-20 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stockValue || 999, quantity + 1))}
                      className="w-14 h-14 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary-500 transition-colors font-bold text-xl flex items-center justify-center"
                      aria-label={t('common.next')}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {isInStock ? (
                  <>
                    <Button 
                      onClick={handleAddToCart} 
                      className="flex-1 py-4 text-lg font-semibold bg-primary-600 hover:bg-primary-700"
                    >
                      {t('products.addToCart')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-6 py-4 border-2 border-gray-300 hover:border-primary-500"
                    >
                      <FiHeart className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-6 py-4 border-2 border-gray-300 hover:border-primary-500"
                    >
                      <FiShare2 className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <Button disabled className="flex-1 py-4 text-lg font-semibold">
                    {t('products.outOfStock')}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-16 border-t border-gray-200">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('products.relatedProducts')}
                </h2>
                <p className="text-gray-600">
                  {t('products.relatedProductsDescription') || 'منتجات مشابهة قد تعجبك'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;

