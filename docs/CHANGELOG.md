# 更新日志

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
