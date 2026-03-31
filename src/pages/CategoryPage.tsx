import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { PostList } from '../components/post/PostList';
import { Loading } from '../components/common/Loading';
import { getPostsByCategory } from '../services/postService';
import { getAllCategories, getCategoryBySlug } from '../services/categoryService';
import type { Post, Category } from '../types';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      getPostsByCategory(slug, 20),
      getCategoryBySlug(slug),
    ]).then(([posts, cat]) => {
      setPosts(posts);
      setCategory(cat);
      setLoading(false);
    });
  }, [slug]);

  return (
    <>
      <SEO title={`${category?.name || slug} - 分类`} description={`${category?.name || slug}分类下的所有文章`} />
      <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link to="/" className="hover:text-accent transition-colors">首页</Link>
        <span>/</span>
        <span className="text-primary dark:text-text-light">{category?.name || slug}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-primary dark:text-text-light mb-3">
          {category?.name || slug}
        </h1>
        {category?.description && (
          <p className="text-text-secondary dark:text-text-muted">{category.description}</p>
        )}
        <p className="text-sm text-text-muted mt-2">{posts.length} 篇文章</p>
      </header>

      <PostList posts={posts} loading={loading} />
    </div>
    </>
  );
}
