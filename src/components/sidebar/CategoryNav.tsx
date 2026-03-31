import { Link, useLocation } from 'react-router-dom';
import type { Category } from '../../types';

interface Props {
  categories: Category[];
}

export function CategoryNav({ categories }: Props) {
  const location = useLocation();

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
        分类
      </h3>
      <div className="space-y-1">
        <Link
          to="/"
          className={`flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
            location.pathname === '/'
              ? 'bg-accent/10 text-accent font-medium'
              : 'text-text-secondary dark:text-text-muted hover:text-accent hover:bg-accent/5'
          }`}
        >
          <span>全部文章</span>
        </Link>
        {categories.map(cat => (
          <Link
            key={cat._id}
            to={`/category/${cat.slug}`}
            className={`flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
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
  );
}
