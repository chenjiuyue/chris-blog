import { useState, useEffect, lazy, Suspense } from 'react';
import { BarChart3, Eye, FileText, MessageCircle, Heart, Tag, FolderOpen, TrendingUp, Users } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Loading } from '../components/common/Loading';
import { getSiteStatsDetail } from '../services/statisticsService';
import type { SiteStatsDetail } from '../types';

// 懒加载图表组件
const StatsCharts = lazy(() => import('../components/stats/StatsCharts'));

const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

function formatNumber(num: number | undefined | null): string {
  const n = num ?? 0;
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export function StatsPage() {
  const [stats, setStats] = useState<SiteStatsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteStatsDetail().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;
  if (!stats) return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-center text-text-muted">
      暂无统计数据
    </div>
  );

  const statCards = [
    { icon: FileText, label: '文章总数', value: stats.totalPosts, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Eye, label: '总浏览量', value: stats.totalViews, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Users, label: '独立访客', value: stats.totalUV, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { icon: MessageCircle, label: '总评论', value: stats.totalComments, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Heart, label: '总点赞', value: stats.totalLikes, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { icon: FolderOpen, label: '分类数', value: stats.totalCategories, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Tag, label: '标签数', value: stats.totalTags, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { icon: TrendingUp, label: '今日访问', value: stats.todayViews, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <>
      <SEO title="站点统计" description="Chris Know 博客数据统计概览" />
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* 页面标题 */}
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 size={28} className="text-accent" />
          <h1 className="text-2xl font-bold text-primary dark:text-text-light">站点统计</h1>
        </div>

        {/* 数据卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {statCards.map(card => (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-xl border border-[var(--color-border)]
                bg-white dark:bg-[#2D2D3A]/60 p-4 hover:border-accent/30 transition-all duration-200"
            >
              <div className={`absolute top-3 right-3 ${card.bg} p-2 rounded-lg`}>
                <card.icon size={18} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-primary dark:text-text-light">
                {formatNumber(card.value)}
              </p>
              <p className="text-sm text-text-muted mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* 懒加载图表区域 */}
        <Suspense fallback={<Loading />}>
          <StatsCharts stats={stats} colors={COLORS} formatNumber={formatNumber} />
        </Suspense>
      </div>
    </>
  );
}
