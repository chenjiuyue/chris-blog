import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Loading } from '../components/common/Loading';
import { getPublishedPosts } from '../services/postService';
import type { Post } from '../types';

interface ArchiveGroup {
  year: string;
  months: {
    month: string;
    posts: Post[];
  }[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}

function groupPostsByDate(posts: Post[]): ArchiveGroup[] {
  const groups: Map<string, Map<string, Post[]>> = new Map();

  posts.forEach(post => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    if (!groups.has(year)) {
      groups.set(year, new Map());
    }

    const yearGroup = groups.get(year)!;
    if (!yearGroup.has(month)) {
      yearGroup.set(month, []);
    }

    yearGroup.get(month)!.push(post);
  });

  // 转换为数组并排序
  const result: ArchiveGroup[] = [];
  const sortedYears = Array.from(groups.keys()).sort((a, b) => Number(b) - Number(a));

  sortedYears.forEach(year => {
    const monthsMap = groups.get(year)!;
    const sortedMonths = Array.from(monthsMap.keys()).sort((a, b) => Number(b) - Number(a));

    result.push({
      year,
      months: sortedMonths.map(month => ({
        month,
        posts: monthsMap.get(month)!.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      })),
    });
  });

  return result;
}

export function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [archives, setArchives] = useState<ArchiveGroup[]>([]);

  useEffect(() => {
    getPublishedPosts(1000).then(data => {
      setPosts(data);
      setArchives(groupPostsByDate(data));
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SEO title="文章归档" description="按时间线浏览所有文章" />
      <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 text-accent mb-4">
          <Calendar size={24} />
          <h1 className="font-serif text-3xl md:text-4xl text-primary dark:text-text-light">
            文章归档
          </h1>
        </div>
        <p className="text-text-muted">
          共 {posts.length} 篇文章
        </p>
      </header>

      {/* Archive Timeline */}
      <div className="space-y-12">
        {archives.map(({ year, months }) => (
          <div key={year} className="relative">
            {/* Year Header */}
            <div className="sticky top-20 z-10 bg-[var(--color-surface)] py-3 mb-6 border-b-2 border-accent">
              <h2 className="font-serif text-2xl text-primary dark:text-text-light">
                {year} 年
              </h2>
            </div>

            {/* Months */}
            <div className="space-y-8">
              {months.map(({ month, posts: monthPosts }) => (
                <div key={month} className="relative pl-8 border-l-2 border-[var(--color-border)]">
                  {/* Month Label */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent"></div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                    {month} 月
                  </h3>

                  {/* Posts List */}
                  <div className="space-y-3">
                    {monthPosts.map(post => (
                      <Link
                        key={post._id}
                        to={`/post/${post._id}`}
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors"
                      >
                        <FileText size={16} className="text-accent mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-base text-primary dark:text-text-light group-hover:text-accent transition-colors line-clamp-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>·</span>
                            <span>{post.category}</span>
                            <span>·</span>
                            <span>{post.viewCount} 次阅读</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {archives.length === 0 && (
        <div className="text-center py-20">
          <Calendar size={48} className="mx-auto text-text-muted/50 mb-4" />
          <p className="text-text-muted">暂无归档文章</p>
        </div>
      )}
    </div>
    </>
  );
}
