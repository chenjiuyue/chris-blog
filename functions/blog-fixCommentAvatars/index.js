/**
 * 云函数：blog-fixCommentAvatars
 * 为所有缺少头像的评论批量添加对应 blog_users 的头像
 */
const cloudbase = require("@cloudbase/node-sdk");

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV,
});
const db = app.database();
const _ = db.command;

// 昵称 → blog_users 中的头像映射
const NICKNAME_AVATAR_MAP = {
  "叶知秋": "https://api.dicebear.com/7.x/adventurer/svg?seed=Coco&backgroundColor=ffdfbf",
  "陈墨白": "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=d1d4f9",
  "赵一鸣": "https://api.dicebear.com/7.x/adventurer/svg?seed=Kiki&backgroundColor=fbc4ab",
  "方圆": "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe&backgroundColor=c9e4de",
  "林小北": "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4",
  "温言": "https://api.dicebear.com/7.x/adventurer/svg?seed=Maple&backgroundColor=f3d2c1",
  "程默": "https://api.dicebear.com/7.x/adventurer/svg?seed=Rocky&backgroundColor=c6dbda",
  "宋晓晓": "https://api.dicebear.com/7.x/adventurer/svg?seed=Willow&backgroundColor=e8c1a0",
  "顾辰": "https://api.dicebear.com/7.x/adventurer/svg?seed=Atlas&backgroundColor=bde0fe",
  "韩小暖": "https://api.dicebear.com/7.x/adventurer/svg?seed=Sasha&backgroundColor=ffd6e0",
  "江一帆": "https://api.dicebear.com/7.x/adventurer/svg?seed=Orion&backgroundColor=d5c4a1",
  "苏晴": "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc",
  "夏一凡": "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=c0aede",
  "许清和": "https://api.dicebear.com/7.x/adventurer/svg?seed=Mochi&backgroundColor=abdee6",
  "沈佳宜": "https://api.dicebear.com/7.x/adventurer/svg?seed=Tofu&backgroundColor=f6eac2",
  "楚天阔": "https://api.dicebear.com/7.x/adventurer/svg?seed=Storm&backgroundColor=a2d2ff",
  "白鹿": "https://api.dicebear.com/7.x/adventurer/svg?seed=Nova&backgroundColor=dfe7fd",
  "唐不苦": "https://api.dicebear.com/7.x/adventurer/svg?seed=Panda&backgroundColor=e8d5b7",
  "周子琪": "https://api.dicebear.com/7.x/adventurer/svg?seed=Nala&backgroundColor=b6f4c4",
  "秦漠": "https://api.dicebear.com/7.x/adventurer/svg?seed=Blaze&backgroundColor=ffc8dd",
};

exports.main = async (event, context) => {
  let totalUpdated = 0;
  const errors = [];

  for (const [nickname, avatar] of Object.entries(NICKNAME_AVATAR_MAP)) {
    try {
      // 查询该昵称下所有评论
      const { data } = await db
        .collection("blog_comments")
        .where({ nickname })
        .limit(100)
        .get();

      for (const comment of data) {
        // 只更新没有 avatar 字段或 avatar 为空的评论
        if (!comment.avatar) {
          await db.collection("blog_comments").doc(comment._id).update({
            avatar,
          });
          totalUpdated++;
        }
      }
    } catch (err) {
      errors.push(`${nickname}: ${err.message}`);
    }
  }

  return {
    success: true,
    totalUpdated,
    errors: errors.length > 0 ? errors : undefined,
    message: `共更新 ${totalUpdated} 条评论的头像`,
  };
};
