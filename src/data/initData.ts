import { getDB, getAuth } from '../config/cloudbase';

const SAMPLE_CATEGORIES = [
  { name: '前端开发', slug: 'frontend', description: 'React、Vue、CSS 等前端技术分享', postCount: 3 },
  { name: '后端技术', slug: 'backend', description: 'Node.js、数据库、API 设计', postCount: 1 },
  { name: '生活随笔', slug: 'life', description: '技术与生活的感悟', postCount: 1 },
];

const SAMPLE_TAGS = [
  { name: 'React', slug: 'react', postCount: 2 },
  { name: 'TypeScript', slug: 'typescript', postCount: 3 },
  { name: 'CSS', slug: 'css', postCount: 1 },
  { name: 'Node.js', slug: 'nodejs', postCount: 1 },
  { name: '性能优化', slug: 'performance', postCount: 1 },
  { name: '设计', slug: 'design', postCount: 1 },
  { name: '思考', slug: 'thoughts', postCount: 2 },
  { name: 'CloudBase', slug: 'cloudbase', postCount: 1 },
];

const SAMPLE_POSTS = [
  {
    title: '使用 React 18 构建高性能前端应用',
    content: `## 前言

React 18 带来了许多激动人心的新特性，其中最值得关注的是 **Concurrent Mode** 和 **Automatic Batching**。本文将深入探讨如何利用这些特性构建高性能的前端应用。

## Concurrent Rendering

Concurrent Rendering 是 React 18 最重要的更新之一。它允许 React **中断**渲染过程，处理更高优先级的更新。

\`\`\`tsx
import { startTransition } from 'react';

function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    // 紧急更新：输入框的值
    setInputValue(e.target.value);
    
    // 非紧急更新：搜索结果
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };
}
\`\`\`

## Automatic Batching

在 React 18 之前，只有 React 事件处理函数中的更新会被批量处理。现在，**所有**更新都会自动批量处理。

## Suspense 改进

\`\`\`tsx
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
\`\`\`

## 总结

React 18 的这些改进让我们能够构建更加流畅和响应式的用户界面。建议在新项目中尽早采用这些特性。`,
    summary: '深入探讨 React 18 的 Concurrent Rendering、Automatic Batching 等新特性，以及如何在实际项目中应用这些特性来提升应用性能。',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'frontend',
    tags: ['react', 'typescript', 'performance'],
    author: 'Chris',
    status: 'published',
    viewCount: 128,
    likeCount: 24,
    createdAt: '2025-03-20T10:00:00.000Z',
    updatedAt: '2025-03-20T10:00:00.000Z',
  },
  {
    title: 'TypeScript 高级类型技巧总结',
    content: `## 为什么要掌握高级类型

TypeScript 的类型系统非常强大，掌握高级类型技巧可以帮助我们编写更安全、更优雅的代码。

## Conditional Types

条件类型让我们能够根据输入类型来决定输出类型：

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>;      // false
\`\`\`

## Mapped Types

映射类型是构建通用工具类型的基础：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## Template Literal Types

TypeScript 4.1 引入的模板字面量类型：

\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;
\`\`\`

## 实战应用

这些技巧在实际项目中非常有用，特别是在开发通用库和工具函数时。`,
    summary: '总结 TypeScript 中条件类型、映射类型、模板字面量类型等高级类型的使用技巧，附带丰富的代码示例。',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'frontend',
    tags: ['typescript', 'thoughts'],
    author: 'Chris',
    status: 'published',
    viewCount: 95,
    likeCount: 18,
    createdAt: '2025-03-15T08:00:00.000Z',
    updatedAt: '2025-03-15T08:00:00.000Z',
  },
  {
    title: 'CloudBase 云开发实战：从零搭建全栈博客',
    content: `## 项目背景

本文将介绍如何使用 CloudBase 云开发从零搭建一个全栈博客应用，包括数据库设计、云函数开发和前端部署。

## 技术选型

- **前端**: React + TypeScript + Vite
- **后端**: CloudBase 云函数 + NoSQL 数据库
- **部署**: CloudBase 静态托管

## 数据库设计

使用 CloudBase NoSQL 文档数据库存储博客数据，设计了以下集合：

| 集合 | 说明 |
| --- | --- |
| blog_posts | 文章 |
| blog_categories | 分类 |
| blog_tags | 标签 |
| blog_comments | 评论 |

## 安全规则配置

合理配置安全规则是保护数据安全的关键步骤。

## 部署流程

通过 CloudBase CLI 或控制台可以一键部署前端到静态托管。

> CloudBase 大大简化了全栈开发的流程，让你可以专注于业务逻辑而非基础设施。`,
    summary: '从零开始使用 CloudBase 云开发搭建全栈博客的完整指南，涵盖数据库设计、安全规则配置和静态托管部署。',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: 'frontend',
    tags: ['react', 'cloudbase', 'typescript'],
    author: 'Chris',
    status: 'published',
    viewCount: 76,
    likeCount: 12,
    createdAt: '2025-03-10T12:00:00.000Z',
    updatedAt: '2025-03-10T12:00:00.000Z',
  },
  {
    title: 'Node.js 后端架构设计最佳实践',
    content: `## 架构设计原则

一个好的后端架构应该遵循 **高内聚低耦合** 的原则，同时具备良好的可扩展性。

## 分层架构

\`\`\`
Controller -> Service -> Repository -> Database
\`\`\`

### Controller 层

负责处理 HTTP 请求和响应，不包含业务逻辑。

### Service 层

核心业务逻辑层，处理所有的业务规则和数据转换。

### Repository 层

数据访问层，封装数据库操作。

## 错误处理

统一的错误处理机制是保证 API 质量的重要因素。

## 总结

好的架构不是一蹴而就的，需要在实践中不断优化和调整。`,
    summary: '探讨 Node.js 后端架构设计的最佳实践，包括分层架构、错误处理、日志系统等核心话题。',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    category: 'backend',
    tags: ['nodejs', 'thoughts'],
    author: 'Chris',
    status: 'published',
    viewCount: 64,
    likeCount: 9,
    createdAt: '2025-03-05T09:00:00.000Z',
    updatedAt: '2025-03-05T09:00:00.000Z',
  },
  {
    title: '写给程序员的 CSS 动画指南',
    content: `## 动画的本质

动画的本质是 **视觉连续性的营造**，让用户感知到状态的平滑过渡。

## Transition vs Animation

- **Transition**: 状态变化时的过渡效果
- **Animation**: 独立运行的动画序列

## 性能优化

只对 \`transform\` 和 \`opacity\` 做动画，因为它们可以被 GPU 加速：

\`\`\`css
.animate {
  transition: transform 0.3s ease, opacity 0.3s ease;
  will-change: transform, opacity;
}
\`\`\`

## 实际案例

结合实际案例演示常见的动画模式。`,
    summary: '从程序员视角出发，系统讲解 CSS 动画的原理、性能优化技巧和实际应用场景。',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    category: 'frontend',
    tags: ['css', 'design', 'performance'],
    author: 'Chris',
    status: 'published',
    viewCount: 52,
    likeCount: 15,
    createdAt: '2025-02-28T14:00:00.000Z',
    updatedAt: '2025-02-28T14:00:00.000Z',
  },
];

