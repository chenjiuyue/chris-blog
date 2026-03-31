# 部署指南

本文档介绍如何将 Chris Know 博客系统部署到腾讯云 CloudBase。

---

## 📋 部署前准备

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- CloudBase CLI（可选）

### 2. CloudBase 环境信息
- **环境 ID**: `lowcode-0gwpl9v4125156ef`
- **区域**: 上海（ap-shanghai）
- **控制台**: https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef

---

## 🗄️ 数据库配置

### 第一步：创建数据库集合

在 CloudBase 控制台创建以下集合：

| 集合名称 | 说明 | 必需 |
|---------|------|------|
| blog_posts | 文章内容 | ✅ |
| blog_categories | 文章分类 | ✅ |
| blog_tags | 文章标签 | ✅ |
| blog_comments | 评论数据 | ✅ |
| blog_statistics | 全站统计 | ✅ |
| blog_likes | 点赞记录 | ✅ 新增 |
| blog_links | 友情链接 | ⭕ 可选 |
| blog_guestbook | 留言数据 | ⭕ 可选 |

### 第二步：配置安全规则

#### blog_posts
```json
{
  "read": true,
  "write": false
}
```

#### blog_categories
```json
{
  "read": true,
  "write": false
}
```

#### blog_tags
```json
{
  "read": true,
  "write": false
}
```

#### blog_comments
```json
{
  "read": true,
  "create": "auth != null"
}
```

#### blog_statistics
```json
{
  "read": true,
  "write": false
}
```

#### blog_likes（新增）
```json
{
  "read": true,
  "create": "auth != null"
}
```

#### blog_links（可选）
```json
{
  "read": "doc.status == 'active'",
  "write": false
}
```

#### blog_guestbook（可选）
```json
{
  "read": "doc.status == 'approved'",
  "create": "auth != null"
}
```

### 第三步：初始化数据

#### 1. 创建统计记录
在 `blog_statistics` 集合中添加一条文档：
```json
{
  "totalPosts": 0,
  "totalViews": 0,
  "totalComments": 0,
  "totalLikes": 0,
  "updatedAt": "2026-03-25T00:00:00.000Z"
}
```

#### 2. 创建分类
在 `blog_categories` 集合中添加分类：
```json
[
  {
    "name": "技术分享",
    "slug": "tech",
    "description": "技术相关文章",
    "postCount": 0
  },
  {
    "name": "生活随笔",
    "slug": "life",
    "description": "生活感悟",
    "postCount": 0
  },
  {
    "name": "设计思考",
    "slug": "design",
    "description": "设计相关",
    "postCount": 0
  }
]
```

#### 3. 创建标签
在 `blog_tags` 集合中添加标签：
```json
[
  {
    "name": "React",
    "slug": "react",
    "postCount": 0
  },
  {
    "name": "TypeScript",
    "slug": "typescript",
    "postCount": 0
  },
  {
    "name": "前端开发",
    "slug": "frontend",
    "postCount": 0
  }
]
```

