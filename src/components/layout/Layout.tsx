import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AnnouncementBar } from '../common/AnnouncementBar';
import { getActiveAnnouncement } from '../../services/announcementService';
import type { Announcement } from '../../services/announcementService';

export function Layout() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    // 获取当前有效的公告
    getActiveAnnouncement().then(setAnnouncement);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-primary-dark transition-colors duration-300">
      <Header />
      <AnnouncementBar announcement={announcement || undefined} />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
