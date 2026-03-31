/**
 * 云函数：获取热门文章
 * 按浏览量排序返回 Top N 文章
 */

exports.main = async (event, context) => {
  const { limit = 5, category, tag } = event;
  
  try {
    const { database } = require('cloudbase');
    const db = database();
    
    let query = db
      .collection('blog_posts')
      .where({
        status: 'published'
      });

    // 按分类筛选
    if (category) {
      query = query.where({ category });
    }

    // 按标签筛选
    if (tag) {
      query = query.where({ tags: db.command.all([tag]) });
    }

    const result = await query
      .orderBy('viewCount', 'desc')
      .limit(limit)
      .field({
        _id: true,
        title: true,
        viewCount: true,
        likeCount: true,
        createdAt: true,
        category: true,
        coverImage: true
      })
      .get();

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('获取热门文章失败:', error);
    return {
      success: false,
      message: error.message || '获取失败',
      data: []
    };
  }
};
