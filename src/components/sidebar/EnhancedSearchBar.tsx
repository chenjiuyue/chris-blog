/**
 * 增强的搜索栏组件
 * 支持搜索历史、结果高亮和高级筛选
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';

interface SearchHistoryItem {
  keyword: string;
  timestamp: number;
}

interface Props {
  onSearch: (keyword: string, filters?: SearchFilters) => void;
  categories?: { _id: string; name: string }[];
  tags?: { _id: string; name: string }[];
}

export interface SearchFilters {
  category?: string;
  tag?: string;
  dateRange?: 'week' | 'month' | 'year' | 'all';
}

const HISTORY_KEY = 'searchHistory';
const MAX_HISTORY = 10;

export function EnhancedSearchBar({ onSearch, categories = [], tags = [] }: Props) {
  const [keyword, setKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = (kw: string) => {
    if (!kw.trim()) return;

    const newHistory: SearchHistoryItem[] = [
      { keyword: kw, timestamp: Date.now() },
      ...searchHistory.filter(item => item.keyword !== kw)
    ].slice(0, MAX_HISTORY);

    setSearchHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  // 清空历史
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  // 执行搜索
  const handleSearch = (kw?: string) => {
    const searchTerm = kw || keyword;
    if (searchTerm.trim()) {
      saveToHistory(searchTerm);
      onSearch(searchTerm, filters);
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // 点击历史项
  const handleHistoryClick = (kw: string) => {
    setKeyword(kw);
    handleSearch(kw);
  };

  // 删除单个历史项
  const deleteHistoryItem = (e: React.MouseEvent, kw: string) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item.keyword !== kw);
    setSearchHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  return (
    <div className="relative">
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="搜索文章..."
          className="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-accent transition-colors"
        />
        {keyword && (
          <button
            onClick={() => setKeyword('')}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-3 h-3 text-text-muted" />
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
            showFilters || Object.keys(filters).length > 0
              ? 'text-accent'
              : 'text-text-muted hover:text-accent'
          }`}
          title="高级筛选"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* 高级筛选面板 */}
      {showFilters && (
        <div className="mt-2 p-3 bg-white dark:bg-[#2D2D3A] border border-[var(--color-border)] rounded-lg space-y-3">
          {/* 分类筛选 */}
          {categories.length > 0 && (
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">分类</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-[var(--color-border)] rounded focus:outline-none focus:border-accent"
              >
                <option value="">全部分类</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* 标签筛选 */}
          {tags.length > 0 && (
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">标签</label>
              <select
                value={filters.tag || ''}
                onChange={(e) => setFilters({ ...filters, tag: e.target.value || undefined })}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-[var(--color-border)] rounded focus:outline-none focus:border-accent"
              >
                <option value="">全部标签</option>
                {tags.map(tag => (
                  <option key={tag._id} value={tag._id}>{tag.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* 时间筛选 */}
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">时间</label>
            <select
              value={filters.dateRange || 'all'}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as SearchFilters['dateRange'] })}
              className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-[var(--color-border)] rounded focus:outline-none focus:border-accent"
            >
              <option value="all">全部时间</option>
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
              <option value="year">最近一年</option>
            </select>
          </div>

          {/* 应用筛选按钮 */}
          <button
            onClick={() => handleSearch()}
            className="w-full py-1.5 text-sm bg-accent text-white rounded hover:bg-accent/90 transition-colors"
          >
            应用筛选
          </button>
        </div>
      )}

      {/* 下拉菜单 */}
      {showDropdown && !keyword && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#2D2D3A] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-50">
          {/* 历史记录标题 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock className="w-3 h-3" />
              <span>搜索历史</span>
            </div>
            <button
              onClick={clearHistory}
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              清空
            </button>
          </div>

          {/* 历史记录列表 */}
          <ul>
            {searchHistory.map((item) => (
              <li
                key={item.keyword}
                onClick={() => handleHistoryClick(item.keyword)}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
              >
                <span className="text-sm text-primary dark:text-text-light truncate flex-1">
                  {item.keyword}
                </span>
                <button
                  onClick={(e) => deleteHistoryItem(e, item.keyword)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                >
                  <X className="w-3 h-3 text-text-muted" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * 高亮搜索结果文本
 */
export function highlightText(text: string, keyword: string): React.ReactNode {
  if (!keyword.trim()) return text;

  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  
  return parts.map((part, index) => 
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 text-inherit px-0.5 rounded">{part}</mark>
      : part
  );
}
