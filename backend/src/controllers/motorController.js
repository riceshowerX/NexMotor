// controllers/motorController.js（支持全部 20+ 参数 + 安全 + 统一响应）
const motorModel = require('../models/motorModel');

/**
 * GET /api/motors
 * 获取电机列表（公开，支持多条件筛选）
 */
const getMotors = async (req, res) => {
  try {
    const filters = {};
    const query = req.query;

    // 兼容旧参数（前端可能还用老参数）
    if (query.power) {
      const p = parseFloat(query.power);
      filters.power_min = filters.power_max = p;
    }
    if (query.rpm) {
      const r = parseInt(query.rpm, 10);
      filters.rpm_min = filters.rpm_max = r;
    }

    // 新参数（推荐使用）
    const numberFields = ['power_min', 'power_max', 'rpm_min', 'rpm_max', 'voltage', 'efficiency_min', 'current_min', 'powerFactor_min', 'poles', 'frequency', 'noise'];
    numberFields.forEach(field => {
      if (query[field] !== undefined && query[field] !== '') {
        filters[field] = isNaN(query[field]) ? query[field] : Number(query[field]);
      }
    });

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

    // 必填字段校验
    const required = ['model', 'frameSize', 'power', 'voltage', 'rpm'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === '') {
        return res.status(400).json({
          success: false,
          message: `缺少必填字段: ${field}`,
        });
      }
    }
    
    // 自动转换数字类型并验证
    const motorData = { ...data };
    const numberFields = ['power', 'voltage', 'rpm', 'efficiency', 'current', 'powerFactor', 'frequency', 'poles', 'weight', 'lockedRotorTorque', 'maxTorque', 'startingCurrent', 'noise'];
    
    for (const field of numberFields) {
      // 跳过undefined和空字符串
      if (data[field] === undefined || data[field] === '') {
        motorData[field] = null;
        continue;
      }
      
      const value = Number(data[field]);
      if (isNaN(value)) {
        return res.status(400).json({ success: false, message: `${field}必须是数字` });
      }
      
      // 特定字段范围验证
      switch (field) {
        case 'power':
        case 'voltage':
        case 'rpm':
          // 这些字段必须是正数
          if (value <= 0) {
            return res.status(400).json({ success: false, message: `${field}必须是正数` });
          }
          break;
        case 'frequency':
        case 'poles':
          // 这些字段可以是0或正数
          if (value < 0) {
            return res.status(400).json({ success: false, message: `${field}不能为负数` });
          }
          break;
        case 'efficiency':
          if (value < 0 || value > 100) {
            return res.status(400).json({ success: false, message: '效率必须在0-100之间' });
          }
          break;
        case 'powerFactor':
          if (value < 0 || value > 1) {
            return res.status(400).json({ success: false, message: '功率因数必须在0-1之间' });
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
            return res.status(400).json({ success: false, message: `${field}不能为负数` });
          }
          break;
      }
      
      motorData[field] = value;
    }
    
    // 设置默认值
    if (motorData.frequency === null) {
      motorData.frequency = 50;
    }

    const result = await motorModel.createMotor(motorData);

    res.status(201).json({
      success: true,
      message: '电机添加成功',
      data: { id: result.id },
    });
  } catch (error) {
    console.error('添加电机失败:', error);
    if (error.message.includes('UNIQUE')) {
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

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: '没有提供更新数据' });
    }

    // 自动转换数字字段并验证
    const updateData = { ...data };
    const numberFields = ['power', 'voltage', 'rpm', 'efficiency', 'current', 'powerFactor', 'frequency', 'poles', 'weight', 'lockedRotorTorque', 'maxTorque', 'startingCurrent', 'noise'];
    
    // 验证并转换数字字段
    for (const field of numberFields) {
      // 跳过undefined和空字符串
      if (data[field] === undefined || data[field] === '') {
        continue;
      }
      
      const value = Number(data[field]);
      if (isNaN(value)) {
        return res.status(400).json({ success: false, message: `${field}必须是数字` });
      }
      
      // 特定字段范围验证
      switch (field) {
        case 'power':
        case 'voltage':
        case 'rpm':
          // 这些字段必须是正数
          if (value <= 0) {
            return res.status(400).json({ success: false, message: `${field}必须是正数` });
          }
          break;
        case 'frequency':
        case 'poles':
          // 这些字段可以是0或正数
          if (value < 0) {
            return res.status(400).json({ success: false, message: `${field}不能为负数` });
          }
          break;
        case 'efficiency':
          if (value < 0 || value > 100) {
            return res.status(400).json({ success: false, message: '效率必须在0-100之间' });
          }
          break;
        case 'powerFactor':
          if (value < 0 || value > 1) {
            return res.status(400).json({ success: false, message: '功率因数必须在0-1之间' });
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
            return res.status(400).json({ success: false, message: `${field}不能为负数` });
          }
          break;
      }
      
      updateData[field] = value;
    }

    const changes = await motorModel.updateMotor(id, updateData);

    if (changes === 0) {
      return res.status(404).json({ success: false, message: '电机未找到或无更新' });
    }

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新电机失败:', error);
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