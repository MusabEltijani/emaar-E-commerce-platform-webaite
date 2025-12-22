import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import toast from 'react-hot-toast';

// Ensure baseURL is properly formatted
const baseURL = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token only for protected endpoints
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const url = config.url || '';
    
    // Check if endpoint is public
    const isPublic = isPublicEndpoint(url);
    
    // Only add token for protected endpoints
    // For public endpoints, don't send token at all (backend should allow access)
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For public endpoints, intentionally don't send Authorization header
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// List of public endpoints that don't require authentication
const publicEndpoints = [
  '/products',
  '/categories',
  '/brands',
  '/auth/login',
  '/auth/register',
  '/auth/request-reset',
  '/auth/reset-password',
];

// Check if endpoint is public
const isPublicEndpoint = (url) => {
  return publicEndpoints.some(endpoint => url.includes(endpoint));
};

// Response interceptor - handle 401 and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url || '';

    // If 401 error
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if this is a public endpoint
      const isPublic = isPublicEndpoint(url);
      const hadToken = !!originalRequest.headers.Authorization;
      
      // For public endpoints without token, handle 401 gracefully
      if (isPublic && !hadToken) {
        // Don't try to refresh, just return error silently
        // The component should handle empty data
        return Promise.reject(error);
      }

      // For public endpoints with token that got 401, try without token
      if (isPublic && hadToken) {
        originalRequest._retry = true;
        // Remove token and retry
        delete originalRequest.headers.Authorization;
        return api(originalRequest);
      }

      // For protected endpoints, try to refresh token
      if (!isPublic) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
              refreshToken,
            });
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Only redirect to login if accessing protected route
            if (url.includes('/checkout') || url.includes('/orders') || 
                url.includes('/profile') || url.includes('/user')) {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token - only redirect if accessing protected route
          if (url.includes('/checkout') || url.includes('/orders') || 
              url.includes('/profile') || url.includes('/user')) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      }
    }

    // Handle other errors
    if (error.response) {
      const message = error.response.data?.message || 'حدث خطأ ما';
      const isPublic = isPublicEndpoint(error.config?.url || '');
      
      // Don't show toast for 401 errors on public endpoints
      if (error.response.status !== 401 || !isPublic) {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.');
    } else {
      toast.error('حدث خطأ غير متوقع');
    }

    return Promise.reject(error);
  }
);

export default api;

