# Chris Know - 项目结构说明

## 📋 项目概述

**Chris Know** 是一个基于 React + TypeScript + CloudBase 构建的现代化个人博客系统，采用简约极简的 Editorial/Magazine 设计风格，支持暗色/亮色主题切换，具备完整的文章管理、评论系统和统计功能。

## 🗂️ 完整目录结构

```
chris-know/
│
├── public/                          # 静态资源目录
│   └── vite.svg                     # Vite 图标
│
├── src/                             # 源代码目录
│   │
│   ├── assets/                      # 静态资源（图片、字体等）
│   │
│   ├── components/                  # React 组件库
│   │   │
│   │   ├── comment/                 # 评论相关组件
│   │   │   ├── CommentForm.tsx      # 评论表单（提交新评论/回复）
│   │   │   ├── CommentItem.tsx      # 单条评论展示（含回复按钮）
│   │   │   └── CommentList.tsx      # 评论列表容器（递归渲染嵌套评论）
│   │   │
│   │   ├── common/                  # 通用公共组件
│   │   │   ├── Empty.tsx            # 空状态组件
│   │   │   ├── Loading.tsx          # 加载中状态组件
│   │   │   ├── Pagination.tsx       # 分页器组件
│   │   │   ├── StatsOverview.tsx    # 统计概览卡片（总文章数/浏览量/评论数/点赞数）
│   │   │   └── ThemeToggle.tsx      # 主题切换按钮（暗色/亮色）
│   │   │
│   │   ├── layout/                  # 布局框架组件
│   │   │   ├── Footer.tsx           # 页脚（版权信息）
│   │   │   ├── Header.tsx           # 页头（导航栏 + Logo + 主题切换）
│   │   │   └── Layout.tsx           # 主布局容器（Header + Content + Footer）
│   │   │
│   │   ├── post/                    # 文章相关组件
│   │   │   ├── PostCard.tsx         # 文章卡片（缩略图 + 标题 + 摘要）
│   │   │   ├── PostDetail.tsx       # 文章详情（Markdown 渲染 + 代码高亮）
│   │   │   └── PostList.tsx         # 文章列表容器（网格布局）
│   │   │
│   │   └── sidebar/                 # 侧边栏组件
│   │       ├── CategoryNav.tsx      # 分类导航（显示分类 + 文章数量）
│   │       ├── ProfileCard.tsx      # 个人信息卡片（头像 + 昵称 + 简介 + 社交链接）
│   │       ├── SearchBar.tsx        # 搜索框（全文搜索）
│   │       └── TagCloud.tsx         # 标签云（标签 + 文章数量）
│   │
│   ├── config/                      # 配置文件
│   │   └── cloudbase.ts             # CloudBase SDK 初始化配置
│   │
│   ├── contexts/                    # React Context 上下文
│   │   └── ThemeContext.tsx         # 主题上下文（管理暗色/亮色主题状态）
│   │
│   ├── data/                        # 数据相关文件
│   │   ├── initData.ts              # 初始化数据（文章、分类、标签、评论）
│   │   └── mockData.ts              # Mock 数据（开发测试用）
│   │
│   ├── pages/                       # 页面组件
│   │   ├── HomePage.tsx             # 首页（文章列表 + 侧边栏）
│   │   ├── PostDetailPage.tsx       # 文章详情页（文章内容 + 评论区）
│   │   ├── CategoryPage.tsx         # 分类页（按分类筛选文章）
│   │   ├── TagPage.tsx              # 标签页（按标签筛选文章）
│   │   └── AboutPage.tsx            # 关于我页面（个人简介 + 技能 + 社交链接）
│   │
│   ├── services/                    # 数据服务层（与 CloudBase 交互）
│   │   ├── postService.ts           # 文章服务（查询、创建、更新文章）
│   │   ├── categoryService.ts       # 分类服务（查询所有分类）
│   │   ├── tagService.ts            # 标签服务（查询所有标签）
│   │   ├── commentService.ts        # 评论服务（查询、创建、删除评论）
│   │   └── statisticsService.ts     # 统计服务（查询全站统计数据）
│   │
│   ├── types/                       # TypeScript 类型定义
│   │   └── index.ts                 # 全局类型（Post、Category、Tag、Comment、Statistics 等）
│   │
│   ├── App.tsx                      # 根组件（路由配置 + 主题 Provider）
│   ├── main.tsx                     # 应用入口文件（ReactDOM.render）
│   ├── index.css                    # 全局样式（Tailwind CSS 引入 + 自定义样式）
│   └── vite-env.d.ts                # Vite 类型声明文件
│
├── dist/                            # 构建产物目录（.gitignore）
│
├── node_modules/                    # 依赖包目录（.gitignore）
│
├── .env                             # 环境变量配置（CloudBase 环境 ID）
├── .gitignore                       # Git 忽略文件配置
├── eslint.config.js                 # ESLint 配置
├── index.html                       # HTML 入口文件
├── package.json                     # 项目依赖和脚本配置
├── package-lock.json                # 依赖锁文件
├── postcss.config.js                # PostCSS 配置
├── README.md                        # 项目说明文档
├── tailwind.config.js               # Tailwind CSS 配置
├── tsconfig.json                    # TypeScript 配置（根配置）
├── tsconfig.app.json                # TypeScript 配置（应用代码）
├── tsconfig.node.json               # TypeScript 配置（Vite 配置文件）
└── vite.config.ts                   # Vite 构建工具配置
```

