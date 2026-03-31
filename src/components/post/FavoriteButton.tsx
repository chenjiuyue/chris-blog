import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { isFavorited, toggleFavorite } from '../../services/favoriteService';

interface Props {
  postId: string;
  title: string;
  className?: string;
}

export function FavoriteButton({ postId, title, className = '' }: Props) {
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setFavorited(isFavorited(postId));
  }, [postId]);

  const handleToggle = () => {
    setAnimating(true);
    const newState = toggleFavorite(postId, title);
    setFavorited(newState);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
        favorited
          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-600'
          : 'border-[var(--color-border)] hover:border-accent hover:text-accent'
      } ${className}`}
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
  );
}
