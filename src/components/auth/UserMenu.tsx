import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ChevronDown, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function UserMenu() {
  const { user, isLoggedIn, loading, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  }

  if (!isLoggedIn) {
    return (
      <button
        onClick={login}
        className="text-sm font-medium text-text-secondary dark:text-text-muted hover:text-accent transition-colors cursor-pointer"
      >
        登录
      </button>
    );
  }

  const displayName = user?.name || '用户';
  const avatarUrl = user?.picture;
  const maskedPhone = user?.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : '';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 cursor-pointer group"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent/50 transition-all"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-[#B8864A] flex items-center justify-center text-white text-xs font-medium ring-2 ring-transparent group-hover:ring-accent/50 transition-all">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 下拉菜单 */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#2A2A35] backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-gray-100/80 dark:border-white/8 overflow-hidden animate-[menuIn_0.2s_ease-out] z-50">
          {/* 用户信息卡片 */}
          <div className="px-5 py-4 bg-gradient-to-br from-accent/5 to-transparent dark:from-accent/10">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/20 shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-[#B8864A] flex items-center justify-center text-white text-base font-semibold ring-2 ring-white/80 dark:ring-white/20 shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary dark:text-text-light truncate">
                  {displayName}
                </p>
                {maskedPhone && (
                  <p className="text-xs text-text-muted mt-0.5">
                    {maskedPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 分割线 */}
          <div className="mx-4 border-t border-gray-100 dark:border-white/8" />

          {/* 菜单项 */}
          <div className="py-1.5 px-2">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary dark:text-text-light rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <User size={16} className="text-blue-500" />
              </div>
              <span>个人中心</span>
            </Link>
            <Link
              to="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary dark:text-text-light rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center">
                <Heart size={16} className="text-pink-500" />
              </div>
              <span>我的收藏</span>
            </Link>
          </div>

          {/* 分割线 */}
          <div className="mx-4 border-t border-gray-100 dark:border-white/8" />

          {/* 退出 */}
          <div className="py-1.5 px-2 pb-2">
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <LogOut size={16} className="text-red-500" />
              </div>
              <span>退出登录</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes menuIn {
          from { opacity: 0; transform: scale(0.96) translateY(-6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
