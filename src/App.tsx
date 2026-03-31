import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { TagPage } from './pages/TagPage';
import { AboutPage } from './pages/AboutPage';
import { ArchivePage } from './pages/ArchivePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { StatsPage } from './pages/StatsPage';
import { initAuth } from './config/cloudbase';

export default function App() {
  useEffect(() => {
    // 初始化 CloudBase 认证
    initAuth();
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/tag/:slug" element={<TagPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>
        </Routes>
        </HashRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
