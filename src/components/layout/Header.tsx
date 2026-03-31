import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useState, useEffect } from 'react';

export function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/archive', label: '归档' },
    { path: '/favorites', label: '收藏' },
    { path: '/guestbook', label: '留言板' },
    { path: '/stats', label: '统计' },
    { path: '/about', label: '关于' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass bg-white/80 dark:bg-[#1A1A1E]/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-xl tracking-tight text-primary dark:text-text-light hover:text-accent dark:hover:text-accent transition-colors"
        >
          Chris Know
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-accent'
                  : 'text-text-secondary dark:text-text-muted hover:text-primary dark:hover:text-text-light'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/?search=true"
            className="text-text-secondary dark:text-text-muted hover:text-accent transition-colors"
          >
            <Search size={18} />
          </Link>
          <ThemeToggle />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-text-primary dark:text-text-light p-2 cursor-pointer"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden glass bg-white/95 dark:bg-[#1A1A1E]/95 border-t border-[var(--color-border)] animate-fade-in">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-text-secondary dark:text-text-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-2 border-t border-[var(--color-border)]">
              <Link to="/?search=true" className="text-text-secondary dark:text-text-muted">
                <Search size={18} />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
