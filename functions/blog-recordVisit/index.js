/**
 * 云函数：记录访问日志
 * 用于统计分析访问数据
 */

exports.main = async (event, context) => {
  const { 
    postId, 
    page, 
    referrer, 
    userAgent, 
    ip 
  } = event;
  
  try {
    const { database } = require('cloudbase');
    const db = database();
    
    // 记录访问日志
    await db.collection('blog_visits').add({
      postId: postId || null,
      page: page || '/',
      referrer: referrer || '',
      userAgent: userAgent || '',
      ip: ip || '',
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
