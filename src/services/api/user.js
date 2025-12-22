import api from './axios';

export const userAPI = {
  getProfile: () => api.get('/user/me'),
  updateProfile: (formData) => api.put('/user/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.put('/user/me/password', data),
};

