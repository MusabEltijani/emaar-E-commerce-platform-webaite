import { useState } from 'react';
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

const formatDate = (raw) => {
  const d = raw ? new Date(raw) : null;
  return d && !isNaN(d) ? format(d, 'dd/MM/yyyy HH:mm') : '—';
};

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
      toast.success(t('orders.receiptUploaded') || 'تم رفع الإيصال بنجاح');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      setReceiptFile(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('orders.uploadError') || 'حدث خطأ أثناء رفع الإيصال');
    },
  });

  // API response: { status, message, data: { order_id, ... } }
  const order = data?.data?.data || data?.data;

  const handleReceiptUpload = (e) => {
    e.preventDefault();
    if (!receiptFile) return;
    const formData = new FormData();
    formData.append('receipt', receiptFile);
    uploadReceiptMutation.mutate(formData);
  };

  const getStatusText = (status) => t(`orders.statuses.${status}`) || status;

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

  const getPaymentMethodLabel = (method) => {
    const labels = { cod: 'الدفع عند الاستلام', bank_transfer: 'تحويل بنكي' };
    return labels[method] || method;
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

  const totalAmount = parseFloat(order.total_amount || 0);
  const itemsSubtotal = order.items?.reduce((sum, i) => sum + parseFloat(i.subtotal || 0), 0) ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('orders.orderDetails')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Order Info */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {t('orders.orderNumber')}: #{order.order_id}
              </h2>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 text-sm">
              <div>
                <span className="font-medium text-gray-800">{t('orders.orderDate')}:</span>{' '}
                {formatDate(order.created_at)}
              </div>
              <div>
                <span className="font-medium text-gray-800">{t('checkout.paymentMethod') || 'طريقة الدفع'}:</span>{' '}
                {getPaymentMethodLabel(order.payment_method)}
              </div>
              {order.address && (
                <div className="sm:col-span-2">
                  <span className="font-medium text-gray-800">{t('checkout.address')}:</span>{' '}
                  {order.address}
                </div>
              )}
              {order.phone && (
                <div>
                  <span className="font-medium text-gray-800">{t('checkout.phone')}:</span>{' '}
                  {order.phone}
                </div>
              )}
            </div>
          </Card>

          {/* Order Items */}
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('orders.items')}</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <img
                    src={item.product?.thumbnail_url || '/placeholder.png'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.product?.name}</h3>
                    {item.product?.name_ar && (
                      <p className="text-sm text-gray-500">{item.product.name_ar}</p>
                    )}
                    {item.product?.sku && (
                      <p className="text-xs text-gray-400">SKU: {item.product.sku}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {t('products.quantity')}: {item.quantity} × {CURRENCY_SYMBOL} {parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 shrink-0">
                    {CURRENCY_SYMBOL} {parseFloat(item.subtotal).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Receipt Upload - bank_transfer + pending_payment */}
          {order.payment_method === 'bank_transfer' && order.status === ORDER_STATUSES.PENDING_PAYMENT && (
            <Card>
              <h2 className="text-xl font-bold mb-4">{t('orders.uploadReceipt') || 'رفع إيصال التحويل'}</h2>
              <p className="text-gray-600 mb-4">
                {t('orders.uploadReceiptInfo') || 'يرجى رفع صورة إيصال التحويل البنكي لمراجعة الطلب'}
              </p>
              {order.receipt_url ? (
                <div>
                  <p className="text-green-600 mb-2">{t('orders.receiptUploaded') || 'تم رفع الإيصال بنجاح'}</p>
                  <img src={order.receipt_url} alt="Receipt" className="max-w-md rounded-lg border" />
                </div>
              ) : (
                <form onSubmit={handleReceiptUpload}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      {t('orders.selectReceipt') || 'اختر صورة الإيصال'}
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => setReceiptFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {receiptFile && (
                      <p className="mt-2 text-sm text-gray-600">{t('orders.selectedFile')}: {receiptFile.name}</p>
                    )}
                  </div>
                  <Button type="submit" loading={uploadReceiptMutation.isPending} disabled={!receiptFile}>
                    {t('orders.uploadReceipt') || 'رفع الإيصال'}
                  </Button>
                </form>
              )}
            </Card>
          )}

          {/* Receipt under review */}
          {order.status === ORDER_STATUSES.REVIEWING_PAYMENT && order.receipt_url && (
            <Card>
              <h2 className="text-xl font-bold mb-4">{t('orders.receipt') || 'الإيصال'}</h2>
              <p className="text-blue-600 mb-4">{t('orders.receiptUnderReview') || 'جاري مراجعة الإيصال من قبل الإدارة'}</p>
              <img src={order.receipt_url} alt="Receipt" className="max-w-md rounded-lg border" />
            </Card>
          )}

          {/* Order Timeline */}
          {order.timeline?.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">{t('orders.timeline') || 'سجل الطلب'}</h2>
              <div className="relative">
                <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {order.timeline.map((entry, index) => (
                    <div key={index} className="flex gap-4 items-start relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${index === 0 ? 'bg-primary-600' : 'bg-gray-300'}`}>
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                            {getStatusText(entry.status)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                        </div>
                        {entry.remarks && (
                          <p className="text-sm text-gray-600 mt-1">{entry.remarks}</p>
                        )}
                        {entry.updated_by?.name && (
                          <p className="text-xs text-gray-400 mt-0.5">{entry.updated_by.name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate max-w-[60%]">{item.product?.name} × {item.quantity}</span>
                  <span>{CURRENCY_SYMBOL} {parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.subtotal')}</span>
                  <span>{CURRENCY_SYMBOL} {itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>{t('orders.total')}</span>
                  <span className="text-primary-600">{CURRENCY_SYMBOL} {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{t('checkout.paymentMethod') || 'طريقة الدفع'}:</span>{' '}
                  {getPaymentMethodLabel(order.payment_method)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
