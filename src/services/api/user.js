import api from './axios';

export const userAPI = {
  // GET /user/me — requires Bearer token
  getProfile: () => api.get('/user/me'),

  // PUT /user/me — multipart/form-data when image present, JSON otherwise
  updateProfile: (payload) => {
    if (payload instanceof FormData) {
      return api.put('/user/me', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put('/user/me', payload);
  },

  // PUT /user/me/password
  changePassword: (data) => api.put('/user/me/password', data),
};

