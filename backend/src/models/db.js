// db.js（修复版：Promise 竞态 / ADMIN_PASSWORD / DB_PATH / closeDatabase Promise）
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

// 数据库路径：优先使用环境变量 DB_PATH（测试用），否则默认 backend/motors.db
const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.resolve(__dirname, '../../motors.db');
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
        await upgradeTableIfNeeded(); // 自动升级旧表
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

    // 串行建表：全部回调完成后 resolve，任一失败立即 reject
    db.serialize(() => {
      db.run(createMotorsTable, (err) => {
        if (err) return reject(err);
        console.log('motors 表就绪（已支持全部参数）');
        db.run(createUsersTable, (err2) => {
          if (err2) return reject(err2);
          console.log('users 表就绪');
          resolve();
        });
      });
    });
  });
}

// 关键：自动检测并升级旧表（兼容老用户）
// 步骤1：PRAGMA table_info 查现有列，只补缺失列
// 步骤2：确保 motors.model 存在唯一索引（P1 修复，旧表结构 model 无 UNIQUE 约束）
async function upgradeTableIfNeeded() {
  // ---- 步骤1：补缺失列（串行 ALTER） ----
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

  const columns = await new Promise((resolve, reject) => {
    db.all('PRAGMA table_info(motors)', (err, cols) => (err ? reject(err) : resolve(cols || [])));
  });
  const existing = new Set(columns.map((c) => c.name));
  const missing = newColumns.filter((c) => !existing.has(c.name));

  for (const column of missing) {
    const defaultClause = column.default ? `DEFAULT ${column.default}` : '';
    const sql = `ALTER TABLE motors ADD COLUMN ${column.name} ${column.type} ${defaultClause}`;
    await new Promise((resolve, reject) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`添加字段 ${column.name} 失败:`, err.message);
          return reject(err);
        }
        console.log(`√ 已添加字段: ${column.name}`);
        resolve();
      });
    });
  }

  // ---- 步骤2：确保 model 唯一索引 ----
  await ensureModelUniqueIndex();
}

// 确保 motors.model 存在唯一索引（P1：旧表结构 model 无 UNIQUE 约束）
// 先查 PRAGMA index_list，若已存在唯一索引（含 sqlite_autoindex 之类）则跳过；
// 否则先清理重复行（保留每组最小 id），再创建唯一索引。
async function ensureModelUniqueIndex() {
  const indexes = await new Promise((resolve, reject) => {
    db.all("PRAGMA index_list('motors')", (err, rows) => (err ? reject(err) : resolve(rows || [])));
  });

  const hasUniqueIndex = indexes.some((idx) => idx.unique === 1);
  if (hasUniqueIndex) {
    console.log('motors.model 唯一索引已存在，跳过');
    return;
  }

  // 清理重复行：保留每个 model 的最小 id，删除其余（避免建唯一索引失败）
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM motors WHERE id NOT IN (SELECT MIN(id) FROM motors GROUP BY model)', (err) => {
      if (err) {
        console.error('清理重复 model 行失败:', err.message);
        return reject(err);
      }
      console.log('√ 已清理重复 model 行（保留最小 id）');
      resolve();
    });
  });

  // 创建唯一索引
  await new Promise((resolve, reject) => {
    db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_motors_model ON motors(model)', (err) => {
      if (err) {
        console.error('创建 model 唯一索引失败:', err.message);
        return reject(err);
      }
      console.log('√ 已创建唯一索引 idx_motors_model');
      resolve();
    });
  });
}

// 插入初始数据
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
        ['Y200L1-6', '200L1', 18.5, 380, 970, 92.0, '高效率三相异步电动机，节能型', 'https://via.placeholder.com/300x200?text=Y200L1-6', 36.5, 0.85, 50, 6, 'IP55', 'F', 'IM B3', 160, 'Y', 2.1, 2.3, 6.8, 75]
      ];

      const placeholders = sampleData[0].length;
      const sql = `INSERT INTO motors (model, frameSize, power, voltage, rpm, efficiency, description, imageUrl, current, powerFactor, frequency, poles, ip, insulation, mounting, weight, connection, lockedRotorTorque, maxTorque, startingCurrent, noise) VALUES (${'?,'.repeat(placeholders).slice(0, -1)})`;

      const stmt = db.prepare(sql);
      let pending = sampleData.length;
      let insertError = null;

      sampleData.forEach((data, idx) => {
        stmt.run(data, (runErr) => {
          if (runErr && !insertError) {
            insertError = runErr;
          }
          if (--pending === 0) {
            stmt.finalize((finalizeErr) => {
              if (finalizeErr) return reject(finalizeErr);
              if (insertError) return reject(insertError);
              console.log('示例电机数据插入完成');
              checkAndInsertAdmin()
                .then(() => resolve())
                .catch(reject);
            });
          }
        });
      });
    });
  });
}

// 检查并创建管理员
// 密码来源：process.env.ADMIN_PASSWORD；未配置则生成 16 位随机密码，仅首次创建时打印一次
function checkAndInsertAdmin() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) return reject(err);
      if (row.count > 0) {
        console.log('管理员已存在');
        return resolve();
      }

      const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex').slice(0, 16);

      bcrypt.hash(adminPassword, 10, (hashErr, hash) => {
        if (hashErr) return reject(hashErr);
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hash, 'admin'], (insertErr) => {
          if (insertErr) return reject(insertErr);
          if (process.env.ADMIN_PASSWORD) {
            console.log('默认管理员创建成功 → 用户名: admin（密码来自 ADMIN_PASSWORD 环境变量）');
          } else {
            console.log('默认管理员创建成功 → 用户名: admin  密码: ' + adminPassword);
            console.log('【安全提示】请立即登录后台修改该随机密码！');
          }
          resolve();
        });
      });
    });
  });
}

function getDb() {
  if (!db) throw new Error('数据库未初始化');
  return db;
}

// 返回 Promise 的数据库关闭
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (!db) return resolve();
    db.close((err) => {
      if (err) {
        console.error('关闭数据库失败:', err.message);
        return reject(err);
      }
      console.log('数据库已关闭');
      db = null;
      resolve();
    });
  });
}

module.exports = {
  initializeDatabase,
  getDb,
  closeDatabase
};
