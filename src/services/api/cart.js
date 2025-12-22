import api from './axios';

// Helper function to validate and clean cart data
const cleanCartData = (data) => {
  const cleaned = {};
  
  if (data.product_id !== undefined) {
    const productId = parseInt(data.product_id, 10);
    if (!isNaN(productId) && productId > 0) {
      cleaned.product_id = productId;
    }
  }
  
  if (data.quantity !== undefined) {
    const quantity = parseInt(data.quantity, 10);
    if (!isNaN(quantity) && quantity > 0) {
      cleaned.quantity = quantity;
    }
  }
  
  return cleaned;
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => {
    const cleanedData = cleanCartData(data);
    // Validate required fields
    if (!cleanedData.product_id || !cleanedData.quantity) {
      return Promise.reject(new Error('Invalid cart data: product_id and quantity are required'));
    }
    return api.post('/cart/add', cleanedData);
  },
  updateCartItem: (id, data) => {
    const cleanedData = cleanCartData(data);
    const itemId = parseInt(id, 10);
    if (isNaN(itemId) || itemId <= 0) {
      return Promise.reject(new Error('Invalid cart item ID'));
    }
    return api.put(`/cart/update/${itemId}`, cleanedData);
  },
  removeFromCart: (id) => {
    const itemId = parseInt(id, 10);
    if (isNaN(itemId) || itemId <= 0) {
      return Promise.reject(new Error('Invalid cart item ID'));
    }
    return api.delete(`/cart/remove/${itemId}`);
  },
};

