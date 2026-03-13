// server.js（终极生产版）
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const path = require('path');

const { initializeDatabase, closeDatabase } = require('./models/db');
const authRoutes = require('./routes/authRoutes');
const motorRoutes = require('./routes/motorRoutes');

// ==================== 加载配置 ====================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==================== 安全检查：JWT_SECRET 必须强密钥 ====================
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || /your-secret-key/i.test(process.env.JWT_SECRET)) {
  console.error('【致命错误】JWT_SECRET 未正确配置！');
  console.error('请在 .env 文件中设置一个至少 32 位的强随机密钥！');
  console.error('示例：JWT_SECRET=x7kP9mN3qR8vT2wY5zA1cD4fG6hJ9lO0pQ2sU5vX8yZ1B3nM6jL9kI');
  process.exit(1);
}

// ==================== 中间件 ====================
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // 生产建议设置具体域名
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // 防止大文件攻击
app.use(express.urlencoded({ extended: true }));

// ==================== 路由 ====================
app.use('/api/auth', authRoutes);
app.use('/api/motors', motorRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// ==================== 全局错误处理 ====================
app.use((err, req, res, next) => {
  console.error('未捕获错误:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    message,
    // 仅开发环境返回详细错误
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== 启动服务器 ====================
let server;

async function startServer() {
  try {
    await initializeDatabase();
    console.log('✓ 数据库初始化成功');

    if (NODE_ENV === 'production') {
      // 生产环境启用 HTTPS（需配置证书）
      const sslPath = path.resolve(__dirname, 'ssl');
      if (fs.existsSync(path.join(sslPath, 'privkey.pem')) && fs.existsSync(path.join(sslPath, 'fullchain.pem'))) {
        const privateKey = fs.readFileSync(path.join(sslPath, 'privkey.pem'), 'utf8');
        const certificate = fs.readFileSync(path.join(sslPath, 'fullchain.pem'), 'utf8');
        const credentials = { key: privateKey, cert: certificate };

        server = https.createServer(credentials, app);
        server.listen(443, () => {
          console.log('✓ HTTPS 服务器运行在 https://yourdomain.com');
        });
      }
    }

    // HTTP 或开发环境
    const httpServer = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ HTTP 服务器运行在 http://localhost:${PORT}`);
      console.log(`健康检查: http://localhost:${PORT}/health`);
      console.log(`登录接口: POST http://localhost:${PORT}/api/auth/login`);
      console.log(`电机列表: GET http://localhost:${PORT}/api/motors`);
      if (NODE_ENV === 'development') {
        console.log('开发模式已启用');
      }
    });

    server = server || httpServer;

  } catch (error) {
    console.error('✗ 服务器启动失败:', error);
    await closeDatabase();
    process.exit(1);
  }
}

// ==================== 优雅关闭 ====================
async function gracefulShutdown() {
  console.log('\n收到关闭信号，正在优雅关闭...');
  if (server) {
    server.close(async () => {
      await closeDatabase();
      console.log('服务器已安全关闭');
      process.exit(0);
    });
  } else {
    await closeDatabase();
    process.exit(0);
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ==================== 全局异常捕获 ====================
process.on('uncaughtException', async (error) => {
  console.error('未捕获的异常:', error);
  try {
    await closeDatabase();
  } finally {
    process.exit(1);
  }
});

process.on('unhandledRejection', async (reason) => {
  console.error('未处理的 Promise 拒绝:', reason);
  try {
    await closeDatabase();
  } finally {
    process.exit(1);
  }
});

// ==================== 启动 ====================
startServer();