# NexMotor 全面审查与修复交付报告

> 交付总监：齐活林（Qi）· 软件开发团队
> 日期：2026-08-16
> 交付状态：✅ 全部完成 | 测试通过率：后端 13/13 | 遗留 P0/P1：0

---

## TL;DR

对 NexMotor 项目执行了全栈审查（代码质量 / Bug / 安全 / 性能 / 架构），修复了 **20+ 项后端问题**（含 3 个 P0 阻断级缺陷），**整体重建了完全缺失的前端**（36 个文件，含多维筛选 / 3D 查看器 / 中英文国际化 / 管理后台），清理了仓库中另一项目的全部残留文件，并通过 QA 独立全链路验证 + 缺陷修复闭环。

---

## 一、审查发现（按严重级别）

### P0 阻断级（3 项，修复前即导致功能/部署失败）

| # | 问题 | 影响 |
|---|---|---|
| 1 | **前端 src/ 源码 100% 缺失**（无任何 .jsx/.tsx 文件） | 前端完全无法构建运行，项目不可用 |
| 2 | **CORS `origin:'*'` + `credentials:true` 非法组合** | 浏览器规范禁止二者并存，带凭据请求被拦截，登录/CRUD 全失效 |
| 3 | **db.js 初始化 Promise 竞态**（建表 Promise 在异步回调前 resolve）+ **HTTPS/HTTP 双监听**（生产有证书时同时监听 443 与 5000） | 表创建失败被静默吞掉；双监听端口冲突、优雅关闭只关一个 |

### P1 高风险（7 项）

- 默认管理员 admin/admin123 硬编码并打印日志（已知默认凭据）
- 无登录限流（暴力破解风险）
- middleware/auth.js 存在 fallback secret（若 .env 缺失可伪造 token）
- 依赖过旧：express 4.18.2（path-to-regexp ReDoS CVE）、jsonwebtoken 9.0.1
- **筛选参数"解析但不消费"**：controller 解析 current/powerFactor/noise/mounting/connection，模型层静默忽略（"10+ 参数筛选"名不副实）
- 前端 package.json 无 i18next（README 却称已完成国际化）
- README 存在未解决的 Git 合并冲突标记，且描述与实际技术栈严重不符（称 TS/Sequelize/PostgreSQL，实际 JS/原生 SQL/SQLite）

### P2/P3 可维护性问题（10+ 项）

- addMotor/updateMotor 数字校验 100 行重复代码；UNIQUE 判断依赖 SQLite 错误消息字符串
- 非法数字筛选参数返回空结果而非 400；id 校验不一致；closeDatabase 非 Promise
- 生产日志打印完整 SQL；废弃 verifyToken 死代码；内联 require
- 双数据库冲突（backend/motors.db vs data/motors.db 属不同项目）；motors.db 含 7 条测试垃圾数据
- 依赖审计 16 个漏洞（多为 sqlite3 构建链传递性）；无任何测试；.env.example 缺失

---

## 二、修复内容

### 后端（backend/，10 个源文件 + 新增 2 个）

| 文件 | 修复内容 |
|---|---|
| `src/server.js` | CORS 白名单化（开发回退 localhost:3000/5173、生产读 CORS_ORIGIN，去除 credentials）；HTTPS/HTTP 二选一；挂载 helmet；优雅关闭真等待；导出 app 供测试 |
| `src/models/db.js` | 建表 Promise 竞态修复（串行化）；升级逻辑改 PRAGMA 查列补列；**新增 model 唯一索引迁移**（去重 + CREATE UNIQUE INDEX，重复提交返回 409）；ADMIN_PASSWORD 环境变量（未配置则生成 16 位随机密码，仅首次打印）；DB_PATH 支持测试库；closeDatabase 返回 Promise |
| `src/models/motorModel.js` | 补全 5 项筛选（current/powerFactor/noise 区间 + mounting/connection 等值）；SQL 日志改为 LOG_SQL 条件打印 |
| `src/controllers/motorController.js` | 提取 `parseAndValidateMotorInput` 消除 100 行重复；非法数字参数 → 400（含负数拒绝）；UNIQUE 改用 error.code；update/delete 补 id 校验 |
| `src/controllers/authController.js` | 顶部统一 require；删除废弃 verifyToken 死代码 |
| `src/middleware/auth.js` | 删除 fallback secret，缺失即抛错 |
| `src/middleware/rateLimit.js`（新增） | 登录限流 20 次/15 分钟、改密 10 次（429） |
| `src/routes/authRoutes.js` | 挂载限流 |
| `package.json` | express 4.21.2 / jsonwebtoken 9.0.2 / 新增 helmet、express-rate-limit、supertest（sqlite3 5.1.7 保留避免原生模块破坏性升级）；test 脚本 |
| `test/api.test.js`（新增） | 13 项冒烟测试（health/CRUD/鉴权/限流/非法参数/筛选） |
| `.env.example`（新增） | 全部配置项模板与说明 |

