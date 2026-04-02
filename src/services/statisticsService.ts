import { getDB, ensureAuth, getCloudBaseApp } from '../config/cloudbase';
import type { BlogStatistics, SiteStatsDetail } from '../types';

const COLLECTION = 'blog_statistics';
const DOC_ID = 'site_stats';

const CACHE_KEY = 'blog_site_stats_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

export async function getBlogStatistics(): Promise<BlogStatistics | null> {
  try {
    await ensureAuth();
    const db = getDB();
    const result = await db.collection(COLLECTION).doc(DOC_ID).get();
    if (typeof result.code === 'string' || !result.data || !result.data[0]) {
      // blog_statistics 文档不存在，回退到云函数获取
      return await getBlogStatisticsFromFunction();
    }
    const raw = result.data[0] as any;
    const stats: BlogStatistics = {
      _id: raw._id || DOC_ID,
      totalPosts: raw.totalPosts ?? 0,
      totalViews: raw.totalViews ?? 0,
      totalComments: raw.totalComments ?? 0,
      totalLikes: raw.totalLikes ?? 0,
      updatedAt: raw.updatedAt || '',
    };
    // 如果 totalPosts 为 0 但实际可能有文章，回退到云函数
    if (stats.totalPosts === 0) {
      return await getBlogStatisticsFromFunction() || stats;
    }
    return stats;
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return null;
  }
}

/** 从云函数获取统计数据（作为 fallback） */
async function getBlogStatisticsFromFunction(): Promise<BlogStatistics | null> {
  try {
    const detail = await getSiteStatsDetail();
    if (detail) {
      return {
        _id: DOC_ID,
        totalPosts: detail.totalPosts,
        totalViews: detail.totalViews,
        totalComments: detail.totalComments,
        totalLikes: detail.totalLikes,
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
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
