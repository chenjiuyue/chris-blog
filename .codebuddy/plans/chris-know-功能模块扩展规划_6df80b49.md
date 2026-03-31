---
name: chris-know-功能模块扩展规划
overview: 为当前的博客系统规划可添加的新功能模块，涵盖内容管理、用户互动、SEO优化、性能提升等多个方面
todos:
  - id: add-like-feature
    content: 使用 [integration:tcb] 创建 blog_likes 集合并部署点赞云函数
    status: completed
  - id: add-table-of-contents
    content: 实现文章详情页目录导航组件
    status: completed
  - id: add-reading-progress
    content: 添加阅读进度条和返回顶部按钮
    status: completed
  - id: add-seo-optimization
    content: 集成 react-helmet 实现 SEO 优化
    status: completed
  - id: add-archive-page
    content: 创建文章归档页面
    status: completed
  - id: add-hot-posts
    content: 实现热门文章推荐功能
    status: completed
  - id: add-favorites
    content: 添加文章收藏功能（localStorage）
    status: completed
  - id: add-friend-links
    content: 使用 [integration:tcb] 创建友情链接功能
    status: completed
  - id: add-guestbook
    content: 创建留言板页面
    status: completed
  - id: add-pwa-support
    content: 集成 Vite PWA 插件
    status: completed
---

## 产品概述

基于现有的个人博客系统，规划添加新功能模块以增强用户体验和功能完整性。

## 当前已有功能

- **文章系统**: 文章列表、详情、分类筛选、标签筛选、全文搜索
- **评论系统**: 匿名评论、嵌套回复
- **统计系统**: 全站统计、单篇统计
- **主题切换**: 暗色/亮色主题
- **关于我页面**: 个人简介、技能标签、社交链接

## 可添加的新模块

### 一、互动增强模块

1. **文章点赞功能**

- 点赞/取消点赞按钮
- 点赞数实时显示
- 防止重复点赞（基于用户标识）

2. **文章收藏功能**

- 收藏文章到个人书架
- 收藏列表页面
- 本地存储收藏状态

3. **文章分享功能**

- 生成分享链接
- 二维码分享
- 社交平台一键分享

### 二、内容发现模块

4. **文章归档页面**

- 按时间线展示所有文章
- 年份/月份分组
- 文章数量统计

5. **热门文章推荐**

- 基于浏览量排序
- 侧边栏热门榜单
- 相关文章推荐优化

6. **搜索增强**

- 搜索历史记录
- 搜索结果高亮
- 高级筛选（分类+标签+时间）

### 三、用户体验模块

7. **阅读进度条**

- 文章详情页顶部进度指示
- 滚动时实时更新
- 阅读时长估算

8. **目录导航**

- 自动提取文章标题生成目录
- 点击跳转到对应位置
- 滚动时高亮当前章节

9. **返回顶部按钮**

- 滚动一定距离后显示
- 平滑滚动动画

10. **阅读设置**

    - 字体大小调节
    - 行高调节
    - 阅读模式（专注模式）

### 四、性能优化模块

11. **PWA 支持**

    - Service Worker 缓存
    - 离线访问支持
    - 添加到主屏幕
    - 推送通知

### 五、内容管理模块

12. **友情链接**

    - 友链列表页面
    - 友链申请功能
    - 友链管理

13. **留言板**

    - 独立留言页面
    - 留言展示墙
    - 管理员回复

14. **公告系统**

    - 网站公告展示
    - 公告管理
    - 定时发布

### 六、高级功能模块

15. **RSS 订阅**

    - RSS/Atom Feed 生成
    - 订阅链接展示

16. **访问统计**

    - 访问量趋势图
    - 热门文章排行
    - 访客来源分析

17. **文章系列**

    - 系列文章归类
    - 系列导航组件
    - 上下篇关联

## 技术栈

基于现有技术栈扩展，无需引入新技术框架。

### 现有技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS 3.4
- **路由**: React Router 6 (Hash 模式)
- **后端服务**: CloudBase (NoSQL + 云函数 + 静态托管)

