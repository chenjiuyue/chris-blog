# Chris Know - 个人博客系统

基于 **React + TypeScript + Vite + CloudBase** 构建的现代化个人博客网站。

## 🎨 设计风格

- **简约极简风格**（类似 Medium）
- Editorial/Magazine 美学方向
- 支持暗色/亮色主题切换
- 响应式设计（桌面/平板/移动端自适应）

## 🚀 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **路由**: React Router 6（Hash 路由）
- **样式**: Tailwind CSS 3.4
- **Markdown 渲染**: react-markdown + remark-gfm + rehype-highlight
- **图标**: Lucide React
- **PWA**: vite-plugin-pwa

### 后端
- **BaaS 平台**: 腾讯云 CloudBase（云开发）
- **数据库**: CloudBase NoSQL 文档数据库
- **云函数**: Node.js 16.13
- **认证**: CloudBase 匿名登录
- **静态托管**: CloudBase 静态网站托管

## 📦 核心功能

### ✅ P0 - 高优先级功能（已完成）

#### 1. **文章目录导航**
- 自动从 Markdown 提取 H1-H6 标题生成目录树
- 点击目录项平滑滚动到对应位置
- 滚动时自动高亮当前章节
- 支持多级缩进展示标题层级
- 侧边栏固定显示（大屏幕）

#### 2. **阅读进度条**
- 页面顶部固定彩色进度条
- 随滚动位置实时更新
- 平滑过渡动画

#### 3. **返回顶部按钮**
- 滚动超过 300px 后显示
- 点击平滑滚动到顶部
- 圆形浮动按钮，右下角固定
- Hover 放大动画效果

#### 4. **文章点赞功能**
- 点赞/取消点赞切换
- 点赞数实时更新
- 本地存储点赞状态
- 云函数支持原子操作
- 点击动画效果

### ✅ P1 - 中优先级功能（已完成）

#### 5. **文章归档页面**
- 时间轴设计
- 按年月分组展示
- 文章数量统计

#### 6. **热门文章推荐**
- Top 5 排行榜
- 侧边栏展示
- 按浏览量排序

#### 7. **文章收藏功能**
- 收藏文章到本地书架
- 收藏列表页面
- 本地存储收藏状态

#### 8. **友情链接**
- 侧边栏展示
- 数据库管理
- 支持头像和描述

#### 9. **留言板**
- 独立留言页面
- 留言展示墙
- 管理员回复功能

### ✅ P2 - 低优先级功能（已完成）

#### 10. **PWA 支持**
- Service Worker 缓存
- 离线访问支持
- 添加到主屏幕
- App Manifest 配置

#### 11. **RSS 订阅**
- RSS 2.0 / Atom 1.0 / JSON Feed
- 构建时自动生成
- 订阅链接展示

#### 12. **公告系统**
- 顶部公告栏
- 信息/警告/成功三种类型
- 时间范围控制
- 用户可关闭

#### 13. **文章系列**
- 系列文章归类
- 系列导航组件
- 上下篇快速跳转

### ✅ 其他增强功能（已完成）

#### 14. **文章分享功能**
- 二维码分享
- 复制链接
- 社交平台分享（微信、微博、QQ、Twitter）

#### 15. **阅读设置**
- 字体大小调节（14-24px）
- 行高调节（1.5-2.5）
- 阅读模式切换
- 专注模式
- 设置持久化

#### 16. **搜索增强**
- 搜索历史记录
- 高级筛选（分类、标签、时间）
- 搜索结果高亮
- 清空历史

#### 4. **文章点赞功能**
- 点赞/取消点赞切换
- 点赞数实时更新
- 本地存储点赞状态
- 点击动画效果（心形放大）
- 防重复点击保护
- 匿名用户唯一标识
- 云函数: `blog-toggleLike`

### ✅ P1 - 中优先级功能（已完成）

#### 5. **文章归档页面**
- 按时间线展示所有文章
- 年份/月份分组
- 时间轴设计风格
- 文章数量统计

#### 6. **热门文章推荐**
- 基于浏览量排序 Top 5
- 侧边栏展示
- 排名标识（前三名高亮）
- 实时数据更新

#### 7. **文章收藏功能**
- 收藏/取消收藏切换
- localStorage 本地存储
- 收藏列表页面
- 收藏数量统计
- 一键删除收藏

#### 8. **友情链接**
- 侧边栏展示友链
- 支持头像、名称、描述
- 外部链接打开
- 后台数据管理

