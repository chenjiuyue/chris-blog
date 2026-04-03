import { Link, useNavigate } from 'react-router-dom';
import { Eye, MessageCircle, Calendar, Clock } from 'lucide-react';
import type { Post } from '../../types';

interface Props {
  post: Post;
}

function estimateReadTime(content: string): string {
  // 移除 Markdown 语法标记，只保留纯文本用于计算
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')       // 移除代码块
    .replace(/`[^`]+`/g, '')              // 移除行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '')      // 移除图片
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // 链接只保留文字
    .replace(/#{1,6}\s*/g, '')            // 移除标题标记
    .replace(/[*_~>|-]+/g, '')            // 移除加粗/斜体/删除线/引用/分隔线
    .replace(/\n+/g, '')                  // 移除换行
    .trim();
  // 中文阅读速度约 300 字/分钟，最少显示 1 分钟
  const minutes = Math.max(1, Math.ceil(plainText.length / 300));
  return `${minutes} 分钟`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function PostCard({ post }: Props) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <article
      className="group py-6 border-b border-[var(--color-border)] last:border-0 animate-slide-up cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="block">
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-xs font-medium text-accent uppercase tracking-wider">{post.category}</span>
          <span className="text-xs text-text-muted">&middot;</span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(post.publishedAt || post.createdAt)}
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
            {(post.tags || []).slice(0, 3).map(tag => (
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
      </div>
    </article>
  );
}
