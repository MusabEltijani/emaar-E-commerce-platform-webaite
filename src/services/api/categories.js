import api from './axios';

export const categoriesAPI = {
  // GET /categories with optional params: page, limit, is_active
  getCategories: (params) => api.get('/categories', { params }),
  
  // GET /categories/:id
  getCategoryById: (id) => api.get(`/categories/${id}`),
};

