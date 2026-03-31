import { Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-surface-light dark:bg-primary-dark">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg text-primary dark:text-text-light mb-3">Chris Know</h3>
            <p className="text-sm text-text-secondary dark:text-text-muted leading-relaxed">
              记录技术与生活的点滴，分享编程中的思考与感悟。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-primary dark:text-text-light mb-3 tracking-wide uppercase">
              链接
            </h4>
            <div className="space-y-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="block text-sm text-text-secondary dark:text-text-muted hover:text-accent transition-colors">
                GitHub
              </a>
              <a href="mailto:hello@chrisknow.dev"
                className="block text-sm text-text-secondary dark:text-text-muted hover:text-accent transition-colors">
                Email
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-primary dark:text-text-light mb-3 tracking-wide uppercase">
              关于
            </h4>
            <p className="text-sm text-text-secondary dark:text-text-muted leading-relaxed">
              基于 React + CloudBase 构建，使用简约设计追求纯粹的阅读体验。
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted dark:text-text-muted/60">
            &copy; {year} Chris Know. All rights reserved.
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted/60 flex items-center gap-1">
            Made with <Heart size={12} className="text-accent" /> and CloudBase
          </p>
        </div>
      </div>
    </footer>
  );
}
