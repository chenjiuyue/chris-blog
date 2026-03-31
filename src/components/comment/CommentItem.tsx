import { useState } from 'react';
import { Reply } from 'lucide-react';
import type { Comment } from '../../types';
import { CommentForm } from './CommentForm';

interface Props {
  comment: Comment;
  replies: Comment[];
  postId: string;
  onSubmit: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (days > 0) {
    return `${days} 天前`;
  } else if (hours > 0) {
    return `${hours} 小时前`;
  } else if (minutes > 0) {
    return `${minutes} 分钟前`;
  } else {
    return '刚刚';
  }
}

// 根据昵称生成头像颜色
function getAvatarColor(nickname: string): string {
  const colors = [
    'bg-red-400',
    'bg-orange-400',
    'bg-amber-400',
    'bg-yellow-400',
    'bg-lime-400',
    'bg-green-400',
    'bg-emerald-400',
    'bg-teal-400',
    'bg-cyan-400',
    'bg-sky-400',
    'bg-blue-400',
    'bg-indigo-400',
    'bg-violet-400',
    'bg-purple-400',
    'bg-fuchsia-400',
    'bg-pink-400',
    'bg-rose-400',
  ];
  
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function CommentItem({ comment, replies, postId, onSubmit }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const avatarColor = getAvatarColor(comment.nickname);

  return (
    <div className="py-4 hover:bg-accent/5 rounded-lg px-3 -mx-3 transition-colors">
      <div className="flex gap-3">
        {comment.avatar ? (
          <img src={comment.avatar} alt={comment.nickname} className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-0.5 shadow-sm" />
        ) : (
          <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
            <span className="text-sm font-semibold text-white">
              {comment.nickname.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-primary dark:text-text-light">
              {comment.nickname}
            </span>
            <span className="text-xs text-text-muted">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-text-secondary dark:text-text-muted leading-relaxed mb-2">
            {comment.content}
          </p>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent
              transition-colors cursor-pointer px-2 py-1 rounded hover:bg-accent/10 -ml-2"
          >
            <Reply size={13} />
            回复
          </button>

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentId={comment._id}
                isReply
                onSubmit={() => {
                  setShowReplyForm(false);
                  onSubmit();
                }}
              />
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-12 mt-3 border-l-2 border-accent/20 pl-4 space-y-2">
          {replies.map(reply => (
            <CommentItem
              key={reply._id}
              comment={reply}
              replies={[]}
              postId={postId}
              onSubmit={onSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
