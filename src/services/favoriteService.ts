const FAVORITES_KEY = 'blog_favorites';

export interface FavoritePost {
  postId: string;
  title: string;
  createdAt: string;
}

/**
 * 获取所有收藏的文章 ID
 */
export function getFavorites(): FavoritePost[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 检查文章是否已收藏
 */
export function isFavorited(postId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.postId === postId);
}

/**
 * 添加收藏
 */
export function addFavorite(postId: string, title: string): void {
  const favorites = getFavorites();
  if (!favorites.some(f => f.postId === postId)) {
    favorites.unshift({
      postId,
      title,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

/**
 * 取消收藏
 */
export function removeFavorite(postId: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.postId !== postId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

/**
 * 切换收藏状态
 */
export function toggleFavorite(postId: string, title: string): boolean {
  if (isFavorited(postId)) {
    removeFavorite(postId);
    return false;
  } else {
    addFavorite(postId, title);
    return true;
  }
}
