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
    if ((key === 'category_id' || key === 'brand_id' || key === 'page' || key === 'limit' || key === 'min_price' || key === 'max_price') && typeof value === 'string') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        cleaned[key] = numValue;
      }
    } 
    // Handle boolean fields
    else if ((key === 'is_featured') && typeof value === 'string') {
      cleaned[key] = value === 'true' || value === '1';
    }
    // Handle boolean types directly
    else if (typeof value === 'boolean') {
      cleaned[key] = value;
    }
    else {
      // Keep other values as-is (strings, numbers, etc.)
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const productsAPI = {
  // GET /products with filters
  // Params: page, limit, sort (price_asc, price_desc, newest, popular), category_id, brand_id, min_price, max_price, is_featured
  getProducts: (params) => {
    const cleanedParams = cleanParams(params || {});
    return api.get('/products', { params: cleanedParams });
  },
  
  // GET /products/search
  // Params: q (query), category_id, brand, min_price, max_price, sort, page, limit
  searchProducts: (params) => {
    const cleanedParams = cleanParams(params || {});
    return api.get('/products/search', { params: cleanedParams });
  },
  
  // GET /products/:id
  getProductById: (id) => api.get(`/products/${id}`),
};

