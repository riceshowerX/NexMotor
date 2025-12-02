// 存储token到localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// 从localStorage获取token
export const getToken = () => {
  return localStorage.getItem('token');
};

// 从localStorage移除token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// 检查是否已认证
export const isAuthenticated = () => {
  return !!getToken();
};