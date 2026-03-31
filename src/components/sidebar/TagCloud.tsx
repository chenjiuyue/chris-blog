import { Link } from 'react-router-dom';
import type { Tag } from '../../types';

interface Props {
  tags: Tag[];
}

export function TagCloud({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
        标签
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => {
          const size = tag.postCount > 5 ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5';
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
  );
}
