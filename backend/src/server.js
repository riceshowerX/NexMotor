// server.js（修复版：CORS 白名单 / HTTPS 二选一 / helmet / 优雅关闭）
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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

// ==================== CORS 配置 ====================
// 本项目 token 走 Authorization 头，不需要 credentials（cookie），因此移除 credentials:true
// 开发环境允许前端常用端口；生产环境读取 CORS_ORIGIN（逗号分隔白名单）
// P2-2 修复：CORS_ORIGIN 缺失或仍为占位符（如 yourdomain.com）时回退到开发白名单，
// 避免本地以 production 启动时浏览器带 Origin 请求被 403 拦截。
function buildCorsOrigins() {
  const raw = process.env.CORS_ORIGIN;
  const hasRealOrigin = raw && !/yourdomain\.com/i.test(raw);
  if (hasRealOrigin) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (hasRealOrigin === false && NODE_ENV === 'production') {
    // 生产环境配置了占位符视为未配置
    console.warn('【警告】CORS_ORIGIN 未配置或仍为占位符，已回退到开发白名单！生产部署请务必设置真实域名。');
  }
  return ['http://localhost:3000', 'http://localhost:5173'];
}

const allowedOrigins = buildCorsOrigins();

app.use(cors({
  origin(origin, callback) {
    // 无 Origin 的请求（同源/curl/服务器间调用）直接放行
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS 策略禁止该来源访问'));
  },
}));

// ==================== 安全中间件 ====================
app.use(helmet());

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
  // CORS 拒绝产生的错误走这里
  if (err && err.message && err.message.startsWith('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }

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
let server = null;

async function startServer() {
  try {
    await initializeDatabase();
    console.log('✓ 数据库初始化成功');

    // 生产环境且证书存在 → 仅启动 HTTPS(443)；否则 → 仅启动 HTTP(PORT)。二选一，绝不双监听。
    const useHttps = NODE_ENV === 'production';
    const sslPath = path.resolve(__dirname, 'ssl');
    const hasCert = fs.existsSync(path.join(sslPath, 'privkey.pem')) && fs.existsSync(path.join(sslPath, 'fullchain.pem'));

    if (useHttps && hasCert) {
      const privateKey = fs.readFileSync(path.join(sslPath, 'privkey.pem'), 'utf8');
      const certificate = fs.readFileSync(path.join(sslPath, 'fullchain.pem'), 'utf8');
      const credentials = { key: privateKey, cert: certificate };

      server = https.createServer(credentials, app);
      server.listen(443, () => {
        console.log('✓ HTTPS 服务器运行在 https://yourdomain.com');
        console.log('健康检查: https://yourdomain.com/health');
        console.log('登录接口: POST https://yourdomain.com/api/auth/login');
        console.log('电机列表: GET https://yourdomain.com/api/motors');
      });
    } else {
      server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`✓ HTTP 服务器运行在 http://localhost:${PORT}`);
        console.log(`健康检查: http://localhost:${PORT}/health`);
        console.log(`登录接口: POST http://localhost:${PORT}/api/auth/login`);
        console.log(`电机列表: GET http://localhost:${PORT}/api/motors`);
        if (NODE_ENV === 'development') {
          console.log('开发模式已启用');
        }
      });
    }
  } catch (error) {
    console.error('✗ 服务器启动失败:', error);
    await closeDatabase();
    process.exit(1);
  }
}

// ==================== 优雅关闭 ====================
async function gracefulShutdown() {
  console.log('\n收到关闭信号，正在优雅关闭...');
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
    // closeDatabase 现返回 Promise，真正等待数据库关闭
    await closeDatabase();
    console.log('服务器已安全关闭');
    process.exit(0);
  } catch (error) {
    console.error('优雅关闭出错:', error);
    process.exit(1);
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
// 仅当作为主模块直接运行时启动服务（测试中 require 时导出 app 供 supertest 使用）
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
