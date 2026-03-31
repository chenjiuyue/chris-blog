import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { getDB, ensureAuth } from '../config/cloudbase';

interface GuestbookMessage {
  _id: string;
  nickname: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN');
}

export function GuestbookPage() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchMessages();
    // 从 localStorage 恢复昵称
    const savedNickname = localStorage.getItem('guestbook_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      await ensureAuth();
      const db = getDB();
      const result = await db.collection('blog_guestbook')
        .where({ status: 'approved' })
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      if (typeof result.code !== 'string') {
        setMessages(result.data as GuestbookMessage[]);
      }
    } catch (error) {
      console.error('获取留言失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !content.trim()) {
      alert('请填写昵称和留言内容');
      return;
    }

    setSubmitting(true);

    try {
      await ensureAuth();
      const db = getDB();
      await db.collection('blog_guestbook').add({
        nickname: nickname.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      });

      // 保存昵称到 localStorage
      localStorage.setItem('guestbook_nickname', nickname.trim());

      alert('留言提交成功！审核通过后将显示在留言板上');
      setContent('');
      fetchMessages();
    } catch (error) {
      console.error('提交留言失败:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="留言板" description="欢迎留言，与我交流" />
      <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 text-accent mb-4">
          <MessageSquare size={24} />
          <h1 className="font-serif text-3xl md:text-4xl text-primary dark:text-text-light">
            留言板
          </h1>
        </div>
        <p className="text-text-muted">
          欢迎留言交流，分享你的想法
        </p>
      </header>

      {/* Leave Message Form */}
      <div className="mb-12 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <h3 className="font-serif text-lg text-primary dark:text-text-light mb-4">
          发表留言
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="你的昵称"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            maxLength={20}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="留下你的想法..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {content.length}/500
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {submitting ? '提交中...' : '提交留言'}
            </button>
          </div>
        </form>
      </div>

      {/* Messages List */}
      <div>
        <h3 className="font-serif text-lg text-primary dark:text-text-light mb-6">
          留言墙 ({messages.length})
        </h3>

        {loading ? (
          <div className="text-center py-12 text-text-muted">加载中...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            还没有留言，快来抢沙发吧！
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message._id}
                className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-medium">
                      {message.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-primary dark:text-text-light">
                        {message.nickname}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
