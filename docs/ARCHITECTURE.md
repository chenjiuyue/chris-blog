# Chris Know 项目架构说明

> 基于 React 18 + TypeScript + 腾讯 CloudBase 的个人博客系统

## 技术栈总览

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端框架** | React 18 + TypeScript | 函数式组件 + Hooks |
| **路由** | React Router v7 | HashRouter，支持懒加载 |
| **样式** | Tailwind CSS 3.4 | 原子化 CSS + 暗黑模式 |
| **构建工具** | Vite 5 | 热更新 + PWA 支持 |
| **后端服务** | 腾讯 CloudBase | NoSQL 数据库 + 云函数 + 认证 + 静态托管 |
| **图表** | Recharts | 站点统计数据可视化 |
| **Markdown** | react-markdown + rehype-highlight + remark-gfm | 文章内容渲染 |
| **图标** | lucide-react | SVG 图标库 |
| **SEO** | react-helmet-async | 动态 HTML Head 管理 |

---

## 项目目录结构

```
chris-know/
├── public/                     # 静态资源
│   └── favicon.svg
├── docs/                       # 项目文档
│   ├── ARCHITECTURE.md         # 架构说明（本文件）
│   ├── CHANGELOG.md            # 更新日志
│   ├── DEPLOYMENT.md           # 部署指南
│   ├── FEATURES.md             # 功能清单
│   ├── QUICKSTART.md           # 快速开始
│   └── ...
├── functions/                  # CloudBase 云函数
│   ├── blog-toggleLike/        # 文章点赞
│   ├── blog-updatePostViews/   # 更新浏览量
│   ├── blog-recordVisit/       # 记录访问日志
│   ├── blog-getHotPosts/       # 获取热门文章
│   ├── blog-getSiteStats/      # 站点统计详情
│   ├── blog-aggregateStats/    # 统计数据聚合
│   └── blog-seedComments/      # 评论种子数据
├── scripts/                    # 构建脚本
├── src/                        # 前端源码（详见下方）
├── cloudbaserc.json            # CloudBase 配置
├── vite.config.ts              # Vite 构建配置
├── tailwind.config.js          # Tailwind 样式配置
├── tsconfig.json               # TypeScript 配置
├── package.json                # 依赖管理
└── index.html                  # HTML 入口
```

---

## 前端架构 (`src/`)

### 分层架构图

```
┌─────────────────────────────────────────────────┐
│                    pages/                        │  页面层：路由对应的页面组件
│  HomePage │ PostDetailPage │ FavoritesPage │ ... │
├─────────────────────────────────────────────────┤
│                  components/                     │  组件层：可复用的 UI 组件
│  layout/ │ post/ │ comment/ │ sidebar/ │ common/ │
├─────────────────────────────────────────────────┤
│                   services/                      │  服务层：封装数据库操作
│  postService │ favoriteService │ authService │.. │
├─────────────────────────────────────────────────┤
│                   contexts/                      │  状态层：全局状态管理
│          AuthContext │ ThemeContext               │
├─────────────────────────────────────────────────┤
│                config/ │ types/ │ lib/            │  基础层：配置 + 类型 + 工具
│       cloudbase.ts │ index.ts │ utils.ts         │
└─────────────────────────────────────────────────┘
```

### 目录详解

