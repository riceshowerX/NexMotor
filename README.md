<<<<<<< HEAD
# projects

这是一个基于 [Next.js 16](https://nextjs.org) + [shadcn/ui](https://ui.shadcn.com) 的全栈应用项目，由扣子编程 CLI 创建。

## 快速开始

### 启动开发服务器

```bash
coze dev
```

启动后，在浏览器中打开 [http://localhost:5000](http://localhost:5000) 查看应用。

开发服务器支持热更新，修改代码后页面会自动刷新。

### 构建生产版本

```bash
coze build
```

### 启动生产服务器

```bash
coze start
```
=======
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
>>>>>>> 9d67fbdfee47b2a2ebf8e10f1345fbdc47c9ec35

## 项目结构

```
<<<<<<< HEAD
src/
├── app/                      # Next.js App Router 目录
│   ├── layout.tsx           # 根布局组件
│   ├── page.tsx             # 首页
│   ├── globals.css          # 全局样式（包含 shadcn 主题变量）
│   └── [route]/             # 其他路由页面
├── components/              # React 组件目录
│   └── ui/                  # shadcn/ui 基础组件（优先使用）
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── lib/                     # 工具函数库
│   └── utils.ts            # cn() 等工具函数
└── hooks/                   # 自定义 React Hooks（可选）
```

## 核心开发规范

### 1. 组件开发

**优先使用 shadcn/ui 基础组件**

本项目已预装完整的 shadcn/ui 组件库，位于 `src/components/ui/` 目录。开发时应优先使用这些组件作为基础：

```tsx
// ✅ 推荐：使用 shadcn 基础组件
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>标题</CardHeader>
      <CardContent>
        <Input placeholder="输入内容" />
        <Button>提交</Button>
      </CardContent>
    </Card>
  );
}
```

**可用的 shadcn 组件清单**

- 表单：`button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`
- 布局：`card`, `separator`, `tabs`, `accordion`, `collapsible`, `scroll-area`
- 反馈：`alert`, `alert-dialog`, `dialog`, `toast`, `sonner`, `progress`
- 导航：`dropdown-menu`, `menubar`, `navigation-menu`, `context-menu`
- 数据展示：`table`, `avatar`, `badge`, `hover-card`, `tooltip`, `popover`
- 其他：`calendar`, `command`, `carousel`, `resizable`, `sidebar`

详见 `src/components/ui/` 目录下的具体组件实现。

### 2. 路由开发

Next.js 使用文件系统路由，在 `src/app/` 目录下创建文件夹即可添加路由：

```bash
# 创建新路由 /about
src/app/about/page.tsx

# 创建动态路由 /posts/[id]
src/app/posts/[id]/page.tsx

# 创建路由组（不影响 URL）
src/app/(marketing)/about/page.tsx

# 创建 API 路由
src/app/api/users/route.ts
```

**页面组件示例**

```tsx
// src/app/about/page.tsx
import { Button } from '@/components/ui/button';

export const metadata = {
  title: '关于我们',
  description: '关于页面描述',
};

export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <Button>了解更多</Button>
    </div>
  );
}
```

**动态路由示例**

```tsx
// src/app/posts/[id]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>文章 ID: {id}</div>;
}
```

**API 路由示例**

```tsx
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ users: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true });
}
```

### 3. 依赖管理

**必须使用 pnpm 管理依赖**

```bash
# ✅ 安装依赖
pnpm install

# ✅ 添加新依赖
pnpm add package-name

# ✅ 添加开发依赖
pnpm add -D package-name

# ❌ 禁止使用 npm 或 yarn
# npm install  # 错误！
# yarn add     # 错误！
```

项目已配置 `preinstall` 脚本，使用其他包管理器会报错。

### 4. 样式开发

**使用 Tailwind CSS v4**

本项目使用 Tailwind CSS v4 进行样式开发，并已配置 shadcn 主题变量。

```tsx
// 使用 Tailwind 类名
<div className="flex items-center gap-4 p-4 rounded-lg bg-background">
  <Button className="bg-primary text-primary-foreground">
    主要按钮
  </Button>
</div>

// 使用 cn() 工具函数合并类名
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  condition && "conditional-class",
  className
)}>
  内容
</div>
```

**主题变量**

主题变量定义在 `src/app/globals.css` 中，支持亮色/暗色模式：

- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`

### 5. 表单开发

推荐使用 `react-hook-form` + `zod` 进行表单开发：

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  username: z.string().min(2, '用户名至少 2 个字符'),
  email: z.string().email('请输入有效的邮箱'),
});

export default function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '' },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('username')} />
      <Input {...form.register('email')} />
      <Button type="submit">提交</Button>
    </form>
  );
}
```

### 6. 数据获取

**服务端组件（推荐）**

```tsx
// src/app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store', // 或 'force-cache'
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

**客户端组件**

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

## 常见开发场景

### 添加新页面

1. 在 `src/app/` 下创建文件夹和 `page.tsx`
2. 使用 shadcn 组件构建 UI
3. 根据需要添加 `layout.tsx` 和 `loading.tsx`

### 创建业务组件

1. 在 `src/components/` 下创建组件文件（非 UI 组件）
2. 优先组合使用 `src/components/ui/` 中的基础组件
3. 使用 TypeScript 定义 Props 类型

### 添加全局状态

推荐使用 React Context 或 Zustand：

```tsx
// src/lib/store.ts
import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### 集成数据库

推荐使用 Prisma 或 Drizzle ORM，在 `src/lib/db.ts` 中配置。

## 技术栈

- **框架**: Next.js 16.1.1 (App Router)
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS v4
- **表单**: React Hook Form + Zod
- **图标**: Lucide React
- **字体**: Geist Sans & Geist Mono
- **包管理器**: pnpm 9+
- **TypeScript**: 5.x

## 参考文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)

## 重要提示

1. **必须使用 pnpm** 作为包管理器
2. **优先使用 shadcn/ui 组件** 而不是从零开发基础组件
3. **遵循 Next.js App Router 规范**，正确区分服务端/客户端组件
4. **使用 TypeScript** 进行类型安全开发
5. **使用 `@/` 路径别名** 导入模块（已配置）
=======
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
>>>>>>> 9d67fbdfee47b2a2ebf8e10f1345fbdc47c9ec35
