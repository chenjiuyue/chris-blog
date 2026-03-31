# Bug 修复报告 v2

## 修复时间
2026-03-26（第二次修复）

---

## 问题分析

### 问题 1：分类统计不准确 ❌ → ✅

**根本原因**：
- 数据库中的文章 `category` 字段不一致
  - 旧文章使用英文 slug：`frontend`、`backend`
  - 新文章使用中文名称：`人工智能`、`开发工具`
- 分类表中 `name` 是中文，`slug` 是英文
- 查询条件只匹配 `name`，导致 slug 类型的文章无法统计

**数据库实际情况**：
```javascript
// 文章表 (blog_posts)
{ category: "frontend" }      // 英文 slug
{ category: "人工智能" }       // 中文名称

// 分类表 (blog_categories)
{ name: "前端开发", slug: "frontend" }
{ name: "人工智能", slug: "ai" }
```

**修复方案**：
```typescript
// 修复前：只匹配 name
.where({
  category: category.name
})

// 修复后：同时匹配 name 和 slug
.where({
  status: 'published',
  category: db.command.in([category.name, category.slug])
})
```

**修复文件**：
- `src/services/categoryService.ts`

---

### 问题 2：目录锚点失效 ❌ → ✅

**根本原因**：
- `PostDetail.tsx` 使用 `String(children)` 提取文本
- React 的 `children` 可能包含嵌套元素或数组
- `String()` 无法正确处理对象类型，可能返回 `[object Object]`

**示例**：
```tsx
// children 可能是这样
<h2>引言 <span className="badge">新</span></h2>

// String(children) → "[object Object]"
// extractText(children) → "引言 新"
```

**修复方案**：
添加递归文本提取函数：

```typescript
function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText(children.props.children);
  }
  return '';
}
```

**修复文件**：
- `src/components/post/PostDetail.tsx`

---

## 修复后的效果

### 分类统计（预期）

| 分类 | 文章数 | 统计来源 |
|------|--------|---------|
| 前端开发 | 5 | frontend |
| 后端开发 | 1 | backend |
| 人工智能 | 5 | 人工智能 |
| 开发工具 | 1 | 开发工具 |

### 目录锚点

- ✅ 点击目录项可以正确跳转到对应章节
- ✅ 滚动时正确高亮当前章节
- ✅ 支持标题中包含内联元素（如代码、链接）

---

## 部署信息

**云端访问地址**：
```
https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/
```

**部署状态**：✅ 成功

**部署时间**：2026-03-26

---

## 验证步骤

### 1. 验证分类统计

1. 打开博客首页
2. 查看侧边栏分类列表
3. 检查每个分类的文章数量是否准确
4. 点击分类，查看文章列表是否匹配

**预期结果**：
- 前端开发：5 篇
- 人工智能：5 篇
- 后端开发：1 篇
- 开发工具：1 篇

### 2. 验证目录锚点

1. 打开任意文章详情页
2. 点击右侧目录中的任意章节
3. 验证页面是否平滑滚动到对应位置
4. 滚动文章，检查目录高亮是否正确

**预期结果**：
- ✅ 点击目录项正确跳转
- ✅ 当前章节在目录中高亮显示

---

## 技术总结

### 分类统计修复要点

1. **数据一致性**：数据库中应统一使用一种标识（name 或 slug）
2. **兼容性查询**：使用 `in` 操作符同时匹配多种格式
3. **实时统计**：避免依赖静态字段，使用实时查询

### 目录锚点修复要点

1. **React children 处理**：不能直接用 `String()` 转换
2. **递归提取**：需要递归处理嵌套结构
3. **ID 一致性**：确保生成和查找使用相同的 ID 逻辑

---

## 后续建议

### 数据规范化

建议统一文章的 `category` 字段格式：

```javascript
// 方案 1：全部使用中文
category: "人工智能"

// 方案 2：全部使用 slug
category: "ai"

// 方案 3：使用引用
categoryId: "cat-ai"
```

### 性能优化

对于分类统计，可以考虑：

1. **缓存机制**：使用 Redis 或本地缓存
2. **定时更新**：云函数定时更新 postCount 字段
3. **增量更新**：文章增删时触发更新

---

## 文件变更

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/services/categoryService.ts` | 修改 | 使用 in 操作符匹配 name 和 slug |
| `src/components/post/PostDetail.tsx` | 修改 | 添加 extractText 函数 |

---

**修复完成！请访问验证。** ✅
