import { useState } from 'react';
import type { Comment } from '../../types';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Loading } from '../common/Loading';
import { Empty } from '../common/Empty';
import { MessageCircle } from 'lucide-react';

interface Props {
  postId: string;
  comments: Comment[];
  loading: boolean;
  onRefresh: () => void;
}

export function CommentList({ postId, comments, loading, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleCommentSubmit = () => {
    setRefreshing(true);
    setTimeout(() => {
      onRefresh();
      setRefreshing(false);
    }, 500);
  };

  const rootComments = comments.filter(c => !c.parentId);

  const getReplies = (parentId: string): Comment[] => {
    return comments.filter(c => c.parentId === parentId);
  };

  if (loading) return <Loading />;

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="text-accent" size={24} />
        <h3 className="font-serif text-2xl text-primary dark:text-text-light">
          评论
        </h3>
        <span className="text-sm text-text-muted">({comments.length})</span>
      </div>

      {/* Comment Form */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)] mb-6">
        <CommentForm postId={postId} onSubmit={handleCommentSubmit} />
      </div>

      {/* Comments List */}
      {refreshing ? (
        <Loading />
      ) : rootComments.length === 0 ? (
        <Empty message="暂无评论，来写下第一条吧 💬" />
      ) : (
        <div className="p-5 rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)]">
          <div className="divide-y divide-[var(--color-border)]">
            {rootComments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                replies={getReplies(comment._id)}
                postId={postId}
                onSubmit={handleCommentSubmit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
