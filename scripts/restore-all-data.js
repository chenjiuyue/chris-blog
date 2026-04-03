import cloudbase from '@cloudbase/node-sdk';

const app = cloudbase.init({
  env: 'lowcode-0gwpl9v4125156ef'
});

const db = app.database();

// ===== 5篇种子文章 =====
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
    commentCount: 7,
    publishedAt: '2026-03-20T10:00:00.000Z',
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    _id: 'post-002',
    title: 'TypeScript 高级类型技巧总结',
    content: `## 为什么要掌握高级类型\n\nTypeScript 的类型系统非常强大，掌握高级类型技巧可以帮助我们编写更安全、更优雅的代码。\n\n## Conditional Types\n\n条件类型让我们能够根据输入类型来决定输出类型：\n\n\`\`\`typescript\ntype IsString<T> = T extends string ? true : false;\n\ntype A = IsString<'hello'>; // true\ntype B = IsString<42>;      // false\n\`\`\`\n\n## Mapped Types\n\n映射类型是构建通用工具类型的基础：\n\n\`\`\`typescript\ntype Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};\n\ntype Partial<T> = {\n  [P in keyof T]?: T[P];\n};\n\`\`\`\n\n## Template Literal Types\n\nTypeScript 4.1 引入的模板字面量类型：\n\n\`\`\`typescript\ntype EventName = \\\`on\\\${Capitalize<string>}\\\`;\n\`\`\`\n\n## 实战应用\n\n这些技巧在实际项目中非常有用，特别是在开发通用库和工具函数时。`,
    summary: '总结 TypeScript 中条件类型、映射类型、模板字面量类型等高级类型的使用技巧，附带丰富的代码示例。',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'frontend',
    tags: ['typescript', 'thoughts'],
    author: 'Chris',
    status: 'published',
    viewCount: 95,
    likeCount: 18,
    commentCount: 7,
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
    commentCount: 7,
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
    commentCount: 7,
    publishedAt: '2026-03-05T09:00:00.000Z',
    createdAt: '2026-03-05T09:00:00.000Z',
    updatedAt: '2026-03-05T09:00:00.000Z',
  },
  {
    _id: 'post-005',
    title: '写给程序员的 CSS 动画指南',
    content: `## 动画的本质\n\n动画的本质是 **视觉连续性的营造**，让用户感知到状态的平滑过渡。\n\n## Transition vs Animation\n\n- **Transition**: 状态变化时的过渡效果\n- **Animation**: 独立运行的动画序列\n\n## 性能优化\n\n只对 \\\`transform\\\` 和 \\\`opacity\\\` 做动画，因为它们可以被 GPU 加速：\n\n\`\`\`css\n.animate {\n  transition: transform 0.3s ease, opacity 0.3s ease;\n  will-change: transform, opacity;\n}\n\`\`\`\n\n## 实际案例\n\n结合实际案例演示常见的动画模式。`,
    summary: '从程序员视角出发，系统讲解 CSS 动画的原理、性能优化技巧和实际应用场景。',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    category: 'frontend',
    tags: ['css', 'design', 'performance'],
    author: 'Chris',
    status: 'published',
    viewCount: 52,
    likeCount: 15,
    commentCount: 7,
    publishedAt: '2026-02-28T14:00:00.000Z',
    createdAt: '2026-02-28T14:00:00.000Z',
    updatedAt: '2026-02-28T14:00:00.000Z',
  },
];

