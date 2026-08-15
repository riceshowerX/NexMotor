<div align="center">

**简体中文 | [English](./README.en.md)**

# ⚙️ NexMotor

**新一代在线电机选型平台**

把繁琐的电机选型手册，变成真正好用的交互工具 —— 智能筛选、3D 可视化、中英双语、完整后台管理。

![License](https://img.shields.io/github/license/riceshowerX/NexMotor?style=for-the-badge&color=1d4ed8)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-0.160-000000?style=for-the-badge&logo=three.js)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [技术栈](#-技术栈) • [API 概览](#-api-概览) • [项目结构](#-项目结构) • [贡献指南](#-贡献指南) • [许可证](#-许可证与版权)

---

**智能筛选 · 3D 可视化 · 中英文切换 · 全平台响应式 · 完整后台管理**

</div>

---

## ✨ 功能特性

| 功能 | 说明 |
| --- | --- |
| 📊 **多维智能筛选** | 功率、电压、转速、机座号、效率、额定电流、功率因数、噪声等 16 项参数实时组合过滤，支持区间、模糊匹配与多字段排序 |
| 🧊 **交互式 3D 查看器** | 基于 Three.js 的 3D 电机模型，支持旋转、缩放、剖面查看与部件高亮（演示模型） |
| 🌐 **国际化支持** | 基于 i18next 的中英文无缝切换，语言偏好本地持久化，antd 组件语言自动联动 |
| 📱 **全平台响应式** | 桌面端 / 平板 / 手机完美适配，移动端友好 |
| 🛠 **企业级后台管理** | 完整的电机数据增删改查（CRUD），支持新增、编辑、删除与修改密码 |
| 🔐 **JWT 安全认证** | 管理员专属后台，bcrypt 密码哈希存储 + Token 有效期控制 + 登录限流防护 |

## 🛠 技术栈

| 层级 | 技术方案 |
| --- | --- |
| 前端框架 | React 18 + Vite 5 + JavaScript（JSX） |
| UI 组件 | Ant Design 5 + Tailwind CSS 3 |
| 3D 渲染 | Three.js + React Three Fiber + drei |
| 路由 | React Router 6 |
| 状态管理 | Context API + 自定义 Hooks |
| 国际化 | i18next + react-i18next |
| 后端 | Node.js + Express |
| 数据库 | SQLite（原生 SQL，参数化查询） |
| 安全认证 | JWT + bcrypt + helmet + 速率限制 |

## 🚀 快速开始

### 环境要求

- **Node.js ≥ 18**（推荐 20+）
- npm ≥ 9（随 Node.js 附带）

### 安装与启动（约 3 分钟）

```bash
# 1. 克隆项目
git clone https://github.com/riceshowerX/NexMotor.git
cd NexMotor

# 2. 启动后端（端口 5000）
cd backend
npm install
cp .env.example .env    # 按需修改 JWT_SECRET 等配置
npm start               # → http://localhost:5000

# 3. 启动前端（另开终端，端口 3000）
cd ../frontend
npm install
npm run dev             # → http://localhost:3000
```

### 登录后台

- 管理员用户名：`admin`
- 密码：**首次启动时自动生成**的随机密码，见后端启动日志
- ⚠️ **登录后请立即修改默认密码**

> 💡 前端开发服务器已配置 `/api` 代理至后端 `http://localhost:5000`，开发环境无需额外配置跨域。

## 📡 API 概览

### 接口列表

| 方法 | 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| GET | `/health` | 健康检查 | 否 |
| GET | `/api/motors` | 电机列表 + 多维筛选 | 否 |
| GET | `/api/motors/:id` | 电机详情 | 否 |
| POST | `/api/motors` | 新增电机 | ✅ |
| PUT | `/api/motors/:id` | 更新电机 | ✅ |
| DELETE | `/api/motors/:id` | 删除电机 | ✅ |
| POST | `/api/auth/login` | 管理员登录 | 否 |
| GET | `/api/auth/me` | 当前用户信息 | ✅ |
| POST | `/api/auth/change-password` | 修改密码 | ✅ |
| POST | `/api/auth/logout` | 退出登录 | ✅ |

### 筛选参数（GET `/api/motors`）

| 类型 | 参数 |
| --- | --- |
| 精确匹配 | `voltage`、`frameSize`、`poles`、`ip`、`insulation`、`frequency`、`mounting`、`connection` |
| 区间匹配 | `power_min/power_max`、`rpm_min/rpm_max`、`efficiency_min/efficiency_max`、`current_min/current_max`、`powerFactor_min`、`noise_max` |
| 模糊搜索 | `model`、`description` |
| 排序 | `sortBy`（如 `power_desc`、`rpm_asc`、`efficiency_desc`） |

## 📁 项目结构

```
NexMotor/
├── backend/                # Node.js + Express + SQLite 后端
│   ├── src/
│   │   ├── server.js       # 应用入口：CORS / HTTPS / 优雅关闭 / 全局异常处理
│   │   ├── routes/         # 路由层（auth / motors）
│   │   ├── controllers/    # 控制器层（参数校验 + 业务编排）
│   │   ├── middleware/     # JWT 认证 + 登录限流
│   │   └── models/         # 数据访问层（db / motorModel / user）
│   └── test/               # 冒烟测试（node:test + supertest，13 项）
└── frontend/               # Vite + React 前端
    └── src/
        ├── pages/          # 页面（首页 / 选型列表 / 详情 / 3D 查看器 / 登录 / 后台）
        ├── components/     # 组件（布局 / 电机 / 3D 查看器 / 通用）
        ├── api/            # axios 封装与拦截器
        ├── context/        # AuthContext 登录态管理
        ├── hooks/          # 自定义 Hooks（useMotors 等）
        ├── i18n/           # 中英文翻译资源
        └── utils/          # 常量与格式化工具
```

## 💻 常用命令

```bash
# ── 后端 ─────────────────────────────
cd backend
npm start        # 启动生产服务（:5000）
npm run dev      # 开发模式（nodemon 热重载）
npm test         # 运行冒烟测试

# ── 前端 ─────────────────────────────
cd frontend
npm run dev      # 启动开发服务器（:3000）
npm run build    # 生产构建（输出 dist/）
```

## 🤝 贡献指南

欢迎通过以下方式参与本项目：

1. **报告问题**：[GitHub Issues](https://github.com/riceshowerX/NexMotor/issues) —— 提交 Bug、功能建议或文档改进
2. **提交代码**：[Pull Requests](https://github.com/riceshowerX/NexMotor/pulls) —— Fork 后修改，提交前请确保：
   - 后端改动通过 `npm test`
   - 前端改动通过 `npm run build`
   - 保持代码风格与现有代码一致

## ⚠️ 免责声明

- 本项目为个人业余时间独立开发与维护的开源作品，**所有电机参数、3D 模型与图片仅为演示用途，不代表任何真实产品的性能或技术指标**。
- 项目功能已达到可完整运行状态，但仍处于持续迭代阶段，可能存在未发现的缺陷。
- 安全机制为学习级实现，**生产环境部署前请自行完成完整的安全加固、性能压测与合规评估**。
- 本项目按「原样」（AS IS）提供，**不附带任何明示或默示的担保**。作者对因直接或间接使用本项目导致的任何后果（包括但不限于数据丢失、业务损失、法律风险）不承担责任。
- 欢迎学习、参考、Fork 或在此基础上进行企业内部部署与二次开发。

## 📄 许可证与版权

本项目采用 [MIT License](LICENSE) 开源，允许**自由使用、修改、分发与商用**，仅需保留版权声明与许可证文本。

**Copyright © 2026 riceshowerX**

### 商标声明

本项目为独立开源作品，与任何品牌无隶属、赞助或背书关系。文档中提及的 React、Vite、Three.js、Ant Design、Tailwind CSS、i18next、Node.js、Express、SQLite 等名称均为其各自所有者的商标或注册商标，仅用于技术描述之目的。

---

<div align="center">

**一个人也可以把事情做到极致**

NexMotor —— 由兴趣驱动，追求极致的个人全栈作品

[⭐ 觉得不错就给个 Star 吧](https://github.com/riceshowerX/NexMotor)

</div>
