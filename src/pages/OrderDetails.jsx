import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../services/api/orders';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { CURRENCY_SYMBOL, ORDER_STATUSES } from '../utils/constants';
import { format } from 'date-fns';

const OrderDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [receiptFile, setReceiptFile] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOrderById(id),
  });

  const uploadReceiptMutation = useMutation({
    mutationFn: (formData) => ordersAPI.uploadReceipt(id, formData),
    onSuccess: () => {
      toast.success(t('orders.receiptUploaded'));
      queryClient.invalidateQueries(['order', id]);
      setReceiptFile(null);
    },
  });

  const order = data?.data;

  const handleReceiptUpload = (e) => {
    e.preventDefault();
    if (!receiptFile) return;

    const formData = new FormData();
    formData.append('receipt', receiptFile);
    uploadReceiptMutation.mutate(formData);
  };

  const getStatusText = (status) => {
    return t(`orders.statuses.${status}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUSES.PENDING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
      [ORDER_STATUSES.REVIEWING_PAYMENT]: 'bg-blue-100 text-blue-800',
      [ORDER_STATUSES.PAID]: 'bg-green-100 text-green-800',
      [ORDER_STATUSES.PROCESSING]: 'bg-purple-100 text-purple-800',
      [ORDER_STATUSES.SHIPPED]: 'bg-indigo-100 text-indigo-800',
      [ORDER_STATUSES.OUT_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
      [ORDER_STATUSES.COMPLETED]: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('orders.noOrders')}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('orders.orderDetails')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {t('orders.orderNumber')}: #{order.id}
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm ${getStatusColor(order.status)}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
            <p className="text-gray-600 mb-2">
              {t('orders.orderDate')}: {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
            {order.address && (
              <p className="text-gray-600 mb-2">
                {t('checkout.address')}: {order.address}
              </p>
            )}
            {order.phone && (
              <p className="text-gray-600">
                {t('checkout.phone')}: {order.phone}
              </p>
            )}
          </Card>

          {/* Order Items */}
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('orders.items')}</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 space-x-reverse border-b pb-4"
                >
                  <img
                    src={item.product?.images?.[0] || '/placeholder.png'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product?.name}</h3>
                    <p className="text-gray-600">
                      {t('products.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-lg font-semibold">
                    {CURRENCY_SYMBOL} {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Receipt Upload */}
          {order.status === ORDER_STATUSES.PENDING_PAYMENT && (
            <Card>
              <h2 className="text-xl font-bold mb-4">{t('orders.uploadReceipt')}</h2>
              {order.receipt ? (
                <div>
                  <img
                    src={order.receipt}
                    alt="Receipt"
                    className="max-w-md rounded-lg mb-4"
                  />
                </div>
              ) : (
                <form onSubmit={handleReceiptUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    className="mb-4"
                  />
                  <Button
                    type="submit"
                    loading={uploadReceiptMutation.isLoading}
                    disabled={!receiptFile}
                  >
                    {t('orders.uploadReceipt')}
                  </Button>
                </form>
              )}
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>{CURRENCY_SYMBOL} {order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>{t('orders.total')}</span>
                <span>{CURRENCY_SYMBOL} {order.total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

