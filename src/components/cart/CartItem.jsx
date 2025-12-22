import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiX } from 'react-icons/fi';
import { cartAPI } from '../../services/api/cart';
import { setCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { CURRENCY_SYMBOL } from '../../utils/constants';
import Image from '../common/Image';

const CartItem = ({ item }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const { data } = await cartAPI.updateCartItem(item.id, { quantity: newQuantity });
      dispatch(setCart(data.cart));
      toast.success(t('cart.itemUpdated'));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemove = async () => {
    try {
      const { data } = await cartAPI.removeFromCart(item.id);
      dispatch(setCart(data.cart));
      toast.success(t('cart.itemRemoved'));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const productName = item.product?.name_ar || item.product?.name || '';
  const productImage = item.product?.images?.[0] || item.product?.thumbnail_url || '/placeholder.png';
  const productPrice = parseFloat(item.product?.discount_price || item.product?.price || 0);
  const originalPrice = item.product?.discount_price ? parseFloat(item.product.price) : null;
  const itemTotal = (productPrice * item.quantity).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Product Image */}
        <Link
          to={`/products/${item.product?.id}`}
          className="flex-shrink-0 w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden group"
        >
          <Image
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            lazy={true}
            fallback="/placeholder.png"
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <Link
              to={`/products/${item.product?.id}`}
              className="block mb-2"
            >
              <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                {productName}
              </h3>
            </Link>
            
            {/* Price Info */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl font-bold text-primary-600">
                {CURRENCY_SYMBOL} {productPrice.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {CURRENCY_SYMBOL} {originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{t('products.quantity')}:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  className="p-2 hover:bg-gray-100 transition-colors flex items-center justify-center min-w-[40px]"
                  aria-label={t('common.previous')}
                >
                  <FiMinus className="w-4 h-4 text-gray-700" />
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center font-semibold text-gray-900 border-x border-gray-300">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors flex items-center justify-center min-w-[40px]"
                  aria-label={t('common.next')}
                >
                  <FiPlus className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Total Price & Remove */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">{t('cart.itemTotal') || 'المجموع'}</p>
              <p className="text-2xl font-bold text-gray-900">
                {CURRENCY_SYMBOL} {itemTotal}
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
              aria-label={t('common.delete')}
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;

