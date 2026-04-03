/**
 * 云函数：获取站点统计详情
 * 聚合查询访问趋势、分类分布、标签统计、热门文章、UV 等
 */

const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    // 1. 获取基础统计
    let baseStats = {
      totalPosts: 0,
      totalViews: 0,
      totalComments: 0,
      totalLikes: 0,
    };
    try {
      const statsResult = await db.collection('blog_statistics').doc('site_stats').get();
      if (statsResult.data && statsResult.data.length > 0) {
        baseStats = statsResult.data[0];
      }
    } catch (e) {
      console.log('blog_statistics 集合可能不存在，使用默认值');
    }

    // 2. 获取分类数量和标签数量
    let totalCategories = 0;
    let totalTags = 0;
    try {
      const catResult = await db.collection('blog_categories').count();
      totalCategories = catResult.total || 0;
    } catch (e) {}
    try {
      const tagResult = await db.collection('blog_tags').count();
      totalTags = tagResult.total || 0;
    } catch (e) {}

    // 3. 获取近30天访问趋势 + UV 统计
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const visitMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().split('T')[0];
      visitMap[key] = 0;
    }

    let totalUV = 0;
    try {
      // 分批获取访问记录（最多2000条）
      let allVisits = [];
      for (let skip = 0; skip < 2000; skip += 1000) {
        const batch = await db.collection('blog_visits')
          .where({ date: _.gte(startDate) })
          .skip(skip)
          .limit(1000)
          .get();
        if (!batch.data || batch.data.length === 0) break;
        allVisits = allVisits.concat(batch.data);
        if (batch.data.length < 1000) break;
      }

      // PV 统计
      allVisits.forEach(v => {
        if (visitMap[v.date] !== undefined) {
          visitMap[v.date]++;
        }
      });

      // UV 统计（优先按 visitorId 去重，回退到 IP）
      const uniqueVisitors = new Set();
      allVisits.forEach(v => {
        const vid = v.visitorId || v.ip;
        if (vid) uniqueVisitors.add(vid);
      });
      totalUV = uniqueVisitors.size;
    } catch (e) {
      console.log('blog_visits 集合可能不存在');
    }

    const visitTrend = Object.entries(visitMap).map(([date, count]) => ({
      date,
      count,
    }));

    const today = now.toISOString().split('T')[0];
    const todayViews = visitMap[today] || 0;

    // 4. 获取所有已发布文章（分批加载，突破 200 条限制）
    let allPosts = [];
    try {
      for (let skip = 0; skip < 2000; skip += 200) {
        const postsResult = await db.collection('blog_posts')
          .where({ status: 'published' })
          .field({ category: true, tags: true, title: true, viewCount: true, likeCount: true, commentCount: true })
          .skip(skip)
          .limit(200)
          .get();
        if (!postsResult.data || postsResult.data.length === 0) break;
        allPosts = allPosts.concat(postsResult.data);
        if (postsResult.data.length < 200) break;
      }
    } catch (e) {}

    // 始终以实际文章数据为准进行汇总（blog_statistics 可能未及时更新）
    const realTotalPosts = allPosts.length;
    const realTotalViews = allPosts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const realTotalLikes = allPosts.reduce((sum, p) => sum + (p.likeCount || 0), 0);

    // 评论数从 blog_comments 集合实际统计
    let realTotalComments = 0;
    try {
      const commentsCountResult = await db.collection('blog_comments').count();
      realTotalComments = commentsCountResult.total || 0;
    } catch (countErr) {
      realTotalComments = allPosts.reduce((sum, p) => sum + (p.commentCount || 0), 0);
    }

    // 取 blog_statistics 和实际数据中的较大值（避免统计倒退）
    baseStats.totalPosts = Math.max(baseStats.totalPosts || 0, realTotalPosts);
    baseStats.totalViews = Math.max(baseStats.totalViews || 0, realTotalViews);
    baseStats.totalLikes = Math.max(baseStats.totalLikes || 0, realTotalLikes);
    baseStats.totalComments = Math.max(baseStats.totalComments || 0, realTotalComments);

    // 4.5 获取分类表，构建 slug → name 映射，统一分类名称
    let categorySlugToName = {};
    try {
      const catListResult = await db.collection('blog_categories').limit(50).get();
      (catListResult.data || []).forEach(cat => {
        // slug → name 映射
        if (cat.slug) categorySlugToName[cat.slug] = cat.name;
        // name → name 映射（保持一致）
        if (cat.name) categorySlugToName[cat.name] = cat.name;
      });
    } catch (e) {}

    // 分类分布（统一使用分类中文名）
    const categoryMap = {};
    allPosts.forEach(p => {
      const rawCat = p.category || '未分类';
      // 通过映射表将 slug 转为中文名，如 'frontend' → '前端开发'
      const catName = categorySlugToName[rawCat] || rawCat;
      categoryMap[catName] = (categoryMap[catName] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 5. 标签统计
    const tagMap = {};
    allPosts.forEach(p => {
      (p.tags || []).forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    const tagStats = Object.entries(tagMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 6. 获取热门文章 Top 10
    let topPosts = [];
    try {
      const hotResult = await db.collection('blog_posts')
        .where({ status: 'published' })
        .orderBy('viewCount', 'desc')
        .field({ title: true, viewCount: true, likeCount: true, commentCount: true })
        .limit(10)
        .get();

      topPosts = (hotResult.data || []).map(p => ({
        _id: p._id,
        title: p.title,
        viewCount: p.viewCount || 0,
        likeCount: p.likeCount || 0,
        commentCount: p.commentCount || 0,
      }));
    } catch (e) {}

    return {
      success: true,
      data: {
        totalPosts: baseStats.totalPosts || 0,
        totalViews: baseStats.totalViews || 0,
        totalComments: baseStats.totalComments || 0,
        totalLikes: baseStats.totalLikes || 0,
        totalTags,
        totalCategories,
        todayViews,
        totalUV,
        visitTrend,
        categoryDistribution,
        topPosts,
        tagStats,
      }
    };
  } catch (error) {
    console.error('获取站点统计失败:', error);
    return {
      success: false,
      message: error.message || '获取统计失败',
      data: null,
    };
  }
};
