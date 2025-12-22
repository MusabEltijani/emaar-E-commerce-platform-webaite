import api from './axios';

export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
};