## 📁 核心目录详解

### 1. `/src/components/` - 组件库

#### 🗨️ `comment/` - 评论模块
| 文件 | 说明 | 主要功能 |
|-----|------|---------|
| `CommentForm.tsx` | 评论表单组件 | 提交新评论、回复评论 |
| `CommentItem.tsx` | 单条评论组件 | 展示评论内容、时间、回复按钮 |
| `CommentList.tsx` | 评论列表组件 | 递归渲染嵌套评论树 |

#### 🧩 `common/` - 通用组件
| 文件 | 说明 | 使用场景 |
|-----|------|---------|
| `Empty.tsx` | 空状态组件 | 无数据时展示（如：暂无文章） |
| `Loading.tsx` | 加载中组件 | 数据加载时展示 Loading 动画 |
| `Pagination.tsx` | 分页器组件 | 文章列表分页、评论分页 |
| `StatsOverview.tsx` | 统计卡片组件 | 显示全站统计（文章数/浏览量/评论数/点赞数） |
| `ThemeToggle.tsx` | 主题切换按钮 | 切换暗色/亮色主题 |

#### 🏗️ `layout/` - 布局组件
| 文件 | 说明 | 主要功能 |
|-----|------|---------|
| `Header.tsx` | 页头导航栏 | Logo、导航菜单、主题切换按钮 |
| `Footer.tsx` | 页脚 | 版权信息、备案号 |
| `Layout.tsx` | 主布局容器 | 包裹所有页面，提供统一的 Header + Footer |

#### 📝 `post/` - 文章模块
| 文件 | 说明 | 主要功能 |
|-----|------|---------|
| `PostCard.tsx` | 文章卡片 | 展示文章缩略图、标题、摘要、分类、标签 |
| `PostList.tsx` | 文章列表 | 网格布局展示多篇文章卡片 |
| `PostDetail.tsx` | 文章详情 | Markdown 渲染、代码高亮、目录导航 |

#### 🎛️ `sidebar/` - 侧边栏模块
| 文件 | 说明 | 主要功能 |
|-----|------|---------|
| `ProfileCard.tsx` | 个人信息卡片 | 头像、昵称、简介、社交链接 |
| `CategoryNav.tsx` | 分类导航 | 展示所有分类 + 文章数量 |
| `TagCloud.tsx` | 标签云 | 展示所有标签 + 文章数量 |
| `SearchBar.tsx` | 搜索框 | 全文搜索文章 |

### 2. `/src/pages/` - 页面组件

| 文件 | 路由 | 说明 |
|-----|------|------|
| `HomePage.tsx` | `/` | 首页（文章列表 + 侧边栏） |
| `PostDetailPage.tsx` | `/post/:id` | 文章详情页（文章内容 + 评论区） |
| `CategoryPage.tsx` | `/category/:slug` | 分类页（按分类筛选文章） |
| `TagPage.tsx` | `/tag/:slug` | 标签页（按标签筛选文章） |
| `AboutPage.tsx` | `/about` | 关于我页面（个人简介 + 技能） |

