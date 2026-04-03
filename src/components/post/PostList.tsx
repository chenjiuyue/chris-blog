import { useState, useEffect, useMemo } from 'react';
import { Clock, Flame, MessageCircle, Heart } from 'lucide-react';
import type { Post } from '../../types';
import type { PostSortField } from '../../services/postService';
import { PostCard } from './PostCard';
import { Pagination } from '../common/Pagination';
import { Loading } from '../common/Loading';
import { Empty } from '../common/Empty';

interface Props {
  posts: Post[];
  loading: boolean;
  pageSize?: number;
  sortField?: PostSortField;
  onSortChange?: (field: PostSortField) => void;
  showSort?: boolean;
}

const SORT_OPTIONS: { field: PostSortField; label: string; icon: typeof Clock }[] = [
  { field: 'createdAt', label: '最新', icon: Clock },
  { field: 'viewCount', label: '最热', icon: Flame },
  { field: 'commentCount', label: '评论', icon: MessageCircle },
  { field: 'likeCount', label: '点赞', icon: Heart },
];

export function PostList({ posts, loading, pageSize = 10, sortField, onSortChange, showSort = false }: Props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [posts]);

  const displayedPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, page, pageSize]);

  if (loading) return <Loading />;
  if (posts.length === 0) return <Empty message="暂无文章" />;

  return (
    <div>
      {showSort && (
        <div className="flex items-center gap-1.5 mb-5">
          <span className="text-xs text-text-muted mr-1">排序</span>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.field}
              onClick={() => onSortChange?.(opt.field)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                sortField === opt.field
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-muted hover:text-primary hover:bg-[var(--color-border)]'
              }`}
            >
              <opt.icon size={12} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
      <div>
        {displayedPosts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <Pagination
        current={page}
        total={posts.length}
        pageSize={pageSize}
        onPage={setPage}
      />
    </div>
  );
}
