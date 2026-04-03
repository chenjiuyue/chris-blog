# 更新日志

## [v2.3.0] - 2026-04-03

### ✨ 新功能

- **文章排序切换** - 首页文章列表支持按「最新发布 / 最多浏览 / 最多评论 / 最多点赞」排序
  - `postService.ts` 新增 `PostSortField` 类型，`getPublishedPosts` 接受排序字段参数
  - `PostList` 组件顶部新增排序选项栏

- **AboutCard 个人名片** - 全新侧边栏名片组件，合并原 `ProfileCard` + `StatsOverview`
  - 头像、简介、社交链接 + 文章/浏览/评论/点赞统计一体化展示
  - 底部农历日期信息（天干地支、生肖、农历月日）

- **CategoryTagNav 分类标签导航** - 新增侧边栏分类列表 + 标签云组件
  - 分类支持路由高亮，标签按文章数动态调整透明度

- **自动发文附带评论** - `blog-autoPublish` 云函数发布文章时自动生成 3-5 条随机评论
  - 内置 30 条评论模板和 20 个昵称素材库
  - 评论时间随机分布在文章发布后 1-72 小时内

- **Post 类型新增 `publishedAt` 字段** - 支持区分发布时间与创建时间

### 🐛 Bug 修复

- **归档页 `toString()` 崩溃** - 修复 `ArchivePage` 中 `getPostDate()` 返回 `undefined` 时，`new Date(undefined)` 导致 `Invalid Date`，后续 `.getFullYear().toString()` 报错
  - 增加空值和无效日期防御检查，跳过没有日期的文章

- **公告服务 `find()` 崩溃** - 修复 `announcementService.ts` 中 `result.data` 非数组时 `.find()` 报错
  - 使用 `Array.isArray(result?.data)` 严格类型检查，回退到空数组

- **评论计数不同步** - 新增评论后使用 `_.inc(1)` 原子递增 `blog_posts.commentCount`

- **统计评论数不准确** - `blog-aggregateStats` 和 `blog-getSiteStats` 云函数改为从 `blog_comments` 集合实际 `count()` 统计评论数，不再依赖文章的 `commentCount` 汇总

### 🔧 优化改进

- **用户菜单重构** - `UserMenu` 下拉菜单样式优化，新增手机号脱敏显示、收藏入口，硬编码色值替换为语义化 Tailwind token
- **Header 精简** - 移除无用导入
- **PostCard 优化** - 文章卡片样式微调
- **文档清理** - docs 目录从 14 个文件精简为 3 个核心文档（CHANGELOG / ARCHITECTURE / PROJECT_PLAN）

---

## [v2.2.2] - 2026-04-02

### 🐛 Bug 修复

- **文章评论统计不准确** - 修复文章卡片和统计面板中评论数与实际评论不一致的问题
  - 根因：种子文章（post-001 ~ post-005）的 `commentCount` 为 0，但实际各有 7 条评论；AI 文章的 `commentCount` 是脚本中的硬编码值（23、45、67 等），不反映 `blog_comments` 中的真实数据
  - 逐一查询 `blog_comments` 集合每篇文章的实际评论数，更新全部 22 篇文章的 `commentCount`
  - 修复 `commentService.ts` 的 `createComment()` 函数，新增评论后使用 `_.inc(1)` 原子递增 `blog_posts.commentCount`，避免后续计数偏移
  - 同步更新 `blog_statistics.totalComments`（81）和 `totalPosts`（22）

- **首页用户菜单下拉透明度异常** - 修复点击头像弹出的下拉菜单背景半透明、页面内容透出的问题
  - 根因：`UserMenu.tsx` 使用 `bg-white/98`，`/98` 不是 Tailwind CSS 的有效不透明度值（有效值：0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100），导致背景色未正确渲染
  - 改为 `bg-white dark:bg-[#2A2A35]`（完全不透明），配合已有 `backdrop-blur-xl` 保持毛玻璃视觉效果

### 📦 数据库变更

- 全部 22 篇文章的 `blog_posts.commentCount` 已同步为 `blog_comments` 集合中的实际评论数
- `blog_statistics.totalComments` 更新为 81，`totalPosts` 更新为 22

---

## [v2.2.1] - 2026-04-02

### 🐛 Bug 修复

- **首页分类显示 `undefined`** - 修复分类导航出现 undefined 分类名的问题
  - 根因：数据库 `blog_categories` 集合中存在 2 条无效记录（`cat-ai`、`cat-tools`），缺少 `name` 和 `slug` 字段
  - 删除无效分类记录，补充"人工智能"和"开发工具"两个完整分类
  - `categoryService.ts` 增加 `.filter(cat => cat.name && cat.slug)` 过滤无效记录
  - `CategoryNav.tsx` 渲染前增加同样的防御性过滤

