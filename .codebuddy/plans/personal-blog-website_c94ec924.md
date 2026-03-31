---
name: personal-blog-website
overview: 基于 React + TypeScript + Vite 构建一个简约极简风格的个人博客网站，集成 CloudBase 云开发（NoSQL 文档数据库 + 静态托管），支持文章发布与分类、标签系统与搜索、评论系统、暗色/亮色主题切换、关于我页面等核心功能。
design:
  architecture:
    framework: react
  styleKeywords:
    - Editorial/Magazine
    - Typographic elegance
    - Content-first reading experience
    - Warm minimalism
    - Generous whitespace
    - Frosted glass navigation
    - Subtle micro-interactions
  fontSystem:
    fontFamily: DM Serif Display, Noto Sans SC
    heading:
      size: 36px
      weight: 400
    subheading:
      size: 20px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#1A1A2E"
      - "#D4A574"
      - "#2D2D3A"
    background:
      - "#FAFAF8"
      - "#FFFFFF"
      - "#1A1A1E"
      - "#2D2D3A"
    text:
      - "#1A1A2E"
      - "#4A4A5A"
      - "#E8E6E3"
      - "#B8B6B3"
    functional:
      - "#D4A574"
      - "#E74C3C"
      - "#27AE60"
      - "#F39C12"
      - "#3498DB"
todos:
  - id: init-project
    content: 使用 Vite 初始化 React + TypeScript 项目，安装 Tailwind CSS、react-router-dom、react-markdown、lucide-react 等依赖
    status: completed
  - id: setup-cloudbase
    content: 初始化 CloudBase SDK，创建 blog_posts/categories/tags/comments 四个集合并配置安全规则
    status: completed
    dependencies:
      - init-project
  - id: build-core-layer
    content: 实现类型定义、服务层（CRUD 操作）、主题 Context、全局布局组件（Header/Footer/Layout）和公共组件
    status: completed
    dependencies:
      - init-project
  - id: build-pages
    content: 实现首页（文章列表+侧边栏）、文章详情页（Markdown 渲染+评论区）、分类/标签页、关于我页面四个核心页面
    status: completed
    dependencies:
      - build-core-layer
      - setup-cloudbase
  - id: deploy
    content: 构建项目并使用 [integration:tcb] 部署到 CloudBase 静态托管，插入示例文章数据
    status: completed
    dependencies:
      - build-pages
---

## 产品概述

一个基于 React + TypeScript 的个人博客网站，部署到 CloudBase 云开发静态托管。采用简约极简设计风格（类似 Medium），支持 Markdown 文章发布、分类标签管理、评论系统、暗色/亮色主题切换等功能。

## 核心功能

- **文章系统**: 文章列表展示、分类浏览、标签筛选、全文搜索，文章详情页支持 Markdown 渲染与代码高亮
- **评论系统**: 读者可对文章发表评论，支持嵌套回复（parentId），登录用户可创建评论
- **主题切换**: 暗色/亮色两套主题，通过 CSS 变量实现，状态持久化到 localStorage
- **关于我页面**: 个人介绍、技能展示、联系方式等信息展示
- **数据持久化**: 使用 CloudBase NoSQL 文档数据库存储文章、分类、标签、评论数据
- **博客统计**: 文章浏览量（PV）、总浏览量统计、评论数统计、文章总数、分类/标签统计
- **部署**: 构建后部署到 CloudBase 静态托管，使用 Hash 路由兼容静态站点

## 页面规划（4个页面）

