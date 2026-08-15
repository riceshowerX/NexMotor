/**
 * api/client.js
 * axios 实例 + 请求/响应拦截器
 * - 请求：从 localStorage 注入 Bearer token
 * - 响应：解包 res.data（后端统一 { success, data, total?, message }）；401 清 token 跳 /login
 */
import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000,
});

// 请求拦截器：注入 token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：解包 data + 401 处理
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const serverMessage = error.response && error.response.data ? error.response.data.message : '';
    const message = serverMessage || (status === 401 ? 'Unauthorized' : error.message) || 'Network Error';

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const apiError = new Error(message);
    apiError.status = status;
    apiError.raw = error;
    return Promise.reject(apiError);
  }
);

export default client;
