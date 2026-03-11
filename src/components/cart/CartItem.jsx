import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { cartAPI, persistCartIds } from '../../services/api/cart';
import { setCart, removeItem, updateItemQty } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { CURRENCY_SYMBOL } from '../../utils/constants';
import Image from '../common/Image';

// Extract full cart from API response only if it actually contains an items array.
// A bare { success: true, message: "..." } response must return null so the
// caller falls back to the optimistic local update instead of wiping the cart.
const extractCart = (res) => {
  const cart = res?.data?.data ?? res?.data;
  return Array.isArray(cart?.items) ? cart : null;
};

const CartItem = ({ item }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [loadingQty, setLoadingQty] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  // API returns flat fields on item directly
  const itemQty = item.qty ?? item.quantity ?? 1;
  const productName = (i18n.language === 'ar' && item.name_ar) ? item.name_ar : item.name;
  const productImage = item.thumbnail_url;
  const productPrice = parseFloat(item.price || 0);
  const itemSubtotal = parseFloat(item.subtotal || (productPrice * itemQty) || 0);

  const handleUpdateQuantity = async (newQty) => {
    if (newQty < 1) return;
    setLoadingQty(true);
    try {
      const res = await cartAPI.updateCartItem(item.id, newQty);
      const cart = extractCart(res);
      if (cart) {
        persistCartIds(cart);
        dispatch(setCart(cart));
      } else {
        dispatch(updateItemQty({ id: item.id, qty: newQty }));
      }
    } catch (error) {
      console.error('Update cart error:', error);
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setLoadingQty(false);
    }
  };

  const handleRemove = async () => {
    setLoadingRemove(true);
    try {
      const res = await cartAPI.removeFromCart(item.id);
      const cart = extractCart(res);
      if (cart) {
        persistCartIds(cart);
        dispatch(setCart(cart));
      } else {
        dispatch(removeItem(item.id));
      }
      toast.success(t('cart.itemRemoved'));
    } catch (error) {
      console.error('Remove cart error:', error);
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setLoadingRemove(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex gap-4">
        {/* Image */}
        <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
          <Image
            src={productImage}
            alt={productName}
            wrapperClassName="w-20 h-20 rounded-lg bg-gray-50"
            className="w-full h-full object-cover"
            lazy={true}
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/products/${item.product_id}`}>
              <h3 className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                {productName}
              </h3>
            </Link>
            <button
              onClick={handleRemove}
              disabled={loadingRemove}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
              aria-label={t('common.delete')}
            >
              {loadingRemove
                ? <span className="block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                : <FiTrash2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            {/* Price */}
            <span className="text-base font-bold text-primary-600">
              {productPrice.toFixed(2)}
              <span className="text-xs font-medium text-primary-400 ms-1">{CURRENCY_SYMBOL}</span>
            </span>

            {/* Qty controls */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                onClick={() => handleUpdateQuantity(itemQty - 1)}
                disabled={itemQty <= 1 || loadingQty}
                className="px-2 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-900 select-none">
                {loadingQty
                  ? <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin align-middle" />
                  : itemQty}
              </span>
              <button
                onClick={() => handleUpdateQuantity(itemQty + 1)}
                disabled={loadingQty}
                className="px-2 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <p className="text-xs text-gray-500">
            {t('cart.itemTotal') || 'المجموع'}:
            <span className="font-semibold text-gray-700 ms-1">
              {itemSubtotal.toFixed(2)} {CURRENCY_SYMBOL}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
