# MotorVizSelect（在线电机选型系统）

<div align="center">
  <a href="#">
    <img src="frontend/src/assets/logo/logo透明底蓝色1.png" alt="Logo" width="180" height="180">
  </a>
  <h2 align="center" style="margin: 0; font-weight: 600; color: #1a56db;">
    专业、高效、智能的在线电机选型解决方案
  </h2>
  <p align="center" style="margin: 8px 0 20px; color: #64748b;">
    为电机制造商、分销商和终端用户提供一站式选型服务
  </p>
  <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
    <a href="#" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: linear-gradient(135deg, #1a56db, #3b82f6); color: white; text-decoration: none; border-radius: 8px; font-weight: 500; transition: all 0.3s ease;">
      🚀 查看演示
    </a>
    <a href="#" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #f1f5f9; color: #334155; text-decoration: none; border-radius: 8px; font-weight: 500; transition: all 0.3s ease;">
      🐛 报告问题
    </a>
    <a href="#" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #f1f5f9; color: #334155; text-decoration: none; border-radius: 8px; font-weight: 500; transition: all 0.3s ease;">
      💡 贡献代码
    </a>
  </div>
</div>

## 📋 项目概述

MotorVizSelect 是一个功能完整的在线电机选型系统，旨在帮助用户快速、准确地选择合适的电机型号。系统提供了直观的用户界面、强大的筛选功能、3D电机查看器以及完整的后台管理系统，适用于电机制造商、分销商和终端用户。

### ✨ 核心优势

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin: 20px 0;">
  <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 12px; border: 1px solid #bae6fd;">
    <div style="font-size: 24px; margin-bottom: 12px;">🎯</div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #0c4a6e;">智能筛选</h3>
    <p style="margin: 0; color: #475569; font-size: 14px;">支持多维度参数筛选，快速定位目标电机</p>
  </div>
  <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); padding: 20px; border-radius: 12px; border: 1px solid #fbcfe8;">
    <div style="font-size: 24px; margin-bottom: 12px;">🔮</div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #7c2d12;">3D可视化</h3>
    <p style="margin: 0; color: #475569; font-size: 14px;">提供电机3D模型查看，直观了解产品结构</p>
  </div>
  <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0;">
    <div style="font-size: 24px; margin-bottom: 12px;">🌐</div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #166534;">多语言支持</h3>
    <p style="margin: 0; color: #475569; font-size: 14px;">支持中英文切换，满足国际化需求</p>
  </div>
  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border: 1px solid #fcd34d;">
    <div style="font-size: 24px; margin-bottom: 12px;">📱</div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #92400e;">响应式设计</h3>
    <p style="margin: 0; color: #475569; font-size: 14px;">适配各种设备尺寸，提供良好的移动端体验</p>
  </div>
  <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); padding: 20px; border-radius: 12px; border: 1px solid #e9d5ff;">
    <div style="font-size: 24px; margin-bottom: 12px;">🛡️</div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #581c87;">安全认证</h3>
    <p style="margin: 0; color: #475569; font-size: 14px;">基于JWT的身份验证机制，保障系统安全</p>
  </div>
  <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 20px; border-radius: 12px; border: 1px solid #fecaca;">
    <div style="font-size: 24px; margin-bottom: 12px;">📊</div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #991b1b;">完整后台管理</h3>
    <p style="margin: 0; color: #475569; font-size: 14px;">支持电机信息的CRUD操作，方便数据维护</p>
  </div>
</div>

## 🛠️ 技术栈

### 前端技术

<div style="overflow-x: auto; margin: 20px 0;">
  <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
    <thead style="background: linear-gradient(135deg, #1a56db, #3b82f6); color: white;">
      <tr>
        <th style="padding: 12px; text-align: left; font-weight: 600;">技术</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">版本</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">用途</th>
      </tr>
    </thead>
    <tbody style="background: white;">
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">React</td>
        <td style="padding: 12px; color: #64748b;">^18.0.0</td>
        <td style="padding: 12px; color: #64748b;">前端框架</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">React Router</td>
        <td style="padding: 12px; color: #64748b;">^6.0.0</td>
        <td style="padding: 12px; color: #64748b;">路由管理</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Axios</td>
        <td style="padding: 12px; color: #64748b;">^1.0.0</td>
        <td style="padding: 12px; color: #64748b;">API请求</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Ant Design</td>
        <td style="padding: 12px; color: #64748b;">^5.0.0</td>
        <td style="padding: 12px; color: #64748b;">UI组件库</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Tailwind CSS</td>
        <td style="padding: 12px; color: #64748b;">^3.0.0</td>
        <td style="padding: 12px; color: #64748b;">样式框架</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Vite</td>
        <td style="padding: 12px; color: #64748b;">^4.0.0</td>
        <td style="padding: 12px; color: #64748b;">构建工具</td>
      </tr>
      <tr style="transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Three.js</td>
        <td style="padding: 12px; color: #64748b;">^0.160.0</td>
        <td style="padding: 12px; color: #64748b;">3D模型渲染</td>
      </tr>
    </tbody>
  </table>