const SAMPLE_STATISTICS = {
  _id: 'site_stats',
  totalPosts: 5,
  totalViews: 415,
  totalComments: 12,
  totalLikes: 78,
  updatedAt: new Date().toISOString(),
};

export async function initSampleData() {
  const auth = getAuth();
  await auth.anonymousAuthProvider().signIn();
  console.log('已登录匿名用户');

  const db = getDB();

  // Insert categories
  for (const cat of SAMPLE_CATEGORIES) {
    const result = await db.collection('blog_categories').add(cat);
    if (typeof result.code === 'string') console.error('插入分类失败:', result.code);
    else console.log('插入分类:', cat.name);
  }

  // Insert tags
  for (const tag of SAMPLE_TAGS) {
    const result = await db.collection('blog_tags').add(tag);
    if (typeof result.code === 'string') console.error('插入标签失败:', result.code);
    else console.log('插入标签:', tag.name);
  }

  // Insert posts
  for (const post of SAMPLE_POSTS) {
    const result = await db.collection('blog_posts').add(post);
    if (typeof result.code === 'string') console.error('插入文章失败:', result.code);
    else console.log('插入文章:', post.title);
  }

  // Insert statistics
  const statsResult = await db.collection('blog_statistics').add(SAMPLE_STATISTICS);
  if (typeof statsResult.code === 'string') console.error('插入统计失败:', statsResult.code);
  else console.log('插入统计数据');

  // Insert sample comments
  const sampleComments = [
    { postId: '', nickname: '小明', content: '写得很详细，学到了很多！', parentId: '', createdAt: '2025-03-21T09:30:00.000Z' },
    { postId: '', nickname: 'TechFan', content: 'React 18 的新特性真的很棒，感谢分享。', parentId: '', createdAt: '2025-03-21T11:00:00.000Z' },
    { postId: '', nickname: '设计师小李', content: 'CSS 动画的部分讲得很清楚，收藏了。', parentId: '', createdAt: '2025-03-01T15:20:00.000Z' },
  ];

  // Get first post ID for comments
  const postsResult = await db.collection('blog_posts').where({}).limit(1).get();
  if (postsResult.data && postsResult.data.length > 0) {
    sampleComments[0].postId = postsResult.data[0]._id;
    sampleComments[1].postId = postsResult.data[0]._id;
    const result = await db.collection('blog_comments').add(sampleComments[0]);
    if (typeof result.code !== 'string') console.log('插入评论成功');
    const result2 = await db.collection('blog_comments').add(sampleComments[1]);
    if (typeof result2.code !== 'string') console.log('插入评论成功');
  }

  console.log('示例数据初始化完成！');
}
