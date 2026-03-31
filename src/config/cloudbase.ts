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
  
  // 检查是否已有登录状态
  const loginState = await auth.getLoginState();
  if (loginState) {
    // 已有登录态（可能是用户登录或匿名），复用
    isLoginInitialized = true;
    return;
  }

  // 没有任何登录态，使用匿名登录兜底
  await auth.anonymousAuthProvider().signIn();
  console.log('CloudBase 匿名登录成功');
  isLoginInitialized = true;
}

/** 重置登录状态标记（用于退出登录后重新初始化） */
export function resetLoginState() {
  isLoginInitialized = false;
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