</div>

### 后端技术

<div style="overflow-x: auto; margin: 20px 0;">
  <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
    <thead style="background: linear-gradient(135deg, #166534, #22c55e); color: white;">
      <tr>
        <th style="padding: 12px; text-align: left; font-weight: 600;">技术</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">版本</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">用途</th>
      </tr>
    </thead>
    <tbody style="background: white;">
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Node.js</td>
        <td style="padding: 12px; color: #64748b;">^18.0.0</td>
        <td style="padding: 12px; color: #64748b;">运行环境</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Express</td>
        <td style="padding: 12px; color: #64748b;">^4.0.0</td>
        <td style="padding: 12px; color: #64748b;">Web框架</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">SQLite</td>
        <td style="padding: 12px; color: #64748b;">^3.0.0</td>
        <td style="padding: 12px; color: #64748b;">数据库</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">JWT</td>
        <td style="padding: 12px; color: #64748b;">^9.0.0</td>
        <td style="padding: 12px; color: #64748b;">身份认证</td>
      </tr>
      <tr style="transition: background-color 0.2s;">
        <td style="padding: 12px; font-weight: 500;">Sequelize</td>
        <td style="padding: 12px; color: #64748b;">^6.0.0</td>
        <td style="padding: 12px; color: #64748b;">ORM框架</td>
      </tr>
    </tbody>
  </table>
</div>

## 📁 项目结构

```
├── backend/           # 后端代码
│   ├── src/           # 源代码目录
│   │   ├── controllers/  # 控制器
│   │   │   ├── authController.js   # 认证控制器
│   │   │   └── motorController.js  # 电机控制器
│   │   ├── middleware/   # 中间件
│   │   │   └── auth.js             # 认证中间件
│   │   ├── models/       # 数据模型
│   │   │   ├── db.js               # 数据库连接
│   │   │   ├── motorModel.js       # 电机模型
│   │   │   └── user.js             # 用户模型
│   │   ├── routes/       # 路由
│   │   │   ├── authRoutes.js       # 认证路由
│   │   │   └── motorRoutes.js      # 电机路由
│   │   └── server.js      # 后端入口
│   ├── .env              # 环境变量
│   ├── debug-db.js       # 数据库调试工具
│   ├── init.sql          # 数据库初始化脚本
│   ├── motors.db         # SQLite数据库文件
│   └── package.json      # 依赖配置
├── frontend/          # 前端代码
│   ├── src/           # 源代码目录
│   │   ├── assets/       # 静态资源
│   │   │   └── logo/      # 项目Logo
│   │   ├── components/   # 组件
│   │   │   ├── 3d/        # 3D相关组件
│   │   │   │   └── Motor3DViewer.jsx  # 电机3D查看器
│   │   │   └── ui/        # UI组件
│   │   │       ├── GradientButton.jsx  # 渐变按钮
│   │   │       ├── LanguageSwitch.jsx  # 语言切换
│   │   │       └── ModernCard.jsx      # 现代卡片
│   │   ├── context/       # 上下文管理
│   │   │   ├── AuthContext.jsx     # 认证上下文
│   │   │   └── LanguageContext.jsx # 语言上下文
│   │   ├── hooks/         # 自定义钩子
│   │   │   └── useTranslation.js   # 翻译钩子
│   │   ├── locales/       # 国际化资源
│   │   │   ├── en-US.js   # 英文资源
│   │   │   └── zh-CN.js   # 中文资源
│   │   ├── pages/         # 页面组件
│   │   │   ├── AdminPage.jsx        # 后台管理页
│   │   │   ├── HomePage.jsx         # 首页
│   │   │   ├── LoginPage.jsx        # 登录页
│   │   │   ├── ProductDetailPage.jsx # 产品详情页
│   │   │   ├── ProductEditPage.jsx  # 产品编辑页
│   │   │   └── ProductListPage.jsx  # 产品列表页
│   │   ├── services/      # API服务
│   │   │   └── api.js      # API请求封装
│   │   ├── theme/         # 主题管理
│   │   │   ├── globalStyles.js  # 全局样式
│   │   │   ├── index.js         # 主题入口
│   │   │   └── variables.js     # 主题变量
│   │   ├── utils/         # 工具函数
│   │   │   └── auth.js     # 认证工具
│   │   ├── App.jsx        # 应用主组件
│   │   ├── index.css      # 全局CSS
│   │   └── main.jsx       # 前端入口
│   ├── index.html         # HTML模板
│   ├── package.json       # 依赖配置
│   ├── postcss.config.js  # PostCSS配置
│   ├── tailwind.config.js # Tailwind配置
│   └── vite.config.js     # Vite配置
└── README.md          # 项目说明文档
```

