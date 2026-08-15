/**
 * format.js
 * 数字 / 单位 / 参数格式化工具
 */

/** 空值占位符 */
const EMPTY = '—';

/**
 * 数字格式化：null/undefined/'' 显示占位符
 * @param {number|string|null|undefined} value
 * @param {number} digits 最大小数位
 * @returns {string}
 */
export function formatNumber(value, digits = 1) {
  if (value === null || value === undefined || value === '') return EMPTY;
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString('zh-CN', { maximumFractionDigits: digits });
}

/**
 * 带单位格式化
 * @param {number|string|null|undefined} value
 * @param {string} unit 单位后缀（如 kW / V / rpm）
 * @param {number} digits
 * @returns {string}
 */
export function formatWithUnit(value, unit, digits = 1) {
  const formatted = formatNumber(value, digits);
  if (formatted === EMPTY) return EMPTY;
  return `${formatted} ${unit}`;
}

/** 效率（百分比） */
export function formatPercent(value, digits = 1) {
  return formatWithUnit(value, '%', digits);
}

/** 功率因数（两位小数） */
export function formatFactor(value) {
  return formatNumber(value, 2);
}

/**
 * 根据电机字段键智能格式化
 * @param {object} motor 电机对象
 * @param {string} key 字段名
 * @returns {string}
 */
export function formatMotorField(motor, key) {
  const value = motor[key];
  switch (key) {
    case 'efficiency':
      return formatPercent(value);
    case 'powerFactor':
      return formatFactor(value);
    case 'noise':
      return formatWithUnit(value, 'dB', 0);
    case 'power':
      return formatWithUnit(value, 'kW');
    case 'voltage':
      return formatWithUnit(value, 'V', 0);
    case 'current':
    case 'startingCurrent':
      return formatWithUnit(value, 'A');
    case 'rpm':
      return formatWithUnit(value, 'rpm', 0);
    case 'frequency':
      return formatWithUnit(value, 'Hz', 0);
    case 'weight':
      return formatWithUnit(value, 'kg');
    default:
      return value === null || value === undefined || value === '' ? EMPTY : String(value);
  }
}
