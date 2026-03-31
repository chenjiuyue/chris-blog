/**
 * 云函数：递增文章浏览量
 * 避免并发问题，使用原子操作
 */

exports.main = async (event, context) => {
  const { postId } = event;
  
  if (!postId) {
    return {
      success: false,
      message: '缺少文章ID'
    };
  }

  try {
    const { database } = require('cloudbase');
    const db = database();
    
    // 使用原子操作递增浏览量
    await db
      .collection('blog_posts')
      .doc(postId)
      .update({
        viewCount: db.command.inc(1)
      });

    // 更新全站统计
    await db
      .collection('blog_statistics')
      .where({
        _id: 'global'
      })
      .update({
        totalViews: db.command.inc(1),
        updatedAt: new Date().toISOString()
      });

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
