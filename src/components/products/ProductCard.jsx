import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CURRENCY_SYMBOL } from '../../utils/constants';
import Image from '../common/Image';
import QuickAddToCart from './QuickAddToCart';

const ProductCard = ({ product, showQuickAdd = true }) => {
  const { t, i18n } = useTranslation();

  const productName = i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name;
  const imageUrl = product.thumbnail_url || product.images?.[0] || '/placeholder.png';
  const displayPrice = parseFloat(product.discount_price || product.price || 0).toFixed(2);
  const originalPrice = product.discount_price ? parseFloat(product.price).toFixed(2) : null;
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;

  const stock = product?.stock ?? product?.quantity ?? product?.available_quantity ?? product?.in_stock ?? null;
  const stockValue = stock !== null && stock !== undefined ? parseInt(stock, 10) : null;
  const isOutOfStock = stockValue !== null && stockValue === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all duration-300 flex flex-col h-full group">

        {/* Image */}
        <Link to={`/products/${product.id}`} className="block relative">
          <Image
            src={imageUrl}
            alt={productName}
            wrapperClassName="aspect-[4/3] bg-gray-50"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            lazy={true}
          />

          {/* Badges overlay — absolute against the Image wrapper (which is relative) */}
          <div className="absolute inset-x-2.5 top-2.5 flex justify-between items-start pointer-events-none z-10">
            <div>
              {discountPercent && !isOutOfStock ? (
                <span className="inline-block bg-primary-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  -{discountPercent}%
                </span>
              ) : product.is_featured && !isOutOfStock ? (
                <span className="inline-block bg-amber-400 text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-md">
                  ⭐ {t('products.featured')}
                </span>
              ) : null}
            </div>
            {isOutOfStock && (
              <span className="inline-block bg-gray-700 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                {t('products.outOfStock')}
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-3.5 flex flex-col flex-1 gap-2.5">
          <Link to={`/products/${product.id}`} className="flex-1 flex flex-col gap-1.5">
            {/* Product name */}
            <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
              {productName}
            </h3>

            {/* Price row */}
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-primary-600">
                {displayPrice}
                <span className="text-[11px] font-medium text-primary-400 ms-1">{CURRENCY_SYMBOL}</span>
              </span>
              {originalPrice && (
                <span className="text-[11px] text-gray-400 line-through">
                  {originalPrice} {CURRENCY_SYMBOL}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {stockValue !== null && (
              <div>
                {isOutOfStock ? (
                  <span className="text-[11px] font-medium text-red-500">{t('products.outOfStock')}</span>
                ) : stockValue < 10 ? (
                  <span className="text-[11px] font-medium text-amber-600">
                    {stockValue} {t('products.itemsInStock') || 'متبقي'}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-green-600">{t('products.inStock')}</span>
                )}
              </div>
            )}
          </Link>

          {/* Add to cart */}
          {showQuickAdd && (
            <div className="mt-auto">
              <QuickAddToCart product={product} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