#### 4. 创建测试文章
在 `blog_posts` 集合中添加测试文章：
```json
{
  "title": "欢迎来到我的博客",
  "content": "# 欢迎\n\n这是第一篇文章。",
  "summary": "博客系统已成功部署！",
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

#### 5. 创建友情链接（可选）
在 `blog_links` 集合中添加友链：
```json
{
  "name": "GitHub",
  "url": "https://github.com",
  "avatar": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  "description": "代码托管平台",
  "status": "active",
  "order": 1
}
```

---

## ⚡ 云函数部署

### 第一步：部署点赞云函数

使用 CloudBase 控制台部署云函数：

1. 打开云函数页面：https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/scf

2. 点击"新建云函数"

3. 配置信息：
   - **函数名称**: `blog-toggleLike`
   - **运行环境**: Node.js 16.13
   - **超时时间**: 5 秒
   - **入口函数**: `index.main`

4. 上传代码：
   - 方式 1: 打包 `functions/blog-toggleLike/` 目录为 zip 文件上传
   - 方式 2: 使用在线编辑器复制代码

5. 安装依赖：
   - 在云函数控制台点击"依赖安装"
   - 添加依赖: `wx-server-sdk@latest`

6. 部署函数

### 第二步：测试云函数

在控制台测试函数：

**测试输入**:
```json
{
  "postId": "test-post-001",
  "userId": "test-user-001"
}
```

**预期输出**:
```json
{
  "success": true,
  "liked": true,
  "likeCount": 1
}
```

---

## 🌐 静态网站部署

### 方式一：使用控制台上传（推荐新手）

#### 1. 构建项目
```bash
npm run build
```

#### 2. 上传文件
1. 打开静态托管页面：https://tcb.cloud.tencent.com/dev?envId=lowcode-0gwpl9v4125156ef#/static-hosting

2. 点击"文件管理"

3. 创建目录 `/chris-know`

4. 上传 `dist/` 目录下所有文件到 `/chris-know` 目录

5. 等待上传完成

#### 3. 访问网站
- **访问地址**: https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/
- **首页**: https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/#/

---

### 方式二：使用 CLI 部署（推荐开发者）

#### 1. 安装 CloudBase CLI
```bash
npm install -g @cloudbase/cli
```

#### 2. 登录
```bash
tcb login
```

浏览器会自动打开登录页面，使用微信扫码登录。

#### 3. 构建项目
```bash
npm run build
```

#### 4. 部署到子目录
```bash
tcb hosting deploy dist/ /chris-know -e lowcode-0gwpl9v4125156ef
```

#### 5. 或部署到根目录
如果要部署到根目录，需要修改 `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/',  // 改为 '/'
  // ...
})
```

然后运行：
```bash
npm run build
tcb hosting deploy dist/ -e lowcode-0gwpl9v4125156ef
```

#### 6. 访问网站
部署完成后，访问显示的 URL。

---

## 🔧 环境变量配置

创建 `.env` 文件：

```env
VITE_CLOUDBASE_ENV_ID=lowcode-0gwpl9v4125156ef
```

> 注意：生产环境部署后，环境变量会从 Vite 配置中读取。

---

## ✅ 部署检查清单

部署完成后，检查以下项目：

### 数据库
- [ ] 8 个集合已创建
- [ ] 安全规则已配置
- [ ] 初始数据已添加
- [ ] 匿名登录已启用

### 云函数
- [ ] `blog-toggleLike` 函数已部署
- [ ] 函数测试通过
- [ ] 依赖已安装

### 静态网站
- [ ] 文件已上传
- [ ] 首页可正常访问
- [ ] 路由跳转正常
- [ ] 主题切换正常

### 功能测试
- [ ] 文章列表显示正常
- [ ] 文章详情可以打开
- [ ] 评论功能正常
- [ ] 点赞功能正常
- [ ] 收藏功能正常
- [ ] 归档页面正常
- [ ] 留言板正常

---

## 🐛 常见问题

### 1. 首页空白
**原因**: 数据库集合为空或安全规则配置错误

**解决方案**:
- 检查数据库集合是否创建
- 检查安全规则是否正确
- 检查是否已添加测试数据
- 检查浏览器控制台错误信息

### 2. 点赞功能无效
**原因**: 云函数未部署或调用失败

**解决方案**:
- 检查云函数是否已部署
- 检查云函数日志
- 检查 `blog_likes` 集合是否创建
- 检查安全规则是否允许 create

### 3. 评论无法提交
**原因**: 匿名登录未启用

**解决方案**:
- 打开控制台 - 用户管理 - 登录方式
- 启用"匿名登录"
- 刷新页面重试

### 4. 部署后 404
**原因**: 路由配置错误或文件路径错误

**解决方案**:
- 检查 `vite.config.ts` 中 `base` 配置
- 确保使用 Hash 路由（`#/`）
- 检查静态托管文件路径

### 5. PWA 功能无效
**原因**: HTTPS 环境或配置问题

**解决方案**:
- 确保使用 HTTPS 访问
- 检查 `manifest.webmanifest` 文件
- 检查 Service Worker 注册
- 清除浏览器缓存重试

---

## 📊 性能优化建议

### 1. CDN 加速
- 在 CloudBase 控制台开启 CDN 加速
- 配置自定义域名（推荐）

### 2. 图片优化
- 使用 CloudBase 云存储托管图片
- 开启图片压缩和 WebP 格式
- 使用 CDN 域名访问

### 3. 代码分割
- 使用动态 import() 拆分大模块
- 配置 Vite 代码分割策略

### 4. 缓存策略
- PWA 已自动配置缓存
- 可根据需求调整 `workbox` 配置

---

## 🔄 更新部署

### 代码更新
```bash
# 1. 拉取最新代码
git pull

# 2. 安装依赖
npm install

# 3. 构建
npm run build

# 4. 部署
tcb hosting deploy dist/ /chris-know -e lowcode-0gwpl9v4125156ef
```

### 云函数更新
```bash
# 使用控制台重新上传代码
# 或使用 CLI 部署
tcb fn deploy blog-toggleLike -e lowcode-0gwpl9v4125156ef
```

---

## 📞 技术支持

- **CloudBase 文档**: https://docs.cloudbase.net/
- **CloudBase 控制台**: https://tcb.cloud.tencent.com/
- **问题反馈**: https://github.com/TencentCloudBase/cloudbase-js-sdk/issues

---

**文档版本**: 2.0.0  
**最后更新**: 2026-03-25
