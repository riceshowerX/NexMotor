/**
 * constants.js
 * 全局常量：筛选字段定义、排序选项、电机字段元数据、单位映射
 */

/** 筛选面板字段定义（14 个筛选参数 + 型号/描述关键字）
 *  key        : 前端 filters 状态中的键
 *  type       : range(区间) | number(数字) | text(文本) | select(下拉)
 *  queryKey   : 映射到后端 GET /api/motors 的 query 参数
 *  minKey/maxKey: range 类型映射的 min/max 参数
 */
export const FILTER_DEFINITIONS = [
  { key: 'power', type: 'range', minKey: 'power_min', maxKey: 'power_max', labelKey: 'catalog.filter.power', placeholder: 'kW', step: 0.1 },
  { key: 'voltage', type: 'number', queryKey: 'voltage', labelKey: 'catalog.filter.voltage', placeholder: 'V', step: 10 },
  { key: 'rpm', type: 'range', minKey: 'rpm_min', maxKey: 'rpm_max', labelKey: 'catalog.filter.rpm', placeholder: 'rpm', step: 10 },
  { key: 'frameSize', type: 'text', queryKey: 'frameSize', labelKey: 'catalog.filter.frameSize', placeholder: 'catalog.filter.placeholder.input' },
  { key: 'efficiencyMin', type: 'number', queryKey: 'efficiency_min', labelKey: 'catalog.filter.efficiencyMin', placeholder: '%', step: 0.1 },
  { key: 'poles', type: 'select', queryKey: 'poles', labelKey: 'catalog.filter.poles', options: [2, 4, 6, 8, 10, 12] },
  { key: 'frequency', type: 'select', queryKey: 'frequency', labelKey: 'catalog.filter.frequency', options: [50, 60] },
  { key: 'ip', type: 'text', queryKey: 'ip', labelKey: 'catalog.filter.ip', placeholder: 'catalog.filter.placeholder.input' },
  { key: 'insulation', type: 'select', queryKey: 'insulation', labelKey: 'catalog.filter.insulation', options: ['B', 'F', 'H'] },
  { key: 'mounting', type: 'select', queryKey: 'mounting', labelKey: 'catalog.filter.mounting', options: ['IM B3', 'IM B5', 'IM B35', 'IM V1', 'IM V3', 'IM B14', 'IM B34'] },
  { key: 'connection', type: 'select', queryKey: 'connection', labelKey: 'catalog.filter.connection', options: ['Y', 'Delta'] },
  { key: 'current', type: 'range', minKey: 'current_min', maxKey: 'current_max', labelKey: 'catalog.filter.current', placeholder: 'A', step: 0.1 },
  { key: 'powerFactorMin', type: 'number', queryKey: 'powerFactor_min', labelKey: 'catalog.filter.powerFactorMin', step: 0.01 },
  { key: 'noiseMax', type: 'number', queryKey: 'noise_max', labelKey: 'catalog.filter.noiseMax', placeholder: 'dB', step: 1 },
  { key: 'model', type: 'text', queryKey: 'model', labelKey: 'catalog.filter.model', placeholder: 'catalog.filter.placeholder.input' },
  { key: 'description', type: 'text', queryKey: 'description', labelKey: 'catalog.filter.description', placeholder: 'catalog.filter.placeholder.input' },
];

/** 筛选状态初始值（与 FILTER_DEFINITIONS.key 一一对应） */
export const INITIAL_FILTERS = {
  power: {},
  voltage: null,
  rpm: {},
  frameSize: '',
  efficiencyMin: null,
  poles: null,
  frequency: null,
  ip: '',
  insulation: null,
  mounting: null,
  connection: null,
  current: {},
  powerFactorMin: null,
  noiseMax: null,
  model: '',
  description: '',
};

/** 排序选项（值对应后端白名单） */
export const SORT_OPTIONS = [
  { value: '', labelKey: 'catalog.sort.placeholder' },
  { value: 'power_asc', labelKey: 'catalog.sort.powerAsc' },
  { value: 'power_desc', labelKey: 'catalog.sort.powerDesc' },
  { value: 'rpm_asc', labelKey: 'catalog.sort.rpmAsc' },
  { value: 'rpm_desc', labelKey: 'catalog.sort.rpmDesc' },
  { value: 'efficiency_desc', labelKey: 'catalog.sort.efficiencyDesc' },
];

/** 电机字段元数据（后台表单 / 详情参数表共用）
 *  required : 后端必填校验（model/frameSize/power/voltage/rpm）
 *  min/max  : 数字范围（与后端 controller 校验一致）
 *  exclusiveMin: 必须为正数
 */
export const MOTOR_FIELDS = [
  { key: 'model', type: 'string', required: true, labelKey: 'detail.field.model' },
  { key: 'frameSize', type: 'string', required: true, labelKey: 'detail.field.frameSize' },
  { key: 'power', type: 'number', required: true, labelKey: 'detail.field.power', exclusiveMin: true },
  { key: 'voltage', type: 'number', required: true, labelKey: 'detail.field.voltage', exclusiveMin: true },
  { key: 'current', type: 'number', labelKey: 'detail.field.current', min: 0 },
  { key: 'rpm', type: 'number', required: true, labelKey: 'detail.field.rpm', exclusiveMin: true },
  { key: 'efficiency', type: 'number', labelKey: 'detail.field.efficiency', min: 0, max: 100 },
  { key: 'powerFactor', type: 'number', labelKey: 'detail.field.powerFactor', min: 0, max: 1, step: 0.01 },
  { key: 'frequency', type: 'number', labelKey: 'detail.field.frequency', min: 0 },
  { key: 'poles', type: 'number', labelKey: 'detail.field.poles', min: 0 },
  { key: 'ip', type: 'string', labelKey: 'detail.field.ip' },
  { key: 'insulation', type: 'string', labelKey: 'detail.field.insulation' },
  { key: 'mounting', type: 'string', labelKey: 'detail.field.mounting' },
  { key: 'weight', type: 'number', labelKey: 'detail.field.weight', min: 0 },
  { key: 'connection', type: 'string', labelKey: 'detail.field.connection' },
  { key: 'lockedRotorTorque', type: 'number', labelKey: 'detail.field.lockedRotorTorque', min: 0 },
  { key: 'maxTorque', type: 'number', labelKey: 'detail.field.maxTorque', min: 0 },
  { key: 'startingCurrent', type: 'number', labelKey: 'detail.field.startingCurrent', min: 0 },
  { key: 'noise', type: 'number', labelKey: 'detail.field.noise', min: 0 },
  { key: 'description', type: 'string', labelKey: 'detail.field.description' },
  { key: 'imageUrl', type: 'string', labelKey: 'detail.field.imageUrl' },
];

/** 需要渲染为下拉选择的字段（后台表单） */
export const SELECT_FIELD_OPTIONS = {
  poles: [2, 4, 6, 8, 10, 12],
  frequency: [50, 60],
  insulation: ['B', 'F', 'H'],
  mounting: ['IM B3', 'IM B5', 'IM B35', 'IM V1', 'IM V3', 'IM B14', 'IM B34'],
  connection: ['Y', 'Delta'],
  ip: ['IP23', 'IP44', 'IP54', 'IP55', 'IP65'],
};

/** localStorage 键名 */
export const STORAGE_KEYS = {
  token: 'nexmotor_token',
  lang: 'nexmotor_lang',
};
