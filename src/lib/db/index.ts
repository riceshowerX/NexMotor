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
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建默认管理员（admin/admin123）
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  try {
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hashedPassword, 'admin');
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
