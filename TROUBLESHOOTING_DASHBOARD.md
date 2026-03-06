# 后台仪表盘数据显示为0的问题修复说明

## 问题描述
后台管理仪表盘的数据统计全部显示为0，包括：
- 产品总数：0
- 留言总数：0
- 用户总数：0

## 问题原因
JWT token格式升级导致认证失败：
- **旧版本**：使用 `id` 字段生成JWT payload
- **新版本**：使用 `userId` 字段生成JWT payload

用户在修复前登录的token使用旧格式，导致API验证失败，无法获取数据。

## 解决方案

### 方案1：重新登录（推荐）⭐
1. 点击右上角的"退出"按钮（如果有）
2. 或直接访问登录页面：`http://localhost:5000/login`
3. 使用管理员账号登录：
   - 用户名：`admin`
   - 密码：`admin123`

登录后会自动生成新的JWT token，数据将正常显示。

### 方案2：清除浏览器缓存
1. 打开浏览器开发者工具（F12）
2. 进入 Application 或 存储 标签
3. 找到 Local Storage
4. 删除 `token` 和 `user` 两个键
5. 刷新页面，重新登录

### 方案3：使用隐私模式
1. 打开浏览器的隐私/无痕模式
2. 访问 `http://localhost:5000/login`
3. 登录管理员账号

## 技术细节

### 修复的文件
1. **登录接口** (`src/app/api/auth/login/route.ts`)
   - 修改JWT payload使用 `userId` 字段

2. **认证模块** (`src/lib/auth.ts`)
   - 统一使用 `userId` 字段解析token

3. **登录页面** (`src/app/login/page.tsx`)
   - 登录时自动清除旧token

4. **后台页面** (`src/app/admin/page.tsx`)
   - 添加数据为0时的提示
   - 检测token失效自动跳转登录

5. **AuthContext** (`src/context/AuthContext.tsx`)
   - 添加token自动验证机制

### 验证命令
```bash
# 测试API是否正常（需要有效的token）
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/stats

# 检查数据库中的数据
node -e "const Database = require('better-sqlite3'); const db = new Database('/workspace/projects/data/motors.db'); console.log('Motors:', db.prepare('SELECT COUNT(*) as count FROM motors').get().count); console.log('Messages:', db.prepare('SELECT COUNT(*) as count FROM messages').get().count); db.close();"
```

## 数据验证

实际数据库中的数据：
- ✅ 产品总数：6
- ✅ 留言总数：2
- ✅ 用户总数：1
- ✅ 未读留言：1

API接口正常返回数据，问题仅在前端token认证。

## 预防措施

为避免类似问题，已添加以下机制：
1. **Token自动验证**：AuthContext中验证token有效性
2. **失效自动跳转**：后台页面检测403自动跳转登录
3. **友好提示**：数据为0时显示提示信息
4. **登录清理**：每次登录前清除旧token

## 联系支持
如果问题仍未解决，请检查：
1. 浏览器控制台是否有错误信息
2. 后台日志：`tail -f /app/work/logs/bypass/dev.log`
3. 确认使用正确的管理员账号和密码
