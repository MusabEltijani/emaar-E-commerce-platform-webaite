import api from './axios';

export const brandsAPI = {
  // GET /brands with optional params: page, limit, is_active
  getBrands: (params) => api.get('/brands', { params }),
  
  // GET /brands/:id
  getBrandById: (id) => api.get(`/brands/${id}`),
};

