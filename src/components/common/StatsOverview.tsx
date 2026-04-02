import { Eye, MessageCircle, Heart, FileText } from 'lucide-react';
import type { BlogStatistics } from '../../types';

interface Props {
  stats: BlogStatistics | null;
}

function formatNumber(num: number | undefined | null): string {
  const n = num ?? 0;
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export function StatsOverview({ stats }: Props) {
  if (!stats) return null;

  const items = [
    { icon: FileText, label: '文章', value: stats.totalPosts, color: 'text-blue-500' },
    { icon: Eye, label: '浏览', value: stats.totalViews, color: 'text-emerald-500' },
    { icon: MessageCircle, label: '评论', value: stats.totalComments, color: 'text-amber-500' },
    { icon: Heart, label: '点赞', value: stats.totalLikes, color: 'text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(item => (
        <div
          key={item.label}
          className="flex items-center gap-2.5 p-3 rounded-lg bg-white dark:bg-[#2D2D3A]/50
            border border-[var(--color-border)] hover:border-accent/30 transition-all duration-200"
        >
          <item.icon size={16} className={item.color} />
          <div>
            <p className="text-lg font-semibold text-primary dark:text-text-light leading-none">
              {formatNumber(item.value)}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
