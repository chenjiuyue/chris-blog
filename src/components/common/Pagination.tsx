interface Props {
  current: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
}

export function Pagination({ current, total, pageSize, onPage }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPage(current - 1)}
        disabled={current <= 1}
        className="px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)]
          disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer
          text-text-secondary dark:text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
      >
        上一页
      </button>
      {pages.map((p, i) =>
        typeof p === 'string' ? (
          <span key={`dot-${i}`} className="px-2 text-text-muted">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 text-sm rounded-md cursor-pointer transition-colors ${
              p === current
                ? 'bg-accent text-white'
                : 'text-text-secondary dark:text-text-muted hover:text-accent hover:bg-accent/10'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(current + 1)}
        disabled={current >= totalPages}
        className="px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)]
          disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer
          text-text-secondary dark:text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
      >
        下一页
      </button>
    </div>
  );
}
