/**
 * 公告服务
 * 获取和管理网站公告
 */

import { getCloudBaseApp, ensureAuth } from '../config/cloudbase';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  startTime: string;
  endTime: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取当前有效的公告
 */
export async function getActiveAnnouncement(): Promise<Announcement | null> {
  try {
    await ensureAuth();
    const app = getCloudBaseApp();
    const db = app.database();
    
    const now = new Date();
    
    const result = await db
      .collection('blog_announcements')
      .where({
        status: 'active'
      })
      .get();

    // 在前端过滤时间范围
    const active = result.data.find((item: any) => {
      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);
      return now >= startTime && now <= endTime;
    });

    return active || null;
  } catch (error) {
    console.error('获取公告失败:', error);
    return null;
  }
}

/**
 * 获取所有公告（管理用）
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    await ensureAuth();
    const app = getCloudBaseApp();
    const db = app.database();

    const result = await db
      .collection('blog_announcements')
      .orderBy('createdAt', 'desc')
      .get();

    return result.data as Announcement[];
  } catch (error) {
    console.error('获取公告列表失败:', error);
    return [];
  }
}

/**
 * 创建公告
 */
export async function createAnnouncement(announcement: Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
  try {
    await ensureAuth();
    const app = getCloudBaseApp();
    const db = app.database();

    const now = new Date().toISOString();
    
    await db.collection('blog_announcements').add({
      ...announcement,
      createdAt: now,
      updatedAt: now
    });

    return true;
  } catch (error) {
    console.error('创建公告失败:', error);
    return false;
  }
}

/**
 * 更新公告
 */
export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<boolean> {
  try {
    await ensureAuth();
    const app = getCloudBaseApp();
    const db = app.database();

    await db
      .collection('blog_announcements')
      .doc(id)
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      });

    return true;
  } catch (error) {
    console.error('更新公告失败:', error);
    return false;
  }
}

/**
 * 删除公告
 */
export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    await ensureAuth();
    const app = getCloudBaseApp();
    const db = app.database();

    await db.collection('blog_announcements').doc(id).remove();

    return true;
  } catch (error) {
    console.error('删除公告失败:', error);
    return false;
  }
}
