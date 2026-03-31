import { getDB, ensureAuth } from '../config/cloudbase';

const COLLECTION = 'blog_favorites';

// 收藏状态变更事件系统，用于跨组件同步收藏状态
type FavoriteChangeListener = (postId: string, isFavorited: boolean) => void;
const listeners = new Set<FavoriteChangeListener>();

export function onFavoriteChange(listener: FavoriteChangeListener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function emitFavoriteChange(postId: string, isFav: boolean) {
  listeners.forEach(fn => fn(postId, isFav));
}

export interface FavoritePost {
  _id?: string;
  postId: string;
  title: string;
  userId: string;
  createdAt: string;
}

/**
 * 获取当前用户的所有收藏（必须登录）
 */
export async function getFavorites(uid: string): Promise<FavoritePost[]> {
  try {
    await ensureAuth();
    const db = getDB();
    const result = await db.collection(COLLECTION)
      .where({ userId: uid })
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    if (typeof result.code === 'string') {
      console.error('获取收藏失败:', result.code);
      return [];
    }
    return (result.data || []) as FavoritePost[];
  } catch (error) {
    console.error('获取收藏失败:', error);
    return [];
  }
}

/**
 * 检查文章是否已收藏（必须登录）
 */
export async function isFavorited(postId: string, uid: string): Promise<boolean> {
  try {
    await ensureAuth();
    const db = getDB();
    const result = await db.collection(COLLECTION)
      .where({ userId: uid, postId })
      .limit(1)
      .get();
    return !!(result.data && result.data.length > 0);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
}

/**
 * 添加收藏
 */
export async function addFavorite(postId: string, title: string, uid: string): Promise<boolean> {
  try {
    await ensureAuth();
    const db = getDB();
    // 先检查是否已收藏，避免重复
    const existing = await db.collection(COLLECTION)
      .where({ userId: uid, postId })
      .limit(1)
      .get();
    if (existing.data && existing.data.length > 0) {
      return true; // 已经收藏了
    }
    const result = await db.collection(COLLECTION).add({
      postId,
      title,
      userId: uid,
      createdAt: new Date().toISOString(),
    });
    if (typeof result.code === 'string') {
      console.error('添加收藏失败:', result.code);
      return false;
    }
    emitFavoriteChange(postId, true);
    return true;
  } catch (error) {
    console.error('添加收藏失败:', error);
    return false;
  }
}

/**
 * 取消收藏
 */
export async function removeFavorite(postId: string, uid: string): Promise<boolean> {
  try {
    await ensureAuth();
    const db = getDB();
    const existing = await db.collection(COLLECTION)
      .where({ userId: uid, postId })
      .limit(1)
      .get();

    if (existing.data && existing.data.length > 0) {
      const result = await db.collection(COLLECTION).doc(existing.data[0]._id).remove();
      if (typeof result.code === 'string') {
        console.error('取消收藏失败:', result.code);
        return false;
      }
      emitFavoriteChange(postId, false);
      return true;
    }
    // 本来就没收藏，也算成功
    emitFavoriteChange(postId, false);
    return true;
  } catch (error) {
    console.error('取消收藏失败:', error);
    return false;
  }
}
