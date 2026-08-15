/**
 * context/AuthContext.jsx
 * 全局登录态：user/token/loading + login/logout + 启动时 token 恢复（调 /me）
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [loading, setLoading] = useState(true);

  // 启动时恢复会话
  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      const savedToken = localStorage.getItem(STORAGE_KEYS.token);
      if (!savedToken) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const res = await client.get('/auth/me');
        if (mounted && res && res.success) {
          setUser(res.user || null);
          setToken(savedToken);
        } else if (mounted) {
          localStorage.removeItem(STORAGE_KEYS.token);
          setToken(null);
        }
      } catch (e) {
        if (mounted) {
          localStorage.removeItem(STORAGE_KEYS.token);
          setToken(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    restore();
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * 登录：先清除旧 token，再调后端
   * @param {string} username
   * @param {string} password
   * @returns {Promise<object>} 登录响应
   */
  const login = useCallback(async (username, password) => {
    // 登录前清除旧 token，避免携带过期凭据
    localStorage.removeItem(STORAGE_KEYS.token);
    setToken(null);
    const res = await client.post('/auth/login', { username, password });
    if (!res || !res.success) {
      throw new Error((res && res.message) || 'Login failed');
    }
    localStorage.setItem(STORAGE_KEYS.token, res.token);
    setToken(res.token);
    setUser(res.user || { username });
    return res;
  }, []);

  /** 退出登录：通知后端 + 清除本地 */
  const logout = useCallback(async () => {
    try {
      await client.post('/auth/logout');
    } catch (e) {
      // 忽略登出接口错误，本地照常清除
    }
    localStorage.removeItem(STORAGE_KEYS.token);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** 使用登录态 hook */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必须在 <AuthProvider> 内使用');
  }
  return ctx;
}