### 3. `/src/services/` - 数据服务层

所有与 CloudBase 数据库交互的逻辑都封装在 Service 层。

| 文件 | 说明 | 主要方法 |
|-----|------|---------|
| `postService.ts` | 文章服务 | `getPostById()`, `getPostList()`, `searchPosts()`, `getPostsByCategory()`, `getPostsByTag()` |
| `categoryService.ts` | 分类服务 | `getCategoryList()`, `getCategoryBySlug()` |
| `tagService.ts` | 标签服务 | `getTagList()`, `getTagBySlug()` |
| `commentService.ts` | 评论服务 | `getCommentsByPostId()`, `createComment()`, `deleteComment()` |
| `statisticsService.ts` | 统计服务 | `getGlobalStatistics()`, `updatePostViewCount()` |

### 4. `/src/types/` - 类型定义

#### 核心类型

```typescript
// 文章类型
interface Post {
  _id: string;
  title: string;
  content: string;          // Markdown 格式
  summary: string;
  coverImage: string;
  category: string;         // 分类 slug
  tags: string[];           // 标签 slug 数组
  author: string;
  status: 'published' | 'draft';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

// 分类类型
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

// 标签类型
interface Tag {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
}

// 评论类型
interface Comment {
  _id: string;
  postId: string;           // 所属文章 ID
  nickname: string;
  email?: string;
  content: string;
  createdAt: string;
  parentId?: string;        // 父评论 ID（用于嵌套回复）
}

// 统计类型
interface Statistics {
  _id: string;
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  updatedAt: string;
}
```

## 🗄️ 数据库结构

### CloudBase 环境信息
- **环境 ID**: `lowcode-0gwpl9v4125156ef`
- **区域**: 上海（ap-shanghai）
- **控制台**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef

### 数据库集合（5个）

#### 1. `blog_posts` - 文章集合
- **安全规则**: `read: true`（所有人可读）
- **文档数**: 5 篇
- **字段**:
  ```javascript
  {
    _id: "post-001",                          // 文章 ID
    title: "使用 React 18 构建高性能前端应用",  // 标题
    content: "## 前言...",                     // Markdown 内容
    summary: "深入探讨 React 18...",           // 摘要
    coverImage: "https://...",                // 封面图 URL
    category: "frontend",                     // 分类 slug
    tags: ["react", "typescript"],            // 标签 slug 数组
    author: "Chris",                          // 作者
    status: "published",                      // 状态
    viewCount: 128,                           // 浏览量
    likeCount: 24,                            // 点赞数
    commentCount: 3,                          // 评论数
    createdAt: "2025-03-20T10:00:00.000Z",   // 创建时间
    updatedAt: "2025-03-20T10:00:00.000Z"    // 更新时间
  }
  ```

#### 2. `blog_categories` - 分类集合
- **安全规则**: `read: true`
- **文档数**: 2 个
- **字段**:
  ```javascript
  {
    _id: "frontend",                          // 分类 ID
    name: "前端开发",                          // 分类名称
    slug: "frontend",                         // URL 友好标识
    description: "前端技术、框架和最佳实践",    // 描述
    postCount: 4                              // 文章数量
  }
  ```

#### 3. `blog_tags` - 标签集合
- **安全规则**: `read: true`
- **文档数**: 8 个
- **字段**:
  ```javascript
  {
    _id: "react",                             // 标签 ID
    name: "React",                            // 标签名称
    slug: "react",                            // URL 友好标识
    postCount: 2                              // 文章数量
  }
  ```

#### 4. `blog_comments` - 评论集合
- **安全规则**: `read: true, create: auth != null`（所有人可读，登录用户可创建）
- **文档数**: 9 条
- **字段**:
  ```javascript
  {
    _id: "comment-001",                       // 评论 ID
    postId: "post-001",                       // 所属文章 ID
    nickname: "张三",                          // 昵称
    email: "zhangsan@example.com",           // 邮箱（可选）
    content: "写得很好！",                     // 评论内容
    createdAt: "2025-03-21T08:00:00.000Z",   // 创建时间
    parentId: null                            // 父评论 ID（null 表示顶级评论）
  }
  ```

