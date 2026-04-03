import { getDB, ensureAuth } from '../config/cloudbase';
import type { Post } from '../types';

const COLLECTION = 'blog_posts';

export type PostSortField = 'createdAt' | 'viewCount' | 'commentCount' | 'likeCount';

export async function getPublishedPosts(limit = 10, skip = 0, sortField: PostSortField = 'createdAt'): Promise<Post[]> {
  await ensureAuth();
  const db = getDB();
  const order = sortField === 'createdAt' ? 'desc' : 'desc';
  const result = await db.collection(COLLECTION)
    .where({ status: 'published' })
    .orderBy(sortField, order)
    .skip(skip)
    .limit(limit)
    .get();
  if (typeof result.code === 'string') {
    console.error('获取文章列表失败:', result.code);
    return [];
  }
  return result.data as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION).doc(id).get();
  if (typeof result.code === 'string') {
    console.error('获取文章详情失败:', result.code);
    return null;
  }
  return result.data[0] as Post || null;
}

export async function searchPosts(keyword: string): Promise<Post[]> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION)
    .where({
      status: 'published',
      title: db.RegExp({
        regexp: keyword,
        options: 'i',
      }),
    })
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
  if (typeof result.code === 'string') {
    console.error('搜索文章失败:', result.code);
    return [];
  }
  return result.data as Post[];
}

export async function getPostsByCategory(slug: string, limit = 10, skip = 0): Promise<Post[]> {
  await ensureAuth();
  const db = getDB();
  
  // 先查询分类，获取 name 和 slug
  const catResult = await db.collection('blog_categories')
    .where({ slug })
    .limit(1)
    .get();
  
  const category = catResult.data[0] as { name: string; slug: string } | undefined;
  
  // 同时匹配 slug 和 name
  const categories = category 
    ? [slug, category.name] 
    : [slug];
  
  const result = await db.collection(COLLECTION)
    .where({ 
      status: 'published', 
      category: db.command.in(categories)
    })
    .orderBy('createdAt', 'desc')
    .skip(skip)
    .limit(limit)
    .get();
  if (typeof result.code === 'string') {
    console.error('按分类获取文章失败:', result.code);
    return [];
  }
  return result.data as Post[];
}

export async function getPostsByTag(tagSlug: string, limit = 10, skip = 0): Promise<Post[]> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION)
    .where({ status: 'published', tags: tagSlug })
    .orderBy('createdAt', 'desc')
    .skip(skip)
    .limit(limit)
    .get();
  if (typeof result.code === 'string') {
    console.error('按标签获取文章失败:', result.code);
    return [];
  }
  return result.data as Post[];
}

export async function getRelatedPosts(postId: string, category: string, tags: string[], limit = 3): Promise<Post[]> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION)
    .where({
      status: 'published',
      _id: db.command.neq(postId),
    })
    .orderBy('createdAt', 'desc')
    .limit(limit + 2)
    .get();
  if (typeof result.code === 'string') {
    console.error('获取相关文章失败:', result.code);
    return [];
  }
  const posts = result.data as Post[];
  return posts
    .filter(p => p.category === category || (p.tags || []).some(t => tags.includes(t)))
    .slice(0, limit);
}
