# Electric Motor Selector（在线电机选型系统）

<div align="center">
  <a href="#">
    <img src="frontend/src/assets/logo/logo透明底蓝色1.png" alt="Logo" width="200" height="200">
  </a>
  <p align="center">
    <strong>专业、高效、智能的在线电机选型解决方案</strong>
    <br />
    <br />
    <a href="#">查看演示</a>
    ·
    <a href="#">报告问题</a>
    ·
    <a href="#">贡献代码</a>
  </p>
</div>

## 📋 项目概述

Electric Motor Selector 是一个功能完整的在线电机选型系统，旨在帮助用户快速、准确地选择合适的电机型号。系统提供了直观的用户界面、强大的筛选功能、3D电机查看器以及完整的后台管理系统，适用于电机制造商、分销商和终端用户。

### ✨ 核心优势

- **智能筛选**：支持多维度参数筛选，快速定位目标电机
- **3D可视化**：提供电机3D模型查看，直观了解产品结构
- **多语言支持**：支持中英文切换，满足国际化需求
- **响应式设计**：适配各种设备尺寸，提供良好的移动端体验
- **完整的后台管理**：支持电机信息的CRUD操作，方便数据维护
- **安全认证**：基于JWT的身份验证机制，保障系统安全

## 🛠️ 技术栈

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.0.0 | 前端框架 |
| React Router | ^6.0.0 | 路由管理 |
| Axios | ^1.0.0 | API请求 |
| Ant Design | ^5.0.0 | UI组件库 |
| Tailwind CSS | ^3.0.0 | 样式框架 |
| Vite | ^4.0.0 | 构建工具 |
| Three.js | ^0.160.0 | 3D模型渲染 |
| i18next | ^23.0.0 | 国际化支持 |

### 后端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | ^18.0.0 | 运行环境 |
| Express | ^4.0.0 | Web框架 |
| SQLite | ^3.0.0 | 数据库 |
| JWT | ^9.0.0 | 身份认证 |
| Sequelize | ^6.0.0 | ORM框架 |

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

## 🚀 安装和运行步骤

### 1. 环境准备

确保已安装以下软件：
- Node.js 14.x 或更高版本
- npm 6.x 或更高版本

### 2. 安装依赖

#### 后端依赖

```bash
cd backend
npm install
```

#### 前端依赖

```bash
cd frontend
npm install
```

### 3. 配置环境变量

后端已创建 `.env` 文件，包含以下配置：

```
PORT=5000
JWT_SECRET=your-secret-key-for-jwt-token-generation
JWT_EXPIRES_IN=1h
```

### 4. 初始化数据库

后端启动时会自动执行 `init.sql` 脚本，创建数据库表并插入示例数据。

### 5. 启动服务

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

## 🎯 功能说明

### 🔍 电机选型功能

#### 首页
- 提供直观的电机参数筛选界面
- 支持按功率、电压、转速、机座号等多维度筛选
- 响应式设计，适配各种设备

#### 产品列表页
- 展示筛选后的电机型号
- 支持分页浏览
- 提供电机图片和基本参数预览
- 支持按不同字段排序

#### 产品详情页
- 展示电机完整参数信息
- 集成3D电机查看器，支持旋转、缩放查看
- 提供电机技术文档下载（如果有）
- 支持中英文切换

### 🎨 视觉体验

#### 3D电机查看器
- 基于Three.js实现的3D模型渲染
- 支持模型旋转、缩放
- 提供不同视角预设
- 高质量渲染效果

#### 现代化UI设计
- 采用渐变色彩和现代化卡片设计
- 流畅的动画过渡效果
- 响应式布局，适配各种屏幕尺寸
- 支持深色/浅色主题切换

### 🌐 国际化支持

- 支持中英文双语切换
- 基于i18next的国际化方案
- 可轻松扩展更多语言

### 🔐 认证和授权

- 基于JWT的身份认证
- 安全的密码哈希存储
- 后台管理页面权限控制
- 登录状态持久化

### 📊 后台管理功能

#### 登录页
- 管理员登录界面
- 用户名/密码验证
- 默认账号：admin，密码：admin123

#### 后台管理页
- 电机信息的CRUD操作
- 表格形式展示所有电机数据
- 支持搜索和筛选
- 批量操作功能
- 电机参数编辑界面
- 登出功能

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
   - 在首页输入不同的筛选条件，验证筛选结果是否正确
   - 点击查询按钮，检查是否跳转到产品列表页
   - 检查产品列表的分页功能是否正常

2. **产品详情功能**
   - 点击产品列表中的查看详情按钮，验证是否跳转到详情页
   - 检查详情页的电机参数是否完整显示
   - 测试3D查看器的旋转、缩放功能

3. **后台管理功能**
   - 使用默认账号登录后台
   - 测试添加、编辑、删除电机功能
   - 验证搜索和筛选功能
   - 测试登出功能

4. **国际化功能**
   - 测试语言切换按钮，验证界面语言是否正确切换

### API测试

可以使用Postman或类似工具测试后端API：

1. 测试登录API，获取JWT令牌
2. 使用令牌测试需要认证的API端点
3. 验证所有CRUD操作是否正常工作

## ⚠️ 注意事项

1. 确保Node.js版本在14.x以上
2. 后端服务必须先启动，前端才能正常访问API
3. 默认管理员账号：admin，密码：admin123
4. 数据库会在第一次启动时自动创建
5. 所有API请求都将记录在控制台中，便于调试
6. 3D查看器需要现代浏览器支持WebGL

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
  <p>Made with ❤️ by Electric Motor Selector Team</p>
</div>