#### 5. `blog_statistics` - 统计集合
- **安全规则**: `read: true`
- **文档数**: 1 条（全站统计）
- **字段**:
  ```javascript
  {
    _id: "global",                            // 统计 ID
    totalPosts: 5,                            // 总文章数
    totalViews: 515,                          // 总浏览量
    totalComments: 9,                         // 总评论数
    totalLikes: 78,                           // 总点赞数
    updatedAt: "2025-03-25T10:00:00.000Z"    // 更新时间
  }
  ```

## 🎯 路由结构

使用 **React Router 6** + **Hash 路由**（兼容静态托管）

```javascript
// 路由配置
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/post/:id" element={<PostDetailPage />} />
  <Route path="/category/:slug" element={<CategoryPage />} />
  <Route path="/tag/:slug" element={<TagPage />} />
  <Route path="/about" element={<AboutPage />} />
</Routes>
```

| 路由 | 页面 | 说明 |
|-----|------|------|
| `#/` | 首页 | 文章列表 + 侧边栏（分类/标签/搜索） |
| `#/post/post-001` | 文章详情 | 文章内容 + 评论区 |
| `#/category/frontend` | 分类页 | 前端开发分类的文章列表 |
| `#/tag/react` | 标签页 | React 标签的文章列表 |
| `#/about` | 关于我 | 个人简介 + 技能 + 社交链接 |

## 🎨 样式系统

### Tailwind CSS 配置

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',  // 通过 class 切换主题
  theme: {
    extend: {
      colors: {
        // 自定义主题色
      }
    }
  }
}
```

### 主题切换实现

通过 React Context + localStorage 实现主题切换：

```typescript
// src/contexts/ThemeContext.tsx
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 🛠️ 核心技术栈

### 前端框架
- **React 18.3.1** - UI 框架
- **TypeScript 5.6.2** - 类型安全
- **Vite 5.4.10** - 构建工具

### 路由与状态
- **React Router DOM 7.13.2** - 路由管理
- **React Context** - 主题状态管理

### 样式方案
- **Tailwind CSS 3.4.17** - 原子化 CSS 框架
- **PostCSS 8.5** - CSS 处理器
- **Autoprefixer 10.4.27** - 自动添加浏览器前缀

### Markdown 渲染
- **react-markdown 10.1.0** - Markdown 转 React 组件
- **remark-gfm 4.0.1** - GitHub 风格 Markdown 扩展
- **rehype-highlight 7.0.2** - 代码高亮

### 图标与图表
- **lucide-react 1.6.0** - 图标库
- **recharts 3.8.0** - 图表库（统计可视化）

### 后端服务
- **@cloudbase/js-sdk 2.27.1** - CloudBase Web SDK
- **CloudBase NoSQL 数据库** - 文档数据库
- **CloudBase 静态托管** - 前端部署

## 📦 NPM Scripts

```json
{
  "dev": "vite",                    // 启动开发服务器
  "build": "tsc -b && vite build",  // 构建生产版本
  "lint": "eslint .",               // 代码检查
  "preview": "vite preview"         // 预览生产构建
}
```

## 🔧 环境变量

创建 `.env` 文件：

```env
VITE_CLOUDBASE_ENV_ID=lowcode-0gwpl9v4125156ef
```

在代码中使用：
```typescript
const envId = import.meta.env.VITE_CLOUDBASE_ENV_ID;
```

## 🚀 开发流程

### 1. 本地开发
```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器（http://localhost:5173）
```

### 2. 代码检查
```bash
npm run lint         # ESLint 检查
```

### 3. 构建部署
```bash
npm run build        # 构建生产版本（输出到 dist/）
```

### 4. 部署到 CloudBase
- **方式一**: 控制台上传 `dist/` 目录
- **方式二**: 使用 CloudBase CLI 部署

## 📊 数据流架构

```
用户交互
   ↓
页面组件 (Pages)
   ↓
业务组件 (Components)
   ↓
数据服务层 (Services)
   ↓
CloudBase SDK
   ↓
CloudBase 后端
   ↓
NoSQL 数据库
```

## 🔒 安全规则

### 文章/分类/标签/统计
- 权限：所有人可读（`read: true`）
- 原因：公开内容，无需登录即可访问

