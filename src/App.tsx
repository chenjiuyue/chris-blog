import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
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

const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <HashRouter>
        <AuthProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" /></div>}>
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
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        </Suspense>
        </AuthProvider>
        </HashRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
