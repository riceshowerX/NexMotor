# MotorVizSelect - 在线电机选型系统

**专业 · 高效 · 智能的一站式电机选型平台**

为电机制造商、分销商与终端用户打造的现代化在线选型工具，帮助您在海量产品中快速精准匹配最优电机方案。

[![Stars](https://img.shields.io/github/stars/your-username/MotorVizSelect?style=flat-square)](https://github.com/your-username/MotorVizSelect)
[![Forks](https://img.shields.io/github/forks/your-username/MotorVizSelect?style=flat-square)](https://github.com/your-username/MotorVizSelect)
[![License](https://img.shields.io/github/license/your-username/MotorVizSelect?color=%231d4ed8&style=flat-square)](LICENSE)
[![Vite](https://img.shields.io/badge/B-built%20with%20Vite-646CFF?logo=vite&style=flat-square)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-%2361DAFB?logo=react&style=flat-square)](https://react.dev/)

<p align="center">
  <a href="https://your-demo-url.com" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; box-shadow: 0 4px 14px rgba(29,78,216,0.3); transition: all 0.3s;">
    🚀 立即体验在线演示
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/your-username/MotorVizSelect/issues" style="color: #475569; text-decoration: none; font-weight: 500;">
    🐛 报告问题
  </a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="https://github.com/your-username/MotorVizSelect/pulls" style="color: #475569; text-decoration: none; font-weight: 500;">
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
| 🛡️ **安全认证**    | JWT + 密码哈希，权限严格控制，后 管理员专属后台               |
| ⚙️ **完整后台管理** | 电机数据 CRUD、批量操作、搜索排序、图片上传一应俱全           |

## 🖼️ 产品截图

<div align="center">
  <img src="https://your-screenshot-host.com/screenshot-home.jpg" alt="首页" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin: 20px 0;" />
  <img src="https://your-screenshot-host.com/screenshot-3d.jpg" alt="3D查看器" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin: 20px 0;" />
  <img src="https://your-screenshot-host.com/screenshot-admin.jpg" alt="后台管理" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin: 20px 0;" />
</div>

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
git clone https://github.com/your-username/MotorVizSelect.git
cd MotorVizSelect

# 后端
cd backend
npm install
cp .env.example .env    # 修改 JWT_SECRET 等配置
npm start               # 默认运行在 http://localhost:5000

# 前端（另开终端）
cd ../frontend
npm install
npm run dev             # 默认运行在 http://localhost:5173
```

> 默认管理员账号：`admin` / `admin123`

## 📂 项目结构

```
MotorVizSelect/
├── backend/          # Express + SQLite 后端
├── frontend/         # Vite + React 前端
└── README.md
```

## 🔗 API 快速参考

| 方法 | 路由               | 功能             | 需认证 |
|------|--------------------|------------------|--------|
| POST | `/auth/login`      | 用户登录         | 否     |
| GET  | `/motors`          | 获取电机列表     | 否     |
| GET  | `/motors/:id`      | 获取电机详情     | 否     |
| POST | `/motors`          | 新增电机         | 是     |
| PUT  | `/motors/:id`      | 更新电机         | 是     |
| DELETE | `/motors/:id`    | 删除电机         | 是     |

## 🤝 参与贡献

我们非常欢迎任何形式的贡献！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing`)
3. 提交修改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing`)
5. 开启 Pull Request

## ⚠️ 注意事项

- 确保 Node.js ≥ 18
- 首次启动后端会自动创建 `motors.db` 并初始化数据
- 3D 查看器需要支持 WebGL 的现代浏览器
- 生产环境建议替换 SQLite 为 PostgreSQL/MySQL

## 📄 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源，欢迎自由使用与二次开发。

---

<div align="center">
  <strong>让电机选型更简单、更智能</strong><br/>
  MotorVizSelect —— 您的专业选型助手
</div>
