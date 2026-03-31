import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from 'lucide-react';
import { isFavorited, addFavorite, removeFavorite, onFavoriteChange } from '../../services/favoriteService';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  postId: string;
  title: string;
  className?: string;
}

export function FavoriteButton({ postId, title, className = '' }: Props) {
  const { user, login } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginTip, setShowLoginTip] = useState(false);

  // 查询收藏状态
  const checkFavoriteStatus = useCallback(async () => {
    if (!user?.uid) {
      setFavorited(false);
      return;
    }
    try {
      const result = await isFavorited(postId, user.uid);
      setFavorited(result);
    } catch {
      setFavorited(false);
    }
  }, [postId, user?.uid]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  // 监听其他组件的收藏变更（如收藏页取消收藏）
  useEffect(() => {
    const unsubscribe = onFavoriteChange((changedPostId, isFav) => {
      if (changedPostId === postId) {
        setFavorited(isFav);
      }
    });
    return unsubscribe;
  }, [postId]);

  const handleToggle = async () => {
    // 未登录：提示登录
    if (!user?.uid) {
      setShowLoginTip(true);
      setTimeout(() => setShowLoginTip(false), 3000);
      return;
    }

    if (loading) return;
    setLoading(true);
    setAnimating(true);

    try {
      if (favorited) {
        // 当前已收藏 → 取消收藏
        const success = await removeFavorite(postId, user.uid);
        if (success) {
          setFavorited(false);
        }
      } else {
        // 当前未收藏 → 添加收藏
        const success = await addFavorite(postId, title, user.uid);
        if (success) {
          setFavorited(true);
        }
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
          favorited
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-600'
            : 'border-[var(--color-border)] hover:border-accent hover:text-accent'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        aria-label={favorited ? '取消收藏' : '收藏文章'}
      >
        <Bookmark
          size={18}
          className={`transition-all duration-200 ${animating ? 'scale-125' : 'scale-100'} ${
            favorited ? 'fill-amber-500' : ''
          }`}
        />
        <span className="text-sm font-medium">
          {favorited ? '已收藏' : '收藏'}
        </span>
      </button>

      {/* 未登录提示气泡 */}
      {showLoginTip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max z-50 animate-fade-in">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
            <span>请先登录后再收藏</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLoginTip(false);
                login();
              }}
              className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2"
            >
              去登录
            </button>
          </div>
          <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}