### 新增技术需求

| 模块 | 技术方案 | 说明 |
| --- | --- | --- |
| 文章点赞 | 云函数 + 数据库 | 需要云函数处理并发更新 |
| 目录导航 | rehype 插件 | 从 Markdown 提取标题结构 |
| PWA | Vite PWA 插件 | Service Worker + Manifest |
| RSS | 静态生成 | 构建时生成 XML 文件 |
| 访问统计 | CloudBase 云函数 | 记录和分析访问数据 |


## 实现方案

### 优先级排序

**P0 - 高优先级（建议优先实现）**:

1. 文章点赞功能 - 增强互动性
2. 目录导航 - 提升长文阅读体验
3. 阅读进度条 - 视觉反馈
4. 返回顶部按钮 - 基础体验

**P1 - 中优先级（推荐实现）**:

5. 文章归档页面 - 内容发现
6. 热门文章推荐 - 内容分发
7. 文章收藏功能 - 用户粘性
8. 友情链接 - 社交连接
9. 留言板 - 用户互动

**P2 - 低优先级（可选实现）**:

10. PWA 支持 - 离线访问
11. RSS 订阅 - 内容分发
12. 访问统计 - 数据分析
13. 公告系统 - 信息通知
14. 文章系列 - 内容组织

### 数据库扩展

需要新增以下集合：

```typescript
// blog_likes - 点赞记录
interface Like {
  _id: string;
  postId: string;
  userId: string;  // 匿名用户标识
  createdAt: string;
}

// blog_favorites - 收藏记录
interface Favorite {
  _id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

// blog_links - 友情链接
interface Link {
  _id: string;
  name: string;
  url: string;
  avatar: string;
  description: string;
  status: 'active' | 'inactive';
  order: number;
}

// blog_guestbook - 留言板
interface GuestbookMessage {
  _id: string;
  nickname: string;
  content: string;
  replyTo?: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

// blog_announcements - 公告
interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  startTime: string;
  endTime: string;
  status: 'active' | 'inactive';
}
```

### 云函数需求

需要新增以下云函数：

| 云函数名 | 功能 | 说明 |
| --- | --- | --- |
| updatePostViews | 递增浏览量 | 避免并发问题 |
| toggleLike | 点赞/取消点赞 | 原子操作 + 防重复 |
| getHotPosts | 获取热门文章 | 按浏览量排序 |
| recordVisit | 记录访问日志 | 用于统计分析 |


## 实现注意事项

1. **云函数必要性**: 点赞和浏览量递增必须使用云函数，前端直接操作数据库会有并发问题
2. **本地存储利用**: 收藏、搜索历史等功能可使用 localStorage 实现，无需后端
3. **渐进增强**: SEO 和 PWA 可以独立实现，不影响现有功能
4. **性能考虑**: 目录导航应在客户端生成，避免额外的数据请求
5. **用户体验**: 阅读设置（字体、行高）应持久化到 localStorage

## Agent Extensions

### Integration

- **tcb**
- Purpose: 创建新的数据库集合、配置安全规则、部署云函数
- Expected outcome: 成功创建 blog_likes、blog_favorites、blog_links 等新集合，配置正确的安全规则，部署点赞、浏览量等云函数

### Skill

- **cloudbase-document-database-web-sdk**
- Purpose: 实现新模块的数据查询、创建、更新操作
- Expected outcome: 正确实现收藏、友链、留言等功能的 CRUD 操作
- **cloudrun-development**
- Purpose: 开发点赞、浏览量递增等云函数
- Expected outcome: 创建可靠的云函数处理并发操作
- **ui-design**
- Purpose: 设计新模块的 UI 组件，保持与现有设计风格一致
- Expected outcome: 符合 Editorial 风格的高质量 UI 组件
- **web-development**
- Purpose: 遵循 Web 前端开发规范，确保代码质量和项目结构
- Expected outcome: 规范的前端代码实现