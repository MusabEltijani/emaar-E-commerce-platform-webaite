// Ensure the API base URL is properly formatted
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    let url = envUrl.trim().replace(/\/$/, '');
    if (url.startsWith('/')) return url;
    url = url.replace(/^http:\/\/http:\/\//, 'http://');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }
  return 'https://api.emaar.sd';
};

export const API_BASE_URL = getApiBaseUrl();
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Emaar E-commerce';
export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar';
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'SDG';
export const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || 'جنيه';

export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  REVIEWING_PAYMENT: 'reviewing_payment',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  COD: 'cod', // Cash on Delivery
  ONLINE: 'online',
};

