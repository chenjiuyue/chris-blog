import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  content: string;
}

export function TableOfContents({ content }: Props) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 提取标题生成目录（跳过第一个 h1，因为是文章标题）
  useEffect(() => {
    const headings: TocItem[] = [];
    const lines = content.split('\n');
    let headingCounter = 0;
    let skippedFirstH1 = false;
    
    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        // 跳过第一个 h1（与 PostDetail skipFirstH1 一致）
        if (!skippedFirstH1 && level === 1) {
          skippedFirstH1 = true;
          return;
        }
        const id = `heading-${headingCounter}-${text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')}`;
        headings.push({ id, text, level });
        headingCounter++;
      }
    });

    setToc(headings);
  }, [content]);

  // 监听滚动高亮当前章节
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  // 点击跳转
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden lg:block w-64 pl-8">
      <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
        目录
      </div>
      <ul className="space-y-2 text-sm border-l-2 border-[var(--color-border)]">
        {toc.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                'block w-full text-left py-1 px-3 -ml-[2px] border-l-2 transition-all duration-200',
                activeId === item.id
                  ? 'border-accent text-accent font-medium'
                  : 'border-transparent text-text-muted hover:text-primary hover:border-text-muted'
              )}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
