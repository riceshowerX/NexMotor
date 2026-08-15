# NexMotor

**新一代在线电机选型平台**

一个由个人独立完成的全栈开源项目，目标是把繁琐的电机选型手册变成真正好用的交互工具。

![License](https://img.shields.io/github/license/riceshowerX/NexMotor?style=for-the-badge&color=1d4ed8)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-r150-000?style=for-the-badge&logo=three.js)

<p align="center">
  <a href="#">本地运行即完整演示</a>
  <strong> • </strong>
  <a href="https://github.com/riceshowerX/NexMotor/issues">报告问题</a>
  <strong> • </strong>
  <a href="https://github.com/riceshowerX/NexMotor/pulls">贡献代码</a>
</p>

<p align="center">
  <strong>智能筛选 • 3D 可视化 • 中英文切换 • 全平台响应式 • 完整后台管理</strong>
</p>

## 核心功能一览

| 功能                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| 多维智能筛选         | 功率、电压、转速、机座号、效率、额定电流、功率因数、噪声等十余项参数实时组合过滤 |
| 交互式 3D 查看器     | 基于 Three.js 的 3D 查看器，支持旋转、缩放、剖面、细节高亮 |
| 国际化支持           | 中英文无缝切换（i18next） |
| 全平台响应式设计     | 桌面端 / 平板 / 手机完美适配 |
| 企业级后台管理系统   | 完整的电机数据 CRUD 管理 |
| JWT 安全认证         | 管理员专属后台，密码哈希存储 + Token 有效期控制 |

## 技术栈

| 层级   | 技术方案                                   |
| ------ | ------------------------------------------ |
| 前端   | React 18 + Vite 5 + JavaScript（JSX）      |
| UI     | Ant Design 5 + Tailwind CSS 3              |
| 3D     | Three.js + React-Three-Fiber + drei        |
| 路由   | React Router 6                             |
| 状态   | Context API + custom hooks                 |
| 国际化 | i18next + react-i18next                    |
| 后端   | Node.js + Express                           |
| 数据库 | SQLite（原生 SQL）                         |
| 认证   | JWT + bcrypt                               |

## 快速开始（≤ 3 分钟）

```bash
# 克隆项目
git clone https://github.com/riceshowerX/NexMotor.git
cd NexMotor

# 启动后端
cd backend
npm install
cp .env.example .env    # 按需修改 JWT_SECRET 等配置
npm start               # → http://localhost:5000

# 启动前端（另开终端）
cd ../frontend
npm install
npm run dev             # → http://localhost:3000
```

默认管理员账号：`admin`，密码为**首次启动时自动生成**的随机密码（见后端启动日志，登录后请尽快修改）。

> 前端开发服务器端口为 3000（见 `frontend/vite.config.js`），已配置 `/api` 代理至后端 5000 端口。

## 项目结构

```
NexMotor/
├─ backend/          # Node.js + Express + SQLite 后端
│  ├─ src/
│  │  ├─ server.js            # 启动 / CORS / HTTPS / 优雅关闭
│  │  ├─ routes/              # 路由层（auth / motors）
│  │  ├─ controllers/         # 控制器层（参数校验 + 业务编排）
│  │  ├─ middleware/          # JWT 认证 + 登录限流
│  │  └─ models/              # 数据访问层（db / motorModel / user）
│  └─ test/                   # node:test + supertest 冒烟测试
└─ frontend/         # Vite + React 现代化前端
   └─ src/
      ├─ pages/               # 页面（首页 / 选型列表 / 详情 / 3D / 登录 / 后台）
      ├─ components/          # 组件（布局 / 电机 / 3D 查看器 / 通用）
      ├─ api/                 # axios 封装
      ├─ context/             # AuthContext 登录态
      ├─ hooks/               # useMotors 等自定义 Hook
      ├─ i18n/                # 中英文翻译
      └─ utils/               # 常量与格式化工具
```

## 后端 API 概览

| 方法   | 路径                     | 说明               | 鉴权 |
| ------ | ------------------------ | ------------------ | ---- |
| GET    | `/health`                | 健康检查           | 否   |
| GET    | `/api/motors`            | 电机列表 + 多维筛选 | 否   |
| GET    | `/api/motors/:id`        | 电机详情           | 否   |
| POST   | `/api/motors`            | 新增电机           | 是   |
| PUT    | `/api/motors/:id`        | 更新电机           | 是   |
| DELETE | `/api/motors/:id`        | 删除电机           | 是   |
| POST   | `/api/auth/login`        | 登录               | 否   |
| GET    | `/api/auth/me`           | 当前用户信息       | 是   |
| POST   | `/api/auth/change-password` | 修改密码        | 是   |
| POST   | `/api/auth/logout`       | 退出登录           | 是   |

筛选参数（GET `/api/motors`）：`model`、`description`（模糊）、`power_min/power_max`、`voltage`、`rpm_min/rpm_max`、`frameSize`、`poles`、`ip`、`insulation`、`frequency`、`efficiency_min/efficiency_max`、`current_min/current_max`、`powerFactor_min`、`noise_max`、`mounting`、`connection`、`sortBy`。

## 常用命令

```bash
# 后端
cd backend
npm start          # 启动服务（:5000）
npm test           # 运行冒烟测试（node:test + supertest）
npm run dev        # 开发模式（nodemon 热重载）

# 前端
cd frontend
npm run dev        # 开发服务器（:3000）
npm run build      # 生产构建
```

## 重要声明

本项目为个人在业余时间独立开发与维护的开源作品，具备以下特性：

- 所有电机参数、3D 模型、图片仅为演示用途，不代表任何真实产品性能。
- 功能已达到可完整运行状态，但仍处于持续迭代阶段。
- 安全机制为学习级实现，生产环境请自行完成完整的安全加固与测试。
- 作者对因直接使用本项目导致的任何后果不承担责任。

欢迎学习、参考、fork 或在此基础上进行企业内部部署与二次开发。

## 许可证

采用 [Apache License 2.0](LICENSE) 开源
允许商业使用、修改、分发，仅需保留版权与许可证声明。

---

<div align="center">
  <strong>一个人也可以把事情做到极致</strong><br/>
  NexMotor —— 由兴趣驱动，追求极致的个人全栈作品
</div>

<p align="center">
  <a href="https://github.com/riceshowerX/NexMotor">
    <img src="https://img.shields.io/static/v1?label=&message=Give%20a%20Star%20if%20you%20like%20it!&color=1d4ed8&style=for-the-badge" alt="Star this repo">
  </a>
</p>
