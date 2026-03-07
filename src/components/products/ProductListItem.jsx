import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CURRENCY_SYMBOL } from '../../utils/constants';
import Image from '../common/Image';
import QuickAddToCart from './QuickAddToCart';
import StockBadge from './StockBadge';

const ProductListItem = ({ product }) => {
  const { t, i18n } = useTranslation();
  
  // Get name based on current language
  const productName = i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name;
  const productDescription = i18n.language === 'ar' && product.description_ar ? product.description_ar : product.description;
  
  // Use thumbnail_url or images
  const imageUrl = product.thumbnail_url || product.images?.[0] || '/placeholder.png';
  
  // Use discount_price if available, otherwise use price
  const displayPrice = parseFloat(product.discount_price || product.price || 0).toFixed(2);
  const originalPrice = product.discount_price ? parseFloat(product.price).toFixed(2) : null;
  
  // Handle stock - check multiple possible field names and handle null/undefined
  const stock = product?.stock ?? product?.quantity ?? product?.available_quantity ?? product?.in_stock ?? null;
  const stockValue = stock !== null && stock !== undefined ? parseInt(stock, 10) : null;
  const isInStock = stockValue === null || stockValue > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="flex-shrink-0">
          <div className="relative w-full sm:w-48 h-48 overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              lazy={true}
              fallback="/placeholder.png"
            />
            {stockValue === 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {t('products.outOfStock')}
              </div>
            )}
            {product.discount_price && stockValue !== 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                {Math.round(((product.price - product.discount_price) / product.price) * 100)}% {t('common.off')}
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 flex flex-col min-w-0">
          <Link to={`/products/${product.id}`} className="block flex-1">
            {/* SKU and Featured Badge */}
            <div className="flex items-center gap-2 mb-2">
              {product.sku && (
                <span className="text-xs text-gray-500 font-mono">
                  {t('products.sku')}: {product.sku}
                </span>
              )}
              {product.is_featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                  ⭐ {t('products.featured')}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
              {productName}
            </h3>

            {/* Description */}
            {productDescription && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {productDescription}
              </p>
            )}

            {/* Category and Brand */}
            {(product.category || product.brand) && (
              <div className="flex flex-wrap gap-3 mb-3 text-sm">
                {product.category && (
                  <span className="text-gray-500">
                    <span className="font-medium">{t('products.category')}:</span>{' '}
                    <span className="text-primary-600">
                      {i18n.language === 'ar' && product.category.name_ar ? product.category.name_ar : product.category.name}
                    </span>
                  </span>
                )}
                {product.brand && (
                  <span className="text-gray-500">
                    <span className="font-medium">{t('products.brand')}:</span>{' '}
                    <span className="text-primary-600">
                      {i18n.language === 'ar' && product.brand.name_ar ? product.brand.name_ar : product.brand.name}
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-primary-600">
                {CURRENCY_SYMBOL} {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  {CURRENCY_SYMBOL} {originalPrice}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div className="mb-3">
              <StockBadge stock={stockValue} showQuantity={true} />
            </div>
          </Link>

          {/* Actions */}
          <div className="mt-auto">
            <QuickAddToCart product={product} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;
