import { useState, useEffect } from 'react';
import { createComment } from '../../services/commentService';
import { Send, Shuffle } from 'lucide-react';

interface Props {
  postId: string;
  parentId?: string;
  isReply?: boolean;
  onSubmit: () => void;
}

// 随机昵称生成器
const generateRandomNickname = (): string => {
  const adjectives = [
    '快乐的', '聪明的', '勇敢的', '可爱的', '优雅的', '神秘的', '活力的', '温柔的',
    '阳光的', '热情的', '冷静的', '睿智的', '幽默的', '浪漫的', '梦幻的', '自由的'
  ];
  const nouns = [
    '小猫', '小狗', '熊猫', '兔子', '松鼠', '海豚', '企鹅', '狐狸',
    '浣熊', '考拉', '柯基', '柴犬', '仓鼠', '树懒', '水獭', '刺猬'
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999) + 1;
  
  return `${adj}${noun}${num}`;
};

export function CommentForm({ postId, parentId, isReply, onSubmit }: Props) {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 初始化昵称：优先使用 localStorage，否则随机生成
  useEffect(() => {
    const savedNickname = localStorage.getItem('blog-nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    } else {
      setNickname(generateRandomNickname());
    }
  }, []);

  const handleRandomNickname = () => {
    const newNickname = generateRandomNickname();
    setNickname(newNickname);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setSubmitting(true);
    const result = await createComment(postId, nickname.trim(), content.trim(), parentId || '');
    setSubmitting(false);

    if (result) {
      localStorage.setItem('blog-nickname', nickname.trim());
      setContent('');
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${isReply ? 'ml-8 mt-3' : ''}`}>
      {!parentId && (
        <div className="relative">
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="你的昵称"
            className="w-full px-4 py-3 pr-12 text-sm rounded-lg border border-[var(--color-border)]
              bg-white dark:bg-[#2D2D3A] text-primary dark:text-text-light
              placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10
              transition-all"
          />
          <button
            type="button"
            onClick={handleRandomNickname}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-accent
              transition-colors rounded-md hover:bg-accent/5"
            title="随机生成昵称"
          >
            <Shuffle size={16} />
          </button>
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
          disabled={submitting || !content.trim() || (!parentId && !nickname.trim())}
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