### 前端（frontend/，整体重建 36 个文件）

- **技术栈决策**：保持 JavaScript（JSX），不引入 TypeScript —— 现有依赖栈无 TS 配置、无历史类型债务，迁移成本大于收益；未来可平滑迁移
- 路由 8 条：`/`、`/catalog`、`/motors/:id`、`/viewer/:id`、`/login`、`/admin`、`/about`、`*`404
- **FilterPanel 16 项筛选**全部映射后端参数（对照 API 契约表），含防抖 300ms
- **3D 查看器**：R3F + drei 占位电机模型（机壳/端盖/风罩/接线盒/底座/转子），旋转/缩放/剖面/悬停高亮 + 部件标签 + "演示模型"标注（真实 GLB 资产列为二期）
- **i18n**：i18next + react-i18next，zh/en 各 163 键，全站切换 + localStorage 持久 + antd 组件语言联动
- **后台管理**：登录 / AuthContext(token 持久化 + /me 会话恢复) / ProtectedRoute / CRUD 表格 + 新增编辑 Modal 表单 + 修改密码

### 仓库清理

- 删除 coze 模板全部残留（根 package.json、next.config.ts、components.json、tsconfig.json、pnpm-lock.yaml、TROUBLESHOOTING_DASHBOARD.md、data/ 等 11 项）
- 重写 README.md（消除冲突标记，按实际技术栈描述）
- 清理 motors.db 7 条测试垃圾数据（保留合法示例）

---

## 三、QA 独立验证结果（全链路）

- **后端 11 项全 PASS**：health/helmet 头/CRUD/16 项筛选/非法参数 400/鉴权 401/限流 429/改密/404/13 项测试/垃圾数据清理
- **前端 6 项全 PASS**：build 成功/路由 8 条可达/代理链路联通/代码结构符合设计/拦截器与会话恢复正确
- **缺陷修复闭环**：P1（model 唯一索引，重复提交 409）+ P2-1（筛选枚举对齐种子值）+ P2-2（CORS 占位符回退）→ 修复后复验全过

---

## 四、重构决策说明

1. **前端整体重建而非修补**：源码完全缺失，无法增量修复；依据 README 功能描述 + 后端 API 契约从零实现，功能范围与描述一致
2. **后端限定修复不做架构重构**：现有 routes→controllers→models 三层结构合理，仅消除重复/竞态/安全缺陷，控制回归风险；不引入 ORM
3. **保持 JavaScript 不迁 TypeScript**：成本 > 收益（见上）
4. **sqlite3 5.1.7 不升级**：npm audit 的 critical 漏洞集中在构建链（tar/cacache，仅安装期触发），升级 6.x 属破坏性变更且不影响运行时；已记录二期评估
5. **随机管理员密码**：消除已知默认凭据风险，密码仅在首次启动日志打印一次

---

## 五、遗留事项（二期建议）

| 项 | 说明 |
|---|---|
| 3D 真实模型 | 占位几何体 → 需真实电机 GLB 资产 |
| 批量导入导出/图片上传/多角色权限 | 后端无对应接口，需新增 |
| 数据库种子数据完整性 | motors 表专业字段（poles/current/mounting 等）为 0/NULL，需真实电机数据 |
| 前端组件测试 | Vitest + RTL（本期仅后端冒烟测试） |
| 生产部署 | 配置真实 CORS_ORIGIN 白名单 + HTTPS 证书（src/ssl/）+ 反向代理 |

## 六、启动方式

```bash
# 后端（端口 5000，管理员密码见首次启动日志）
cd backend && npm install && npm start

# 前端（端口 3000，/api 自动代理到 5000）
cd frontend && npm install && npm run dev
```
