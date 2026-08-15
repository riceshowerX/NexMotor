// routes/authRoutes.js（修复版：挂载登录/改密限流）
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth'); // JWT 验证中间件
const { loginLimiter, passwordLimiter } = require('../middleware/rateLimit');

/**
 * POST /api/auth/login
 * 登录接口（限流：15 分钟同 IP 最多 20 次）
 */
router.post('/login', loginLimiter, authController.login);

/**
 * GET /api/auth/me
 * 获取当前登录用户信息（需要 token）
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

/**
 * POST /api/auth/change-password
 * 修改密码（需要登录 + 旧密码验证；限流：15 分钟同 IP 最多 10 次）
 */
router.post('/change-password', passwordLimiter, authenticateToken, authController.changePassword);

/**
 * POST /api/auth/logout
 * 退出登录（前端清除 token 即可，后端无状态，这里仅返回成功）
 */
router.post('/logout', authenticateToken, (req, res) => {
  // JWT 是无状态的，退出只需前端删除 token
  res.json({ success: true, message: '已退出登录' });
});

module.exports = router;
