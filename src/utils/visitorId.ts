/**
 * 获取唯一访客标识（用于 UV 统计）
 * 生成后存入 localStorage，保证同一浏览器的访客 ID 一致
 */
const STORAGE_KEY = 'blog_visitor_id';

function generateId(): string {
  // 使用 crypto.randomUUID 或 fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback: 简单随机 ID
  return 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage 不可用时返回临时 ID
    return generateId();
  }
}
