// Ensure the API base URL is properly formatted
const getApiBaseUrl = () => {
  // In development, use direct URL to port 3002 (no /api prefix)
  if (import.meta.env.DEV) {
    return 'http://localhost:3002';
  }
  
  // In production, use full URL from environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    let url = envUrl.trim().replace(/\/$/, '');
    // Allow relative paths (e.g. /api for Docker nginx proxy)
    if (url.startsWith('/')) {
      return url;
    }
    // Fix double http:// if present
    url = url.replace(/^http:\/\/http:\/\//, 'http://');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    return url;
  }
  // Default fallback - port 3002 without /api prefix
  return 'http://localhost:3002';
};  // version 1.0.0

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
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  COD: 'cod', // Cash on Delivery
  ONLINE: 'online',
};

