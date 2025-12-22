import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { checkoutAPI } from '../services/api/checkout';
import { clearCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { CURRENCY_SYMBOL, PAYMENT_METHODS } from '../utils/constants';

const checkoutSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  payment_method: z.string().min(1, 'Payment method is required'),
});

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await checkoutAPI.checkout(data);
      dispatch(clearCart());
      toast.success(t('checkout.orderPlaced'));
      navigate(`/orders/${response.data.order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">{t('cart.empty')}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('checkout.shippingAddress')}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label={t('checkout.address')}
                {...register('address')}
                error={errors.address?.message}
                required
              />
              <Input
                label={t('checkout.phone')}
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {t('checkout.paymentMethod')}
                </label>
                <select
                  {...register('payment_method')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">{t('checkout.paymentMethod')}</option>
                  <option value={PAYMENT_METHODS.CASH}>{t('checkout.cash')}</option>
                  <option value={PAYMENT_METHODS.CARD}>{t('checkout.card')}</option>
                  <option value={PAYMENT_METHODS.BANK_TRANSFER}>{t('checkout.bankTransfer')}</option>
                </select>
                {errors.payment_method && (
                  <p className="mt-1 text-sm text-red-500">{errors.payment_method.message}</p>
                )}
              </div>
              <Button type="submit" loading={loading} className="w-full">
                {t('checkout.placeOrder')}
              </Button>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product?.name} x {item.quantity}
                  </span>
                  <span>
                    {CURRENCY_SYMBOL} {(item.product?.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>{t('cart.total')}</span>
                <span>{CURRENCY_SYMBOL} {total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

