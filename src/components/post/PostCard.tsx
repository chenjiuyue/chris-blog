import { Link } from 'react-router-dom';
import { Eye, MessageCircle, Calendar, Clock } from 'lucide-react';
import type { Post } from '../../types';

interface Props {
  post: Post;
}

function estimateReadTime(content: string): string {
  const words = content.length;
  const minutes = Math.ceil(words / 400);
  return `${minutes} 分钟`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function PostCard({ post }: Props) {
  return (
    <article className="group py-6 border-b border-[var(--color-border)] last:border-0 animate-slide-up">
      <Link to={`/post/${post._id}`} className="block">
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-xs font-medium text-accent uppercase tracking-wider">{post.category}</span>
          <span className="text-xs text-text-muted">&middot;</span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(post.createdAt)}
          </span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Clock size={12} />
            {estimateReadTime(post.content)}
          </span>
        </div>

        <h2 className="font-serif text-xl md:text-2xl text-primary dark:text-text-light
          leading-snug mb-2 group-hover:text-accent transition-all duration-200
          group-hover:translate-x-1">
          {post.title}
        </h2>

        <p className="text-sm text-text-secondary dark:text-text-muted leading-relaxed
          line-clamp-2 mb-3">
          {post.summary}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                onClick={e => e.stopPropagation()}
                className="text-xs px-2 py-0.5 rounded-full bg-accent/8 text-accent/80
                  hover:bg-accent/15 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {post.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={13} />
              {post.commentCount || 0}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