## 🚀 快速开始

### 1. 环境准备

确保已安装以下软件：
- Node.js 14.x 或更高版本
- npm 6.x 或更高版本

### 2. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 配置环境变量

后端已创建 `.env` 文件，包含以下配置：

```env
PORT=5000
JWT_SECRET=your-secret-key-for-jwt-token-generation
JWT_EXPIRES_IN=1h
```

### 4. 启动服务

#### 启动后端服务

```bash
cd backend
npm start
```

后端服务将在 `http://localhost:5000` 启动。

#### 启动前端服务

```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:5173` 启动。

## 🎯 核心功能

### 🔍 电机选型功能

- **智能筛选**：按功率、电压、转速、机座号等多维度筛选
- **产品列表**：分页展示，支持排序和快速预览
- **产品详情**：完整参数展示，3D模型查看，技术文档下载

### 🎨 视觉体验

- **3D电机查看器**：基于Three.js实现，支持旋转、缩放
- **现代化UI**：渐变色彩、流畅动画、响应式布局
- **主题切换**：支持深色/浅色主题

### 🌐 国际化支持

- 中英文双语切换
- 基于i18next的国际化方案
- 易于扩展更多语言

### 🔐 认证和授权

- JWT身份认证
- 安全密码哈希存储
- 后台管理权限控制
- 登录状态持久化

### 📊 后台管理

- 电机信息CRUD操作
- 表格展示与批量操作
- 搜索和筛选功能
- 直观的编辑界面

## 📡 API文档

### 认证相关API

| HTTP方法 | 路径 | 功能 | 认证要求 |
|----------|------|------|----------|
| POST | /auth/login | 用户登录 | 否 |

### 电机相关API

| HTTP方法 | 路径 | 功能 | 认证要求 |
|----------|------|------|----------|
| GET | /motors | 获取电机列表（支持筛选） | 否 |
| GET | /motors/:id | 获取单个电机详情 | 否 |
| POST | /motors | 添加新电机 | 是 |
| PUT | /motors/:id | 更新电机信息 | 是 |
| DELETE | /motors/:id | 删除电机 | 是 |

## 🗄️ 数据库结构

### motors表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增 |
| model | TEXT | 电机型号 |
| power | REAL | 功率（kW） |
| voltage | INTEGER | 电压（V） |
| rpm | INTEGER | 转速（r/min） |
| frameSize | TEXT | 机座号 |
| efficiency | REAL | 效率（%） |
| description | TEXT | 描述 |
| imageUrl | TEXT | 图片URL |

### users表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增 |
| username | TEXT | 用户名 |
| password | TEXT | 哈希后的密码 |

## 🧪 测试指南

### 功能测试

1. **电机选型功能**
   - 在首页输入不同筛选条件，验证结果准确性
   - 测试产品列表分页和排序功能
   - 验证3D查看器的旋转、缩放功能

2. **后台管理功能**
   - 使用默认账号登录：admin / admin123
   - 测试电机信息的增删改查
   - 验证搜索和筛选功能

3. **国际化功能**
   - 测试语言切换按钮，验证界面语言切换

### API测试

使用Postman或类似工具测试后端API：
1. 测试登录API，获取JWT令牌
2. 使用令牌测试需要认证的API端点
3. 验证所有CRUD操作

## ⚠️ 注意事项

- 确保Node.js版本在14.x以上
- 后端服务必须先启动，前端才能正常访问API
- 默认管理员账号：admin，密码：admin123
- 数据库会在第一次启动时自动创建
- 3D查看器需要现代浏览器支持WebGL

## 📄 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。

## 🤝 贡献指南

欢迎对本项目进行贡献！贡献前请阅读以下指南：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

## 📧 联系方式

如有问题或建议，欢迎联系我们：

- 项目维护者：[Your Name]
- 邮箱：[your.email@example.com]
- 项目地址：[GitHub Repository URL]

## 🙏 致谢

感谢所有为本项目做出贡献的开发者和支持者！

---

<div align="center">
  <p style="margin: 0; color: #64748b; font-size: 14px;">
    Made with ❤️ by Electric Motor Selector Team
  </p>
</div>
