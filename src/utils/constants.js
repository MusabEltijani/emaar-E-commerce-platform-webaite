// Ensure the API base URL is properly formatted
const getApiBaseUrl = () => {
  // In development, use proxy (relative URL) to avoid CORS issues
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // In production, use full URL from environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // Remove trailing slash if present and ensure it starts with http:// or https://
    let url = envUrl.trim().replace(/\/$/, '');
    // Fix double http:// if present
    url = url.replace(/^http:\/\/http:\/\//, 'http://');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    // Ensure /api is included in production URL
    if (!url.endsWith('/api')) {
      url = url.endsWith('/') ? url + 'api' : url + '/api';
    }
    return url;
  }
  // Default fallback
  return 'http://localhost:3002/api';
};

export const API_BASE_URL = getApiBaseUrl();
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Emaar E-commerce';
export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar';
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'SDG';
export const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || 'جنيه سوداني';

export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  REVIEWING_PAYMENT: 'reviewing_payment',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
};

