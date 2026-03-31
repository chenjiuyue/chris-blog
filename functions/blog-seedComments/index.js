/**
 * 云函数：批量生成评论数据
 * 为每篇文章生成 10-20 条真实感评论，并更新评论计数
 */

const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();
const _ = db.command;

// 评论者昵称池
const nicknames = [
  '前端小白', '代码猎人', '技术宅小明', '全栈开发者', 'JS爱好者',
  '云原生探索者', 'React粉丝', '架构师老王', '产品经理小李', '后端大神',
  'Python玩家', '数据分析师', 'AI研究员', '独立开发者', '开源贡献者',
  '技术博主', '学生党小张', '运维工程师', '测试达人', '设计师小美',
  'DevOps实践者', '微服务架构师', '算法工程师', '嵌入式开发', 'Go语言爱好者',
  '数据库专家', '安全研究员', '云计算工程师', '移动端开发', '区块链探索者',
];

// 通用正面评论模板
const generalComments = [
  '写得非常好，学到了很多新知识！感谢分享。',
  '这篇文章太棒了，正好解决了我遇到的问题。',
  '很有深度的文章，期待后续更新！',
  '收藏了，以后还要反复看几遍。',
  '作者写得真清晰，比官方文档好懂多了。',
  '终于找到一篇讲得明白的文章了，感谢！',
  '干货满满，已经分享给同事了。',
  '看完之后对这个领域有了更深的理解。',
  '每篇文章都这么有质量，佩服佩服。',
  '已经按照文章的方法实践了，效果很好！',
  '这个系列太赞了，希望能继续更新。',
  '总结得很全面，点赞收藏一波。',
  '感谢博主的无私分享，受益匪浅。',
  '讲解得很到位，新手也能看懂。',
  '非常实用的技术文章，mark 一下。',
];

// 技术讨论评论模板
const techComments = [
  '请问这种方案在高并发场景下表现怎么样？',
  '我在项目中也遇到了类似问题，你的方案给了我很大启发。',
  '能不能出一篇关于性能优化的文章？',
  '这个方案和 xxx 相比有什么优势吗？很好奇。',
  '看完文章后自己动手实现了一遍，确实学到了东西。',
  '建议可以补充一下错误处理的部分，那块也很重要。',
  '代码示例非常清晰，直接复制过去就能用。',
  '之前一直用的旧方案，看了这篇决定升级了。',
  '有没有考虑过用 TypeScript 重写？类型安全很重要。',
  '这种设计模式我在其他项目中也有用到，很经典。',
  '希望能看到更多实战案例的分享。',
  '文章中提到的那个工具我也在用，确实好用。',
  '学习了，打算用在我的毕业设计里。',
  '请问有没有相关的视频教程？想更深入学习。',
  '很棒的总结，我把要点整理成了笔记。',
];

// 回复评论模板
const replyComments = [
  '同意楼上的观点，我也是这么想的。',
  '补充一下，我觉得还可以从另一个角度来看这个问题。',
  '我的做法稍有不同，但思路是类似的。',
  '确实如此，实际项目中要注意的细节还挺多的。',
  '感谢补充，又学到了新东西。',
  '这个观点很有意思，值得深入思考。',
  '我之前也踩过这个坑，后来换了方案才解决。',
  '你说得对，文档确实应该更详细一些。',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 生成随机时间（在文章创建时间之后）
function randomDate(afterDate) {
  const after = new Date(afterDate).getTime();
  const now = Date.now();
  const ts = after + Math.random() * (now - after);
  return new Date(ts).toISOString();
}

exports.main = async (event, context) => {
  try {
    // 获取所有已发布文章
    const postsResult = await db.collection('blog_posts')
      .where({ status: 'published' })
      .field({ _id: true, title: true, createdAt: true, commentCount: true })
      .limit(100)
      .get();

    const posts = postsResult.data || [];
    if (posts.length === 0) {
      return { success: false, message: '没有找到已发布文章' };
    }

    let totalNewComments = 0;
    const results = [];

    for (const post of posts) {
      // 先查现有评论数
      const existingResult = await db.collection('blog_comments')
        .where({ postId: post._id })
        .count();
      const existingCount = existingResult.total || 0;

      // 每篇文章目标 10-20 条评论
      const targetCount = randomInt(10, 20);
      const needCount = Math.max(0, targetCount - existingCount);

      if (needCount === 0) {
        results.push({ postId: post._id, title: post.title, added: 0, total: existingCount });
        continue;
      }

      const usedNicknames = new Set();
      const newCommentIds = [];

      for (let i = 0; i < needCount; i++) {
        // 选择不重复的昵称
        let nickname;
        do {
          nickname = randomItem(nicknames);
        } while (usedNicknames.has(nickname) && usedNicknames.size < nicknames.length);
        usedNicknames.add(nickname);

        // 决定是顶级评论还是回复
        const isReply = i > 2 && newCommentIds.length > 0 && Math.random() < 0.3;

        const content = isReply
          ? randomItem(replyComments)
          : randomItem([...generalComments, ...techComments]);

        const parentId = isReply ? randomItem(newCommentIds) : '';
        const createdAt = randomDate(post.createdAt || '2026-01-01');

        const addResult = await db.collection('blog_comments').add({
          postId: post._id,
          nickname,
          content,
          parentId,
          createdAt,
        });

        if (addResult.id) {
          newCommentIds.push(addResult.id);
        }
      }

      const finalTotal = existingCount + needCount;
      totalNewComments += needCount;

      // 更新文章的 commentCount
      await db.collection('blog_posts').doc(post._id).update({
        commentCount: finalTotal,
      });

      results.push({ postId: post._id, title: post.title, added: needCount, total: finalTotal });
    }

    // 更新全站统计
    const totalCommentsResult = await db.collection('blog_comments').count();
    try {
      await db.collection('blog_statistics').doc('site_stats').update({
        totalComments: totalCommentsResult.total || 0,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {}

    return {
      success: true,
      message: `共生成 ${totalNewComments} 条评论`,
      data: results,
    };
  } catch (error) {
    console.error('生成评论失败:', error);
    return {
      success: false,
      message: error.message || '生成失败',
    };
  }
};
