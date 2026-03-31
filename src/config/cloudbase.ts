import cloudbase from '@cloudbase/js-sdk';

let appInstance: ReturnType<typeof cloudbase.init> | null = null;
let isLoginInitialized = false;

export function getCloudBaseApp() {
  if (!appInstance) {
    appInstance = cloudbase.init({
      env: import.meta.env.VITE_CLOUDBASE_ENV_ID || 'chris-know',
    });
  }
  return appInstance;
}

export async function initAuth() {
  if (isLoginInitialized) return;
  
  const app = getCloudBaseApp();
  const auth = app.auth();
  
  try {
    // 检查是否已登录
    const loginState = await auth.getLoginState();
    if (!loginState) {
      // 使用匿名登录
      await auth.anonymousAuthProvider().signIn();
      console.log('CloudBase 匿名登录成功');
    }
    isLoginInitialized = true;
  } catch (error) {
    console.error('CloudBase 登录失败:', error);
    throw error;
  }
}

// 确保认证已完成
export async function ensureAuth() {
  if (!isLoginInitialized) {
    await initAuth();
  }
  return isLoginInitialized;
}

export function getDB() {
  const app = getCloudBaseApp();
  return app.database();
}

export function getAuth() {
  const app = getCloudBaseApp();
  return app.auth();
}
