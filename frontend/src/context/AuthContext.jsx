import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { getToken, setToken, removeToken } from '../utils/auth';

const AuthContext = createContext(null);

// 辅助函数：检查 Token 有效性
const checkTokenValidity = (token) => {
  if (!token) return false;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp && payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ★★★★★★ 关键修复：使用 message 的实例化方式，避免静态方法警告 ★★★★★★
  const [messageApi, messageHolder] = message.useMessage();

  // 初始化检查
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        if (checkTokenValidity(token)) {
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const storedUser = localStorage.getItem('userInfo');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('用户信息解析失败', e);
            }
          }
        } else {
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback((userInfo) => {
    setToken(userInfo.token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
    setUser(userInfo);
    setIsAuthenticated(true);
    messageApi.success('登录成功'); // ← 改用 messageApi
  }, [messageApi]);

  const logout = useCallback((showMsg = true) => {
    removeToken();
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    if (showMsg) messageApi.success('已退出登录'); // ← 改用 messageApi
  }, [messageApi]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {/* ★★★★★★ 必须渲染这个 holder，否则消息不会显示 ★★★★★★ */}
      {messageHolder}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};