// ===== 6篇AI文章（第一批，有实际评论）=====
const AI_POSTS_V1 = [
  { _id: 'ai-gpt-5-2026', title: 'GPT-5 发布在即：下一代大语言模型将带来哪些突破？', summary: '深入分析 GPT-5 即将带来的四大突破：推理能力提升、多模态融合、长上下文处理和个性化定制，展望 AI 应用的未来。', coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', category: '人工智能', tags: ['GPT-5', '大模型', 'OpenAI', 'AI突破'], author: 'Chris', status: 'published', viewCount: 1523, likeCount: 89, commentCount: 9, createdAt: '2026-03-25T10:00:00.000Z', updatedAt: '2026-03-25T10:00:00.000Z', content: '# GPT-5 发布在即\n\n2026年，OpenAI 即将发布 GPT-5。\n\n## 主要突破方向\n\n### 1. 推理能力大幅提升\nGPT-5 在复杂推理任务上的准确率提升了 40% 以上。\n\n### 2. 多模态深度融合\n实现了文本、图像、音频、视频的真正统一理解。\n\n### 3. 长上下文处理\n支持最多 200K tokens 的上下文窗口。\n\n### 4. 个性化与定制化\n引入了全新的个性化机制。' },
  { _id: 'ai-agents-2026', title: 'AI Agent 革命：从聊天机器人到自主智能体', summary: '探索 AI Agent 的核心技术、主流框架和实际应用，了解 2026 年智能体技术的最新进展和未来趋势。', coverImage: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800', category: '人工智能', tags: ['AI Agent', '智能体', 'LangChain', '自动化'], author: 'Chris', status: 'published', viewCount: 2341, likeCount: 156, commentCount: 7, createdAt: '2026-03-20T14:30:00.000Z', updatedAt: '2026-03-20T14:30:00.000Z', content: '# AI Agent 革命\n\nAI Agent 是能够自主感知环境、做出决策、执行行动的 AI 系统。\n\n## 2026 年 Agent 技术进展\n\n### 主流框架\n- LangChain\n- AutoGPT\n- CrewAI\n\n### 实际应用\n- 软件开发 Agent\n- 数据分析 Agent\n- 内容创作 Agent\n\n## Agent 技术的未来\n\nAI Agent 正在从概念走向实用。' },
  { _id: 'ai-coding-2026', title: 'AI 编程工具横评：Cursor vs GitHub Copilot vs Codeium', summary: '深入对比 Cursor、GitHub Copilot 和 Codeium 三款主流 AI 编程工具，帮助你选择最适合的 AI 编程助手。', coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', category: '开发工具', tags: ['AI编程', 'Cursor', 'Copilot', '效率工具'], author: 'Chris', status: 'published', viewCount: 3892, likeCount: 234, commentCount: 8, createdAt: '2026-03-15T09:00:00.000Z', updatedAt: '2026-03-15T09:00:00.000Z', content: '# AI 编程工具横评\n\n## Cursor\nAI 原生编辑器，深度集成 AI 能力。\n- Cmd+K 内联编辑\n- 代码库对话\n- Composer 模式\n\n## GitHub Copilot\n微软推出的 AI 结对编程工具。\n- 实时代码补全\n- Copilot Chat\n- Copilot Workspace\n\n## Codeium\n新兴的免费 AI 编程助手。\n- 多语言支持 70+\n- 响应延迟 <100ms\n- 企业级安全' },
  { _id: 'rag-technology-2026', title: 'RAG 技术深度解析：让 AI 拥有实时知识库', summary: '深入解析 RAG 技术原理、架构设计和最佳实践，包括向量数据库选型、高级检索技术和实战案例。', coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', category: '人工智能', tags: ['RAG', '向量数据库', '知识库', 'LLM'], author: 'Chris', status: 'published', viewCount: 1876, likeCount: 112, commentCount: 7, createdAt: '2026-03-10T16:00:00.000Z', updatedAt: '2026-03-10T16:00:00.000Z', content: '# RAG 技术深度解析\n\nRAG（Retrieval-Augmented Generation）是一种结合检索和生成的 AI 技术。\n\n## 为什么需要 RAG？\n- 知识截止问题\n- 幻觉问题\n- 领域知识不足\n- 私有数据访问\n\n## RAG 技术架构\n用户提问 → 问题理解 → 向量检索 → 召回文档 → 重排序 → 构建提示词 → 大模型生成 → 返回结果\n\n## 高级技术\n- 混合检索\n- 重排序\n- 查询改写' },
  { _id: 'ai-multimodal-2026', title: '多模态 AI 进展：视觉语言模型的最新突破', summary: '全面介绍多模态 AI 和视觉语言模型的最新进展，包括主流模型对比、核心应用场景、技术原理和最佳实践。', coverImage: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800', category: '人工智能', tags: ['多模态AI', '视觉语言模型', 'GPT-4V', '图像理解'], author: 'Chris', status: 'published', viewCount: 2456, likeCount: 178, commentCount: 7, createdAt: '2026-03-05T11:30:00.000Z', updatedAt: '2026-03-05T11:30:00.000Z', content: '# 多模态 AI 进展\n\n2026年，多模态 AI 迎来爆发式发展。\n\n## 主流模型\n- GPT-4 Vision：最强综合能力\n- Claude 3 Opus：最佳长文本处理\n- Gemini 1.5 Pro：多模态统一\n\n## 核心应用\n- 图像理解与分析\n- 文档智能处理\n- 视觉问答系统\n- 图像生成与编辑' },
  { _id: 'ai-prompt-engineering', title: '提示工程进阶：从入门到精通的完整指南', summary: '从基础到高级的提示工程完整指南，涵盖思维链、Few-Shot、结构化模板等核心技术，附带丰富的实战案例。', coverImage: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800', category: '人工智能', tags: ['提示工程', 'Prompt', 'ChatGPT', '技巧'], author: 'Chris', status: 'published', viewCount: 3124, likeCount: 201, commentCount: 8, createdAt: '2026-03-01T08:00:00.000Z', updatedAt: '2026-03-01T08:00:00.000Z', content: '# 提示工程进阶\n\n提示工程是与 AI 大模型高效沟通的艺术和科学。\n\n## 基础技巧\n- 角色设定\n- 任务拆解\n- 示例驱动\n\n## 高级技巧\n- Chain-of-Thought（思维链）\n- Few-Shot Learning\n- ReAct（推理+行动）\n\n## 结构化提示模板\n- P-R-E-P 模型\n- SCQA 框架' },
];

// ===== 11篇AI文章（第二批，无实际评论）=====
const AI_POSTS_V2 = [
  { _id: 'ai-mcp-protocol-2026', title: 'MCP 协议详解：AI 应用的标准化连接层', summary: '深入解析 MCP 协议的核心概念、开发方式和生态现状。', coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', category: '人工智能', tags: ['MCP', 'AI协议', '工具集成', '开发框架'], author: 'Chris', status: 'published', viewCount: 1245, likeCount: 87, commentCount: 0, createdAt: '2026-04-02T08:00:00.000Z', updatedAt: '2026-04-02T08:00:00.000Z', content: '# MCP 协议详解\n\nModel Context Protocol（MCP）是 AI 应用生态中最重要的标准化协议。\n\n## 核心概念\n- Tools（工具）\n- Resources（资源）\n- Prompts（提示）\n\n## MCP Server 开发\n支持 TypeScript 和 Python 实现。\n\n## 生态现状\nCursor、VS Code、Claude Desktop、CodeBuddy 均已支持。' },
  { _id: 'ai-deepseek-v3-2026', title: 'DeepSeek V3 深度评测：国产大模型的逆袭之路', summary: '全面评测 DeepSeek V3 大模型。', coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', category: '人工智能', tags: ['DeepSeek', '大模型', '开源AI', 'MoE'], author: 'Chris', status: 'published', viewCount: 3567, likeCount: 245, commentCount: 0, createdAt: '2026-04-01T10:00:00.000Z', updatedAt: '2026-04-01T10:00:00.000Z', content: '# DeepSeek V3 深度评测\n\nDeepSeek V3 以极低的训练成本和卓越的性能震惊全球。\n\n## 核心技术\n- MoE 混合专家架构：671B 总参数，37B 激活\n- Multi-Token Prediction\n- FP8 混合精度训练\n\n## 性能\n训练成本仅 $5.5M，API 价格仅为 GPT-4o 的 1/35。' },
  { _id: 'ai-agentic-workflow-2026', title: 'Agentic Workflow 实战：构建企业级 AI 自动化流水线', summary: '实战讲解 Agentic Workflow 的核心概念和技术架构。', coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', category: '人工智能', tags: ['Agentic Workflow', 'LangGraph', 'AI自动化', '智能体'], author: 'Chris', status: 'published', viewCount: 2134, likeCount: 167, commentCount: 0, createdAt: '2026-03-30T09:00:00.000Z', updatedAt: '2026-03-30T09:00:00.000Z', content: '# Agentic Workflow 实战\n\nAgentic Workflow 是 2026 年 AI 领域最热门的方向之一。\n\n## 核心概念\n传统工作流 vs Agentic 工作流\n\n## 技术架构\n使用 LangGraph 实现，支持人机协作。\n\n## 最佳实践\n- 任务分解\n- 状态管理\n- 可观测性\n- 渐进式自动化' },
  { _id: 'ai-local-llm-2026', title: '本地部署大模型完全指南：从 Ollama 到生产环境', summary: '从 Ollama 到 vLLM 再到 llama.cpp，全面介绍本地部署大模型的方案。', coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', category: '人工智能', tags: ['本地部署', 'Ollama', 'vLLM', '大模型'], author: 'Chris', status: 'published', viewCount: 4123, likeCount: 312, commentCount: 0, createdAt: '2026-03-28T14:00:00.000Z', updatedAt: '2026-03-28T14:00:00.000Z', content: '# 本地部署大模型完全指南\n\n## 为什么要本地部署？\n- 数据隐私\n- 成本可控\n- 低延迟\n- 自定义\n\n## 方案一：Ollama（推荐入门）\n## 方案二：vLLM（生产级推理）\n## 方案三：llama.cpp（极致优化）' },
  { _id: 'ai-fine-tuning-2026', title: 'AI 微调实战：用 LoRA 打造领域专属模型', summary: '手把手教你使用 LoRA/QLoRA 微调大语言模型。', coverImage: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800', category: '人工智能', tags: ['微调', 'LoRA', 'Fine-tuning', '大模型'], author: 'Chris', status: 'published', viewCount: 2876, likeCount: 198, commentCount: 0, createdAt: '2026-03-26T11:00:00.000Z', updatedAt: '2026-03-26T11:00:00.000Z', content: '# AI 微调实战\n\n## LoRA 原理\n通过添加低秩矩阵实现高效微调，训练参数减少 99%+。\n\n## 实战步骤\n1. 准备数据集\n2. 配置训练参数\n3. 开始训练\n4. 合并与部署\n\n## QLoRA\n4-bit 量化加载，7B 模型仅需 ~6GB 显存。' },
  { _id: 'ai-sora-video-2026', title: 'AI 视频生成全景：从 Sora 到可灵，谁主沉浮？', summary: '全面对比 Sora、可灵、Runway、Pika 等主流 AI 视频生成工具。', coverImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800', category: '人工智能', tags: ['Sora', 'AI视频', '视频生成', '可灵'], author: 'Chris', status: 'published', viewCount: 5234, likeCount: 378, commentCount: 0, createdAt: '2026-03-24T10:30:00.000Z', updatedAt: '2026-03-24T10:30:00.000Z', content: '# AI 视频生成全景\n\n2026 年是 AI 视频生成的爆发之年。\n\n## 主流产品\n- OpenAI Sora：最强文生视频\n- 快手可灵：国产最强\n- Runway Gen-3：专业创作者\n- Pika 2.0\n\n## 技术原理\n扩散模型 + Transformer' },
  { _id: 'ai-reasoning-o3-2026', title: '推理模型崛起：从 o1 到 o3，AI "慢思考"的力量', summary: '从 o1 到 o3，深入分析推理模型的工作原理和基准测试表现。', coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', category: '人工智能', tags: ['推理模型', 'o3', 'OpenAI', '思维链'], author: 'Chris', status: 'published', viewCount: 3456, likeCount: 267, commentCount: 0, createdAt: '2026-03-22T08:30:00.000Z', updatedAt: '2026-03-22T08:30:00.000Z', content: '# 推理模型崛起\n\n## 快思考 vs 慢思考\nGPT-4o 是快思考，o3 是慢思考。\n\n## o3 的核心突破\n- 深度推理链\n- 自我纠错\n- ARC-AGI: 87.5%\n\n## 适用场景\n数学证明、代码调试、架构设计、科研分析。' },
  { _id: 'ai-cursor-advanced-2026', title: 'Cursor 高阶玩法：10 个提升编程效率的隐藏技巧', summary: '分享 Cursor AI 编辑器的 10 个高阶技巧。', coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', category: '开发工具', tags: ['Cursor', 'AI编程', '效率工具', '开发技巧'], author: 'Chris', status: 'published', viewCount: 6789, likeCount: 456, commentCount: 0, createdAt: '2026-03-18T10:00:00.000Z', updatedAt: '2026-03-18T10:00:00.000Z', content: '# Cursor 高阶玩法\n\n## 10 个隐藏技巧\n1. .cursorrules 定制 AI 行为\n2. Composer 多文件编辑\n3. @ 符号引用上下文\n4. 智能 Lint 修复\n5. Tab 预测补全\n6. Cmd+K 内联编辑\n7. 项目索引优化\n8. 自定义 AI 模型\n9. Git 集成技巧\n10. 调试辅助' },
  { _id: 'ai-embedding-vector-2026', title: '向量数据库实战：从 Embedding 到语义搜索系统', summary: '从 Embedding 原理到向量数据库选型，手把手教你构建语义搜索系统。', coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', category: '人工智能', tags: ['向量数据库', 'Embedding', '语义搜索', 'RAG'], author: 'Chris', status: 'published', viewCount: 2345, likeCount: 189, commentCount: 0, createdAt: '2026-03-16T15:00:00.000Z', updatedAt: '2026-03-16T15:00:00.000Z', content: '# 向量数据库实战\n\n## Embedding 基础\n将文本转换为高维向量，相似含义距离更近。\n\n## 向量数据库选型\n- Chroma（推荐入门）\n- Pinecone（推荐生产）\n- Weaviate\n- Milvus\n- Qdrant\n\n## 构建语义搜索系统\n文档输入 → 文本切分 → Embedding → 向量数据库 → 搜索' },
  { _id: 'ai-claude-code-2026', title: 'AI 终端编程：Claude Code vs Codex CLI 实战对比', summary: '深度对比 Claude Code 和 Codex CLI 两款终端 AI 编程工具。', coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800', category: '开发工具', tags: ['Claude Code', 'Codex CLI', '终端编程', 'AI工具'], author: 'Chris', status: 'published', viewCount: 4567, likeCount: 334, commentCount: 0, createdAt: '2026-03-14T09:30:00.000Z', updatedAt: '2026-03-14T09:30:00.000Z', content: '# AI 终端编程对比\n\n## Claude Code\n- 200K 上下文\n- 工具调用\n- 多文件编辑\n- 安全审查\n\n## Codex CLI\n- 开源\n- 沙箱执行\n- 多模型支持\n- suggest/auto-edit/full-auto 模式\n\n## 选择建议\nClaude Code 适合大项目，Codex CLI 注重安全性。' },
  { _id: 'ai-safety-alignment-2026', title: 'AI 安全与对齐：大模型时代的守护之道', summary: '全面解析 AI 安全与对齐技术。', coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800', category: '人工智能', tags: ['AI安全', '对齐', 'RLHF', '红队测试'], author: 'Chris', status: 'published', viewCount: 1987, likeCount: 145, commentCount: 0, createdAt: '2026-03-12T14:00:00.000Z', updatedAt: '2026-03-12T14:00:00.000Z', content: '# AI 安全与对齐\n\n## 核心挑战\n- 幻觉问题\n- 越狱攻击\n- 偏见与公平性\n\n## 对齐技术\n- RLHF（人类反馈强化学习）\n- DPO（直接偏好优化）\n- Constitutional AI（宪法 AI）\n\n## 应用层安全\n- 输入过滤\n- 输出审核\n- 多层防御架构\n- 红队测试' },
];

const ALL_POSTS = [...SEED_POSTS, ...AI_POSTS_V1, ...AI_POSTS_V2];

async function restore() {
  try {
    const collection = db.collection('blog_posts');

    // 检查现有数据
    const existing = await collection.count();
    console.log(`📊 当前 blog_posts 集合文档数: ${existing.total}`);

    if (existing.total > 0) {
      console.log('⚠️  集合中仍有数据，将跳过已存在的文档\n');
    }

    console.log(`🔄 开始恢复全部 ${ALL_POSTS.length} 篇文章...\n`);

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (const post of ALL_POSTS) {
      try {
        // 检查是否已存在
        const check = await collection.doc(post._id).get();
        if (check.data && check.data.length > 0) {
          console.log(`⏭️  已存在，跳过：${post.title}`);
          skipCount++;
          continue;
        }
      } catch (e) {
        // 文档不存在，继续插入
      }

      try {
        await collection.add(post);
        console.log(`✅ 恢复成功：${post.title} (commentCount: ${post.commentCount})`);
        successCount++;
      } catch (e) {
        console.error(`❌ 恢复失败：${post.title}`, e.message);
        failCount++;
      }
    }

    // 验证
    const finalCount = await collection.where({ status: 'published' }).count();
    console.log(`\n========== 恢复完成 ==========`);
    console.log(`✅ 成功: ${successCount}`);
    console.log(`⏭️  跳过: ${skipCount}`);
    console.log(`❌ 失败: ${failCount}`);
    console.log(`📊 当前已发布文章数: ${finalCount.total}`);

    // 同步 blog_statistics
    const statsCollection = db.collection('blog_statistics');
    try {
      await statsCollection.doc('site_stats').update({
        totalPosts: finalCount.total,
        totalComments: 81,
      });
      console.log('\n📈 blog_statistics 已同步更新');
    } catch (e) {
      console.warn('⚠️  更新 blog_statistics 失败:', e.message);
    }

    console.log('\n🎉 数据恢复完成！');

  } catch (error) {
    console.error('❌ 恢复失败:', error);
    process.exit(1);
  }
}

restore();