- **独立访客（UV）始终为 0** - 修复统计面板独立访客数一直显示 0 的问题
  - 根因：前端通过 SDK `callFunction` 调用云函数时，`context.sourceIp` 为空字符串，导致 UV 统计无法去重
  - 新增 `visitorId` 机制：前端通过 `localStorage` 持久化随机生成的唯一访客标识
  - `HomePage.tsx` 和 `PostDetailPage.tsx` 调用 `blog-recordVisit` 时传入 `visitorId`
  - `blog-recordVisit` 云函数接收并存储 `visitorId`
  - `blog-getSiteStats` 和 `blog-aggregateStats` UV 统计优先按 `visitorId` 去重，回退到 IP

### 🔧 优化改进

- `.gitignore` 新增 `.codebuddy` 目录忽略规则

### 📦 数据库变更

- 删除 `blog_categories` 集合中 2 条无效记录（`cat-ai`、`cat-tools`）
- 新增 `blog_categories` 分类："人工智能"（slug: `ai-tech`）、"开发工具"（slug: `dev-tools`）
- `blog_visits` 文档新增 `visitorId` 字段

### 📁 新增文件

- `src/utils/visitorId.ts` - 唯一访客标识生成与持久化工具

### ☁️ 云函数更新

- `blog-recordVisit` - 支持接收和存储 `visitorId`
- `blog-getSiteStats` - UV 统计改用 `visitorId` 去重
- `blog-aggregateStats` - 每日聚合 UV 统计改用 `visitorId` 去重

---

## [v2.2.0] - 2026-03-31

### 🐛 Bug 修复

- **收藏功能重构** - 修复收藏与取消收藏交互异常
  - 修复 `blog_favorites` 集合未创建导致收藏功能完全失效的问题
  - 修复安全规则 `auth.uid == doc.userId` 导致客户端 `where` 查询和 `remove` 操作被拒绝的问题
  - 安全规则改为 `auth != null`，数据隔离由代码 `where({ userId: uid })` 保证
  - 将 `toggleFavorite` 拆分为独立的 `addFavorite` 和 `removeFavorite`，操作成功才更新 UI 状态
  - 新增收藏状态事件系统 `onFavoriteChange`，收藏页取消收藏后文章详情页按钮状态自动同步

- **收藏功能去除本地缓存** - 收藏仅关联登录用户
  - 移除所有 `localStorage` 降级方案
  - 未登录点击收藏弹出提示气泡，引导用户登录
  - 收藏页未登录时展示登录引导，不再显示本地缓存数据

- **留言板集合缺失** - 修复 `blog_guestbook` 集合未创建的问题

### ✨ 新增功能

- **留言墙免审核自动展示** - 去掉审核机制
  - 留言提交后直接展示，无需等待审核
  - 新增前端敏感词过滤，匹配到的敏感词自动替换为 `**`
  - 提交和展示双重过滤保护

- **留言板用户头像实时更新**
  - 留言提交时保存 `userId` 和 `avatar` 字段
  - 展示留言时通过 `getBlogUser` 获取用户最新头像和昵称
  - 支持真实头像图片显示，无头像时显示首字母

### 🔧 优化改进

- GitHub 地址更新为 `https://github.com/chenjiuyue/`（Footer、关于页、个人卡片三处）
- `blog_guestbook` 安全规则设置为 `read: true, write: true, create: auth != null`
- `blog_favorites` 安全规则优化为 `read/write/create: auth != null`
- 收藏操作错误处理增强，所有函数均有详细的错误日志和返回值

### 📦 数据库变更

- 创建 `blog_favorites` 集合
- 创建 `blog_guestbook` 集合
- `blog_guestbook` 文档新增 `userId`、`avatar` 字段，移除 `status` 字段

---

## [v2.1.0] - 2026-03-26

### ✨ 新增功能

#### P2 - 低优先级功能
- **RSS 订阅** - 自动生成 RSS/Atom/JSON Feed
  - 支持 RSS 2.0、Atom 1.0 和 JSON Feed 格式
  - 构建时自动生成 feed 文件
  - 添加订阅链接展示

- **公告系统** - 网站公告展示和管理
  - 顶部公告栏组件
  - 支持信息、警告、成功三种类型
  - 时间范围控制
  - 用户可关闭公告
  - 公告管理服务

- **文章系列** - 系列文章归类和导航
  - 系列文章数据模型
  - 系列导航组件
  - 上下篇快速跳转
  - 系列文章列表展示

#### 其他增强功能

