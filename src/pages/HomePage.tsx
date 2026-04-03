import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { PostList } from '../components/post/PostList';
import { HotPosts } from '../components/sidebar/HotPosts';
import { FriendLinks } from '../components/sidebar/FriendLinks';
import { EnhancedSearchBar } from '../components/sidebar/EnhancedSearchBar';
import { AboutCard } from '../components/common/AboutCard';
import { CategoryTagNav } from '../components/sidebar/CategoryTagNav';
import { getPublishedPosts, searchPosts } from '../services/postService';
import type { PostSortField } from '../services/postService';
import { getAllCategories } from '../services/categoryService';
import { getAllTags } from '../services/tagService';
import { getBlogStatistics } from '../services/statisticsService';
import { getCloudBaseApp, ensureAuth } from '../config/cloudbase';
import { getVisitorId } from '../utils/visitorId';
import type { Post, Category, Tag, BlogStatistics } from '../types';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [stats, setStats] = useState<BlogStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [sortField, setSortField] = useState<PostSortField>('createdAt');

  const fetchPosts = useCallback(async (sort: PostSortField = 'createdAt') => {
    setLoading(true);
    const data = await getPublishedPosts(20, 0, sort);
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts(sortField);
    getAllCategories().then(setCategories);
    getAllTags().then(setTags);
    getBlogStatistics().then(setStats);
    // 记录首页访问
    ensureAuth().then(() => {
      const app = getCloudBaseApp();
      app.callFunction({
        name: 'blog-recordVisit',
        data: { page: '/', referrer: document.referrer || '', userAgent: navigator.userAgent || '', visitorId: getVisitorId() },
      }).catch(() => {});
    });
  }, [fetchPosts, sortField]);

  useEffect(() => {
    if (searchParams.get('search') === 'true') {
      setSearchMode(true);
    }
  }, [searchParams]);

  const handleSearch = useCallback(async (keyword: string) => {
    setLoading(true);
    setSearchMode(true);
    const data = await searchPosts(keyword);
    setPosts(data);
    setLoading(false);
  }, []);

  const handleSortChange = useCallback((field: PostSortField) => {
    setSortField(field);
    setSearchMode(false);
  }, []);

  return (
    <>
      <SEO />
      <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {searchMode && (
            <button
              onClick={() => {
                setSearchMode(false);
                fetchPosts(sortField);
              }}
              className="text-sm text-accent mb-6 hover:underline cursor-pointer"
            >
              &larr; 返回全部文章
            </button>
          )}
          <PostList
            posts={posts}
            loading={loading}
            sortField={sortField}
            onSortChange={handleSortChange}
            showSort={!searchMode}
          />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          <AboutCard stats={stats} />

          {/* Search */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)]">
            <EnhancedSearchBar
              onSearch={(kw) => {
                setSearchMode(true);
                handleSearch(kw);
              }}
              categories={categories}
              tags={tags}
            />
          </div>

          {/* Hot Posts */}
          <HotPosts />

          {/* Categories & Tags */}
          <CategoryTagNav categories={categories} tags={tags} />

          {/* Friend Links */}
          <FriendLinks />
        </aside>
      </div>
    </div>
    </>
  );
}
