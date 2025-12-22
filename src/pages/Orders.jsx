import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../services/api/orders';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { CURRENCY_SYMBOL, ORDER_STATUSES } from '../utils/constants';
import { format } from 'date-fns';

const Orders = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', statusFilter, page],
    queryFn: () => ordersAPI.getOrders({ status: statusFilter, page, limit: 10 }),
  });

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

  const orders = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('orders.title')}</h1>

      {/* Status Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">{t('orders.status')}</option>
          {Object.values(ORDER_STATUSES).map((status) => (
            <option key={status} value={status}>
              {getStatusText(status)}
            </option>
          ))}
        </select>
      </div>

      {orders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('orders.noOrders')}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center space-x-4 space-x-reverse mb-2">
                    <span className="font-semibold">
                      {t('orders.orderNumber')}: #{order.id}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t('orders.orderDate')}:{' '}
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    {t('orders.total')}: {CURRENCY_SYMBOL} {order.total}
                  </p>
                </div>
                <Link to={`/orders/${order.id}`}>
                  <Button variant="outline">{t('orders.orderDetails')}</Button>
                </Link>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 space-x-reverse mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                {t('common.previous')}
              </Button>
              <span className="px-4">
                {t('common.page')} {page} {t('common.of')} {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;

