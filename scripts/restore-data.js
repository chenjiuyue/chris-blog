import cloudbase from '@cloudbase/node-sdk';

// 初始化 CloudBase
const app = cloudbase.init({
  env: 'lowcode-0gwpl9v4125156ef'
});

const db = app.database();

// ===== 初始种子文章（5篇）=====
const SEED_POSTS = [
  {
    _id: 'post-001',
    title: '使用 React 18 构建高性能前端应用',
    content: `## 前言\n\nReact 18 带来了许多激动人心的新特性，其中最值得关注的是 **Concurrent Mode** 和 **Automatic Batching**。本文将深入探讨如何利用这些特性构建高性能的前端应用。\n\n## Concurrent Rendering\n\nConcurrent Rendering 是 React 18 最重要的更新之一。它允许 React **中断**渲染过程，处理更高优先级的更新。\n\n\`\`\`tsx\nimport { startTransition } from 'react';\n\nfunction SearchResults({ query }) {\n  const [results, setResults] = useState([]);\n\n  const handleChange = (e) => {\n    setInputValue(e.target.value);\n    startTransition(() => {\n      setSearchQuery(e.target.value);\n    });\n  };\n}\n\`\`\`\n\n## Automatic Batching\n\n在 React 18 之前，只有 React 事件处理函数中的更新会被批量处理。现在，**所有**更新都会自动批量处理。\n\n## Suspense 改进\n\n\`\`\`tsx\n<Suspense fallback={<Loading />}>\n  <AsyncComponent />\n</Suspense>\n\`\`\`\n\n## 总结\n\nReact 18 的这些改进让我们能够构建更加流畅和响应式的用户界面。建议在新项目中尽早采用这些特性。`,
    summary: '深入探讨 React 18 的 Concurrent Rendering、Automatic Batching 等新特性，以及如何在实际项目中应用这些特性来提升应用性能。',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'frontend',
    tags: ['react', 'typescript', 'performance'],
    author: 'Chris',
    status: 'published',
    viewCount: 128,
    likeCount: 24,
    commentCount: 0,
    publishedAt: '2026-03-20T10:00:00.000Z',
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    _id: 'post-002',
    title: 'TypeScript 高级类型技巧总结',
    content: `## 为什么要掌握高级类型\n\nTypeScript 的类型系统非常强大，掌握高级类型技巧可以帮助我们编写更安全、更优雅的代码。\n\n## Conditional Types\n\n条件类型让我们能够根据输入类型来决定输出类型：\n\n\`\`\`typescript\ntype IsString<T> = T extends string ? true : false;\n\ntype A = IsString<'hello'>; // true\ntype B = IsString<42>;      // false\n\`\`\`\n\n## Mapped Types\n\n映射类型是构建通用工具类型的基础：\n\n\`\`\`typescript\ntype Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};\n\ntype Partial<T> = {\n  [P in keyof T]?: T[P];\n};\n\`\`\`\n\n## Template Literal Types\n\nTypeScript 4.1 引入的模板字面量类型：\n\n\`\`\`typescript\ntype EventName = \`on\${Capitalize<string>}\`;\n\`\`\`\n\n## 实战应用\n\n这些技巧在实际项目中非常有用，特别是在开发通用库和工具函数时。`,
    summary: '总结 TypeScript 中条件类型、映射类型、模板字面量类型等高级类型的使用技巧，附带丰富的代码示例。',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'frontend',
    tags: ['typescript', 'thoughts'],
    author: 'Chris',
    status: 'published',
    viewCount: 95,
    likeCount: 18,
    commentCount: 0,
    publishedAt: '2026-03-15T08:00:00.000Z',
    createdAt: '2026-03-15T08:00:00.000Z',
    updatedAt: '2026-03-15T08:00:00.000Z',
  },
  {
    _id: 'post-003',
    title: 'CloudBase 云开发实战：从零搭建全栈博客',
    content: `## 项目背景\n\n本文将介绍如何使用 CloudBase 云开发从零搭建一个全栈博客应用，包括数据库设计、云函数开发和前端部署。\n\n## 技术选型\n\n- **前端**: React + TypeScript + Vite\n- **后端**: CloudBase 云函数 + NoSQL 数据库\n- **部署**: CloudBase 静态托管\n\n## 数据库设计\n\n使用 CloudBase NoSQL 文档数据库存储博客数据，设计了以下集合：\n\n| 集合 | 说明 |\n| --- | --- |\n| blog_posts | 文章 |\n| blog_categories | 分类 |\n| blog_tags | 标签 |\n| blog_comments | 评论 |\n\n## 安全规则配置\n\n合理配置安全规则是保护数据安全的关键步骤。\n\n## 部署流程\n\n通过 CloudBase CLI 或控制台可以一键部署前端到静态托管。\n\n> CloudBase 大大简化了全栈开发的流程，让你可以专注于业务逻辑而非基础设施。`,
    summary: '从零开始使用 CloudBase 云开发搭建全栈博客的完整指南，涵盖数据库设计、安全规则配置和静态托管部署。',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: 'frontend',
    tags: ['react', 'cloudbase', 'typescript'],
    author: 'Chris',
    status: 'published',
    viewCount: 76,
    likeCount: 12,
    commentCount: 0,
    publishedAt: '2026-03-10T12:00:00.000Z',
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-03-10T12:00:00.000Z',
  },
  {
    _id: 'post-004',
    title: 'Node.js 后端架构设计最佳实践',
    content: `## 架构设计原则\n\n一个好的后端架构应该遵循 **高内聚低耦合** 的原则，同时具备良好的可扩展性。\n\n## 分层架构\n\n\`\`\`\nController -> Service -> Repository -> Database\n\`\`\`\n\n### Controller 层\n\n负责处理 HTTP 请求和响应，不包含业务逻辑。\n\n### Service 层\n\n核心业务逻辑层，处理所有的业务规则和数据转换。\n\n### Repository 层\n\n数据访问层，封装数据库操作。\n\n## 错误处理\n\n统一的错误处理机制是保证 API 质量的重要因素。\n\n## 总结\n\n好的架构不是一蹴而就的，需要在实践中不断优化和调整。`,
    summary: '探讨 Node.js 后端架构设计的最佳实践，包括分层架构、错误处理、日志系统等核心话题。',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    category: 'backend',
    tags: ['nodejs', 'thoughts'],
    author: 'Chris',
    status: 'published',
    viewCount: 64,
    likeCount: 9,
    commentCount: 0,
    publishedAt: '2026-03-05T09:00:00.000Z',
    createdAt: '2026-03-05T09:00:00.000Z',
    updatedAt: '2026-03-05T09:00:00.000Z',
  },
  {
    _id: 'post-005',
    title: '写给程序员的 CSS 动画指南',
    content: `## 动画的本质\n\n动画的本质是 **视觉连续性的营造**，让用户感知到状态的平滑过渡。\n\n## Transition vs Animation\n\n- **Transition**: 状态变化时的过渡效果\n- **Animation**: 独立运行的动画序列\n\n## 性能优化\n\n只对 \`transform\` 和 \`opacity\` 做动画，因为它们可以被 GPU 加速：\n\n\`\`\`css\n.animate {\n  transition: transform 0.3s ease, opacity 0.3s ease;\n  will-change: transform, opacity;\n}\n\`\`\`\n\n## 实际案例\n\n结合实际案例演示常见的动画模式。`,
    summary: '从程序员视角出发，系统讲解 CSS 动画的原理、性能优化技巧和实际应用场景。',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    category: 'frontend',
    tags: ['css', 'design', 'performance'],
    author: 'Chris',
    status: 'published',
    viewCount: 52,
    likeCount: 15,
    commentCount: 0,
    publishedAt: '2026-02-28T14:00:00.000Z',
    createdAt: '2026-02-28T14:00:00.000Z',
    updatedAt: '2026-02-28T14:00:00.000Z',
  },
];

async function restore() {
  try {
    const collection = db.collection('blog_posts');
    
    console.log('🔄 开始恢复种子文章数据（5篇）...\n');
    
    for (const post of SEED_POSTS) {
      try {
        await collection.add(post);
        console.log(`✅ 恢复成功：${post.title}`);
      } catch (e) {
        console.error(`❌ 恢复失败：${post.title}`, e.message);
      }
    }
    
    // 验证
    const result = await collection.where({ status: 'published' }).count();
    console.log(`\n📊 当前已发布文章数: ${result.total}`);
    console.log('\n🎉 种子文章恢复完成！');
    console.log('\n⚠️  接下来请运行：');
    console.log('  node scripts/seed-ai-articles.js');
    console.log('  node scripts/seed-ai-articles-v2.js');
    
  } catch (error) {
    console.error('❌ 恢复失败:', error);
    process.exit(1);
  }
}

restore();
