import { getDB, ensureAuth } from '../config/cloudbase';
import type { Tag } from '../types';

const COLLECTION = 'blog_tags';

export async function getAllTags(): Promise<Tag[]> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION)
    .orderBy('postCount', 'desc')
    .limit(30)
    .get();
  if (typeof result.code === 'string') {
    console.error('获取标签列表失败:', result.code);
    return [];
  }
  return result.data as Tag[];
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION)
    .where({ slug })
    .limit(1)
    .get();
  if (typeof result.code === 'string') {
    console.error('获取标签失败:', result.code);
    return null;
  }
  return (result.data as Tag[])[0] || null;
}
