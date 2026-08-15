// controllers/motorController.js（修复版：校验抽离 / 非法参数 400 / UNIQUE code / id 校验）
const motorModel = require('../models/motorModel');

// 所有数字字段（用于 add/update 校验）
const NUMBER_FIELDS = ['power', 'voltage', 'rpm', 'efficiency', 'current', 'powerFactor', 'frequency', 'poles', 'weight', 'lockedRotorTorque', 'maxTorque', 'startingCurrent', 'noise'];

/**
 * 模块内私有函数：解析并校验电机输入（addMotor/updateMotor 共用）
 * @param {object} data 请求体
 * @param {object} options { partial: boolean } partial=true 表示部分更新（可选字段跳过）
 * @returns {{ ok: true, value: object } | { ok: false, error: string }}
 */
function parseAndValidateMotorInput(data, { partial = false } = {}) {
  const motorData = { ...data };

  // 必填字段校验（仅新增时）
  if (!partial) {
    const required = ['model', 'frameSize', 'power', 'voltage', 'rpm'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === '') {
        return { ok: false, error: `缺少必填字段: ${field}` };
      }
    }
  }

  // 数字字段转换与范围验证
  for (const field of NUMBER_FIELDS) {
    // 跳过 undefined 和空字符串
    if (data[field] === undefined || data[field] === '') {
      if (!partial) {
        motorData[field] = null;
      }
      continue;
    }

    const value = Number(data[field]);
    if (isNaN(value)) {
      return { ok: false, error: `${field}必须是数字` };
    }

    // 特定字段范围验证
    switch (field) {
      case 'power':
      case 'voltage':
      case 'rpm':
        // 这些字段必须是正数
        if (value <= 0) {
          return { ok: false, error: `${field}必须是正数` };
        }
        break;
      case 'frequency':
      case 'poles':
        // 这些字段可以是0或正数
        if (value < 0) {
          return { ok: false, error: `${field}不能为负数` };
        }
        break;
      case 'efficiency':
        if (value < 0 || value > 100) {
          return { ok: false, error: '效率必须在0-100之间' };
        }
        break;
      case 'powerFactor':
        if (value < 0 || value > 1) {
          return { ok: false, error: '功率因数必须在0-1之间' };
        }
        break;
      case 'current':
      case 'weight':
      case 'lockedRotorTorque':
      case 'maxTorque':
      case 'startingCurrent':
      case 'noise':
        // 这些字段可以是0或正数
        if (value < 0) {
          return { ok: false, error: `${field}不能为负数` };
        }
        break;
    }

    motorData[field] = value;
  }

  // 新增时设置默认值
  if (!partial && motorData.frequency === null) {
    motorData.frequency = 50;
  }

  return { ok: true, value: motorData };
}

/**
 * GET /api/motors
 * 获取电机列表（公开，支持多条件筛选）
 */
