import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartAPI, persistCartIds } from '../../services/api/cart';
import { setCart, addItem } from '../../store/slices/cartSlice';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';

const QuickAddToCart = ({ product, className = '' }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const stock = product?.stock ?? product?.quantity ?? product?.available_quantity ?? product?.in_stock ?? null;
  const stockValue = stock !== null && stock !== undefined ? parseInt(stock, 10) : null;
  const isInStock = stockValue === null || stockValue > 0;
  const maxQuantity = stockValue || 99;

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      toast.error(t('products.outOfStock'));
      return;
    }

    setLoading(true);
    try {
      const response = await cartAPI.addToCart({
        product_id: product.id,
        quantity,
      });

      // Response: { success, data: { cart_id, session_id, items, total } }
      const cart = response?.data?.data ?? response?.data;
      if (cart && Array.isArray(cart.items)) {
        persistCartIds(cart);
        dispatch(setCart(cart));
      } else {
        // Optimistic local add
        dispatch(addItem({
          product_id: product.id,
          name: product.name,
          name_ar: product.name_ar,
          price: product.discount_price || product.price,
          thumbnail_url: product.thumbnail_url,
          qty: quantity,
        }));
      }
      toast.success(t('cart.itemAdded'));
      setQuantity(1);
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error.response?.status === 401) {
        toast.error(t('auth.loginRequired'));
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(error.response?.data?.message || t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isInStock) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-red-500 text-xs font-medium">{t('products.outOfStock')}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`} onClick={(e) => e.stopPropagation()}>
      {/* Quantity selector */}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1 || loading}
          className="px-2 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <FiMinus className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-gray-900 select-none">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity || loading}
          className="px-2 py-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <FiPlus className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Add to cart"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <FiShoppingCart className="w-4 h-4 shrink-0" />
            <span>{t('products.addToCart')}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default QuickAddToCart;
