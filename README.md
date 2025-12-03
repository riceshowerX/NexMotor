
# NexMotor - 在线电机选型系统

**专业 · 高效 · 智能的一站式电机选型平台**

为电机制造商、分销商与终端用户打造的现代化在线选型工具，帮助您在海量产品中快速精准匹配最优电机方案。

[![Stars](https://img.shields.io/github/stars/riceshowerX/NexMotor?style=flat-square)](https://github.com/riceshowerX/NexMotor)
[![Forks](https://img.shields.io/github/forks/riceshowerX/NexMotor?style=flat-square)](https://github.com/riceshowerX/NexMotor)
[![License](https://img.shields.io/github/license/riceshowerX/NexMotor?color=%231d4ed8&style=flat-square)](LICENSE)
[![Vite](https://img.shields.io/badge/Built%20with%20Vite-646CFF?logo=vite&style=flat-square)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-%2361DAFB?logo=react&style=flat-square)](https://react.dev/)

<p align="center">
  <a href="#" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; box-shadow: 0 4px 14px rgba(29,78,216,0.3); transition: all 0.3s;">
    🚀 立即体验在线演示（待部署）
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/riceshowerX/NexMotor/issues" style="color: #475569; text-decoration: none; font-weight: 500;">
    🐛 报告问题
  </a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="https://github.com/riceshowerX/NexMotor/pulls" style="color: #475569; text-decoration: none; font-weight: 500;">
    💡 贡献代码
  </a>
</p>

## ✨ 核心功能亮点

| 功能               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| 🎯 **智能多维筛选** | 功率、电压、转速、机座号、效率等参数实时组合筛选，秒级响应     |
| 🔮 **3D 交互查看**  | 基于 Three.js 的全交互 3D 模型，支持旋转、缩放、细节高亮       |
| 🌍 **中英文切换**   | 开箱即用的完整国际化（i18next），轻松扩展更多语言             |
| 📱 **全平台响应式** | 完美适配 PC、平板、手机，提供一致流畅体验                    |
| 🛡️ **安全认证**    | JWT + 密码哈希，管理员专属后台                               |
| ⚙️ **完整后台管理** | 电机数据 CRUD、批量操作、搜索排序、图片/文档上传一应俱全      |

## 🛠️ 技术栈

### 前端
| 技术           | 版本       | 用途                     |
| -------------- | ---------- | ------------------------ |
| React          | ^18.3.0    | 核心框架                 |
| Vite           | ^5.0.0     | 极致快速构建工具         |
| React Router   | ^6.0.0     | 路由管理                 |
| Ant Design     | ^5.0.0     | 企业级 UI 组件           |
| Tailwind CSS   | ^3.4.0     | 原子化样式               |
| Three.js       | ^0.160.0   | 3D 渲染引擎              |
| Axios          | ^1.7.0     | API 请求                 |
| i18next        | ^23.0.0    | 国际化方案               |

### 后端
| 技术       | 版本     | 用途                     |
| ---------- | -------- | ------------------------ |
| Node.js    | ≥18      | 运行时环境               |
| Express    | ^4.19.0  | Web 框架                 |
| SQLite     | -        | 轻量级嵌入式数据库       |
| Sequelize  | ^6.37.0  | ORM                      |
| JWT        | ^9.0.0   | 认证令牌                 |

## 📦 快速开始

```bash
# 克隆项目
git clone https://github.com/riceshowerX/NexMotor.git
cd NexMotor

# 后端
cd backend
npm install
cp .env.example .env    # 修改 JWT_SECRET 等配置
npm start               # 默认 http://localhost:5000

# 前端（另开终端）
cd ../frontend
npm install
npm run dev             # 默认 http://localhost:5173
```

> 默认管理员账号：`admin` / `admin123`

## 📂 项目结构

```
NexMotor/
├── backend/          # Express + SQLite 后端
├── frontend/         # Vite + React 前端
└── README.md
```

## 🔗 API 快速参考

| 方法   | 路由              | 功能           | 需认证 |
| ------ | ----------------- | -------------- | ------ |
| POST   | `/auth/login`     | 用户登录       | 否     |
| GET    | `/motors`         | 获取电机列表   | 否     |
| GET    | `/motors/:id`     | 获取电机详情   | 否     |
| POST   | `/motors`         | 新增电机       | 是     |
| PUT    | `/motors/:id`     | 更新电机       | 是     |
| DELETE | `/motors/:id`     | 删除电机       | 是     |


## ⚠️ 免责声明与重要说明

**本项目为个人业余时间开发的开源学习/展示项目**，旨在探索现代 Web 技术在工业选型场景中的应用，**不构成任何形式的商业产品或正式技术支持服务**。

- 项目中所有电机参数、3D 模型、性能曲线等仅为演示用途，不代表任何真实产品的实际性能，请勿用于工程设计、采购决策或生产环境。
- 部分功能可能仍在开发或实验阶段，存在 Bug 或未完成状态。
- 虽已实现基础安全措施，但仍属学习级代码，**请勿直接部署到公网或承载真实业务**。
- 作者对因使用本项目产生的任何直接或间接损失不承担责任。

如需在企业/正式项目中使用，欢迎在此基础上进行二次开发，但请自行完成充分测试、验证与安全加固。


## 📄 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源，欢迎自由使用与二次开发。

---

<div align="center">
  <strong>让电机选型更简单、更智能</strong><br/>
  NexMotor —— 您的专业选型助手（个人开源项目）
</div>
