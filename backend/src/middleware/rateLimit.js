// middleware/rateLimit.js（新建：登录/改密限流）
const rateLimit = require('express-rate-limit');

// 登录限流：15 分钟内同 IP 最多 20 次
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 20,
  standardHeaders: true, // 返回 RateLimit-* 响应头
  legacyHeaders: false,
  message: { success: false, message: '尝试过于频繁，请稍后再试' },
});

// 修改密码限流：15 分钟内同 IP 最多 10 次
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: '尝试过于频繁，请稍后再试' },
});

module.exports = {
  loginLimiter,
  passwordLimiter,
};
