import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShare2, FiTruck, FiShield, FiRefreshCw, FiPlus, FiMinus, FiChevronRight } from 'react-icons/fi';
import { productsAPI } from '../services/api/products';
import { cartAPI, persistCartIds } from '../services/api/cart';
import { setCart, addItem } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import ImageGallery from '../components/common/ImageGallery';
import ProductCard from '../components/products/ProductCard';
import { CURRENCY_SYMBOL } from '../utils/constants';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProductById(id),
  });

  // Response shape: { data: { data: product } } or { data: product }
  const product = data?.data?.data ?? data?.data;

  const { data: relatedData } = useQuery({
    queryKey: ['related-products', id, product?.category_id],
    queryFn: () => productsAPI.getProducts({ category_id: product?.category_id, limit: 4 }),
    enabled: !!product?.category_id,
  });

  const getProductsArray = (response) => {
    const raw = response?.data?.data ?? response?.data;
    const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
    return arr.filter((p) => String(p.id) !== String(id));
  };

  const relatedProducts = getProductsArray(relatedData);

  const productName = (i18n.language === 'ar' && product?.name_ar) ? product.name_ar : (product?.name || '');
  const productDescription = product?.description || '';
  const productImage = product?.images?.[0] || product?.thumbnail_url || '';
  const displayPrice = parseFloat(product?.discount_price || product?.price || 0).toFixed(2);
  const originalPrice = product?.discount_price ? parseFloat(product.price).toFixed(2) : null;
  const discountPercent = product?.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;

  const stock = product?.stock ?? product?.quantity ?? product?.available_quantity ?? product?.in_stock ?? null;
  const stockValue = stock !== null && stock !== undefined ? parseInt(stock, 10) : null;
  const isInStock = stockValue === null || stockValue > 0;
  const maxQty = stockValue || 99;

  const handleAddToCart = async () => {
    if (!isInStock) return;
    setAddingToCart(true);
    try {
      const response = await cartAPI.addToCart({ product_id: product.id, quantity });
      const cart = response?.data?.data ?? response?.data;
      if (cart && Array.isArray(cart.items)) {
        persistCartIds(cart);
        dispatch(setCart(cart));
      } else {
        dispatch(addItem({
          product_id: product.id,
          name: product.name,
          name_ar: product.name_ar,
          price: product.discount_price || product.price,
          thumbnail_url: product.thumbnail_url,
          qty: quantity,
        }));
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t('cart.itemAdded'));
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(t('auth.loginRequired'));
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(error.response?.data?.message || t('common.error'));
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: productName, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success(t('common.linkCopied') || 'تم نسخ الرابط');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">{t('products.noProducts')}</p>
        <Link to="/products" className="mt-4 inline-block text-primary-600 hover:underline">{t('common.products')}</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{productName} - Emaar E-commerce</title>
        <meta name="description" content={productDescription} />
        <meta property="og:title" content={productName} />
        <meta property="og:image" content={productImage} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-6 pb-28 sm:pb-8">

          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-primary-600 transition-colors">{t('common.home')}</Link></li>
              <li><FiChevronRight className="w-3.5 h-3.5" /></li>
              <li><Link to="/products" className="hover:text-primary-600 transition-colors">{t('common.products')}</Link></li>
              {product.category && (
                <>
                  <li><FiChevronRight className="w-3.5 h-3.5" /></li>
                  <li>
                    <Link to={`/products?category_id=${product.category.id}`} className="hover:text-primary-600 transition-colors">
                      {i18n.language === 'ar' && product.category.name_ar ? product.category.name_ar : product.category.name}
                    </Link>
                  </li>
                </>
              )}
              <li><FiChevronRight className="w-3.5 h-3.5" /></li>
              <li className="text-gray-900 font-medium truncate max-w-[200px]">{productName}</li>
            </ol>
          </nav>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12">

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <ImageGallery images={product.images?.length ? product.images : [productImage]} alt={productName} />
            </motion.div>

            {/* Product Info Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              {/* Title + Share */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {discountPercent && (
                        <span className="bg-primary-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          -{discountPercent}%
                        </span>
                      )}
                      {product.is_featured && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          ⭐ {t('products.featured')}
                        </span>
                      )}
                      {product.sku && (
                        <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                      {productName}
                    </h1>
                  </div>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors flex-shrink-0"
                    aria-label="Share"
                  >
                    <FiShare2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Category / Brand */}
                {(product.category || product.brand) && (
                  <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
                    {product.category && (
                      <span className="text-sm text-gray-500">
                        {t('products.category')}:{' '}
                        <Link to={`/products?category_id=${product.category.id}`} className="text-primary-600 hover:underline font-medium">
                          {i18n.language === 'ar' && product.category.name_ar ? product.category.name_ar : product.category.name}
                        </Link>
                      </span>
                    )}
                    {product.brand && (
                      <span className="text-sm text-gray-500">
                        {t('products.brand')}:{' '}
                        <Link to={`/products?brand_id=${product.brand.id}`} className="text-primary-600 hover:underline font-medium">
                          {i18n.language === 'ar' && product.brand.name_ar ? product.brand.name_ar : product.brand.name}
                        </Link>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price + Stock */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl font-bold text-primary-600">
                    {displayPrice}
                    <span className="text-base font-medium text-primary-400 ms-1">{CURRENCY_SYMBOL}</span>
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {originalPrice} {CURRENCY_SYMBOL}
                    </span>
                  )}
                </div>
                {product.discount_price && (
                  <p className="text-sm text-green-600 font-semibold mb-3">
                    {t('products.youSave') || 'وفر'} {(product.price - product.discount_price).toFixed(2)} {CURRENCY_SYMBOL}
                  </p>
                )}

                {/* Stock status */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-fit ${
                  !isInStock
                    ? 'bg-red-50 text-red-700'
                    : stockValue !== null && stockValue < 10
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-green-50 text-green-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    !isInStock ? 'bg-red-500' : stockValue !== null && stockValue < 10 ? 'bg-orange-500' : 'bg-green-500'
                  }`} />
                  {!isInStock
                    ? t('products.outOfStock')
                    : stockValue !== null && stockValue < 10
                    ? `${t('products.onlyLeft', { count: stockValue }) || `فقط ${stockValue} متبقي`}`
                    : t('products.inStock')}
                </div>
              </div>

              {/* Description */}
              {productDescription && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">{t('products.description')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{productDescription}</p>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              {isInStock && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">{t('products.quantity')}</label>
                  <div className="flex items-center gap-4">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-2.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiMinus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center text-base font-bold text-gray-900 select-none">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                        disabled={quantity >= maxQty}
                        className="px-3 py-2.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Add to cart */}
                    <Button
                      onClick={handleAddToCart}
                      loading={addingToCart}
                      disabled={addingToCart}
                      className="flex-1 py-2.5 font-semibold"
                    >
                      {t('products.addToCart')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Feature badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FiTruck, label: t('products.freeShipping') || 'شحن مجاني', sub: t('products.onOrders') || 'للطلبات فوق 100' },
                  { icon: FiShield, label: t('products.warranty') || 'ضمان', sub: t('products.oneYear') || 'سنة كاملة' },
                  { icon: FiRefreshCw, label: t('products.returns') || 'إرجاع', sub: t('products.easyReturns') || '14 يوم' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
                    <Icon className="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-gray-800">{label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('products.relatedProducts')}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t('products.relatedProductsDescription') || 'منتجات مشابهة قد تعجبك'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Mobile sticky bar */}
      {isInStock && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-2xl z-50">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[11px] text-gray-400">{t('products.price')}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-primary-600">{displayPrice}</span>
                <span className="text-xs text-primary-400">{CURRENCY_SYMBOL}</span>
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
                )}
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              loading={addingToCart}
              disabled={addingToCart}
              className="flex-1 py-3 font-semibold"
            >
              {t('products.addToCart')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
