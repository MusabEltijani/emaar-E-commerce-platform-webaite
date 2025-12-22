import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { cartAPI } from '../services/api/cart';
import { setCart } from '../store/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { CURRENCY_SYMBOL } from '../utils/constants';

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, total, subtotal } = useSelector((state) => state.cart);

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.getCart(),
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setCart(data.data));
    }
  }, [data, dispatch]);

  // Calculate shipping (example: free shipping over 100)
  const shippingCost = subtotal >= 100 ? 0 : 10;
  const finalTotal = total + shippingCost;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>{t('cart.title')} - Emaar E-commerce</title>
        </Helmet>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h2>
              <p className="text-gray-600 mb-8">
                {t('cart.emptyDescription') || 'سلة التسوق الخاصة بك فارغة. ابدأ التسوق الآن!'}
              </p>
              <Link to="/products">
                <Button size="lg" className="w-full">
                  {t('cart.continueShopping')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('cart.title')} - Emaar E-commerce</title>
        <meta name="description" content={t('cart.title')} />
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {t('cart.title')}
            </h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? t('cart.item') || 'منتج' : t('cart.items') || 'منتجات'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>

              {/* Continue Shopping Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  <FiArrowRight className="w-5 h-5" />
                  {t('cart.continueShopping')}
                </Link>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-200"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {t('checkout.orderSummary')}
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-semibold">
                      {CURRENCY_SYMBOL} {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>{t('cart.shipping') || 'الشحن'}</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">{t('cart.freeShipping') || 'مجاني'}</span>
                      ) : (
                        `${CURRENCY_SYMBOL} ${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {subtotal < 100 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        {t('cart.freeShippingMessage') || `أضف ${CURRENCY_SYMBOL} ${(100 - subtotal).toFixed(2)} للحصول على شحن مجاني`}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">{t('cart.total')}</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {CURRENCY_SYMBOL} {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" className="block mb-4">
                  <Button className="w-full py-4 text-lg font-semibold">
                    {t('cart.checkout')}
                    <FiArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>

                {/* Security Badge */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('cart.secureCheckout') || 'دفع آمن ومحمي'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;