#### 9. **留言板**
- 独立留言页面
- 访客留言提交
- 留言审核机制
- 留言墙展示
- 昵称记忆功能

### ✅ P2 - 低优先级功能（已完成）

#### 10. **PWA 支持**
- Service Worker 缓存
- 离线访问支持
- 添加到主屏幕
- 资源缓存策略
- Manifest 配置

### ✅ 基础功能

#### **个人展示**
- 精美的个人信息卡片（头像、昵称、简介）
- 社交媒体链接（GitHub、Twitter、LinkedIn、Email）
- 关于页面（技能、简介、联系方式）

#### **文章系统**
- 文章列表（分页）
- 文章详情（Markdown 渲染 + 代码高亮）
- 分类筛选
- 标签筛选
- 全文搜索
- 相关文章推荐

#### **评论系统**
- 匿名评论（需 CloudBase 匿名登录）
- 嵌套回复支持
- 评论时间显示

#### **统计系统**
- 全站统计（总文章数、总浏览量、总评论数、总点赞数）
- 单篇统计（浏览量、点赞数）
- 统计卡片展示（侧边栏）

#### **主题切换**
- 暗色/亮色主题
- localStorage 持久化
- 平滑过渡动画

## 🗄️ 数据库结构

### CloudBase 环境信息
- **环境 ID**: `lowcode-0gwpl9v4125156ef`
- **区域**: 上海（ap-shanghai）
- **控制台**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef

### 数据库集合（8个）

#### 1. blog_posts（文章集合）
- **文档数**: 8 篇
- **安全规则**: READONLY（所有人可读）
- **字段**: `_id`, `title`, `content`(markdown), `summary`, `coverImage`, `category`, `tags[]`, `author`, `createdAt`, `updatedAt`, `viewCount`, `likeCount`, `status`

#### 2. blog_categories（分类集合）
- **文档数**: 3 个
- **安全规则**: READONLY
- **字段**: `_id`, `name`, `slug`, `description`, `postCount`

#### 3. blog_tags（标签集合）
- **文档数**: 5 个
- **安全规则**: READONLY
- **字段**: `_id`, `name`, `slug`, `postCount`

#### 4. blog_comments（评论集合）
- **文档数**: 6 条
- **安全规则**: CUSTOM（`read: true, create: auth != null`）
- **字段**: `_id`, `postId`, `nickname`, `content`, `createdAt`, `parentId`

#### 5. blog_statistics（统计集合）
- **文档数**: 1 条（全站统计）
- **安全规则**: READONLY
- **字段**: `_id`, `totalPosts`, `totalViews`, `totalComments`, `totalLikes`, `updatedAt`

#### 6. blog_likes（点赞记录集合）✨ 新增
- **安全规则**: CUSTOM（`read: true, create: auth != null`）
- **字段**: `_id`, `postId`, `userId`, `createdAt`

#### 7. blog_links（友情链接集合）✨ 新增
- **安全规则**: READONLY
- **字段**: `_id`, `name`, `url`, `avatar`, `description`, `status`, `order`

#### 8. blog_guestbook（留言板集合）✨ 新增
- **安全规则**: CUSTOM（`read: status == 'approved', create: auth != null`）
- **字段**: `_id`, `nickname`, `content`, `createdAt`, `status`

### 云函数（1个）

#### blog-toggleLike（点赞云函数）✨ 新增
- **运行时**: Node.js 16.13
- **功能**: 处理文章点赞/取消点赞逻辑
- **参数**: `postId`, `userId`
- **返回**: `{ success, liked, likeCount }`

## 🛠️ 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5177/chris-know/

### 构建生产版本
```bash
npm run build
```

构建产物在 `dist/` 目录。

## 🌐 部署到 CloudBase

### 📦 当前部署状态

**✅ 已部署到静态托管子目录**

- **部署路径**: `/chris-know/`（子目录）
- **访问地址**: https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/
- **部署时间**: 2026-03-25
- **构建配置**: `base: '/chris-know/'`（vite.config.ts）

> 💡 **注意**: 项目使用 Hash 路由，所有页面访问都是 `/chris-know/#/` 开头

### 部署步骤

```bash
# 1. 构建项目
npm run build

# 2. 使用 CloudBase CLI 部署
tcb hosting deploy dist/ /chris-know -e lowcode-0gwpl9v4125156ef
```

## 📁 项目结构

