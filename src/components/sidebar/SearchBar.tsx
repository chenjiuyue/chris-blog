import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

interface Props {
  onSearch: (keyword: string) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  }, [keyword, onSearch]);

  const handleClear = () => {
    setKeyword('');
    navigate('/');
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="搜索文章..."
        className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-[var(--color-border)]
          bg-white dark:bg-[#2D2D3A] text-primary dark:text-text-light
          placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50
          transition-colors"
      />
      {keyword && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted
            hover:text-accent transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