const getMotors = async (req, res) => {
  try {
    const filters = {};
    const query = req.query;

    // 兼容旧参数（前端可能还用老参数）
    if (query.power !== undefined && query.power !== '') {
      const p = Number(query.power);
      if (!Number.isFinite(p)) {
        return res.status(400).json({ success: false, message: '参数 power 必须是数字' });
      }
      filters.power_min = filters.power_max = p;
    }
    if (query.rpm !== undefined && query.rpm !== '') {
      const r = Number(query.rpm);
      if (!Number.isFinite(r)) {
        return res.status(400).json({ success: false, message: '参数 rpm 必须是数字' });
      }
      filters.rpm_min = filters.rpm_max = r;
    }

    // 数字筛选参数：统一 Number() + Number.isFinite() 校验，非法即 400
    const numberFields = ['power_min', 'power_max', 'rpm_min', 'rpm_max', 'voltage', 'efficiency_min', 'efficiency_max', 'current_min', 'current_max', 'powerFactor_min', 'powerFactor_max', 'noise_min', 'noise_max', 'poles', 'frequency'];
    for (const field of numberFields) {
      if (query[field] !== undefined && query[field] !== '') {
        const value = Number(query[field]);
        if (!Number.isFinite(value)) {
          return res.status(400).json({ success: false, message: `参数 ${field} 必须是数字` });
        }
        filters[field] = value;
      }
    }

    // 拒绝负数范围参数（功率/转速/效率/电流/功率因数/噪声等均为非负物理量）
    const nonNegativeFields = ['power_min', 'power_max', 'rpm_min', 'rpm_max', 'efficiency_min', 'efficiency_max', 'current_min', 'current_max', 'noise_min', 'noise_max', 'voltage', 'poles', 'frequency'];
    for (const field of nonNegativeFields) {
      if (filters[field] !== undefined && filters[field] < 0) {
        return res.status(400).json({ success: false, message: `参数 ${field} 不能为负数` });
      }
    }
    // 功率因数必须在 0-1 之间
    for (const field of ['powerFactor_min', 'powerFactor_max']) {
      if (filters[field] !== undefined && (filters[field] < 0 || filters[field] > 1)) {
        return res.status(400).json({ success: false, message: `参数 ${field} 必须在0-1之间` });
      }
    }

    const stringFields = ['frameSize', 'model', 'description', 'ip', 'insulation', 'mounting', 'connection'];
    stringFields.forEach(field => {
      if (query[field]) filters[field] = query[field].trim();
    });

    // 排序
    if (query.sortBy) filters.sortBy = query.sortBy;

    const motors = await motorModel.filterMotors(filters);

    res.json({
      success: true,
      data: motors,
      total: motors.length,
    });
  } catch (error) {
    console.error('获取电机列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
};

/**
 * GET /api/motors/:id
 * 获取单个电机详情
 */
const getMotorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: '无效的电机ID' });
    }

    const motor = await motorModel.getMotorById(id);
    if (!motor) {
      return res.status(404).json({ success: false, message: '电机未找到' });
    }

    res.json({ success: true, data: motor });
  } catch (error) {
    console.error('获取电机详情失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

/**
 * POST /api/motors
 * 添加新电机（需登录）
 */
const addMotor = async (req, res) => {
  try {
    const data = req.body;

    const parsed = parseAndValidateMotorInput(data, { partial: false });
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.error });
    }

    const result = await motorModel.createMotor(parsed.value);

    res.status(201).json({
      success: true,
      message: '电机添加成功',
      data: { id: result.id },
    });
  } catch (error) {
    console.error('添加电机失败:', error);
    // 改用 error.code 判断 UNIQUE 约束（不再依赖错误消息字符串）
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ success: false, message: '电机型号已存在' });
    }
    res.status(500).json({ success: false, message: '添加失败' });
  }
};

/**
 * PUT /api/motors/:id
 * 更新电机（支持部分更新）
 */
const updateMotor = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // id 校验（B-02，与 getMotorById 保持一致）
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: '无效的电机ID' });
    }

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: '没有提供更新数据' });
    }

    const parsed = parseAndValidateMotorInput(data, { partial: true });
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.error });
    }

    const changes = await motorModel.updateMotor(id, parsed.value);

    if (changes === 0) {
      return res.status(404).json({ success: false, message: '电机未找到或无更新' });
    }

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新电机失败:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ success: false, message: '电机型号已存在' });
    }
    res.status(500).json({ success: false, message: '更新失败' });
  }
};

/**
 * DELETE /api/motors/:id
 * 删除电机
 */
const deleteMotor = async (req, res) => {
  try {
    const { id } = req.params;

    // id 校验（B-02，与 getMotorById 保持一致）
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: '无效的电机ID' });
    }

    const changes = await motorModel.deleteMotor(id);

    if (changes === 0) {
      return res.status(404).json({ success: false, message: '电机未找到' });
    }

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除电机失败:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
};

module.exports = {
  getMotors,
  getMotorById,
  addMotor,
  updateMotor,
  deleteMotor,
};
