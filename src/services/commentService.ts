import { getDB, getAuth, ensureAuth } from '../config/cloudbase';
import type { Comment } from '../types';

const COLLECTION = 'blog_comments';

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION)
    .where({ postId })
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();
  if (typeof result.code === 'string') {
    console.error('获取评论失败:', result.code);
    return [];
  }
  return result.data as Comment[];
}

export async function createComment(postId: string, nickname: string, content: string, parentId = ''): Promise<Comment | null> {
  await ensureAuth();
  const auth = getAuth();
  const loginState = await auth.getLoginState();
  if (!loginState) {
    console.error('评论需要先登录');
    return null;
  }

  const db = getDB();
  const now = new Date().toISOString();
  const result = await db.collection(COLLECTION).add({
    postId,
    nickname,
    content,
    parentId,
    createdAt: now,
  });

  if (typeof result.code === 'string') {
    console.error('创建评论失败:', result.code);
    return null;
  }

  return {
    _id: result.id,
    postId,
    nickname,
    content,
    parentId,
    createdAt: now,
  };
}
