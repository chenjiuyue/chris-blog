const cloudbase = require('@cloudbase/node-sdk');

// 初始化 CloudBase SDK
const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();
const _ = db.command;

/**
 * 点赞/取消点赞云函数
 * @param {string} postId - 文章 ID
 * @param {string} userId - 用户 ID（匿名用户标识）
 * @returns {Object} { success, liked, likeCount }
 */
exports.main = async (event, context) => {
  const { postId, userId } = event;

  if (!postId || !userId) {
    return {
      success: false,
      message: '缺少必要参数',
    };
  }

  try {
    // 检查是否已点赞
    const likeRecord = await db.collection('blog_likes')
      .where({
        postId,
        userId,
      })
      .get();

    let liked = false;
    let likeCount = 0;

    if (likeRecord.data.length > 0) {
      // 已点赞 -> 取消点赞
      await db.collection('blog_likes').doc(likeRecord.data[0]._id).remove();

      // 减少文章点赞数
      await db.collection('blog_posts').doc(postId).update({
        likeCount: _.inc(-1),
      });

      liked = false;
    } else {
      // 未点赞 -> 添加点赞
      await db.collection('blog_likes').add({
        postId,
        userId,
        createdAt: new Date().toISOString(),
      });

      // 增加文章点赞数
      await db.collection('blog_posts').doc(postId).update({
        likeCount: _.inc(1),
      });

      liked = true;
    }

    // 获取最新点赞数
    const post = await db.collection('blog_posts').doc(postId).get();
    likeCount = post.data[0]?.likeCount || 0;

    return {
      success: true,
      liked,
      likeCount,
    };
  } catch (error) {
    console.error('点赞操作失败:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};