```
src/
├── App.tsx                          # 根组件：路由配置 + 全局 Provider
├── main.tsx                         # 应用入口
├── index.css                        # 全局样式 + CSS 变量
│
├── config/
│   └── cloudbase.ts                 # CloudBase SDK 初始化、认证、数据库实例
│
├── contexts/
│   ├── AuthContext.tsx               # 用户认证状态（登录/登出/用户信息）
│   └── ThemeContext.tsx              # 主题切换（亮色/暗色）
│
├── types/
│   └── index.ts                     # 全局 TypeScript 类型定义
│
├── services/                        # 数据服务层（封装 CloudBase 数据库操作）
│   ├── postService.ts               # 文章 CRUD、相关文章
│   ├── commentService.ts            # 评论查询与创建
│   ├── favoriteService.ts           # 收藏（增删查 + 跨组件事件通知）
│   ├── likeService.ts               # 点赞（本地存储 + 云函数）
│   ├── authService.ts               # 用户认证（短信登录、用户信息同步）
│   ├── categoryService.ts           # 分类数据
│   ├── tagService.ts                # 标签数据
│   ├── statisticsService.ts         # 统计数据
│   └── announcementService.ts       # 公告系统
│
├── pages/                           # 页面组件（对应路由）
│   ├── HomePage.tsx                 # 首页：文章列表 + 侧边栏
│   ├── PostDetailPage.tsx           # 文章详情：正文 + 评论 + 目录 + 操作栏
│   ├── ArchivePage.tsx              # 归档：时间轴展示
│   ├── CategoryPage.tsx             # 分类筛选页
│   ├── TagPage.tsx                  # 标签筛选页
│   ├── FavoritesPage.tsx            # 我的收藏
│   ├── GuestbookPage.tsx            # 留言板
│   ├── StatsPage.tsx                # 站点统计
│   ├── AboutPage.tsx                # 关于我
│   ├── LoginPage.tsx                # 登录页（懒加载）
│   └── ProfilePage.tsx              # 个人中心（懒加载）
│
├── components/
│   ├── layout/                      # 布局组件
│   │   ├── Layout.tsx               # 页面布局骨架（Header + Content + Footer）
│   │   ├── Header.tsx               # 顶部导航栏（响应式 + 滚动效果）
│   │   └── Footer.tsx               # 页脚
│   │
│   ├── post/                        # 文章相关组件
│   │   ├── PostCard.tsx             # 文章卡片
│   │   ├── PostList.tsx             # 文章列表
│   │   ├── PostDetail.tsx           # 文章正文（Markdown 渲染）
│   │   ├── LikeButton.tsx           # 点赞按钮
│   │   ├── FavoriteButton.tsx       # 收藏按钮（含登录提示）
│   │   ├── ShareButton.tsx          # 分享按钮（二维码 + 链接 + 社交）
│   │   ├── TableOfContents.tsx      # 文章目录导航
│   │   ├── ReadingSettings.tsx      # 阅读设置（字号/行高/模式）
│   │   └── SeriesNavigation.tsx     # 系列文章导航
│   │
│   ├── comment/                     # 评论组件
│   │   ├── CommentList.tsx          # 评论列表
│   │   ├── CommentItem.tsx          # 单条评论（支持嵌套回复）
│   │   └── CommentForm.tsx          # 评论表单（含登录判断）
│   │
│   ├── sidebar/                     # 侧边栏组件
│   │   ├── ProfileCard.tsx          # 博主个人卡片
│   │   ├── EnhancedSearchBar.tsx    # 增强搜索（历史 + 筛选 + 高亮）
│   │   ├── SearchBar.tsx            # 基础搜索栏
│   │   ├── CategoryNav.tsx          # 分类导航
│   │   ├── TagCloud.tsx             # 标签云
│   │   ├── HotPosts.tsx             # 热门文章 Top 5
│   │   └── FriendLinks.tsx          # 友情链接
│   │
│   ├── common/                      # 通用组件
│   │   ├── SEO.tsx                  # SEO 元标签
│   │   ├── AnnouncementBar.tsx      # 公告栏
│   │   ├── BackToTop.tsx            # 返回顶部
│   │   ├── ThemeToggle.tsx          # 主题切换按钮
│   │   ├── Loading.tsx              # 加载动画
│   │   ├── Empty.tsx                # 空状态
│   │   ├── Pagination.tsx           # 分页
│   │   └── StatsOverview.tsx        # 统计概览卡片
│   │
│   ├── auth/                        # 认证组件
│   │   └── UserMenu.tsx             # 用户菜单（头像 + 下拉）
│   │
│   └── stats/                       # 统计图表
│       └── StatsCharts.tsx          # Recharts 图表（趋势/分布/排行）
│
├── data/
│   └── initData.ts                  # 初始化种子数据
│
└── lib/
    └── utils.ts                     # 工具函数（clsx + tailwind-merge）
```

---

## 后端架构（CloudBase）

### 数据库集合

| 集合名 | 说明 | 安全规则 |
|--------|------|----------|
| `blog_posts` | 文章数据 | 所有人可读，管理员可写 |
| `blog_categories` | 分类 | 所有人可读 |
| `blog_tags` | 标签 | 所有人可读 |
| `blog_comments` | 评论 | 所有人可读，登录用户可创建 |
| `blog_favorites` | 用户收藏 | 登录用户可读写（`auth != null`） |
| `blog_guestbook` | 留言板 | 所有人可读，登录用户可创建 |
| `blog_users` | 用户扩展信息 | 用户只能读写自己的数据 |
| `blog_likes` | 点赞记录 | 所有人可读写 |
| `blog_statistics` | 全站统计 | 所有人可读 |
| `blog_visits` | 访问日志 | 云函数读写 |
| `blog_announcements` | 公告 | 所有人可读 |
| `blog_series` | 文章系列 | 所有人可读 |
| `blog_links` | 友情链接 | 所有人可读 |

### 云函数

| 函数名 | 功能 | 触发方式 |
|--------|------|----------|
| `blog-toggleLike` | 文章点赞/取消点赞 | 客户端调用 |
| `blog-updatePostViews` | 原子递增文章浏览量 | 客户端调用（文章详情页加载时） |
| `blog-recordVisit` | 记录访问日志（IP、UA、页面） | 客户端调用 |
| `blog-getHotPosts` | 获取热门文章排行 | 客户端调用 |
| `blog-getSiteStats` | 获取站点统计详情 | 客户端调用 |
| `blog-aggregateStats` | 聚合统计数据（定时/手动） | 定时触发或手动调用 |
| `blog-seedComments` | 生成种子评论数据 | 手动调用（开发用） |

