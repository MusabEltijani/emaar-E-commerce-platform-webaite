import api from './axios';

export const brandsAPI = {
  getBrands: () => api.get('/brands'),
};

