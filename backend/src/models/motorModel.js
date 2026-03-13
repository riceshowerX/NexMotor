// motorModel.js（终极安全版，永不 500！）
const { getDb } = require('./db');

// 获取所有电机
function getAllMotors() {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all('SELECT * FROM motors ORDER BY model ASC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// 根据ID获取单个电机
function getMotorById(id) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get('SELECT * FROM motors WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

// 筛选电机（关键修复：模糊搜索永不崩溃）
function filterMotors(filters = {}) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    let query = 'SELECT * FROM motors WHERE 1=1';
    const params = [];

    // 安全添加普通条件
    const addCondition = (field, value, operator = '=') => {
      if (value !== undefined && value !== null && value !== '') {
        query += ` AND ${field} ${operator} ?`;
        params.push(value);
      }
    };

    // 安全添加范围条件
    const addRange = (minKey, maxKey, column) => {
      if (filters[minKey] !== undefined && filters[minKey] !== '') {
        query += ` AND ${column} >= ?`;
        params.push(Number(filters[minKey]));
      }
      if (filters[maxKey] !== undefined && filters[maxKey] !== '') {
        query += ` AND ${column} <= ?`;
        params.push(Number(filters[maxKey]));
      }
    };

    // 安全添加模糊搜索（关键修复！）
    const addLike = (field, value) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        query += ` AND ${field} LIKE ?`;
        params.push(`%${value.trim()}%`);
      }
    };

    // 执行所有筛选
    addRange('power_min', 'power_max', 'power');
    addRange('rpm_min', 'rpm_max', 'rpm');
    addCondition('voltage', filters.voltage);
    addCondition('frameSize', filters.frameSize);
    addCondition('poles', filters.poles);
    addCondition('ip', filters.ip);
    addCondition('insulation', filters.insulation);
    addCondition('frequency', filters.frequency);
    addRange('efficiency_min', 'efficiency_max', 'efficiency');

    // 模糊搜索（永不崩溃）
    addLike('model', filters.model);
    addLike('description', filters.description);

    // 排序（安全处理）
    const validSorts = {
      power_asc: 'power ASC',
      power_desc: 'power DESC',
      rpm_asc: 'rpm ASC',
      rpm_desc: 'rpm DESC',
      efficiency_desc: 'efficiency DESC NULLS LAST',
    };
    const sort = validSorts[filters.sortBy] || 'model ASC';
    query += ` ORDER BY ${sort}`;

    // 调试日志（生产可注释）
    console.log('SQL:', query);
    console.log('Params:', params);

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('查询失败:', err.message);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// 创建新电机（支持所有字段）
function createMotor(motorData) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    const fields = [];
    const placeholders = [];
    const values = [];

    const allFields = [
      'model', 'frameSize', 'power', 'voltage', 'current', 'rpm', 'efficiency',
      'powerFactor', 'frequency', 'poles', 'ip', 'insulation', 'mounting',
      'weight', 'connection', 'lockedRotorTorque', 'maxTorque',
      'startingCurrent', 'noise', 'description', 'imageUrl'
    ];

    allFields.forEach(field => {
      if (motorData[field] !== undefined && motorData[field] !== null) {
        fields.push(field);
        placeholders.push('?');
        values.push(motorData[field]);
      }
    });

    if (fields.length === 0) {
      return reject(new Error('没有提供任何数据'));
    }

    const sql = `INSERT INTO motors (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;

    db.run(sql, values, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, ...motorData });
    });
  });
}

// 更新电机（支持部分更新）
function updateMotor(id, motorData) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    const setClauses = [];
    const values = [];

    const allowedFields = [
      'model', 'frameSize', 'power', 'voltage', 'current', 'rpm', 'efficiency',
      'powerFactor', 'frequency', 'poles', 'ip', 'insulation', 'mounting',
      'weight', 'connection', 'lockedRotorTorque', 'maxTorque',
      'startingCurrent', 'noise', 'description', 'imageUrl'
    ];

    allowedFields.forEach(field => {
      if (motorData[field] !== undefined && motorData[field] !== null) {
        setClauses.push(`${field} = ?`);
        values.push(motorData[field]);
      }
    });

    if (setClauses.length === 0) {
      return resolve(0); // 无更新
    }

    values.push(id);
    const sql = `UPDATE motors SET ${setClauses.join(', ')} WHERE id = ?`;

    db.run(sql, values, function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

// 删除电机
function deleteMotor(id) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.run('DELETE FROM motors WHERE id = ?', [id], function(err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

module.exports = {
  getAllMotors,
  getMotorById,
  filterMotors,
  createMotor,
  updateMotor,
  deleteMotor
};