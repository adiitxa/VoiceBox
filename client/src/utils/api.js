import axios from 'axios';

const api = axios.create({
  baseURL: 'https://voicebox.up.railway.app/api',
  withCredentials: true
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // token must be valid
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
