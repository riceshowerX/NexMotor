// check-admin.js  （检查 admin 用户是否存在及密码是否正确）
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const chalk = require('chalk'); // 可选：美化控制台输出（需 npm i chalk）

const dbPath = path.resolve(__dirname, 'motors.db');
console.log(chalk.cyan('正在连接数据库:'), dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(chalk.red('✗ 数据库连接失败:'), err.message);
    process.exit(1);
  }
  console.log(chalk.green('✓ 数据库连接成功'));
});

db.get('SELECT id, username, password, role FROM users WHERE username = ?', ['admin'], (err, row) => {
  if (err) {
    console.error(chalk.red('✗ 查询用户失败:'), err.message);
    db.close();
    return;
  }

  if (!row) {
    console.log(chalk.yellow('⚠ 未找到用户: admin'));
    console.log(chalk.gray('提示：首次运行时会自动创建 admin 用户（密码 admin123）'));
    db.close();
    return;
  }

  console.log(chalk.green('✓ 找到管理员用户！'));
  console.log(`   ID      : ${chalk.bold(row.id)}`);
  console.log(`   用户名   : ${chalk.bold(row.username)}`);
  console.log(`   角色     : ${chalk.bold(row.role || 'admin')}`);
  console.log(`   密码哈希 : ${row.password.substring(0, 15)}...`);

  // 验证默认密码 admin123 是否正确
  bcrypt.compare('admin123', row.password, (compareErr, isValid) => {
    if (compareErr) {
      console.error(chalk.red('✗ 密码验证失败:'), compareErr.message);
    } else if (isValid) {
      console.log(chalk.green('✓ 默认密码 admin123 正确！可以登录'));
      console.log(chalk.cyan('   登录地址: http://localhost:5000'));
      console.log(chalk.cyan('   用户名   : admin'));
      console.log(chalk.cyan('   密码     : admin123'));
      console.log(chalk.yellow('\n⚠️ 安全警告：请立即登录后台修改默认密码！'));
    } else {
      console.log(chalk.magenta('✓ 默认密码已修改，当前 admin123 无效（非常好！）'));
    }

    db.close((closeErr) => {
      if (closeErr) console.error(chalk.red('关闭数据库失败:'), closeErr.message);
      else console.log(chalk.gray('\n数据库连接已关闭'));
    });
  });
});