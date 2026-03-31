import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
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
            className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#D4A574]/50 transition-all"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864A] flex items-center justify-center text-white text-xs font-medium ring-2 ring-transparent group-hover:ring-[#D4A574]/50 transition-all">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <ChevronDown
          size={14}
          className={`text-[#B8B6B3] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 下拉菜单 */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 dark:bg-[#2D2D3A]/95 backdrop-blur-xl rounded-xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden animate-[menuIn_0.15s_ease-out] z-50">
          {/* 用户信息 */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <p className="text-sm font-medium text-[#1A1A2E] dark:text-[#F5F5F5] truncate">
              {displayName}
            </p>
            <p className="text-xs text-[#B8B6B3] mt-0.5 truncate">
              {user?.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : ''}
            </p>
          </div>

          {/* 菜单项 */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A2E] dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <User size={16} className="text-[#B8B6B3]" />
              个人中心
            </Link>
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes menuIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
