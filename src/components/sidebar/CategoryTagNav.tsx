import { Link, useLocation } from 'react-router-dom';
import { FolderOpen, Tag as TagIcon } from 'lucide-react';
import type { Category, Tag } from '../../types';

interface Props {
  categories: Category[];
  tags: Tag[];
}

export function CategoryTagNav({ categories, tags }: Props) {
  const location = useLocation();

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)]">
      {/* Categories */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3">
          <FolderOpen size={14} className="text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            分类
          </h3>
        </div>
        <div className="space-y-0.5">
          <Link
            to="/"
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors ${
              location.pathname === '/'
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-text-secondary dark:text-text-muted hover:text-accent hover:bg-accent/5'
            }`}
          >
            <span>全部文章</span>
          </Link>
          {categories.filter(cat => cat.name && cat.slug).map(cat => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                location.pathname === `/category/${cat.slug}`
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-secondary dark:text-text-muted hover:text-accent hover:bg-accent/5'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-text-muted">{cat.postCount}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <TagIcon size={14} className="text-accent" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              标签
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => {
              const size = tag.postCount > 5 ? 'text-xs px-2.5 py-1' : 'text-xs px-2 py-0.5';
              const opacity = Math.max(0.5, Math.min(1, tag.postCount / 10 + 0.4));
              return (
                <Link
                  key={tag._id}
                  to={`/tag/${tag.slug}`}
                  className={`${size} rounded-full border border-[var(--color-border)] text-accent/80
                    hover:bg-accent/10 hover:border-accent/30 transition-all duration-200`}
                  style={{ opacity }}
                >
                  #{tag.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
