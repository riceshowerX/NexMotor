// userModel.js（完美版：修复问题 + 最佳实践）
const { getDb } = require('./db');
const bcrypt = require('bcryptjs');

// 根据用户名查找用户
function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get('SELECT id, username, password, role FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('查询用户失败:', err.message);
        reject(err);
      } else {
        resolve(row || null);  // ← 修复：明确返回 null 而不是 undefined
      }
    });
  });
}

// 根据ID查找用户
function getUserByUsernameById(id) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get('SELECT id, username, password, role FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('根据ID查询用户失败:', err.message);
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

// 创建新用户（管理员后台用，不对外开放）
async function createUser(username, password, role = 'admin') {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('密码加密失败:', err);
        return reject(err);
      }

      const db = getDb();
      db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role],
        function(err) {
          if (err) {
            // ← 修复：更友好的错误提示（用户名重复时）
            if (err.message.includes('UNIQUE constraint failed')) {
              reject(new Error('用户名已存在'));
            } else {
              reject(err);
            }
          } else {
            resolve({ id: this.lastID, username, role });
          }
        }
      );
    });
  });
}

// 验证用户密码（登录用）
async function validatePassword(username, password) {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return false; // 用户不存在
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      // ← 最佳实践：返回用户对象但不包含密码
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
    return false;
  } catch (err) {
    console.error('验证密码时出错:', err);
    return false;
  }
}

// 可选：修改密码（未来扩展用）
async function changePassword(userId, oldPassword, newPassword) {
  const user = await getUserByUsernameById(userId); // 你可以再加一个按ID查的函数
  if (!user) return false;

  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) return false;

  const hashed = await bcrypt.hash(newPassword, 10);
  return new Promise((resolve, reject) => {
    getDb().run('UPDATE users SET password = ? WHERE id = ?', [hashed, userId], function(err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
}

module.exports = {
  getUserByUsername,
  getUserByUsernameById,
  createUser,
  validatePassword,
  changePassword
};