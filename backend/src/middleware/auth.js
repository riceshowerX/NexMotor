// middleware/auth.js（完美版）
const jwt = require('jsonwebtoken');

// 推荐：把密钥单独放到 .env 文件，永远不要硬编码
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only'; // 开发环境 fallback
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 默认7天，可配置

// JWT验证中间件（增强版）
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问被拒绝：未提供认证令牌',
    });
  }

  jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      // 更精确的错误判断
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: '认证令牌已过期，请重新登录',
        });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({
          success: false,
          message: '认证令牌无效',
        });
      }
      // 其他错误（如密钥错误）
      return res.status(403).json({
        success: false,
        message: '令牌验证失败',
      });
    }

    // decoded 示例：{ id: 1, username: 'admin', role: 'admin', iat: ..., exp: ... }
    req.user = decoded; // 挂载到 req 上，后续路由可用
    next();
  });
}

// 可选：生成 token 的工具函数（方便在登录接口使用）
function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
    algorithm: 'HS256',
  });
}

module.exports = {
  authenticateToken,
  generateToken, // 推荐导出，登录时直接用
};