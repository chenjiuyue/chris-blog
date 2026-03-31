import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, FileText, LogIn } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { getFavorites, removeFavorite, type FavoritePost } from '../services/favoriteService';
import { getPostById } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import type { Post } from '../types';

export function FavoritesPage() {
  const { user, isLoggedIn, login } = useAuth();
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [posts, setPosts] = useState<Map<string, Post>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadFavorites();
    } else {
      setFavorites([]);
      setPosts(new Map());
      setLoading(false);
    }
  }, [user?.uid]);

  const loadFavorites = async () => {
    if (!user?.uid) return;
    setLoading(true);
    const favs = await getFavorites(user.uid);
    setFavorites(favs);

    // 加载文章详情
    const postsMap = new Map<string, Post>();
    for (const fav of favs) {
      const post = await getPostById(fav.postId);
      if (post) {
        postsMap.set(fav.postId, post);
      }
    }
    setPosts(postsMap);
    setLoading(false);
  };

  const handleRemove = async (postId: string) => {
    if (!user?.uid) return;
    const success = await removeFavorite(postId, user.uid);
    if (success) {
      setFavorites(prev => prev.filter(f => f.postId !== postId));
      setPosts(prev => {
        const newPosts = new Map(prev);
        newPosts.delete(postId);
        return newPosts;
      });
    }
  };

  return (
    <>
      <SEO title="我的收藏" description="我收藏的文章列表" />
      <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 text-accent mb-4">
          <Bookmark size={24} />
          <h1 className="font-serif text-3xl md:text-4xl text-primary dark:text-text-light">
            我的收藏
          </h1>
        </div>
        {isLoggedIn && (
          <p className="text-text-muted">
            共收藏 {favorites.length} 篇文章
          </p>
        )}
      </header>

      {/* 未登录提示 */}
      {!isLoggedIn ? (
        <div className="text-center py-20">
          <LogIn size={48} className="mx-auto text-text-muted/50 mb-4" />
          <p className="text-text-muted mb-4">登录后即可查看和管理您的收藏</p>
          <button
            onClick={login}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors text-sm font-medium"
          >
            <LogIn size={16} />
            去登录
          </button>
        </div>
      ) : loading ? (
        <div className="text-center py-20 text-text-muted">加载中...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark size={48} className="mx-auto text-text-muted/50 mb-4" />
          <p className="text-text-muted mb-2">还没有收藏任何文章</p>
          <Link to="/" className="text-accent hover:underline text-sm">
            去首页看看
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map(fav => {
            const post = posts.get(fav.postId);
            return (
              <div
                key={fav.postId}
                className="flex items-start gap-4 p-5 rounded-xl border border-[var(--color-border)] hover:border-accent/30 transition-all bg-[var(--color-surface)]"
              >
                <FileText size={20} className="text-accent mt-1 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  {post ? (
                    <>
                      <Link
                        to={`/post/${fav.postId}`}
                        className="block group"
                      >
                        <h3 className="font-serif text-lg text-primary dark:text-text-light group-hover:text-accent transition-colors mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-2 mb-3">
                          {post.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span>{post.category}</span>
                          <span>·</span>
                          <span>{post.viewCount} 次阅读</span>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <div className="text-text-muted">
                      <p className="mb-2">{fav.title}</p>
                      <p className="text-xs">文章可能已被删除</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRemove(fav.postId)}
                  className="flex-shrink-0 p-2 text-text-muted hover:text-red-500 transition-colors"
                  aria-label="取消收藏"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}