### 评论
- 权限：所有人可读，登录用户可创建（`read: true, create: auth != null`）
- 原因：防止匿名恶意评论，要求登录后才能评论

## 📝 开发规范

### 组件命名
- 页面组件：`XxxPage.tsx`（如 `HomePage.tsx`）
- 业务组件：大驼峰命名（如 `PostCard.tsx`）
- 组件目录：按功能模块分类（如 `comment/`, `post/`, `sidebar/`）

### 文件组织
- 一个组件一个文件
- 相关组件放在同一目录
- 通用组件放在 `common/` 目录

### 类型定义
- 所有类型定义集中在 `src/types/index.ts`
- 使用 TypeScript 严格模式
- 组件 Props 必须定义类型

### 数据服务
- 所有数据库操作封装在 Service 层
- Service 函数返回 Promise
- 统一的错误处理

## 📄 配置文件说明

| 文件 | 说明 |
|-----|------|
| `vite.config.ts` | Vite 构建配置（插件、路径别名） |
| `tsconfig.json` | TypeScript 根配置 |
| `tsconfig.app.json` | 应用代码 TypeScript 配置 |
| `tsconfig.node.json` | Vite 配置文件 TypeScript 配置 |
| `tailwind.config.js` | Tailwind CSS 配置（主题、插件） |
| `postcss.config.js` | PostCSS 配置（Tailwind + Autoprefixer） |
| `eslint.config.js` | ESLint 代码检查配置 |

## 🐛 常见问题

### Q1: 首页空白，控制台无报错？
**A**: CloudBase SDK 需要先进行匿名登录。确保 `App.tsx` 中调用了 `initAuth()`。

### Q2: 数据库查询返回空？
**A**: 检查安全规则是否正确配置，确保当前用户有读取权限。

### Q3: 主题切换不生效？
**A**: 确保 `<html>` 标签添加了 `dark` class，Tailwind 才能应用暗色主题样式。

### Q4: 部署后路由 404？
**A**: 使用 Hash 路由（`HashRouter`），而非 `BrowserRouter`，兼容静态托管。

## 📋 项目规划文档

### Plan 文件位置
```
.codebuddy/plans/personal-blog-website_c94ec924.md
```

这是 **CodeBuddy 自动生成的项目规划文档**，包含：

- **项目概述**: 整体功能描述和技术选型
- **设计规格**: Editorial/Magazine 美学方向、字体系统（DM Serif Display + Noto Sans SC）、配色方案（暖色极简风格）
- **核心功能**: 文章系统、评论系统、主题切换、博客统计等
- **数据库设计**: 5个集合的详细字段定义和安全规则配置
- **页面规划**: 4个页面的布局、交互和响应式设计
- **Todo 任务**: 5个核心任务的完成情况（全部已完成✅）
- **Agent Skills**: 开发过程中使用的技能模块（web-development、cloudbase-document-database-web-sdk、ui-design 等）

### 为什么在 `.codebuddy` 目录？

`.codebuddy/` 是 CodeBuddy IDE 的工作区配置目录（类似于 `.vscode/`），用于存储：
- `plans/` - 项目规划和设计文档
- `rules/` - 项目开发规则（如 CloudBase 开发规范）
- 其他 IDE 相关配置

**注意**: 这个目录是项目的重要文档，请勿删除！

### 任务完成情况

| 任务 ID | 任务内容 | 状态 |
|--------|---------|------|
| `init-project` | 初始化 React + TypeScript 项目 | ✅ completed |
| `setup-cloudbase` | 配置 CloudBase SDK 和数据库集合 | ✅ completed |
| `build-core-layer` | 构建核心层（类型、服务、布局） | ✅ completed |
| `build-pages` | 构建页面（首页、详情、分类、标签、关于） | ✅ completed |
| `deploy` | 部署到 CloudBase 静态托管 | ✅ completed |

## 📚 参考资料

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [CloudBase 官方文档](https://docs.cloudbase.net/)
- [React Router 官方文档](https://reactrouter.com/)
- [项目规划文档](.codebuddy/plans/personal-blog-website_c94ec924.md) - 完整的设计规格和技术方案

---

**最后更新**: 2026-03-25  
**文档版本**: v1.1.0
