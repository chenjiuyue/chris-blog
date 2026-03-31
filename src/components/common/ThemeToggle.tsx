import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-full
        text-text-secondary dark:text-text-muted hover:text-accent dark:hover:text-accent
        hover:bg-accent/10 transition-all duration-200 cursor-pointer"
      aria-label="切换主题"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