### 认证流程

```
用户打开页面
    │
    ▼
检查登录态 ──── 有 ──→ 复用已有登录态
    │                    （短信登录用户 / 匿名用户）
    │ 无
    ▼
匿名登录兜底 ──→ 获得 auth.uid（可访问公开数据）
    │
    ▼
用户点击登录 ──→ 短信验证码登录
    │
    ▼
登录成功 ──→ 同步用户信息到 blog_users 集合
           ──→ 解锁收藏/评论/留言等功能
```

---

## 路由结构

| 路径 | 页面 | 加载方式 | 需要登录 |
|------|------|----------|----------|
| `/` | 首页 | 直接加载 | 否 |
| `/post/:id` | 文章详情 | 直接加载 | 否（收藏/评论需登录） |
| `/category/:slug` | 分类页 | 直接加载 | 否 |
| `/tag/:slug` | 标签页 | 直接加载 | 否 |
| `/archive` | 归档页 | 直接加载 | 否 |
| `/favorites` | 我的收藏 | 直接加载 | 是 |
| `/guestbook` | 留言板 | 直接加载 | 留言需登录 |
| `/stats` | 站点统计 | 直接加载 | 否 |
| `/about` | 关于我 | 直接加载 | 否 |
| `/profile` | 个人中心 | **懒加载** | 是 |
| `/login` | 登录页 | **懒加载** | 否（无 Layout） |

---

## 数据模型

### 核心模型关系

```
Post (文章)
  ├── Category (分类) ─── 1:N
  ├── Tag (标签) ─── M:N
  ├── Comment (评论) ─── 1:N
  │     └── Comment (回复) ─── 自关联嵌套
  ├── FavoritePost (收藏) ─── N:M (通过 userId 关联用户)
  ├── Like (点赞) ─── N:M
  └── PostSeries (系列) ─── N:1

AuthUser (认证用户)
  └── BlogUser (扩展信息) ─── 1:1 (_id = uid)

SiteStatsDetail (站点统计)
  ├── VisitTrendItem[] (访问趋势)
  ├── CategoryDistribution[] (分类分布)
  ├── TopPost[] (热门文章)
  └── TagStat[] (标签统计)
```

### 关键类型定义

```typescript
interface Post {
  _id: string;
  title: string;
  content: string;        // Markdown 格式
  summary: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  seriesId?: string;
  createdAt: string;       // ISO 8601
  updatedAt: string;
}

interface AuthUser {
  uid: string;             // CloudBase Auth UID
  phone: string;
  name: string;
  picture: string;         // 头像 URL
}

interface BlogUser {
  _id: string;             // = AuthUser.uid
  nickname: string;
  avatar: string;
  bio: string;
}
```

---

## 关键设计决策

### 1. 认证策略：匿名 + 短信登录
- 所有访客默认匿名登录，确保能正常浏览内容
- 需要互动（收藏/评论/留言）时引导登录
- 使用 CloudBase Auth v2 短信验证码登录

### 2. 数据服务层设计
- 每个业务模块独立一个 `service` 文件，封装数据库操作
- 统一调用 `ensureAuth()` 确保认证状态
- 错误处理：`try-catch` 捕获，返回空数据而非崩溃

### 3. 收藏状态同步机制
- `favoriteService` 内置事件系统（`onFavoriteChange`）
- 收藏页取消收藏 → 触发事件 → 文章详情页按钮自动更新
- 避免全局状态管理的复杂度

### 4. 样式方案：CSS 变量 + Tailwind
- CSS 变量定义主题色（`--color-text`、`--color-border`、`--color-surface`）
- Tailwind `darkMode: 'class'` 通过 class 切换暗黑模式
- 品牌色系：金棕色 `#D4A574`（accent）+ 深蓝黑 `#1A1A2E`（primary）

### 5. 性能优化
- 登录页、个人中心页使用 `React.lazy` 懒加载
- PWA Service Worker 缓存静态资源
- CloudBase 资源使用 `NetworkFirst` 缓存策略（7 天有效）

---

## 构建与部署

### 构建命令

```bash
npm run build     # TypeScript 编译 + Vite 构建
npm run dev       # 本地开发服务器
npm run preview   # 预览构建产物
```

### 部署目标

- **前端静态文件** → CloudBase 静态网站托管（路径：`/chris-know/`）
- **云函数** → CloudBase 云函数（Node.js 16.13 运行时）
- **数据库** → CloudBase NoSQL 文档数据库

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_CLOUDBASE_ENV_ID` | CloudBase 环境 ID | `chris-know` |

---

## 在线地址

- **博客首页**：https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/


---

*最后更新：2026-03-31*
