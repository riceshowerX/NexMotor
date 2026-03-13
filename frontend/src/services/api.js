import axios from 'axios';
import { message } from 'antd';
import { getToken, removeToken } from '../utils/auth';

// 常量配置
const BASE_URL = '/api';
const TIMEOUT = 10000;

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：自动添加 token
api.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器：统一处理错误 + 401 自动跳转登录
api.interceptors.response.use(
  response => {
    // 如果后端返回 { code, data, message } 结构，可在这里统一处理
    // 当前我们直接返回 response.data（后端已直接返回 data）
    return response.data;
  },
  error => {
    const { response } = error;
    let displayMessage = '网络错误，请稍后重试';

    if (response) {
      switch (response.status) {
        case 401:
          removeToken();
          displayMessage = '登录已过期，正在跳转登录页...';
          if (!window.location.pathname.includes('/login')) {
            message.error(displayMessage);
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
          return new Promise(() => {}); // 挂起后续请求
        case 403:
          displayMessage = '权限不足';
          break;
        case 404:
          displayMessage = '接口不存在';
          break;
        case 500:
          displayMessage = '服务器错误';
          break;
        default:
          displayMessage = response.data?.message || `请求失败 (${response.status})`;
      }
    } else if (error.message.includes('timeout')) {
      displayMessage = '请求超时，请检查网络';
    } else if (!error.response) {
      displayMessage = '无法连接到服务器';
    }

    if (response?.status !== 401) {
      message.error(displayMessage);
    }

    return Promise.reject(error);
  }
);

/**
 * 电机管理 API（已支持全部 20+ 参数）
 */
export const motorAPI = {
  // 获取电机列表（支持筛选）
  getMotors: (params = {}) => api.get('/motors', { params }),

  // 获取单个电机详情
  getMotorById: (id) => api.get(`/motors/${id}`),

  // 新增电机（所有字段都会被提交）
  addMotor: (motorData) => api.post('/motors', motorData),

  // 更新电机（支持部分更新，所有字段可选）
  updateMotor: (id, motorData) => api.put(`/motors/${id}`, motorData),

  // 删除电机
  deleteMotor: (id) => api.delete(`/motors/${id}`),

  // 【可选】批量删除（如果后端支持的话）
  // batchDelete: (ids) => api.post('/motors/batch-delete', { ids }),
};

/**
 * 认证相关 API
 */
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  // 可扩展：logout、refreshToken、register 等
};

export default api;