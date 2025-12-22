import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CURRENCY_SYMBOL } from '../../utils/constants';

const MiniCart = () => {
  const { t } = useTranslation();
  const { items, total } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {t('cart.empty')}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 space-x-reverse border-b pb-4">
            <img
              src={item.product?.images?.[0] || '/placeholder.png'}
              alt={item.product?.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium">{item.product?.name}</h4>
              <p className="text-sm text-gray-500">
                {item.quantity} x {CURRENCY_SYMBOL} {item.product?.price}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">{t('cart.total')}</span>
          <span className="font-semibold">{CURRENCY_SYMBOL} {total}</span>
        </div>
        <Link
          to="/cart"
          className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
        >
          {t('cart.checkout')}
        </Link>
      </div>
    </div>
  );
};

export default MiniCart;

