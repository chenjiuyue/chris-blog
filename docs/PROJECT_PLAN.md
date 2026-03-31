# Chris Know 项目规划文档

## 项目概述

基于 **React + TypeScript + Vite + CloudBase** 构建的现代化个人博客系统。

**当前版本**: v2.0.0  
**最后更新**: 2026-03-25

---

## 功能模块实施状态

### ✅ P0 - 高优先级功能（已完成）

#### 1. 文章目录导航 ✅
**实施时间**: 2026-03-25  
**实现方式**: 纯前端  
**相关文件**:
- `src/components/post/TableOfContents.tsx` - 目录组件
- `src/components/post/PostDetail.tsx` - 增强标题 ID 支持

**功能特性**:
- 自动提取 H1-H6 标题生成目录树
- 点击跳转 + 平滑滚动
- 滚动高亮当前章节
- 多级缩进显示
- 侧边栏固定（大屏幕）

---

#### 2. 阅读进度条 ✅
**实施时间**: 2026-03-25  
**实现方式**: 纯前端  
**相关文件**:
- `src/pages/PostDetailPage.tsx` - 进度条逻辑

**功能特性**:
- 页面顶部固定进度条
- 实时更新（滚动事件）
- 平滑过渡动画
- 彩色进度显示

---

#### 3. 返回顶部按钮 ✅
**实施时间**: 2026-03-25  
**实现方式**: 纯前端  
**相关文件**:
- `src/components/common/BackToTop.tsx` - 返回顶部组件

**功能特性**:
- 滚动 >300px 显示
- 平滑滚动到顶部
- 圆形浮动按钮
- Hover 放大动画

---

#### 4. 文章点赞功能 ✅
**实施时间**: 2026-03-25  
**实现方式**: 云函数 + 前端  
**相关文件**:
- `functions/blog-toggleLike/` - 云函数
- `src/services/likeService.ts` - 点赞服务
- `src/components/post/LikeButton.tsx` - 点赞按钮

**数据库**:
- 集合: `blog_likes`
- 字段: `_id`, `postId`, `userId`, `createdAt`

**功能特性**:
- 点赞/取消点赞切换
- 点赞数实时更新
- localStorage 记录状态
- 点击动画效果
- 防重复点击
- 云函数原子操作

---

### ✅ P1 - 中优先级功能（已完成）

#### 5. 文章归档页面 ✅
**实施时间**: 2026-03-25  
**实现方式**: 纯前端  
**相关文件**:
- `src/pages/ArchivePage.tsx` - 归档页面
- 路由: `/archive`

**功能特性**:
- 按年份-月份分组
- 时间轴设计
- 文章数量统计
- 响应式布局

---

#### 6. 热门文章推荐 ✅
**实施时间**: 2026-03-25  
**实现方式**: 纯前端（数据库查询）  
**相关文件**:
- `src/components/sidebar/HotPosts.tsx` - 热门文章组件

**功能特性**:
- 按浏览量排序 Top 5
- 排名数字标识
- 前三名高亮显示
- 侧边栏展示

---

#### 7. 文章收藏功能 ✅
**实施时间**: 2026-03-25  
**实现方式**: localStorage（纯前端）  
**相关文件**:
- `src/services/favoriteService.ts` - 收藏服务
- `src/components/post/FavoriteButton.tsx` - 收藏按钮
- `src/pages/FavoritesPage.tsx` - 收藏列表页
- 路由: `/favorites`

**功能特性**:
- 收藏/取消收藏
- 本地持久化存储
- 收藏列表页面
- 一键删除
- 文章数量统计

---

#### 8. 友情链接 ✅
**实施时间**: 2026-03-25  
**实现方式**: 数据库 + 前端  
**相关文件**:
- `src/components/sidebar/FriendLinks.tsx` - 友链组件
- `src/types/index.ts` - Link 类型定义

**数据库**:
- 集合: `blog_links`
- 字段: `_id`, `name`, `url`, `avatar`, `description`, `status`, `order`

**功能特性**:
- 侧边栏展示
- 头像显示
- 外部链接跳转
- 后台数据管理

---

#### 9. 留言板 ✅
**实施时间**: 2026-03-25  
**实现方式**: 数据库 + 前端  
**相关文件**:
- `src/pages/GuestbookPage.tsx` - 留言板页面
- 路由: `/guestbook`

**数据库**:
- 集合: `blog_guestbook`
- 字段: `_id`, `nickname`, `content`, `createdAt`, `status`
- 安全规则: `read: status == 'approved', create: auth != null`

**功能特性**:
- 访客留言提交
- 留言审核机制
- 留言墙展示
- 昵称记忆（localStorage）
- 字数限制（500字）

---

### ✅ P2 - 低优先级功能（已完成）

#### 10. PWA 支持 ✅
**实施时间**: 2026-03-25  
**实现方式**: vite-plugin-pwa  
**相关文件**:
- `vite.config.ts` - PWA 配置

**功能特性**:
- Service Worker 缓存
- 离线访问支持
- Manifest 配置
- 资源缓存策略
- 添加到主屏幕

---

## 技术架构

### 前端技术栈
- **框架**: React 18.3.1
- **语言**: TypeScript 5.6.2
- **构建**: Vite 5.4.10
- **路由**: React Router 7.13.2
- **样式**: Tailwind CSS 3.4.17
- **Markdown**: react-markdown 10.1.0
- **图标**: Lucide React 1.6.0
- **PWA**: vite-plugin-pwa