1. **首页** (#/) - 置顶文章、文章列表（分页）、分类导航、标签云、搜索栏、博客总览统计
2. **文章详情** (#/post/:id) - Markdown 渲染文章、评论区、相关文章推荐、单篇统计（浏览量/评论数）
3. **分类/标签页** (#/category/:slug, #/tag/:slug) - 按分类或标签筛选文章列表
4. **关于我** (#/about) - 个人简介页面

## 技术栈选择

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS 3
- **路由**: React Router v6（Hash 模式，静态托管兼容）
- **状态管理**: React Context + useState/useReducer
- **Markdown 渲染**: react-markdown + remark-gfm + rehype-highlight
- **图标库**: Lucide React（专业图标，遵循 UI 设计规范）
- **数据库**: CloudBase NoSQL 文档数据库（@cloudbase/js-sdk）
- **认证**: CloudBase 匿名登录（阅读场景）+ 自定义登录（评论场景）
- **部署**: CloudBase 静态托管

## 实现方案

### 系统架构

采用分层架构：展示层（React 组件）-> 服务层（数据库操作封装）-> 数据层（CloudBase NoSQL）。页面使用 Hash 路由，通过 CloudBase Web SDK 初始化匿名登录后即可读取文章数据，评论提交使用自定义登录。

```mermaid
graph TD
    A[React SPA] --> B[React Router Hash]
    B --> C[Pages / Components]
    C --> D[CloudBase Service Layer]
    D --> E[@cloudbase/js-sdk]
    E --> F[CloudBase NoSQL]
    E --> G[CloudBase Auth]
    A --> H[CloudBase Static Hosting]
```

### 数据库集合设计（NoSQL）

**1. blog_posts - 文章集合**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 文档 ID |
| title | string | 文章标题 |
| content | string | Markdown 正文 |
| summary | string | 摘要（前 200 字） |
| coverImage | string | 封面图 URL |
| category | string | 分类 slug |
| tags | string[] | 标签 slug 数组 |
| author | string | 作者名 |
| status | 'draft' / 'published' | 发布状态 |
| viewCount | number | 阅读量 |
| likeCount | number | 点赞数 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |


**2. blog_categories - 分类集合**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 文档 ID |
| name | string | 分类名称 |
| slug | string | URL 友好标识 |
| description | string | 分类描述 |
| postCount | number | 文章数 |


**3. blog_tags - 标签集合**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 文档 ID |
| name | string | 标签名称 |
| slug | string | URL 友好标识 |
| postCount | number | 文章数 |


**4. blog_comments - 评论集合**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 文档 ID |
| postId | string | 关联文章 ID |
| nickname | string | 昵称 |
| content | string | 评论内容 |
| parentId | string | 父评论 ID（回复功能） |
| createdAt | Date | 创建时间 |


**5. blog_statistics - 博客统计集合**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 文档 ID |
| totalPosts | number | 已发布文章总数 |
| totalViews | number | 全站总浏览量 |
| totalComments | number | 全站总评论数 |
| totalLikes | number | 全站总点赞数 |
| updatedAt | Date | 最后更新时间 |


### 数据库安全规则

- **blog_posts**: READONLY（所有人可读已发布文章，管理员通过云函数写入）
- **blog_categories**: READONLY
- **blog_tags**: READONLY
- **blog_comments**: CUSTOM - `{"read": true, "create": "auth != null", "update": false, "delete": false}`（登录用户可创建评论）
- **blog_statistics**: READONLY（统计数据由云函数维护，前端只读）

### 关键技术决策

1. **Hash 路由**: 静态托管下刷新不 404，兼容性最佳
2. **匿名登录 + 自定义登录**: 阅读使用匿名登录（无感知），评论使用自定义登录（昵称作为 uid）
3. **Markdown 渲染**: 使用 react-markdown 配合 remark-gfm（表格、任务列表）和 rehype-highlight（代码高亮）
4. **主题切换**: CSS 变量 + Tailwind dark: 类，通过 React Context 管理状态，localStorage 持久化
5. **分页**: 使用 skip/limit 分页，每页 10 篇文章
6. **统计方案**: 使用 `blog_statistics` 集合存储全站聚合统计（由云函数维护），文章详情页进入时通过云函数 `updatePostViews` 递增 `viewCount`，文章列表从 `blog_posts` 的 `viewCount`/`likeCount` 字段读取单篇指标

### 统计指标体系

**全站级统计**（存储在 `blog_statistics` 集合）：

- 总文章数（totalPosts）：已发布文章计数
- 总浏览量（totalViews）：所有文章 viewCount 之和
- 总评论数（totalComments）：所有评论计数
- 总点赞数（totalLikes）：所有文章 likeCount 之和

**文章级统计**（存储在 `blog_posts` 每篇文档中）：

- 阅读量（viewCount）：进入文章详情页时 +1，通过云函数更新避免并发问题
- 点赞数（likeCount）：读者可点赞/取消点赞，通过云函数更新

**展示位置**：

- 首页侧边栏：全站统计卡片（4个数字 + 图标）
- 首页文章卡片：单篇浏览量 + 评论数
- 文章详情页头部：浏览量、评论数、点赞数（含点赞按钮）
- 文章详情页底部：统计栏（阅读进度、分享等）

### 实现注意事项

- **publicPath**: 使用相对路径 `'./'`，确保静态托管资源加载正常
- **SDK 初始化**: 使用同步初始化，在应用入口创建全局单例，不使用动态 import
- **错误处理**: 每个 db 操作需检查 `result.code`，展示友好 UI 提示
- **安全规则**: 配置后等待 2-5 分钟缓存生效再测试
- **_openid**: 不在任何写操作中手动包含此字段，由 SDK 自动管理

## 目录结构

```
chris-know/
├── public/
│   └── favicon.svg                    # [NEW] 网站图标
├── src/
│   ├── main.tsx                       # [NEW] 应用入口，初始化 CloudBase SDK
│   ├── App.tsx                        # [NEW] 根组件，路由配置，主题 Provider
│   ├── index.css                      # [NEW] Tailwind 入口 + CSS 变量（亮色/暗色主题）
│   ├── vite-env.d.ts                  # [NEW] Vite 类型声明
│   ├── config/
│   │   └── cloudbase.ts              # [NEW] CloudBase SDK 初始化单例，env ID 配置
│   ├── types/
│   │   ├── post.ts                    # [NEW] 文章类型定义（Post, PostStatus）
│   │   ├── category.ts                # [NEW] 分类类型定义（Category）
│   │   ├── tag.ts                     # [NEW] 标签类型定义（Tag）
│   │   ├── comment.ts                 # [NEW] 评论类型定义（Comment）
│   │   ├── statistics.ts              # [NEW] 统计类型定义（BlogStatistics）
│   │   └── index.ts                   # [NEW] 统一导出所有类型
│   ├── services/
│   │   ├── postService.ts            # [NEW] 文章 CRUD 操作（查询列表、详情、搜索）
│   │   ├── categoryService.ts        # [NEW] 分类查询操作
│   │   ├── tagService.ts             # [NEW] 标签查询操作
│   │   └── commentService.ts         # [NEW] 评论创建、查询操作
│   │   └── statisticsService.ts     # [NEW] 统计数据查询、浏览量递增操作
│   ├── contexts/
│   │   └── ThemeContext.tsx           # [NEW] 主题切换 Context，dark/light 状态管理
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # [NEW] 顶部导航栏（Logo、分类导航、主题切换、搜索）
│   │   │   ├── Footer.tsx            # [NEW] 底部信息栏
│   │   │   └── Layout.tsx            # [NEW] 页面布局容器（Header + Content + Footer）
│   │   ├── post/
│   │   │   ├── PostCard.tsx          # [NEW] 文章卡片（封面图、标题、摘要、标签、日期）
│   │   │   ├── PostList.tsx          # [NEW] 文章列表容器（分页逻辑）
│   │   │   └── PostDetail.tsx        # [NEW] 文章详情（Markdown 渲染、阅读量）
│   │   ├── comment/
│   │   │   ├── CommentForm.tsx       # [NEW] 评论输入表单（昵称、内容、提交）
│   │   │   ├── CommentItem.tsx       # [NEW] 单条评论（支持嵌套回复）
│   │   │   └── CommentList.tsx       # [NEW] 评论列表容器
│   │   ├── sidebar/
│   │   │   ├── CategoryNav.tsx       # [NEW] 分类导航组件
│   │   │   ├── TagCloud.tsx          # [NEW] 标签云组件
│   │   │   └── SearchBar.tsx         # [NEW] 搜索框组件
│   │   └── common/
│   │       ├── Pagination.tsx        # [NEW] 分页组件
│   │       ├── ThemeToggle.tsx       # [NEW] 主题切换按钮
│   │       ├── Loading.tsx           # [NEW] 加载状态组件
│   │       ├── Empty.tsx             # [NEW] 空状态组件
│   │       └── StatsOverview.tsx     # [NEW] 博客总览统计卡片组件（文章数、浏览量、评论数、点赞数）
│   └── pages/
│       ├── HomePage.tsx              # [NEW] 首页（文章列表 + 侧边栏）
│       ├── PostDetailPage.tsx        # [NEW] 文章详情页
│       ├── CategoryPage.tsx          # [NEW] 分类文章列表页
│       ├── TagPage.tsx               # [NEW] 标签文章列表页
│       └── AboutPage.tsx             # [NEW] 关于我页面
├── index.html                         # [NEW] HTML 入口
├── package.json                       # [NEW] 项目依赖配置
├── tsconfig.json                      # [NEW] TypeScript 配置
├── tailwind.config.js                 # [NEW] Tailwind CSS 配置（暗色模式）
├── postcss.config.js                  # [NEW] PostCSS 配置
└── vite.config.ts                     # [NEW] Vite 构建配置（相对 publicPath）
```

## 设计规格

**美学方向**: Editorial/Magazine - 编辑杂志风格，追求阅读体验的纯粹与优雅。大量留白、精细排版、内容优先。

**设计理念**: 以 Medium 为灵感来源，强调内容阅读的沉浸感。使用温暖的色调和精致的排版系统，让文章成为视觉焦点。布局采用非对称设计打破单调，通过微妙的动画和交互提升用户体验。

**布局策略**: 使用 CSS Grid 实现 7:5 的主内容与侧边栏比例（而非标准 8:4），标题使用大号衬线字体左对齐，文章列表卡片采用微妙的 hover 提升效果。暗色模式下使用低饱和度暖灰调，避免纯黑背景。

## 页面设计

### 1. 首页 (#/)

- **顶部导航栏**: 左侧博客名称（衬线字体），右侧分类导航链接、搜索图标、主题切换按钮。导航栏使用毛玻璃效果（backdrop-blur），固定在顶部。
- **主内容区（左侧 7 列）**: 文章列表，每篇文章以卡片形式展示：大号标题、摘要文本（两行截断）、标签胶囊、发布日期、阅读时间估算、浏览量和评论数指标。卡片之间使用细线分隔而非卡片阴影。
- **侧边栏（右侧 5 列）**: 博客总览统计卡片（总文章数、总浏览量、总评论数、总点赞数，使用 Lucide 图标 + 数字排列，带微妙动画计数效果）、分类导航列表（竖排链接）、标签云（不同大小和透明度的标签）、个人简介卡片。
- **交互**: 文章卡片 hover 时标题颜色变深、微微右移；标签 hover 时背景色变化；滚动时导航栏透明度变化。

### 2. 文章详情页 (#/post/:id)

- **文章头部**: 全宽大标题（衬线字体）、作者信息、发布日期、分类标签、阅读量、评论数、点赞数（带点赞按钮）。
- **文章正文**: 大行高（1.8）、舒适字号的 Markdown 渲染区域。代码块使用深色背景配语法高亮，引用块使用左边框强调。
- **文章底部统计栏**: 阅读进度指示、浏览量、评论数、点赞数、分享按钮组。
- **评论区**: 位于文章下方，评论输入框（昵称 + 内容 textarea），已发布评论按时间排列，支持缩进嵌套回复。
- **侧边推荐**: 右侧展示"相关文章"推荐列表（同标签或同分类文章）。

### 3. 分类/标签页 (#/category/:slug, #/tag/:slug)

- **页面头部**: 分类/标签名称、描述信息、文章总数。
- **文章列表**: 与首页相同的文章卡片布局，但不显示侧边栏，列表居中展示。

### 4. 关于我页面 (#/about)

- **个人头像区域**: 圆形头像（带微妙的边框装饰）、姓名（大号衬线字）、简短签名。
- **技能/兴趣标签**: 水平排列的标签组。
- **个人介绍**: 大段文字区域，支持 Markdown 格式。
- **联系方式**: 社交链接图标列表（GitHub、Twitter、Email 等）。

## 响应式设计

- **桌面端（>= 1024px）**: 主内容 + 侧边栏双栏布局
- **平板端（768px - 1023px）**: 单栏布局，侧边栏折叠到底部
- **移动端（< 768px）**: 简化导航为汉堡菜单，文章卡片全宽展示

## Agent Extensions

### Skill

- **web-development**
- Purpose: Web 前端项目开发规范，指导项目结构、Vite 构建、路由配置和部署流程
- Expected outcome: 按照规范完成项目搭建、构建和部署到 CloudBase 静态托管

- **cloudbase-document-database-web-sdk**
- Purpose: CloudBase NoSQL 数据库 Web SDK 的查询、创建、更新、删除操作指南
- Expected outcome: 正确实现文章/分类/标签/评论的 CRUD 操作，包括分页、搜索、错误处理

- **cloudbase-platform**
- Purpose: CloudBase 平台知识，数据库权限配置、环境管理、控制台链接
- Expected outcome: 正确配置数据库安全规则，创建数据库集合

- **auth-web-cloudbase**
- Purpose: CloudBase Web 认证指南，匿名登录和自定义登录实现
- Expected outcome: 实现匿名登录（阅读）和自定义登录（评论）的认证流程

- **ui-design**
- Purpose: UI 设计规范，确保设计风格符合 Editorial 方向，避免通用 AI 美学
- Expected outcome: 产出符合设计规格的高质量 UI 组件，通过设计自审

### Integration

- **tcb**
- Purpose: CloudBase 数据库操作、安全规则配置、静态托管部署
- Expected outcome: 创建数据库集合、配置安全规则、部署静态网站