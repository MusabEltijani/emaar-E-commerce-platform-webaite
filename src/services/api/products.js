import api from './axios';

// Helper function to clean params - remove empty strings and convert IDs to numbers
const cleanParams = (params) => {
  if (!params || typeof params !== 'object') return {};
  
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    // Skip empty strings, null, undefined, and empty arrays
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      return; // Skip this parameter
    }
    
    // Convert ID fields and pagination fields to numbers if they're strings
    if ((key === 'category_id' || key === 'brand_id' || key === 'page' || key === 'limit') && typeof value === 'string') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        cleaned[key] = numValue;
      }
    } else {
      // Keep other values as-is (strings, numbers, etc.)
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const productsAPI = {
  getProducts: (params) => {
    const cleanedParams = cleanParams(params || {});
    return api.get('/products', { params: cleanedParams });
  },
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
  getProductById: (id) => api.get(`/products/${id}`),
};

