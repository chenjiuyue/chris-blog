import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, LogOut, Loader2, Check, Upload, X, ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getBlogUser, updateUserProfile } from '../services/authService';
import { getCloudBaseApp, getDB } from '../config/cloudbase';
import type { BlogUser } from '../types';

// 10 个动漫风格预设头像（使用 DiceBear API 生成）
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Coco&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Nala&backgroundColor=b6f4c4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Kiki&backgroundColor=fbc4ab',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Mochi&backgroundColor=abdee6',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Tofu&backgroundColor=f6eac2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Panda&backgroundColor=e8d5b7',
];

export default function ProfilePage() {
  const { user, isLoggedIn, loading: authLoading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [blogUser, setBlogUser] = useState<BlogUser | null>(null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [authLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (!user?.uid) return;
    async function load() {
      const bu = await getBlogUser(user!.uid);
      if (bu) {
        setBlogUser(bu);
        setNickname(bu.nickname);
        setAvatar(bu.avatar);
        setBio(bu.bio);
      } else {
        setNickname(user!.name || '');
        setAvatar(user!.picture || '');
      }
    }
    load();
  }, [user]);

  // 上传本地图片到云存储
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    // 校验文件类型和大小
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB');
      return;
    }

    setUploading(true);
    try {
      const app = getCloudBaseApp();
      const ext = file.name.split('.').pop() || 'jpg';
      const cloudPath = `avatars/${user.uid}_${Date.now()}.${ext}`;

      const result = await app.uploadFile({
        cloudPath,
        filePath: file as unknown as string, // Web SDK 适配器接受 File 对象
      });

      if (result.fileID) {
        // 获取临时访问链接
        const urlResult = await app.getTempFileURL({
          fileList: [result.fileID],
        });
        const url = urlResult.fileList?.[0]?.tempFileURL;
        if (url) {
          setAvatar(url);
          setShowAvatarPicker(false);
        }
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
      // 清空 input 以便重复选择同一文件
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [user]);

  // 选择预设头像
  const handleSelectPreset = (url: string) => {
    setAvatar(url);
    setShowAvatarPicker(false);
  };

  const handleSave = useCallback(async () => {
    if (!user?.uid || saving) return;
    setSaving(true);
    try {
      // 1. 更新 CloudBase Auth 用户资料（失败不阻塞）
      await updateUserProfile({ name: nickname, picture: avatar });

      // 2. 更新 blog_users 集合
      const db = getDB();
      const now = new Date().toISOString();

      if (blogUser) {
        // 已有记录 — 使用 update 只更新指定字段
        await db.collection('blog_users').doc(user.uid).update({
          nickname,
          avatar,
          bio,
          updatedAt: now,
        });
        setBlogUser({ ...blogUser, nickname, avatar, bio, updatedAt: now });
      } else {
        // 无记录 — 用 doc(uid).set 创建新文档
        const userData = {
          phone: user.phone || '',
          nickname,
          avatar,
          bio,
          createdAt: now,
          updatedAt: now,
        };
        await db.collection('blog_users').doc(user.uid).set(userData);
        setBlogUser({ _id: user.uid, ...userData });
      }

      await refreshUser({ name: nickname, picture: avatar });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error: any) {
      console.error('保存失败:', error);
      alert('保存失败: ' + (error?.message || error?.code || '请重试'));
    } finally {
      setSaving(false);
    }
  }, [user, nickname, avatar, bio, saving, refreshUser, blogUser]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/');
  }, [logout, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4A574] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const maskedPhone = user.phone
    ? `${user.phone.replace('+86 ', '').slice(0, 3)}****${user.phone.replace('+86 ', '').slice(-4)}`
    : '';

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* 返回 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#B8B6B3] hover:text-[#D4A574] transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft size={16} /> 返回
      </button>

      {/* 头部 */}
      <div className="flex items-center gap-5 mb-10">
        <div className="relative group">
          {avatar ? (
            <img
              src={avatar}
              alt={nickname}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#D4A574]/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864A] flex items-center justify-center text-white text-2xl font-bold ring-4 ring-[#D4A574]/20">
              {(nickname || '用').charAt(0).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowAvatarPicker(true)}
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <Camera size={20} className="text-white" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] dark:text-[#F5F5F5]">
            {nickname || '用户'}
          </h1>
          <p className="text-sm text-[#B8B6B3] mt-1">{maskedPhone}</p>
          <p className="text-xs text-[#B8B6B3] mt-0.5">
            UID: {user.uid.slice(0, 12)}...
          </p>
        </div>
      </div>

      {/* 隐藏的文件上传 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* 头像选择弹窗 */}
      {showAvatarPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={() => setShowAvatarPicker(false)}>
          <div
            className="bg-white dark:bg-[#2D2D3A] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[#1A1A2E] dark:text-[#F5F5F5]">选择头像</h3>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#B8B6B3]" />
              </button>
            </div>

            {/* 上传本地图片 */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-[#D4A574] hover:bg-[#D4A574]/5 transition-all cursor-pointer mb-5"
            >
              {uploading ? (
                <><Loader2 size={20} className="text-[#D4A574] animate-spin" /> <span className="text-sm text-[#B8B6B3]">上传中...</span></>
              ) : (
                <><Upload size={20} className="text-[#D4A574]" /> <span className="text-sm text-[#1A1A2E] dark:text-[#F5F5F5]">上传本地图片</span> <span className="text-xs text-[#B8B6B3]">(≤2MB)</span></>
              )}
            </button>

            {/* 预设头像 */}
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-[#D4A574]" />
              <span className="text-sm font-medium text-[#1A1A2E] dark:text-[#F5F5F5]">动漫头像</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPreset(url)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer hover:scale-105 ${
                    avatar === url
                      ? 'border-[#D4A574] ring-2 ring-[#D4A574]/30'
                      : 'border-transparent hover:border-[#D4A574]/40'
                  }`}
                >
                  <img src={url} alt={`头像 ${i + 1}`} className="w-full h-full object-cover bg-gray-50 dark:bg-gray-800" />
                  {avatar === url && (
                    <div className="absolute inset-0 bg-[#D4A574]/20 flex items-center justify-center">
                      <Check size={20} className="text-[#D4A574]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 编辑区 */}
      <div className="bg-white/80 dark:bg-[#2D2D3A]/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 dark:border-white/5 space-y-5">
        <h2 className="text-lg font-semibold text-[#1A1A2E] dark:text-[#F5F5F5]">个人资料</h2>

        <div>
          <label className="text-xs font-medium text-[#B8B6B3] uppercase tracking-wider mb-2 block">昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
            className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-600 focus:border-[#D4A574] outline-none py-2 text-[#1A1A2E] dark:text-[#F5F5F5] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#B8B6B3] uppercase tracking-wider mb-2 block">个人简介</label>
          <input
            type="text"
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={100}
            placeholder="一句话介绍自己"
            className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-600 focus:border-[#D4A574] outline-none py-2 text-[#1A1A2E] dark:text-[#F5F5F5] placeholder:text-[#B8B6B3]/50 transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
            ${saved
              ? 'bg-[#10B981] text-white'
              : saving
                ? 'bg-gray-200 dark:bg-gray-700 text-[#B8B6B3] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#D4A574] to-[#B8864A] text-white hover:shadow-lg hover:shadow-[#D4A574]/30 hover:-translate-y-0.5'
            }`}
        >
          {saved ? <><Check size={16} /> 已保存</> : saving ? <><Loader2 size={16} className="animate-spin" /> 保存中</> : <><Save size={16} /> 保存修改</>}
        </button>
      </div>

      {/* 退出登录 */}
      <div className="mt-8">
        {showLogoutConfirm ? (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 flex items-center justify-between animate-[slideUp_0.2s_ease-out]">
            <p className="text-sm text-[#EF4444]">确定要退出登录吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-1.5 text-sm text-[#B8B6B3] hover:text-[#1A1A2E] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm text-white bg-[#EF4444] rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                确认退出
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#EF4444]/30 text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} /> 退出登录
          </button>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
