// db.js（完整升级版，支持 20+ 参数 + 自动升级旧表）
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../motors.db');
let db = null;

// 初始化数据库
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('连接数据库失败:', err.message);
        return reject(err);
      }
      console.log('成功连接到 SQLite 数据库');

      try {
        await createTablesIfNotExist();
        await upgradeTableIfNeeded();  // ← 关键：自动升级旧表
        await insertInitialData();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

// 创建表（新表结构）
function createTablesIfNotExist() {
  return new Promise((resolve, reject) => {
    const createMotorsTable = `
      CREATE TABLE IF NOT EXISTS motors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT NOT NULL UNIQUE,
        frameSize TEXT NOT NULL,
        power REAL NOT NULL,
        voltage INTEGER NOT NULL,
        rpm INTEGER NOT NULL,
        efficiency REAL,
        description TEXT,
        imageUrl TEXT,
        
        -- 新增的 20+ 个专业参数
        current REAL,                    -- 额定电流 A
        powerFactor REAL,                -- 功率因数 cos φ
        frequency INTEGER DEFAULT 50,    -- 频率 Hz
        poles INTEGER,                   -- 极数
        ip TEXT DEFAULT 'IP55',          -- 防护等级
        insulation TEXT DEFAULT 'F',     -- 绝缘等级
        mounting TEXT,                   -- 安装方式
        weight REAL,                     -- 重量 kg
        connection TEXT,                 -- 接法 Y/Δ
        lockedRotorTorque REAL,          -- 堵转转矩倍数
        maxTorque REAL,                  -- 最大转矩倍数
        startingCurrent REAL,            -- 启动电流倍数
        noise INTEGER                    -- 噪声 dB(A)
      );
    `;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin'
      );
    `;

    db.serialize(() => {
      db.run(createMotorsTable, (err) => {
        if (err) reject(err);
        else console.log('motors 表就绪（已支持全部参数）');
      });

      db.run(createUsersTable, (err) => {
        if (err) reject(err);
        else console.log('users 表就绪');
      });

      resolve();
    });
  });
}

// 关键：自动检测并升级旧表（兼容老用户）
function upgradeTableIfNeeded() {
  return new Promise((resolve, reject) => {
    const newColumns = [
      { name: 'current', type: 'REAL' },
      { name: 'powerFactor', type: 'REAL' },
      { name: 'frequency', type: 'INTEGER', default: '50' },
      { name: 'poles', type: 'INTEGER' },
      { name: 'ip', type: 'TEXT', default: "'IP55'" },
      { name: 'insulation', type: 'TEXT', default: "'F'" },
      { name: 'mounting', type: 'TEXT' },
      { name: 'weight', type: 'REAL' },
      { name: 'connection', type: 'TEXT' },
      { name: 'lockedRotorTorque', type: 'REAL' },
      { name: 'maxTorque', type: 'REAL' },
      { name: 'startingCurrent', type: 'REAL' },
      { name: 'noise', type: 'INTEGER' }
    ];

    let pending = newColumns.length;
    if (pending === 0) return resolve();

    newColumns.forEach(column => {
      const defaultClause = column.default ? `DEFAULT ${column.default}` : '';
      const sql = `ALTER TABLE motors ADD COLUMN ${column.name} ${column.type} ${defaultClause}`;

      db.run(sql, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error(`添加字段 ${column.name} 失败:`, err.message);
        } else if (!err) {
          console.log(`√ 已添加字段: ${column.name}`);
        }
        if (--pending === 0) resolve();
      });
    });
  });
}

// 插入初始数据（保持不变，只改了字段顺序）
async function insertInitialData() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM motors', async (err, row) => {
      if (err) return reject(err);
      if (row.count > 0) {
        console.log('已有电机数据，跳过初始化插入');
        await checkAndInsertAdmin();
        return resolve();
      }

      const sampleData = [
        ['Y160M-4', '160M', 11.0, 380, 1460, 91.5, '三相异步电动机，适用于一般机械设备', 'https://via.placeholder.com/300x200?text=Y160M-4', 21.8, 0.84, 50, 4, 'IP55', 'F', 'IM B3', 95, 'Y', 2.2, 2.4, 7.0, 72],
        ['Y200L1-6', '200L1', 18.5, 380, 970, 92.0, '高效率三相异步电动机，节能型', 'https://via.placeholder.com/300x200?text=Y200L1-6', 36.5, 0.85, 50, 6, 'IP55', 'F', 'IM B3', 160, 'Y', 2.1, 2.3, 6.8, 75],
        // 可以继续加更多示例...
      ];

      const placeholders = sampleData[0].length;
      const sql = `INSERT INTO motors (model, frameSize, power, voltage, rpm, efficiency, description, imageUrl, current, powerFactor, frequency, poles, ip, insulation, mounting, weight, connection, lockedRotorTorque, maxTorque, startingCurrent, noise) VALUES (${'?,'.repeat(placeholders).slice(0, -1)})`;

      const stmt = db.prepare(sql);
      sampleData.forEach(data => stmt.run(data));
      stmt.finalize(async (err) => {
        if (err) reject(err);
        else console.log('示例电机数据插入完成');
        await checkAndInsertAdmin();
        resolve();
      });
    });
  });
}

// 检查并创建默认管理员
function checkAndInsertAdmin() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) return reject(err);
      if (row.count > 0) {
        console.log('管理员已存在');
        return resolve();
      }

      bcrypt.hash('admin123', 10, (err, hash) => {
        if (err) return reject(err);
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hash, 'admin'], (err) => {
          if (err) reject(err);
          else {
            console.log('默认管理员创建成功 → 用户名: admin  密码: admin123');
            resolve();
          }
        });
      });
    });
  });
}

function getDb() {
  if (!db) throw new Error('数据库未初始化');
  return db;
}

function closeDatabase() {
  if (db) {
    db.close((err) => {
      err ? console.error('关闭数据库失败:', err.message) : console.log('数据库已关闭');
    });
  }
}

module.exports = {
  initializeDatabase,
  getDb,
  closeDatabase
};