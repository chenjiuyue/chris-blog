import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike, getUserId, checkLiked, saveLikedStatus } from '../../services/likeService';

interface Props {
  postId: string;
  initialLikeCount: number;
  className?: string;
}

export function LikeButton({ postId, initialLikeCount, className = '' }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // 检查本地是否已点赞
    setLiked(checkLiked(postId));
  }, [postId]);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);
    setAnimating(true);

    try {
      const userId = getUserId();
      const result = await toggleLike(postId, userId);

      if (result.success) {
        setLiked(result.liked);
        setLikeCount(result.likeCount);
        saveLikedStatus(postId, result.liked);
      } else {
        console.error('点赞失败:', result.message);
      }
    } catch (error) {
      console.error('点赞操作异常:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
        liked
          ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500'
          : 'border-[var(--color-border)] hover:border-accent hover:text-accent'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <Heart
        size={18}
        className={`transition-all duration-200 ${animating ? 'scale-125' : 'scale-100'} ${
          liked ? 'fill-red-500' : ''
        }`}
      />
      <span className="text-sm font-medium">
        {liked ? '已点赞' : '点赞'} {likeCount > 0 && `(${likeCount})`}
      </span>
    </button>
  );
}
