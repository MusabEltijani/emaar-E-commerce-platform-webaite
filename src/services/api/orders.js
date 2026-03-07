import api from './axios';

export const ordersAPI = {
  // GET /orders with optional filters
  getOrders: (params) => api.get('/orders', { params }),
  
  // GET /orders/:id
  getOrderById: (id) => api.get(`/orders/${id}`),
  
  // POST /orders/:id/upload-receipt (multipart/form-data)
  uploadReceipt: (id, formData) => api.post(`/orders/${id}/upload-receipt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // GET /orders/:id/receipt
  getReceipt: (id) => api.get(`/orders/${id}/receipt`, {
    responseType: 'blob', // To handle image response
  }),
};

