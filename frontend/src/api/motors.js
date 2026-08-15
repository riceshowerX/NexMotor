/**
 * api/motors.js
 * 电机 CRUD + 筛选参数构造（对照架构文档 3.6 契约表）
 */
import client from './client';
import { FILTER_DEFINITIONS } from '../utils/constants';

/**
 * 将前端筛选状态转换为后端 query 参数（对照 3.6 契约表）
 * @param {object} filters 前端筛选状态（键与 FILTER_DEFINITIONS.key 对应）
 * @param {string} sortBy 排序值（后端白名单）
 * @returns {object} query 参数对象
 */
export function buildMotorQuery(filters = {}, sortBy = '') {
  const params = {};
  FILTER_DEFINITIONS.forEach((def) => {
    const value = filters[def.key];
    if (value === undefined || value === null || value === '') return;
    if (def.type === 'range') {
      const min = value.min;
      const max = value.max;
      if (min !== undefined && min !== null && min !== '') params[def.minKey] = min;
      if (max !== undefined && max !== null && max !== '') params[def.maxKey] = max;
    } else {
      params[def.queryKey] = value;
    }
  });
  if (sortBy) params.sortBy = sortBy;
  return params;
}

/**
 * 获取电机列表（支持筛选 + 排序）
 * @param {object} filters 筛选状态
 * @param {string} sortBy 排序
 * @returns {Promise<{success:boolean, data:Array, total?:number}>}
 */
export async function getMotors(filters = {}, sortBy = '') {
  const params = buildMotorQuery(filters, sortBy);
  return client.get('/motors', { params });
}

/** 获取单个电机详情 */
export async function getMotor(id) {
  return client.get(`/motors/${id}`);
}

/** 新增电机（需 Bearer token） */
export async function createMotor(data) {
  return client.post('/motors', data);
}

/** 更新电机（需 Bearer token） */
export async function updateMotor(id, data) {
  return client.put(`/motors/${id}`, data);
}

/** 删除电机（需 Bearer token） */
export async function deleteMotor(id) {
  return client.delete(`/motors/${id}`);
}
