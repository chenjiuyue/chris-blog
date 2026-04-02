import { Link } from 'react-router-dom';

export function ProfileCard() {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)] text-center">
      {/* Avatar with Online Status */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-2xl font-serif shadow-md">
          C
        </div>
        {/* Online Status Indicator */}
        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-[#2D2D3A]">
          <div className="w-full h-full rounded-full bg-green-500 animate-ping opacity-75"></div>
        </div>
      </div>
      
      {/* Name & Title */}
      <h3 className="font-serif text-xl text-[var(--color-text)] mb-1">Chris</h3>
      <p className="text-sm text-accent mb-4">前端开发工程师</p>
      
      {/* Bio */}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
        热爱技术与设计，专注于构建优雅的用户界面。
      </p>
      
      {/* Social Links */}
      <div className="flex justify-center gap-1 text-xs text-[var(--color-text-secondary)]">
        <a
          href="https://github.com/chenjiuyue/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          GitHub
        </a>
        <span>·</span>
        <a
          href="mailto:contact@example.com"
          className="hover:text-accent transition-colors"
        >
          Email
        </a>
        <span>·</span>
        <Link
          to="/about"
          className="hover:text-accent transition-colors"
        >
          关于
        </Link>
      </div>
    </div>
  );
}
