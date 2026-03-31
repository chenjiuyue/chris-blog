import { getDB, ensureAuth } from '../config/cloudbase';
import type { Category } from '../types';

const COLLECTION = 'blog_categories';
const POSTS_COLLECTION = 'blog_posts';

export async function getAllCategories(): Promise<Category[]> {
  await ensureAuth();
  const db = getDB();
  
  // 获取所有分类
  const result = await db.collection(COLLECTION)
    .limit(20)
    .get();
  
  if (typeof result.code === 'string') {
    console.error('获取分类列表失败:', result.code);
    return [];
  }
  
  const categories = result.data as Category[];
  
  // 实时统计每个分类的文章数量（同时匹配 name 和 slug）
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      // 使用 in 操作符同时匹配 name 和 slug
      const countResult = await db.collection(POSTS_COLLECTION)
        .where({
          status: 'published',
          category: db.command.in([category.name, category.slug])
        })
        .count();
      
      return {
        ...category,
        postCount: countResult.total || 0
      };
    })
  );
  
  // 按文章数量降序排序
  return categoriesWithCount.sort((a, b) => b.postCount - a.postCount);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION)
    .where({ slug })
    .limit(1)
    .get();
  if (typeof result.code === 'string') {
    console.error('获取分类失败:', result.code);
    return null;
  }
  return (result.data as Category[])[0] || null;
}