```
chris-know/
├── src/
│   ├── components/         # React 组件
│   │   ├── common/        # 公共组件（Loading、BackToTop 等）
│   │   ├── layout/        # 布局组件（Header、Footer、Layout）
│   │   ├── post/          # 文章组件（PostCard、PostList、PostDetail、TableOfContents、LikeButton、FavoriteButton）
│   │   ├── comment/       # 评论组件（CommentForm、CommentList、CommentItem）
│   │   └── sidebar/       # 侧边栏组件（CategoryNav、TagCloud、HotPosts、FriendLinks）
│   ├── pages/             # 页面组件
│   │   ├── HomePage.tsx           # 首页
│   │   ├── PostDetailPage.tsx     # 文章详情页
│   │   ├── CategoryPage.tsx       # 分类页
│   │   ├── TagPage.tsx            # 标签页
│   │   ├── AboutPage.tsx          # 关于我页面
│   │   ├── ArchivePage.tsx        # 归档页 ✨
│   │   ├── FavoritesPage.tsx      # 收藏页 ✨
│   │   └── GuestbookPage.tsx      # 留言板页 ✨
│   ├── services/          # 数据服务层
│   │   ├── postService.ts         # 文章 CRUD
│   │   ├── categoryService.ts     # 分类查询
│   │   ├── tagService.ts          # 标签查询
│   │   ├── commentService.ts      # 评论 CRUD
│   │   ├── statisticsService.ts   # 统计数据查询
│   │   ├── likeService.ts         # 点赞服务 ✨
│   │   └── favoriteService.ts     # 收藏服务 ✨
│   ├── contexts/          # React Context
│   │   └── ThemeContext.tsx       # 主题上下文
│   ├── lib/               # 工具函数 ✨
│   │   └── utils.ts               # className 合并等
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── config/            # 配置文件
│   │   └── cloudbase.ts           # CloudBase SDK 初始化
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── functions/             # 云函数 ✨
│   └── blog-toggleLike/   # 点赞云函数
│       ├── index.js
│       └── package.json
├── public/                # 静态资源
├── dist/                  # 构建产物（.gitignore）
├── cloudbaserc.json       # CloudBase 配置 ✨
├── .env                   # 环境变量
├── vite.config.ts         # Vite 配置（含 PWA）✨
├── tailwind.config.js     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖
```

## 🎯 页面路由

- `/` - 首页（文章列表 + 侧边栏）
- `/post/:id` - 文章详情页
- `/category/:slug` - 分类页
- `/tag/:slug` - 标签页
- `/about` - 关于我页面
- `/archive` - 文章归档页 ✨
- `/favorites` - 我的收藏页 ✨
- `/guestbook` - 留言板页 ✨

使用 Hash 路由（`#/`），兼容静态托管。

## 🔧 环境变量

创建 `.env` 文件：

```env
VITE_CLOUDBASE_ENV_ID=lowcode-0gwpl9v4125156ef
```

## 📊 控制台快捷链接

- **数据库总览**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/db/doc
- **文章集合**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/db/doc/collection/blog_posts
- **云函数**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/scf
- **静态托管**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/static-hosting
- **环境设置**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/env

## 📝 TODO

### 待实现功能
- [ ] 文章浏览量递增（需云函数避免并发问题）
- [ ] 评论审核管理后台
- [ ] Markdown 图片上传到云存储
- [ ] RSS 订阅生成
- [ ] 网站访问统计分析
- [ ] 文章系列分组
- [ ] 公告系统

### 已完成功能 ✅
- [x] 文章点赞功能（云函数支持）
- [x] 文章目录导航
- [x] 阅读进度条
- [x] 返回顶部按钮
- [x] 文章归档页面
- [x] 热门文章推荐
- [x] 文章收藏功能
- [x] 友情链接
- [x] 留言板
- [x] PWA 支持

## 🎉 功能亮点

1. **优秀的阅读体验**
   - 自动生成目录导航
   - 实时阅读进度条
   - 一键返回顶部
   - 暗色/亮色主题

2. **强大的互动功能**
   - 点赞系统（云函数保证数据一致性）
   - 收藏功能（本地存储）
   - 评论系统（嵌套回复）
   - 留言板

3. **完善的内容组织**
   - 分类/标签筛选
   - 文章归档时间线
   - 热门文章推荐
   - 相关文章推荐

4. **现代化技术栈**
   - React 18 + TypeScript
   - Tailwind CSS 响应式设计
   - CloudBase Serverless 架构
   - PWA 离线支持

## 📄 License

MIT License

---

**作者**: Chris  
**最后更新**: 2026-03-25  
**版本**: 2.0.0 ✨
