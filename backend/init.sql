-- 创建motors表
CREATE TABLE IF NOT EXISTS motors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model TEXT NOT NULL,
  power REAL NOT NULL,
  voltage INTEGER NOT NULL,
  rpm INTEGER NOT NULL,
  frameSize TEXT NOT NULL,
  efficiency REAL,
  description TEXT,
  imageUrl TEXT
);

-- 创建users表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin'
);

-- 插入示例数据
INSERT INTO motors (model, power, voltage, rpm, frameSize, efficiency, description, imageUrl)
VALUES 
('Y160M-4', 11.0, 380, 1460, '160M', 91.5, '三相异步电动机，适用于一般机械设备', 'https://via.placeholder.com/300x200?text=Y160M-4'),
('Y200L1-6', 18.5, 380, 970, '200L1', 92.0, '高效率三相异步电动机，节能型', 'https://via.placeholder.com/300x200?text=Y200L1-6'),
('Y132S1-2', 5.5, 380, 2920, '132S1', 88.5, '高速三相异步电动机', 'https://via.placeholder.com/300x200?text=Y132S1-2'),
('Y180M-4', 18.5, 380, 1470, '180M', 91.0, '中型三相异步电动机', 'https://via.placeholder.com/300x200?text=Y180M-4'),
('Y160L-6', 11.0, 380, 970, '160L', 90.0, '低速三相异步电动机，适用于减速机', 'https://via.placeholder.com/300x200?text=Y160L-6');

-- 插入默认管理员用户（密码：admin123）
INSERT OR IGNORE INTO users (username, password, role)
VALUES ('admin', '$2b$10$EIXZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin');