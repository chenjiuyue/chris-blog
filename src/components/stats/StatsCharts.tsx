import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { SiteStatsDetail } from '../../types';

interface Props {
  stats: SiteStatsDetail;
  colors: string[];
  formatNumber: (num: number) => string;
}

// 标签大小映射
function getTagSize(count: number, max: number): string {
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.8) return 'text-2xl font-bold';
  if (ratio > 0.6) return 'text-xl font-semibold';
  if (ratio > 0.4) return 'text-lg font-medium';
  if (ratio > 0.2) return 'text-base';
  return 'text-sm';
}

function getTagColor(index: number): string {
  const colors = [
    'text-blue-500', 'text-emerald-500', 'text-amber-500', 'text-rose-400',
    'text-purple-500', 'text-teal-500', 'text-indigo-500', 'text-pink-500',
    'text-cyan-500', 'text-orange-500', 'text-lime-500', 'text-violet-500',
  ];
  return colors[index % colors.length];
}

export default function StatsCharts({ stats, colors, formatNumber }: Props) {
  const trendData = stats.visitTrend.map(item => ({
    ...item,
    label: item.date.slice(5),
  }));

  const maxTagCount = Math.max(...(stats.tagStats || []).map(t => t.count), 1);

  return (
    <>
      {/* 访问趋势 */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white dark:bg-[#2D2D3A]/60 p-6 mb-8">
        <h2 className="text-lg font-semibold text-primary dark:text-text-light mb-4">
          近 30 天访问趋势
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#999' }}
                interval={Math.floor(trendData.length / 7)}
              />
              <YAxis tick={{ fontSize: 12, fill: '#999' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card-bg, #fff)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                labelFormatter={(label) => `日期: ${label}`}
                formatter={(value) => [`${value} 次`, '访问量']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#colorVisit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 两列布局：热门文章 + 分类分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 热门文章 Top 10 */}
        <div className="rounded-xl border border-[var(--color-border)] bg-white dark:bg-[#2D2D3A]/60 p-6">
          <h2 className="text-lg font-semibold text-primary dark:text-text-light mb-4">
            热门文章 Top 10
          </h2>
          {stats.topPosts.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topPosts.map(p => ({
                    name: p.title.length > 10 ? p.title.slice(0, 10) + '…' : p.title,
                    浏览量: p.viewCount,
                    fullTitle: p.title,
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#999' }} allowDecimals={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#999' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card-bg, #fff)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    formatter={(value) => [`${value} 次`, '浏览量']}
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullTitle || '';
                    }}
                  />
                  <Bar dataKey="浏览量" fill="#6366F1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-text-muted text-sm">暂无数据</p>
          )}
        </div>

        {/* 分类分布 */}
        <div className="rounded-xl border border-[var(--color-border)] bg-white dark:bg-[#2D2D3A]/60 p-6">
          <h2 className="text-lg font-semibold text-primary dark:text-text-light mb-4">
            分类分布
          </h2>
          {stats.categoryDistribution.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    label={({ name, percent }: any) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {stats.categoryDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card-bg, #fff)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    formatter={(value) => [`${value} 篇`, '文章数']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-text-muted text-sm">暂无分类数据</p>
          )}
        </div>
      </div>

      {/* 标签热度云 */}
      {stats.tagStats && stats.tagStats.length > 0 && (
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white dark:bg-[#2D2D3A]/60 p-6">
          <h2 className="text-lg font-semibold text-primary dark:text-text-light mb-4">
            标签热度
          </h2>
          <div className="flex flex-wrap items-center gap-3 justify-center py-4">
            {stats.tagStats.map((tag, idx) => (
              <a
                key={tag.name}
                href={`#/tag/${tag.name}`}
                className={`${getTagSize(tag.count, maxTagCount)} ${getTagColor(idx)}
                  hover:opacity-80 transition-opacity cursor-pointer px-2 py-1`}
                title={`${tag.name}: ${tag.count} 篇文章`}
              >
                {tag.name}
                <sup className="text-xs text-text-muted ml-0.5">{tag.count}</sup>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 文章排行详情表 */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white dark:bg-[#2D2D3A]/60 p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-text-light mb-4">
          文章排行详情
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="py-3 px-2 text-left text-text-muted font-medium">#</th>
                <th className="py-3 px-2 text-left text-text-muted font-medium">文章标题</th>
                <th className="py-3 px-2 text-right text-text-muted font-medium">浏览</th>
                <th className="py-3 px-2 text-right text-text-muted font-medium">点赞</th>
                <th className="py-3 px-2 text-right text-text-muted font-medium">评论</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPosts.map((post, idx) => (
                <tr
                  key={post._id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-surface-light/50 dark:hover:bg-[#3D3D4A]/30 transition-colors"
                >
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                      ${idx < 3 ? 'bg-accent/10 text-accent' : 'text-text-muted'}`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-primary dark:text-text-light font-medium max-w-[300px] truncate">
                    <a href={`#/post/${post._id}`} className="hover:text-accent transition-colors">
                      {post.title}
                    </a>
                  </td>
                  <td className="py-3 px-2 text-right text-text-secondary">{formatNumber(post.viewCount)}</td>
                  <td className="py-3 px-2 text-right text-text-secondary">{formatNumber(post.likeCount)}</td>
                  <td className="py-3 px-2 text-right text-text-secondary">{formatNumber(post.commentCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
