import { getDB, ensureAuth, getCloudBaseApp } from '../config/cloudbase';
import type { BlogStatistics, SiteStatsDetail } from '../types';

const COLLECTION = 'blog_statistics';
const DOC_ID = 'site_stats';

const CACHE_KEY = 'blog_site_stats_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

export async function getBlogStatistics(): Promise<BlogStatistics | null> {
  await ensureAuth();
  const db = getDB();
  const result = await db.collection(COLLECTION).doc(DOC_ID).get();
  if (typeof result.code === 'string') {
    console.error('获取统计数据失败:', result.code);
    return null;
  }
  return result.data[0] as BlogStatistics || null;
}

/** 获取完整的站点统计数据（带 localStorage 缓存） */
export async function getSiteStatsDetail(): Promise<SiteStatsDetail | null> {
  // 尝试读取缓存
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data as SiteStatsDetail;
      }
    }
  } catch {}

  try {
    await ensureAuth();
    const app = getCloudBaseApp();
    const result = await app.callFunction({
      name: 'blog-getSiteStats',
      data: {}
    });
    const res = result.result as { success: boolean; data: SiteStatsDetail };
    if (res.success && res.data) {
      // 写入缓存
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: res.data,
          timestamp: Date.now(),
        }));
      } catch {}
      return res.data;
    }
    console.error('获取站点统计失败:', res);
    return null;
  } catch (error) {
    console.error('获取站点统计失败:', error);
    return null;
  }
}
