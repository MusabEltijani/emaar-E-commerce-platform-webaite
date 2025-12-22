import api from './axios';

export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  uploadReceipt: (id, formData) => api.post(`/orders/${id}/upload-receipt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

