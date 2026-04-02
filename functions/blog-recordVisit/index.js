/**
 * 云函数：记录访问日志
 * 用于统计分析访问数据
 */

const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();

exports.main = async (event, context) => {
  const { 
    postId, 
    page, 
    referrer, 
    userAgent,
    visitorId,
  } = event;
  
  try {
    // 尝试从 context 获取来源 IP
    const ip = context.sourceIp || context.ip || '';
    // 使用前端传来的 visitorId 作为唯一访客标识（IP 可能在云函数 SDK 调用时为空）
    const vid = visitorId || ip || '';

    // 记录访问日志
    await db.collection('blog_visits').add({
      postId: postId || null,
      page: page || '/',
      referrer: referrer || '',
      userAgent: userAgent || '',
      ip: ip,
      visitorId: vid,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0] // 用于日期分组
    });

    return {
      success: true,
      message: '访问记录成功'
    };
  } catch (error) {
    console.error('记录访问失败:', error);
    return {
      success: false,
      message: error.message || '记录失败'
    };
  }
};
