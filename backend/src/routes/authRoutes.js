// routes/auth.js（完整生产版）
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth'); // JWT 验证中间件

/**
 * POST /api/auth/login
 * 登录接口
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/me
 * 获取当前登录用户信息（需要 token）
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

/**
 * POST /api/auth/change-password
 * 修改密码（需要登录 + 旧密码验证）
 */
router.post('/change-password', authenticateToken, authController.changePassword);

/**
 * POST /api/auth/logout
 * 退出登录（前端清除 token 即可，后端无状态，这里仅返回成功）
 * 可选：如果你用黑名单机制，可在这里加入
 */
router.post('/logout', authenticateToken, (req, res) => {
  // JWT 是无状态的，退出只需前端删除 token
  res.json({ success: true, message: '已退出登录' });
});

module.exports = router;