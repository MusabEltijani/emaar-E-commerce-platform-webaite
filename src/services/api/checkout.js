import api from './axios';

export const checkoutAPI = {
  checkout: (data) => api.post('/checkout', data),
};

