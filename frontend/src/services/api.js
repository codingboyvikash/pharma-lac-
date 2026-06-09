import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5001';

let storeRef = null;
export const setStore = (s) => {
  storeRef = s;
};

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  let token = null;
  try {
    token = storeRef?.getState().auth.token;
  } catch (e) {
    // ignore
  }
  if (!token) {
    const saved = JSON.parse(localStorage.getItem('adminAuth') || 'null');
    token = saved?.token || null;
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (storeRef) storeRef.dispatch({ type: 'auth/logout' });
      else localStorage.removeItem('adminAuth');
    }
    return Promise.reject(error);
  }
);

export default api;
