# 快速开始指南

5 分钟快速部署你的个人博客系统！

---

## 📋 准备工作

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 2. 获取代码
```bash
git clone <repository-url> chris-know
cd chris-know
```

---

## 🚀 本地运行

### 第一步：安装依赖
```bash
npm install
```

### 第二步：配置环境变量
创建 `.env` 文件：
```env
VITE_CLOUDBASE_ENV_ID=lowcode-0gwpl9v4125156ef
```

### 第三步：启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5177/chris-know/

---

## ☁️ 部署到 CloudBase

### 方式一：使用控制台（推荐新手）

#### 1. 构建项目
```bash
npm run build
```

#### 2. 登录 CloudBase 控制台
打开 https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef

#### 3. 上传文件
- 进入"静态托管"页面
- 创建目录 `/chris-know`
- 上传 `dist/` 目录下所有文件

#### 4. 访问网站
https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/

---

### 方式二：使用 CLI（推荐开发者）

#### 1. 安装 CLI
```bash
npm install -g @cloudbase/cli
```

#### 2. 登录
```bash
tcb login
```

#### 3. 一键部署
```bash
npm run build
tcb hosting deploy dist/ /chris-know -e lowcode-0gwpl9v4125156ef
```

---

## 🗄️ 初始化数据库

### 快速初始化（推荐）

在 CloudBase 控制台执行以下步骤：

#### 1. 创建集合
```
blog_posts
blog_categories
blog_tags
blog_comments
blog_statistics
blog_likes
blog_links（可选）
blog_guestbook（可选）
```

#### 2. 配置安全规则

**所有集合通用规则**（只读）:
```json
{
  "read": true,
  "write": false
}
```

**评论和点赞集合**（允许创建）:
```json
{
  "read": true,
  "create": "auth != null"
}
```

#### 3. 添加初始数据

**统计记录** (`blog_statistics`):
```json
{
  "totalPosts": 0,
  "totalViews": 0,
  "totalComments": 0,
  "totalLikes": 0,
  "updatedAt": "2026-03-25T00:00:00.000Z"
}
```

**分类数据** (`blog_categories`):
```json
[
  { "name": "技术分享", "slug": "tech", "description": "技术文章", "postCount": 0 },
  { "name": "生活随笔", "slug": "life", "description": "生活感悟", "postCount": 0 },
  { "name": "设计思考", "slug": "design", "description": "设计相关", "postCount": 0 }
]
```

**测试文章** (`blog_posts`):
```json
{
  "title": "欢迎来到我的博客",
  "content": "# 欢迎\n\n这是第一篇文章，博客系统已成功部署！\n\n## 功能特性\n\n- 文章管理\n- 评论系统\n- 点赞收藏\n- 主题切换\n\n期待与你分享更多内容。",
  "summary": "博客系统已成功部署，开始你的写作之旅吧！",
  "coverImage": "",
  "category": "tech",
  "tags": ["react", "typescript"],
  "author": "Chris",
  "status": "published",
  "viewCount": 0,
  "likeCount": 0,
  "commentCount": 0,
  "createdAt": "2026-03-25T00:00:00.000Z",
  "updatedAt": "2026-03-25T00:00:00.000Z"
}
```

---

## ⚡ 部署云函数

### 1. 打开云函数页面
https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/scf

### 2. 创建云函数
- 函数名称: `blog-toggleLike`
- 运行环境: Node.js 16.13
- 超时时间: 5 秒

### 3. 上传代码
将 `functions/blog-toggleLike/` 目录打包成 zip 上传

### 4. 安装依赖
添加依赖: `wx-server-sdk@latest`

### 5. 部署
点击"部署"按钮

---

## ✅ 功能测试

部署完成后，测试以下功能：

### 基础功能
- [ ] 首页显示文章列表
- [ ] 点击文章查看详情
- [ ] 分类/标签筛选正常
- [ ] 搜索功能正常

### 新功能
- [ ] 文章目录导航显示
- [ ] 阅读进度条更新
- [ ] 返回顶部按钮工作
- [ ] 点赞功能正常
- [ ] 收藏功能正常
- [ ] 归档页面正常
- [ ] 留言板正常

### 交互功能
- [ ] 评论提交成功
- [ ] 主题切换正常
- [ ] PWA 可离线访问

---

## 🎨 个性化配置

### 修改个人信息

编辑 `src/components/sidebar/ProfileCard.tsx`:
```typescript
const profile = {
  name: '你的名字',
  avatar: '你的头像 URL',
  bio: '你的简介',
  socialLinks: {
    github: 'https://github.com/yourname',
    twitter: 'https://twitter.com/yourname',
    // ...
  }
}
```

### 修改网站标题

编辑 `src/components/layout/Header.tsx`:
```typescript
<Link to="/" className="...">
  你的博客名称
</Link>
```

### 修改关于页面

编辑 `src/pages/AboutPage.tsx` 自定义内容。

---

## 📝 添加文章

### 1. 在控制台添加

打开文章集合：https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/db/doc/collection/blog_posts

点击"新增记录"，填写文章信息。

### 2. 文章字段说明

```json
{
  "title": "文章标题",
  "content": "Markdown 格式内容",
  "summary": "文章摘要（150字内）",
  "coverImage": "封面图 URL（可选）",
  "category": "分类 slug",
  "tags": ["标签1", "标签2"],
  "author": "作者名",
  "status": "published",  // 或 "draft"
  "viewCount": 0,
  "likeCount": 0,
  "commentCount": 0,
  "createdAt": "2026-03-25T12:00:00.000Z",
  "updatedAt": "2026-03-25T12:00:00.000Z"
}
```

### 3. Markdown 语法

支持标准 Markdown 语法：
- 标题：`# H1`, `## H2`
- 加粗：`**文字**`
- 斜体：`*文字*`
- 代码块：` ```javascript ... ``` `
- 链接：`[文字](URL)`
- 图片：`![描述](URL)`
- 表格、任务列表等

---

## 🔧 常见问题

### Q1: 首页空白怎么办？
**A**: 检查数据库是否已创建并添加数据，查看浏览器控制台错误信息。

### Q2: 点赞功能不工作？
**A**: 确保云函数已部署，检查 `blog_likes` 集合是否创建。

### Q3: 如何添加友情链接？
**A**: 在 `blog_links` 集合中添加记录，字段包括 `name`, `url`, `avatar`, `description`, `status`（设为 `active`）, `order`。

### Q4: 如何审核留言？
**A**: 在 `blog_guestbook` 集合中找到留言记录，将 `status` 字段改为 `approved`。

### Q5: 如何更新部署？
**A**: 修改代码后运行 `npm run build`，然后重新上传 `dist/` 目录。

---

## 📚 更多文档

- **完整文档**: [README.md](./README.md)
- **功能说明**: [FEATURES.md](./FEATURES.md)
- **部署指南**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **项目规划**: [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- **更新日志**: [CHANGELOG.md](./CHANGELOG.md)

---

## 💡 下一步

1. ✍️ **开始写作**: 添加你的第一篇文章
2. 🎨 **个性化**: 修改个人信息和样式
3. 📢 **分享**: 将博客地址分享给朋友
4. 🔧 **扩展**: 根据需求添加新功能

---

祝你使用愉快！🎉

**最后更新**: 2026-03-25