- **文章分享功能**
  - 二维码分享
  - 复制链接
  - 社交平台一键分享（微信、微博、QQ、Twitter）
  - 分享弹窗优化

- **阅读设置**
  - 字体大小调节（14-24px）
  - 行高调节（1.5-2.5）
  - 阅读模式切换（明亮/暗黑/自动）
  - 专注模式（隐藏干扰元素）
  - 设置持久化到 localStorage

- **搜索增强**
  - 搜索历史记录
  - 高级筛选（分类、标签、时间）
  - 搜索结果高亮
  - 清空历史功能

- **新增云函数**
  - `blog-updatePostViews` - 原子递增浏览量
  - `blog-getHotPosts` - 获取热门文章
  - `blog-recordVisit` - 记录访问日志

### 🔧 优化改进

- 首页搜索栏升级为增强版
- 文章详情页布局优化
- 阅读体验提升
- PWA 缓存优化

### 📦 新增依赖

- `feed` - RSS Feed 生成
- `qrcode` - 二维码生成

### 📝 文档更新

- 更新 README.md
- 更新 FEATURES.md
- 更新 CHANGELOG.md
- 创建云函数部署指南

---

## [v2.0.0] - 2026-03-25

### ✨ 新增功能

#### P0 - 高优先级功能
- **文章点赞功能** - 云函数支持、实时更新、本地存储
- **目录导航** - 自动提取标题、点击跳转、滚动高亮
- **阅读进度条** - 顶部固定、实时更新、平滑动画
- **返回顶部按钮** - 浮动按钮、平滑滚动、动画效果

#### P1 - 中优先级功能
- **文章归档页面** - 时间轴设计、年月分组
- **热门文章推荐** - Top 5 排行、侧边栏展示
- **文章收藏功能** - 本地存储、收藏列表页
- **友情链接** - 侧边栏展示、数据库管理
- **留言板** - 独立页面、审核机制

#### P2 - 低优先级功能
- **PWA 支持** - Service Worker 缓存、离线访问、添加到主屏幕

### 🔧 优化改进

- 完善的文章阅读体验
- 响应式设计优化
- 暗色主题支持
- 性能优化

### 📦 新增依赖

- `vite-plugin-pwa` - PWA 支持
- `clsx` - CSS 类名合并

---

## [v1.0.0] - 2025-12-01

### ✨ 初始版本

- 文章系统（列表、详情、分类、标签）
- 评论系统（匿名评论、嵌套回复）
- 统计系统（全站统计、单篇统计）
- 主题切换（暗色/亮色）
- 关于我页面（个人简介、技能标签、社交链接）
- CloudBase 后端集成
- React 18 + TypeScript
- Vite 5 + Tailwind CSS 3.4

---

## 版本说明

- **主版本号（Major）**: 重大架构变更或不兼容更新
- **次版本号（Minor）**: 新增功能，向后兼容
- **修订号（Patch）**: Bug 修复和小改进

## 升级指南

### 从 v2.2.1 升级到 v2.2.2

1. 拉取最新代码
2. 构建项目：`npm run build`
3. 部署到云端

> 数据库评论计数已通过 MCP 同步修正，无需额外操作。

### 从 v2.2.0 升级到 v2.2.1

1. 拉取最新代码
2. 构建项目：`npm run build`
3. 部署到云端

#### 云函数部署

需要重新部署以下云函数：
- `blog-recordVisit` - 支持 visitorId
- `blog-getSiteStats` - UV 统计逻辑更新
- `blog-aggregateStats` - 聚合 UV 统计逻辑更新

### 从 v2.1.0 升级到 v2.2.0

1. 拉取最新代码
2. 构建项目：`npm run build`
3. 部署到云端

#### 数据库更新

需要创建以下新集合（如尚未创建）：
- `blog_favorites` - 用户收藏（安全规则：`auth != null`）
- `blog_guestbook` - 留言板（安全规则：`read: true, write: true, create: auth != null`）

### 从 v2.0.0 升级到 v2.1.0

1. 拉取最新代码
2. 安装新依赖：`npm install`
3. 构建项目：`npm run build`
4. 部署到云端：`tcb hosting deploy dist /chris-know -e <envId>`

### 数据库更新

需要创建以下新集合：
- `blog_announcements` - 公告数据
- `blog_series` - 文章系列
- `blog_visits` - 访问日志

### 云函数部署

需要部署以下新云函数：
- `blog-updatePostViews`
- `blog-getHotPosts`
- `blog-recordVisit`

---

**详细文档**: 请查看 [FEATURES.md](./FEATURES.md) 和 [DEPLOYMENT.md](./DEPLOYMENT.md)
