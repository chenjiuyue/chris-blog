import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, LogIn } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { getDB, ensureAuth } from '../config/cloudbase';
import { useAuth } from '../contexts/AuthContext';
import { getBlogUser } from '../services/authService';

interface GuestbookMessage {
  _id: string;
  nickname: string;
  content: string;
  createdAt: string;
  userId?: string;
  avatar?: string;
}

// 敏感词列表
const SENSITIVE_WORDS = [
  '傻逼', '操你妈', '草泥马', '妈的', '他妈的', '你妈', '狗日', '王八蛋',
  '混蛋', '滚蛋', '去死', '白痴', '废物', '垃圾', '贱人', '婊子', '妓女',
  '操', '艹', '屎', '尿', '屁', '奶子', '鸡巴', '阴茎', '阴道',
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'damn',
  '赌博', '彩票', '代开发票', '刷单', '兼职赚钱',
];

function filterSensitiveWords(text: string): string {
  let result = text;
  for (const word of SENSITIVE_WORDS) {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, '**'.repeat(Math.ceil(word.length / 2)));
  }
  return result;
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
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

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

  const fetchMessages = async () => {
    try {
      await ensureAuth();
      const db = getDB();
      const result = await db.collection('blog_guestbook')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      if (typeof result.code !== 'string') {
        const msgs = result.data as GuestbookMessage[];
        // 批量加载留言者最新头像
        const enriched = await Promise.all(
          msgs.map(async (msg) => {
            if (msg.userId) {
              try {
                const blogUser = await getBlogUser(msg.userId);
                if (blogUser) {
                  return {
                    ...msg,
                    avatar: blogUser.avatar || msg.avatar || '',
                    nickname: blogUser.nickname || msg.nickname,
                  };
                }
              } catch {
                // 获取用户信息失败不影响展示
              }
            }
            return msg;
          })
        );
        setMessages(enriched);
      }
    } catch (error) {
      console.error('获取留言失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('请填写留言内容');
      return;
    }

    setSubmitting(true);

    try {
      await ensureAuth();
      const db = getDB();
      const filteredContent = filterSensitiveWords(content.trim());
      const filteredNickname = filterSensitiveWords(nickname.trim() || '匿名用户');

      await db.collection('blog_guestbook').add({
        nickname: filteredNickname,
        content: filteredContent,
        avatar: avatar || '',
        userId: user?.uid || '',
        createdAt: new Date().toISOString(),
      });

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
        {!isLoggedIn ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-text-muted">登录后即可发表留言</p>
            <button
              onClick={() => navigate('/login', { state: { from: '/guestbook' } })}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors cursor-pointer"
            >
              <LogIn size={16} />
              去登录
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 px-1">
              {avatar ? (
                <img src={avatar} alt={nickname} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864A] flex items-center justify-center text-white text-xs font-medium">
                  {(nickname || '用').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-primary dark:text-text-light">{nickname || '用户'}</span>
            </div>
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send size={16} />
                {submitting ? '提交中...' : '提交留言'}
              </button>
            </div>
          </form>
        )}
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
                  {message.avatar ? (
                    <img src={message.avatar} alt={message.nickname} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-medium">
                        {message.nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
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
                      {filterSensitiveWords(message.content)}
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
