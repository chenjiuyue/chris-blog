/**
 * 网站公告栏组件
 * 在页面顶部显示公告信息
 */

import { useState, useEffect } from 'react';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  startTime: string;
  endTime: string;
  status: 'active' | 'inactive';
}

interface Props {
  announcement?: Announcement;
}

export function AnnouncementBar({ announcement }: Props) {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 检查是否已被用户关闭
    const dismissedAnnouncements = JSON.parse(
      localStorage.getItem('dismissedAnnouncements') || '[]'
    );
    if (announcement && dismissedAnnouncements.includes(announcement._id)) {
      setDismissed(true);
    }
  }, [announcement]);

  const handleDismiss = () => {
    if (!announcement) return;
    
    setVisible(false);
    const dismissedAnnouncements = JSON.parse(
      localStorage.getItem('dismissedAnnouncements') || '[]'
    );
    dismissedAnnouncements.push(announcement._id);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(dismissedAnnouncements));
    setDismissed(true);
  };

  // 如果没有公告或已被关闭，不显示
  if (!announcement || dismissed || !visible) return null;

  // 检查公告是否在有效期内
  const now = new Date();
  const startTime = new Date(announcement.startTime);
  const endTime = new Date(announcement.endTime);
  
  if (now < startTime || now > endTime) return null;
  if (announcement.status !== 'active') return null;

  // 根据类型设置样式
  const typeStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: Info
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      icon: AlertTriangle
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: CheckCircle
    }
  };

  const style = typeStyles[announcement.type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border-b ${style.border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1">
            <Icon className={`w-5 h-5 ${style.text} flex-shrink-0`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${style.text}`}>
                {announcement.title}
              </p>
              {announcement.content && (
                <p className={`text-xs ${style.text} mt-0.5 opacity-90`}>
                  {announcement.content}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className={`${style.text} hover:opacity-70 transition-opacity p-1`}
            aria-label="关闭公告"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
