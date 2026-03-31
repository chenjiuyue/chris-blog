import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { PostList } from '../components/post/PostList';
import { CategoryNav } from '../components/sidebar/CategoryNav';
import { TagCloud } from '../components/sidebar/TagCloud';
import { HotPosts } from '../components/sidebar/HotPosts';
import { FriendLinks } from '../components/sidebar/FriendLinks';
import { EnhancedSearchBar } from '../components/sidebar/EnhancedSearchBar';
import { StatsOverview } from '../components/common/StatsOverview';
import { ProfileCard } from '../components/sidebar/ProfileCard';
import { getPublishedPosts, searchPosts } from '../services/postService';
import { getAllCategories } from '../services/categoryService';
import { getAllTags } from '../services/tagService';
import { getBlogStatistics } from '../services/statisticsService';
import type { Post, Category, Tag, BlogStatistics } from '../types';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [stats, setStats] = useState<BlogStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const data = await getPublishedPosts(20);
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
    getAllCategories().then(setCategories);
    getAllTags().then(setTags);
    getBlogStatistics().then(setStats);
  }, [fetchPosts]);

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
                fetchPosts();
              }}
              className="text-sm text-accent mb-6 hover:underline cursor-pointer"
            >
              &larr; 返回全部文章
            </button>
          )}
          <PostList posts={posts} loading={loading} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <ProfileCard />
          <StatsOverview stats={stats} />

          {/* Search & Categories */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)]">
            <div className="mb-5">
              <EnhancedSearchBar 
                onSearch={(kw) => {
                  setSearchMode(true);
                  handleSearch(kw);
                }}
                categories={categories}
                tags={tags}
              />
            </div>
            <CategoryNav categories={categories} />
          </div>

          {/* Hot Posts */}
          <HotPosts />

          {/* Tags */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)]">
            <TagCloud tags={tags} />
          </div>

          {/* Friend Links */}
          <FriendLinks />
        </aside>
      </div>
    </div>
    </>
  );
}
