# NexMotor  
**新一代在线电机选型平台**

一个由个人独立完成的全栈开源项目，目标是把繁琐的电机选型手册变成真正好用的交互工具。

![GitHub stars](https://img.shields.io/github/stars/riceshowerX/NexMotor?style=for-the-badge&logo=github&color=1d4ed8)
![GitHub forks](https://img.shields.io/github/forks/riceshowerX/NexMotor?style=for-the-badge&logo=github&color=1d4ed8)
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
| 多维智能筛选         | 功率、电压、转速、机座号、效率、极数等十余项参数实时组合过滤 |
| 交互式 3D 查看器     | 基于 Three.js 的完整 3D 模型，支持旋转、缩放、剖面、细节高亮 |
| 国际化支持           | 中英文无缝切换，已基于 i18next 完成完整翻译，可轻松扩展 |
| 全平台响应式设计     | 桌面端 / 平板 / 手机完美适配                                 |
| 企业级后台管理系统   | 完整的电机数据 CRUD、批量导入导出、图片管理、权限控制        |
| JWT 安全认证         | 管理员专属后台，密码哈希存储 + Token 有效期控制             |

## 技术栈

| 层级   | 技术方案                                   |
| ------ | ------------------------------------------ |
| 前端   | React 18 + Vite 5 + TypeScript             |
| UI     | Ant Design 5 + Tailwind CSS                |
| 3D     | Three.js + React-Three-Fiber + drei       |
| 路由   | React Router 6                             |
| 状态   | Context API + custom hooks                 |
| 国际化 | i18next + react-i18next                    |
| 后端   | Node.js + Express                          |
| 数据库 | SQLite（开发） / 支持迁移至 PostgreSQL     |
| ORM    | Sequelize                                  |
| 认证   | JWT + bcrypt                               |

## 快速开始（≤ 3 分钟）

```bash
# 克隆项目
git clone https://github.com/riceshowerX/NexMotor.git
cd NexMotor

# 启动后端
cd backend
npm install
cp .env.example .env    # 可修改 JWT_SECRET
npm start                # → http://localhost:5000

# 启动前端（另开终端）
cd ../frontend
npm install
npm run dev              # → http://localhost:5173
```

默认管理员账号：`admin` / `admin123`

## 项目结构

```
NexMotor/
├─ backend/          # Express + Sequelize 全栈后端
└─ frontend/         # Vite + React + TypeScript 现代化前端
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
