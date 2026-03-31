import { getCloudBaseApp, ensureAuth } from '../config/cloudbase';

/**
 * 切换文章点赞状态
 * @param postId 文章 ID
 * @param userId 用户 ID（从 localStorage 获取或生成）
 */
export async function toggleLike(postId: string, userId: string): Promise<{
  success: boolean;
  liked: boolean;
  likeCount: number;
  message?: string;
}> {
  try {
    await ensureAuth();
    const app = getCloudBaseApp();

    const result = await app.callFunction({
      name: 'blog-toggleLike',
      data: {
        postId,
        userId,
      },
    });

    if (result.result) {
      return result.result as {
        success: boolean;
        liked: boolean;
        likeCount: number;
        message?: string;
      };
    }

    return {
      success: false,
      liked: false,
      likeCount: 0,
      message: '调用云函数失败',
    };
  } catch (error) {
    console.error('点赞操作失败:', error);
    return {
      success: false,
      liked: false,
      likeCount: 0,
      message: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 获取或生成用户唯一标识
 */
export function getUserId(): string {
  const key = 'blog_user_id';
  let userId = localStorage.getItem(key);

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, userId);
  }

  return userId;
}

/**
 * 检查文章是否已点赞
 */
export function checkLiked(postId: string): boolean {
  const key = `liked_${postId}`;
  return localStorage.getItem(key) === 'true';
}

/**
 * 保存点赞状态到本地
 */
export function saveLikedStatus(postId: string, liked: boolean): void {
  const key = `liked_${postId}`;
  if (liked) {
    localStorage.setItem(key, 'true');
  } else {
    localStorage.removeItem(key);
  }
}
