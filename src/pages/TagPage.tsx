import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { PostList } from '../components/post/PostList';
import { Loading } from '../components/common/Loading';
import { getPostsByTag } from '../services/postService';
import { getTagBySlug } from '../services/tagService';
import type { Post, Tag } from '../types';

export function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      getPostsByTag(slug, 20),
      getTagBySlug(slug),
    ]).then(([posts, t]) => {
      setPosts(posts);
      setTag(t);
      setLoading(false);
    });
  }, [slug]);

  return (
    <>
      <SEO title={`#${tag?.name || slug} - 标签`} description={`${tag?.name || slug}标签下的所有文章`} />
      <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link to="/" className="hover:text-accent transition-colors">首页</Link>
        <span>/</span>
        <span className="text-primary dark:text-text-light">#{tag?.name || slug}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-primary dark:text-text-light mb-3">
          #{tag?.name || slug}
        </h1>
        <p className="text-sm text-text-muted">{posts.length} 篇文章</p>
      </header>

      <PostList posts={posts} loading={loading} />
    </div>
    </>
  );
}
