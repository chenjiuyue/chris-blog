import { useState, useEffect } from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import { getDB, ensureAuth } from '../../config/cloudbase';
import type { Link } from '../../types';

export function FriendLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      await ensureAuth();
      const db = getDB();
      const result = await db.collection('blog_links')
        .where({ status: 'active' })
        .orderBy('order', 'asc')
        .limit(10)
        .get();

      if (typeof result.code !== 'string') {
        setLinks(result.data as Link[]);
      }
    } catch (error) {
      console.error('获取友情链接失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (links.length === 0) return null;

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <LinkIcon size={18} className="text-accent" />
        <h3 className="font-serif text-lg text-primary dark:text-text-light">
          友情链接
        </h3>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map(link => (
          <a
            key={link._id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors"
          >
            {/* Avatar */}
            {link.avatar ? (
              <img
                src={link.avatar}
                alt={link.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <LinkIcon size={16} className="text-accent" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-medium text-primary dark:text-text-light group-hover:text-accent transition-colors truncate">
                  {link.name}
                </h4>
                <ExternalLink size={12} className="text-text-muted flex-shrink-0" />
              </div>
              {link.description && (
                <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                  {link.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
