/**
 * hooks/useMotors.js
 * 列表拉取 + 筛选状态管理（防抖 300ms）+ 重置
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getMotors } from '../api/motors';
import { INITIAL_FILTERS } from '../utils/constants';

const DEBOUNCE_MS = 300;

export default function useMotors() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState('');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const requestSeq = useRef(0);

  useEffect(() => {
    const seq = ++requestSeq.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMotors(filters, sortBy);
        if (seq !== requestSeq.current) return; // 丢弃过期响应
        const list = (res && res.data) || [];
        setData(list);
        setTotal(res && res.total !== undefined ? res.total : list.length);
      } catch (e) {
        if (seq !== requestSeq.current) return;
        setError(e.message || 'load failed');
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters, sortBy, reloadKey]);

  /**
   * 更新单个筛选字段（range 类型为 {min,max} 对象，做深合并）
   * @param {string} key 筛选键
   * @param {*} value 新值
   */
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const prevValue = prev[key];
      if (
        prevValue &&
        typeof prevValue === 'object' &&
        value &&
        typeof value === 'object' &&
        !Array.isArray(prevValue) &&
        !Array.isArray(value)
      ) {
        return { ...prev, [key]: { ...prevValue, ...value } };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  /** 重置所有筛选与排序 */
  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSortBy('');
  }, []);

  /** 手动刷新 */
  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    data,
    total,
    loading,
    error,
    reload,
  };
}
