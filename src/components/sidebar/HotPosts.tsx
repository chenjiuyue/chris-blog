import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Eye } from 'lucide-react';
import { getDB, ensureAuth } from '../../config/cloudbase';
import type { Post } from '../../types';

export function HotPosts() {
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotPosts();
  }, []);

  const fetchHotPosts = async () => {
    try {
      await ensureAuth();
      const db = getDB();
      const result = await db.collection('blog_posts')
        .where({ status: 'published' })
        .orderBy('viewCount', 'desc')
        .limit(5)
        .get();

      if (typeof result.code !== 'string') {
        setHotPosts(result.data as Post[]);
      }
    } catch (error) {
      console.error('获取热门文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (hotPosts.length === 0) return null;

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={18} className="text-accent" />
        <h3 className="font-serif text-lg text-primary dark:text-text-light">
          热门文章
        </h3>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {hotPosts.map((post, index) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="group flex gap-3 items-start"
          >
            {/* Rank Number */}
            <div className={`
              flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${index < 3 
                ? 'bg-accent text-white' 
                : 'bg-accent/10 text-accent'
              }
            `}>
              {index + 1}
            </div>

            {/* Post Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-primary dark:text-text-light group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-1">
                {post.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Eye size={12} />
                <span>{post.viewCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
