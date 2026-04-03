/**
 * 云函数：每日聚合统计
 * 定时触发（每日凌晨 1:00），将当日数据汇总到 blog_daily_stats 集合
 * 同时更新 blog_statistics 全站汇总
 */

const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const now = new Date();
    // 统计的是昨天的数据
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split('T')[0];

    console.log(`开始聚合 ${date} 的统计数据...`);

    // 1. 获取当日访问记录
    let dayVisits = [];
    try {
      for (let skip = 0; skip < 5000; skip += 1000) {
        const batch = await db.collection('blog_visits')
          .where({ date })
          .skip(skip)
          .limit(1000)
          .get();
        if (!batch.data || batch.data.length === 0) break;
        dayVisits = dayVisits.concat(batch.data);
        if (batch.data.length < 1000) break;
      }
    } catch (e) {
      console.log('获取访问记录失败:', e.message);
    }

    // PV
    const pv = dayVisits.length;

    // UV（优先按 visitorId 去重，回退到 IP）
    const uniqueVisitors = new Set();
    dayVisits.forEach(v => {
      const vid = v.visitorId || v.ip;
      if (vid) uniqueVisitors.add(vid);
    });
    const uv = uniqueVisitors.size;

    // 当日热门页面
    const pageMap = {};
    dayVisits.forEach(v => {
      if (v.postId) {
        pageMap[v.postId] = (pageMap[v.postId] || 0) + 1;
      }
    });
    const topPages = Object.entries(pageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([postId, views]) => ({ postId, views }));

    // 2. 获取当日新增文章数
    let newPosts = 0;
    try {
      const postsResult = await db.collection('blog_posts')
        .where({
          createdAt: _.gte(date + 'T00:00:00').and(_.lt(date + 'T23:59:59'))
        })
        .count();
      newPosts = postsResult.total || 0;
    } catch (e) {}

    // 3. 获取当日新增评论数
    let newComments = 0;
    try {
      const commentsResult = await db.collection('blog_comments')
        .where({
          createdAt: _.gte(date + 'T00:00:00').and(_.lt(date + 'T23:59:59'))
        })
        .count();
      newComments = commentsResult.total || 0;
    } catch (e) {}

    // 4. 写入 blog_daily_stats
    const dailyDoc = {
      date,
      pv,
      uv,
      newPosts,
      newComments,
      topPages,
      createdAt: now.toISOString(),
    };

    try {
      // 先尝试查找是否已存在当天记录
      const existing = await db.collection('blog_daily_stats')
        .where({ date })
        .limit(1)
        .get();

      if (existing.data && existing.data.length > 0) {
        await db.collection('blog_daily_stats').doc(existing.data[0]._id).update(dailyDoc);
        console.log(`更新 ${date} 每日统计`);
      } else {
        await db.collection('blog_daily_stats').add(dailyDoc);
        console.log(`新增 ${date} 每日统计`);
      }
    } catch (e) {
      console.log('写入 blog_daily_stats 失败:', e.message);
    }

    // 5. 更新全站汇总 blog_statistics
    try {
      const allPosts = await db.collection('blog_posts')
        .where({ status: 'published' })
        .field({ viewCount: true, likeCount: true })
        .limit(500)
        .get();

      const posts = allPosts.data || [];
      const totalPosts = posts.length;
      const totalViews = posts.reduce((s, p) => s + (p.viewCount || 0), 0);
      const totalLikes = posts.reduce((s, p) => s + (p.likeCount || 0), 0);

      // 评论数从 blog_comments 集合实际统计
      let totalComments = 0;
      try {
        const commentsCountResult = await db.collection('blog_comments').count();
        totalComments = commentsCountResult.total || 0;
      } catch (countErr) {
        // 回退到文章 commentCount 汇总
        const commentPosts = await db.collection('blog_posts')
          .where({ status: 'published' })
          .field({ commentCount: true })
          .limit(500)
          .get();
        totalComments = (commentPosts.data || []).reduce((s, p) => s + (p.commentCount || 0), 0);
      }

      const statsDoc = {
        totalPosts,
        totalViews,
        totalComments,
        totalLikes,
        updatedAt: now.toISOString(),
      };

      try {
        const existingStats = await db.collection('blog_statistics').doc('site_stats').get();
        if (existingStats.data && existingStats.data.length > 0) {
          await db.collection('blog_statistics').doc('site_stats').update(statsDoc);
        } else {
          await db.collection('blog_statistics').add({ ...statsDoc, _id: 'site_stats' });
        }
      } catch (e) {
        await db.collection('blog_statistics').add({ ...statsDoc, _id: 'site_stats' });
      }

      console.log('全站统计已更新');
    } catch (e) {
      console.log('更新全站统计失败:', e.message);
    }

    return {
      success: true,
      message: `${date} 统计聚合完成`,
      data: { date, pv, uv, newPosts, newComments }
    };
  } catch (error) {
    console.error('聚合统计失败:', error);
    return {
      success: false,
      message: error.message || '聚合失败'
    };
  }
};
