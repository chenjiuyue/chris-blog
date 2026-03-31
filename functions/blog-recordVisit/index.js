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
  } = event;
  
  try {
    // 尝试从 context 获取来源 IP
    const ip = context.sourceIp || context.ip || '';

    // 记录访问日志
    await db.collection('blog_visits').add({
      postId: postId || null,
      page: page || '/',
      referrer: referrer || '',
      userAgent: userAgent || '',
      ip: ip,
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
