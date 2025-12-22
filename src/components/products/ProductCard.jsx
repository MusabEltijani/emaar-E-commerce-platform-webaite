import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CURRENCY_SYMBOL } from '../../utils/constants';
import Image from '../common/Image';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  
  // Get name based on current language
  const productName = i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name;
  // Use thumbnail_url or images
  const imageUrl = product.thumbnail_url || product.images?.[0] || '/placeholder.png';
  // Use discount_price if available, otherwise use price
  const displayPrice = parseFloat(product.discount_price || product.price || 0).toFixed(2);
  const originalPrice = product.discount_price ? parseFloat(product.price).toFixed(2) : null;
  
  // Handle stock - check multiple possible field names and handle null/undefined
  const stock = product?.stock ?? product?.quantity ?? product?.available_quantity ?? product?.in_stock ?? null;
  const stockValue = stock !== null && stock !== undefined ? parseInt(stock, 10) : null;
  const isInStock = stockValue === null || stockValue > 0; // If stock is null/undefined, assume in stock

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/products/${product.id}`}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 block border border-gray-100 hover:border-primary-200 group"
      >
      <div className="relative overflow-hidden bg-gray-50">
        <Image
          src={imageUrl}
          alt={productName}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          lazy={true}
          fallback="/placeholder.png"
        />
        {stockValue === 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {t('products.outOfStock')}
          </div>
        )}
        {product.discount_price && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {Math.round(((product.price - product.discount_price) / product.price) * 100)}% {t('common.off')}
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
            ⭐ {t('products.featured')}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base mb-2 line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors min-h-[3rem]">
          {productName}
        </h3>
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-600">
                {CURRENCY_SYMBOL} {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {CURRENCY_SYMBOL} {originalPrice}
                </span>
              )}
            </div>
            {isInStock && (
              <span className="text-xs text-green-600 font-medium mt-1">{t('products.inStock')}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
    </motion.div>
  );
};

export default ProductCard;

