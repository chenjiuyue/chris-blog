import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, MessageCircle, Calendar, Clock } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { PostDetail } from '../components/post/PostDetail';
import { TableOfContents } from '../components/post/TableOfContents';
import { LikeButton } from '../components/post/LikeButton';
import { FavoriteButton } from '../components/post/FavoriteButton';
import { ShareButton } from '../components/post/ShareButton';
import { ReadingSettings } from '../components/post/ReadingSettings';
import { SeriesNavigation } from '../components/post/SeriesNavigation';
import { BackToTop } from '../components/common/BackToTop';
import { CommentList } from '../components/comment/CommentList';
import { Loading } from '../components/common/Loading';
import { getPostById, getRelatedPosts } from '../services/postService';
import { getCommentsByPostId } from '../services/commentService';
import { getCloudBaseApp, ensureAuth } from '../config/cloudbase';
import { getVisitorId } from '../utils/visitorId';
import type { Post, Comment } from '../types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function estimateReadTime(content: string): string {
  return `${Math.ceil(content.length / 400)} 分钟阅读`;
}

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // 记录访问日志 + 更新文章浏览量
  const recordVisit = async (postId: string) => {
    try {
      await ensureAuth();
      const app = getCloudBaseApp();
      // 并行调用两个云函数
      await Promise.allSettled([
        app.callFunction({
          name: 'blog-recordVisit',
          data: {
            postId,
            page: `/post/${postId}`,
            referrer: document.referrer || '',
            userAgent: navigator.userAgent || '',
            visitorId: getVisitorId(),
          },
        }),
        app.callFunction({
          name: 'blog-updatePostViews',
          data: { postId },
        }),
      ]);
    } catch (e) {
      // 访问记录失败不影响页面展示
      console.warn('记录访问失败:', e);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getPostById(id).then(p => {
      setPost(p);
      setLoading(false);
      if (p) {
        getRelatedPosts(p._id, p.category, p.tags).then(setRelatedPosts);
        // 记录访问 + 更新浏览量
        recordVisit(id);
      }
    });

    getCommentsByPostId(id).then(setComments);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      const total = contentRef.current.scrollHeight;
      const progress = Math.min(100, Math.max(0, (-rect.top / (total - window.innerHeight)) * 100));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <Loading />;
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-text-muted">
        文章不存在或已删除
      </div>
    );
  }

  const refreshComments = () => {
    if (id) getCommentsByPostId(id).then(setComments);
  };

  return (
    <>
      <SEO 
        title={post.title} 
        description={post.summary || post.content.slice(0, 150)} 
        keywords={post.tags || []}
        type="article"
      />
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-accent z-[60] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }} 
      />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <div className="flex gap-8">
          {/* Main Content */}
          <article className="flex-1 max-w-3xl min-w-0" ref={contentRef}>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8">
              <ArrowLeft size={14} />
              返回首页
            </Link>

            {/* Article Header */}
            <header className="mb-12">
              <Link to={`/category/${post.category}`} className="inline-block text-xs font-medium text-accent uppercase tracking-wider mb-5 hover:underline">
                {post.category}
              </Link>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-primary dark:text-text-light leading-snug md:leading-relaxed mb-7">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted mb-7">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {estimateReadTime(post.content)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {post.viewCount} 次阅读
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(post.tags || []).map(tag => (
                  <Link key={tag} to={`/tag/${tag}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-accent/8 text-accent/80 hover:bg-accent/15 transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            </header>

            {/* Article Body */}
            <div className="mb-12">
              <PostDetail content={post.content} skipFirstH1 />
            </div>

            {/* Action Bar - Like & Favorite & Share Buttons */}
            <div className="flex items-center justify-center gap-4 py-6 mb-8">
              <LikeButton postId={post._id} initialLikeCount={post.likeCount} />
              <FavoriteButton postId={post._id} title={post.title} />
              <ShareButton postId={post._id} title={post.title} />
            </div>

            {/* Series Navigation */}
            {post.seriesId && (
              <div className="mb-8">
                <SeriesNavigation seriesId={post.seriesId} currentPostId={post._id} />
              </div>
            )}

            {/* Stats Bar */}
            <div className="flex items-center justify-between py-4 border-t border-b border-[var(--color-border)] mb-8">
              <div className="flex items-center gap-5 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Eye size={15} />
                  {post.viewCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={15} />
                  {comments.length}
                </span>
              </div>
            </div>

            {/* Comments */}
            <CommentList postId={post._id} comments={comments} loading={false} onRefresh={refreshComments} />
          </article>

          {/* Table of Contents Sidebar */}
          <TableOfContents content={post.content} />
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <h3 className="font-serif text-xl text-primary dark:text-text-light mb-6">相关文章</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            {relatedPosts.map(rp => (
              <Link key={rp._id} to={`/post/${rp._id}`}
                className="group p-4 rounded-xl border border-[var(--color-border)] hover:border-accent/30 transition-all duration-200 hover:shadow-sm">
                <h4 className="font-serif text-sm text-primary dark:text-text-light leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {rp.title}
                </h4>
                <p className="text-xs text-text-muted">{formatDate(rp.createdAt)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <BackToTop />

      {/* Reading Settings */}
      <ReadingSettings />
    </>
  );
}
