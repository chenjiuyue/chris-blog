/**
 * 云函数：递增文章浏览量
 * 避免并发问题，使用原子操作
 */

const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { postId } = event;
  
  if (!postId) {
    return {
      success: false,
      message: '缺少文章ID'
    };
  }

  try {
    // 使用原子操作递增浏览量
    await db
      .collection('blog_posts')
      .doc(postId)
      .update({
        viewCount: _.inc(1)
      });

    // 更新全站统计
    try {
      const existing = await db.collection('blog_statistics').doc('site_stats').get();
      if (existing.data && existing.data.length > 0) {
        await db.collection('blog_statistics').doc('site_stats').update({
          totalViews: _.inc(1),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      // site_stats 不存在时忽略
    }

    return {
      success: true,
      message: '浏览量更新成功'
    };
  } catch (error) {
    console.error('更新浏览量失败:', error);
    return {
      success: false,
      message: error.message || '更新失败'
    };
  }
};
