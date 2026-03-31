/**
 * 文章系列导航组件
 * 显示系列文章的导航和上下篇链接
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, List } from 'lucide-react';
import type { PostSeries } from '../../types';

interface Props {
  seriesId?: string;
  currentPostId: string;
}

export function SeriesNavigation({ seriesId, currentPostId }: Props) {
  const [series, setSeries] = useState<PostSeries | null>(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    // TODO: 从数据库获取系列信息
    // 这里暂时使用模拟数据
    if (seriesId) {
      // 模拟系列数据
      setSeries(null);
    }
  }, [seriesId]);

  if (!series) return null;

  const currentIndex = series.postIds.indexOf(currentPostId);
  if (currentIndex === -1) return null;

  const prevPostId = currentIndex > 0 ? series.postIds[currentIndex - 1] : null;
  const nextPostId = currentIndex < series.postIds.length - 1 ? series.postIds[currentIndex + 1] : null;

  return (
    <div className="my-8 rounded-xl border border-[var(--color-border)] bg-white dark:bg-[#2D2D3A]/40 overflow-hidden">
      {/* 系列标题 */}
      <div 
        className="p-4 bg-gradient-to-r from-accent/5 to-accent/10 cursor-pointer hover:from-accent/10 hover:to-accent/15 transition-colors"
        onClick={() => setShowList(!showList)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-medium text-primary dark:text-text-light">
                {series.title}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                共 {series.postCount} 篇文章 · 当前第 {currentIndex + 1} 篇
              </p>
            </div>
          </div>
          <List className={`w-5 h-5 text-text-muted transition-transform ${showList ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* 文章列表（可折叠） */}
      {showList && (
        <div className="border-t border-[var(--color-border)] p-4">
          <ol className="space-y-2">
            {series.postIds.map((postId, index) => (
              <li key={postId}>
                <Link
                  to={`/post/${postId}`}
                  className={`flex items-center gap-2 text-sm py-1.5 px-3 rounded transition-colors ${
                    postId === currentPostId
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-text-muted hover:text-accent hover:bg-accent/5'
                  }`}
                >
                  <span className="text-xs font-mono opacity-50">{index + 1}.</span>
                  文章标题 {postId} {/* TODO: 替换为实际文章标题 */}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 上下篇导航 */}
      <div className="grid grid-cols-2 border-t border-[var(--color-border)] divide-x divide-[var(--color-border)]">
        {prevPostId ? (
          <Link
            to={`/post/${prevPostId}`}
            className="flex items-center gap-2 p-4 hover:bg-accent/5 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-muted">上一篇</p>
              <p className="text-sm text-primary dark:text-text-light truncate">
                文章标题 {prevPostId}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 p-4 opacity-40">
            <ChevronLeft className="w-5 h-5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">上一篇</p>
              <p className="text-sm text-text-muted">已是第一篇</p>
            </div>
          </div>
        )}

        {nextPostId ? (
          <Link
            to={`/post/${nextPostId}`}
            className="flex items-center justify-end gap-2 p-4 hover:bg-accent/5 transition-colors group"
          >
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs text-text-muted">下一篇</p>
              <p className="text-sm text-primary dark:text-text-light truncate">
                文章标题 {nextPostId}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
          </Link>
        ) : (
          <div className="flex items-center justify-end gap-2 p-4 opacity-40">
            <div className="text-right">
              <p className="text-xs text-text-muted">下一篇</p>
              <p className="text-sm text-text-muted">已是最后一篇</p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </div>
        )}
      </div>
    </div>
  );
}
