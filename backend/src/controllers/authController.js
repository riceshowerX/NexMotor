// src/controllers/authController.js（完整版，必须导出所有函数！）
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../models/user'); // 你的文件叫 user.js
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 安全检查
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('【致命错误】JWT_SECRET 配置错误！请设置强密钥！');
  process.exit(1);
}

// ==================== 登录 ====================
const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ success: false, message: '用户名和密码不能为空' });

    const user = await validatePassword(username.trim(), password);
    if (!user) return res.status(401).json({ success: false, message: '用户名或密码错误' });

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role || 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username, role: user.role || 'admin' },
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// ==================== 获取当前用户信息 ====================
const getCurrentUser = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.userId,
      username: req.user.username,
      role: req.user.role || 'admin',
    },
  });
};

// ==================== 修改密码（必须有！）===================
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: '旧密码和新密码不能为空' });
    
    // 验证新密码强度
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: '新密码长度不能少于6位' });
    
    // 获取当前用户信息
    const user = await require('../models/user').getUserByUsernameById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: '用户不存在' });
    
    // 验证旧密码是否正确
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: '旧密码错误' });
    
    // 更新密码
    const result = await require('../models/user').changePassword(req.user.userId, oldPassword, newPassword);
    if (!result) return res.status(500).json({ success: false, message: '密码修改失败' });
    
    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// ==================== JWT 验证中间件 ====================
// 注意：此中间件已废弃，建议使用 middleware/auth.js 中的 authenticateToken
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: '无效令牌' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = {
  login,
  verifyToken, // 保留以兼容旧代码
  getCurrentUser,      // ← 必须导出！
  changePassword,      // ← 必须导出！不然又报错
};