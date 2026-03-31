import { getCloudBaseApp, getDB } from '../config/cloudbase';
import type { AuthUser, BlogUser } from '../types';

const auth = getCloudBaseApp().auth();

/** 发送短信验证码 */
export async function sendSmsCode(phoneNumber: string) {
  const phone = phoneNumber.startsWith('+86') ? phoneNumber : `+86 ${phoneNumber}`;
  const verificationInfo = await auth.getVerification({ phone_number: phone });
  return verificationInfo;
}

/** 验证码登录/注册（合一流程） */
export async function loginWithSms(
  phoneNumber: string,
  verificationCode: string,
  verificationInfo: any
) {
  const phone = phoneNumber.startsWith('+86') ? phoneNumber : `+86 ${phoneNumber}`;

  // 验证验证码
  const verificationTokenRes = await auth.verify({
    verification_id: verificationInfo.verification_id,
    verification_code: verificationCode,
  });

  if (verificationInfo.is_user) {
    // 老用户：直接登录
    await auth.signIn({
      username: phone,
      verification_token: verificationTokenRes.verification_token,
    });
  } else {
    // 新用户：注册并登录
    await auth.signUp({
      phone_number: phone,
      verification_code: verificationCode,
      verification_token: verificationTokenRes.verification_token,
      name: `用户${phoneNumber.slice(-4)}`,
    });
  }

  // 登录成功后同步用户信息到 blog_users
  const user = await getCurrentUser();
  if (user) {
    await syncBlogUser(user);
  }
  return user;
}

/** 获取当前登录用户（合并 blog_users 集合中的最新头像和昵称） */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const user = await auth.getCurrentUser();
  if (!user || !user.uid) return null;
  const u = user as any;

  // 基础信息从 Auth 层获取
  const authUser: AuthUser = {
    uid: user.uid,
    phone: u.phone || '',
    name: user.name || '',
    picture: u.picture || '',
    email: user.email || '',
  };

  // 尝试从 blog_users 集合获取最新的昵称和头像（以数据库为准）
  try {
    const blogUser = await getBlogUser(user.uid);
    if (blogUser) {
      if (blogUser.nickname) authUser.name = blogUser.nickname;
      if (blogUser.avatar) authUser.picture = blogUser.avatar;
    }
  } catch {
    // blog_users 读取失败不影响基础信息返回
  }

  return authUser;
}

/** 退出登录 */
export async function signOut() {
  await auth.signOut();
}

/** 更新用户资料（Auth 用户基本信息） */
export async function updateUserProfile(data: { name?: string; picture?: string }) {
  try {
    const user = await auth.getCurrentUser();
    if (!user) return;
    await user.update(data);
  } catch (error) {
    // Auth 用户资料更新失败不应阻塞 blog_users 的保存
    console.warn('Auth 用户资料更新失败（不影响数据库保存）:', error);
  }
}

/** 同步用户信息到 blog_users 集合 */
async function syncBlogUser(user: AuthUser) {
  const db = getDB();
  const collection = db.collection('blog_users');
  const now = new Date().toISOString();

  // 使用 doc(uid).get() 检查用户是否存在（与安全规则 auth.uid == doc._id 兼容）
  try {
    const existing = await getBlogUser(user.uid);
    if (!existing) {
      // 新用户，用 doc(uid).set 创建，确保 _id = uid 匹配安全规则
      await collection.doc(user.uid).set({
        phone: user.phone,
        nickname: user.name || `用户${user.phone.slice(-4)}`,
        avatar: user.picture || '',
        bio: '',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // 已有用户，更新最后登录时间
      await collection.doc(user.uid).update({
        updatedAt: now,
      });
    }
  } catch (error) {
    console.warn('同步用户信息失败:', error);
  }
}

/** 获取博客用户扩展信息 */
export async function getBlogUser(uid: string): Promise<BlogUser | null> {
  const db = getDB();
  // 使用 doc(uid).get() 而非 where 查询，确保安全规则 auth.uid == doc._id 能正确匹配
  try {
    const { data } = await db.collection('blog_users').doc(uid).get();
    if (data && data.length > 0) {
      return data[0] as BlogUser;
    }
    // 某些 SDK 版本 doc().get() 返回单个对象而非数组
    if (data && !Array.isArray(data) && (data as any)._id) {
      return data as unknown as BlogUser;
    }
    return null;
  } catch {
    return null;
  }
}

/** 更新博客用户扩展信息 */
export async function updateBlogUser(uid: string, updates: Partial<BlogUser>) {
  const db = getDB();
  await db.collection('blog_users').doc(uid).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/** 检查登录状态 */
export async function checkLoginState() {
  const loginState = await auth.getLoginState();
  if (!loginState) return null;

  const scope = await auth.loginScope();
  if (scope === 'anonymous') return null;

  return getCurrentUser();
}