### 后端服务
- **平台**: 腾讯云 CloudBase
- **数据库**: NoSQL 文档数据库
- **云函数**: Node.js 16.13
- **认证**: 匿名登录
- **托管**: 静态网站托管

### 数据库设计

| 集合名称 | 文档数 | 用途 | 状态 |
|---------|--------|------|------|
| blog_posts | 8 | 文章内容 | ✅ |
| blog_categories | 3 | 文章分类 | ✅ |
| blog_tags | 5 | 文章标签 | ✅ |
| blog_comments | 6 | 评论数据 | ✅ |
| blog_statistics | 1 | 全站统计 | ✅ |
| blog_likes | N | 点赞记录 | ✅ 新增 |
| blog_links | N | 友情链接 | ✅ 新增 |
| blog_guestbook | N | 留言数据 | ✅ 新增 |

### 云函数

| 函数名称 | 运行时 | 用途 | 状态 |
|---------|--------|------|------|
| blog-toggleLike | Nodejs16.13 | 点赞逻辑处理 | ✅ 已部署 |

---

## 路由规划

| 路径 | 页面 | 功能 | 状态 |
|------|------|------|------|
| `/` | HomePage | 首页（文章列表） | ✅ |
| `/post/:id` | PostDetailPage | 文章详情 | ✅ |
| `/category/:slug` | CategoryPage | 分类页 | ✅ |
| `/tag/:slug` | TagPage | 标签页 | ✅ |
| `/about` | AboutPage | 关于我 | ✅ |
| `/archive` | ArchivePage | 文章归档 | ✅ 新增 |
| `/favorites` | FavoritesPage | 我的收藏 | ✅ 新增 |
| `/guestbook` | GuestbookPage | 留言板 | ✅ 新增 |

---

## 组件目录

### 公共组件 (`src/components/common/`)
- `Loading.tsx` - 加载动画
- `Empty.tsx` - 空状态
- `BackToTop.tsx` - 返回顶部 ✨
- `StatsOverview.tsx` - 统计卡片
- `ThemeToggle.tsx` - 主题切换

### 文章组件 (`src/components/post/`)
- `PostCard.tsx` - 文章卡片
- `PostList.tsx` - 文章列表
- `PostDetail.tsx` - 文章详情（Markdown 渲染）
- `TableOfContents.tsx` - 目录导航 ✨
- `LikeButton.tsx` - 点赞按钮 ✨
- `FavoriteButton.tsx` - 收藏按钮 ✨

### 侧边栏组件 (`src/components/sidebar/`)
- `ProfileCard.tsx` - 个人卡片
- `CategoryNav.tsx` - 分类导航
- `TagCloud.tsx` - 标签云
- `SearchBar.tsx` - 搜索框
- `HotPosts.tsx` - 热门文章 ✨
- `FriendLinks.tsx` - 友情链接 ✨

### 评论组件 (`src/components/comment/`)
- `CommentForm.tsx` - 评论表单
- `CommentList.tsx` - 评论列表
- `CommentItem.tsx` - 评论项

### 布局组件 (`src/components/layout/`)
- `Header.tsx` - 顶部导航
- `Footer.tsx` - 底部
- `Layout.tsx` - 布局容器

---

## 待实现功能

### 未来规划

1. **文章浏览量递增**
   - 云函数自动递增
   - 防止并发冲突
   - 实时更新统计

2. **评论审核后台**
   - 管理员登录
   - 审核/删除评论
   - 留言审核

3. **图片上传**
   - Markdown 编辑器
   - 云存储集成
   - 图片压缩

4. **RSS 订阅**
   - XML Feed 生成
   - 订阅链接展示

5. **访问统计**
   - 访问量趋势图
   - 热门文章排行
   - 访客来源分析

6. **文章系列**
   - 系列文章归类
   - 系列导航组件
   - 上下篇关联

7. **公告系统**
   - 网站公告展示
   - 公告管理
   - 定时发布

---

## 部署信息

### 当前部署
- **环境 ID**: `lowcode-0gwpl9v4125156ef`
- **区域**: 上海（ap-shanghai）
- **访问地址**: https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/
- **部署路径**: `/chris-know/`（子目录）

### 部署命令
```bash
# 构建
npm run build

# 部署到 CloudBase
tcb hosting deploy dist/ /chris-know -e lowcode-0gwpl9v4125156ef
```

---

## 开发日志

### 2026-03-25
- ✅ 完成 P0 高优先级 4 个功能
  - 文章目录导航
  - 阅读进度条
  - 返回顶部按钮
  - 文章点赞功能（含云函数）
- ✅ 完成 P1 中优先级 5 个功能
  - 文章归档页面
  - 热门文章推荐
  - 文章收藏功能
  - 友情链接
  - 留言板
- ✅ 完成 P2 低优先级 1 个功能
  - PWA 支持
- ✅ 更新路由配置
- ✅ 更新导航菜单
- ✅ 集成侧边栏组件
- ✅ 部署云函数
- ✅ 更新所有文档

---

**项目负责人**: Chris  
**文档版本**: 2.0.0  
**最后更新**: 2026-03-25
