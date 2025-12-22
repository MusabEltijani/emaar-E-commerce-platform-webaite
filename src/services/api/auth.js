import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  requestReset: (phone) => api.post('/auth/request-reset', { phone }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

