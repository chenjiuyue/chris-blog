import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComment } from '../../services/commentService';
import { getBlogUser } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { Send, LogIn } from 'lucide-react';

interface Props {
  postId: string;
  parentId?: string;
  isReply?: boolean;
  onSubmit: () => void;
}

export function CommentForm({ postId, parentId, isReply, onSubmit }: Props) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 登录用户自动获取昵称和头像
  useEffect(() => {
    if (!isLoggedIn || !user?.uid) return;

    async function loadUserInfo() {
      const blogUser = await getBlogUser(user!.uid);
      if (blogUser) {
        setNickname(blogUser.nickname || user!.name || '');
        setAvatar(blogUser.avatar || user!.picture || '');
      } else {
        setNickname(user!.name || '');
        setAvatar(user!.picture || '');
      }
    }
    loadUserInfo();
  }, [isLoggedIn, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setSubmitting(true);
    const result = await createComment(postId, nickname.trim(), content.trim(), parentId || '', avatar);
    setSubmitting(false);

    if (result) {
      setContent('');
      onSubmit();
    }
  };

  // 未登录：显示登录提示
  if (!isLoggedIn) {
    return (
      <div className={`${isReply ? 'ml-8 mt-3' : ''}`}>
        <div className="flex flex-col items-center gap-3 py-6 px-4 rounded-lg border border-dashed border-[var(--color-border)] bg-gray-50/50 dark:bg-white/5">
          <p className="text-sm text-text-muted">登录后即可发表评论</p>
          <button
            onClick={() => navigate('/login', { state: { from: window.location.hash.slice(1) } })}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors cursor-pointer"
          >
            <LogIn size={16} />
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${isReply ? 'ml-8 mt-3' : ''}`}>
      {/* 已登录用户信息展示 */}
      {!parentId && (
        <div className="flex items-center gap-2.5 mb-1">
          {avatar ? (
            <img src={avatar} alt={nickname} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864A] flex items-center justify-center text-white text-xs font-medium">
              {(nickname || '用').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-primary dark:text-text-light">{nickname}</span>
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={isReply ? '写下你的回复...' : '写下你的想法...'}
          rows={isReply ? 2 : 4}
          className="flex-1 px-4 py-3 text-sm rounded-lg border border-[var(--color-border)]
            bg-white dark:bg-[#2D2D3A] text-primary dark:text-text-light
            placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10
            resize-none transition-all"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="self-end px-5 py-3 rounded-lg bg-accent text-white text-sm font-medium
            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
            hover:bg-accent-dark hover:shadow-md transition-all flex items-center gap-2"
        >
          <Send size={16} />
          {submitting ? '发送中' : '发送'}
        </button>
      </div>
    </form>
  );
}
