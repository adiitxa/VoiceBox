import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true // required if backend expects cookies or auth
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