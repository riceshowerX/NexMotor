// 数据库连接和初始化
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'motors.db');

// 确保数据目录存在
import { mkdirSync } from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!require('fs').existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

export function getDb() {
  return new Database(dbPath);
}

export function initializeDatabase() {
  const db = getDb();

  // 创建用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT DEFAULT '',
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建默认管理员（admin/admin123）
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  try {
    db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)').run('admin', 'admin@nexmotor.com', hashedPassword, 'admin');
  } catch (err) {
    // 用户已存在，忽略错误
  }

  // 创建电机表
  db.exec(`
    CREATE TABLE IF NOT EXISTS motors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      frameSize TEXT,
      power REAL,
      voltage INTEGER,
      current REAL,
      rpm INTEGER,
      efficiency REAL,
      powerFactor REAL,
      frequency INTEGER,
      poles INTEGER,
      ip TEXT,
      insulation TEXT,
      mounting TEXT,
      weight REAL,
      connection TEXT,
      lockedRotorTorque REAL,
      maxTorque REAL,
      startingCurrent REAL,
      noise REAL,
      description TEXT,
      imageUrl TEXT
    )
  `);

  // 创建留言表
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      reply TEXT,
      replied_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建系统配置表
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建轮播图表
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      subtitle TEXT,
      image_url TEXT,
      link_url TEXT,
      order_num INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建公告表
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_active INTEGER DEFAULT 1,
      priority INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入默认系统配置
  const defaultConfigs = [
    { key: 'site_title', value: 'NexMotor - 新一代在线电机选型平台', description: '网站标题' },
    { key: 'site_description', value: '智能筛选 · 3D 可视化 · 中英文切换 · 全平台响应式', description: '网站描述' },
    { key: 'contact_email', value: 'contact@nexmotor.com', description: '联系邮箱' },
    { key: 'contact_phone', value: '+86 021-12345678', description: '联系电话' },
    { key: 'contact_address', value: '上海市浦东新区张江高科技园区XX路XX号', description: '公司地址' },
    { key: 'company_name', value: 'NexMotor 电机有限公司', description: '公司名称' },
  ];

  const insertConfig = db.prepare('INSERT OR IGNORE INTO system_config (key, value, description) VALUES (?, ?, ?)');
  const insertConfigMany = db.transaction((configs: any[]) => {
    for (const config of configs) {
      insertConfig.run(config.key, config.value, config.description);
    }
  });
  insertConfigMany(defaultConfigs);

  // 插入示例数据（如果表为空）
  const count = db.prepare('SELECT COUNT(*) as count FROM motors').get() as { count: number };
  if (count.count === 0) {
    const sampleMotors = [
      {
        model: 'Y2-90S-2',
        frameSize: '90S',
        power: 1.5,
        voltage: 380,
        current: 3.4,
        rpm: 2840,
        efficiency: 82.5,
        powerFactor: 0.85,
        frequency: 50,
        poles: 2,
        ip: 'IP54',
        insulation: 'F',
        mounting: 'B3',
        weight: 22,
        connection: 'Y',
        lockedRotorTorque: 2.2,
        maxTorque: 2.3,
        startingCurrent: 7,
        noise: 68,
        description: '三相异步电动机，适用于一般传动',
        imageUrl: null
      },
      {
        model: 'Y2-90L-2',
        frameSize: '90L',
        power: 2.2,
        voltage: 380,
        current: 4.7,
        rpm: 2840,
        efficiency: 84,
        powerFactor: 0.86,
        frequency: 50,
        poles: 2,
        ip: 'IP54',
        insulation: 'F',
        mounting: 'B3',
        weight: 25,
        connection: 'Y',
        lockedRotorTorque: 2.2,
        maxTorque: 2.3,
        startingCurrent: 7,
        noise: 70,
        description: '三相异步电动机，适用于一般传动',
        imageUrl: null
      },
      {
        model: 'Y2-100L-2',
        frameSize: '100L',
        power: 3,
        voltage: 380,
        current: 6.2,
        rpm: 2870,
        efficiency: 85.5,
        powerFactor: 0.87,
        frequency: 50,
        poles: 2,
        ip: 'IP54',
        insulation: 'F',
        mounting: 'B3',
        weight: 34,
        connection: 'Y',
        lockedRotorTorque: 2.2,
        maxTorque: 2.3,
        startingCurrent: 7,
        noise: 74,
        description: '三相异步电动机，适用于一般传动',
        imageUrl: null
      }
    ];

    const insert = db.prepare(`
      INSERT INTO motors (
        model, frameSize, power, voltage, current, rpm, efficiency, powerFactor,
        frequency, poles, ip, insulation, mounting, weight, connection,
        lockedRotorTorque, maxTorque, startingCurrent, noise, description, imageUrl
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const insertMany = db.transaction((motors: any[]) => {
      for (const motor of motors) {
        insert.run(
          motor.model, motor.frameSize, motor.power, motor.voltage, motor.current,
          motor.rpm, motor.efficiency, motor.powerFactor, motor.frequency, motor.poles,
          motor.ip, motor.insulation, motor.mounting, motor.weight, motor.connection,
          motor.lockedRotorTorque, motor.maxTorque, motor.startingCurrent,
          motor.noise, motor.description, motor.imageUrl
        );
      }
    });

    insertMany(sampleMotors);
  }

  db.close();
}
