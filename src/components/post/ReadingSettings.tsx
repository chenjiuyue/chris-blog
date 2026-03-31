/**
 * 阅读设置组件
 * 调整字体大小、行高和阅读模式
 */

import { useState, useEffect } from 'react';
import { Settings, X, Sun, Moon, Monitor, Type, AlignJustify, Eye } from 'lucide-react';

interface ReadingSettings {
  fontSize: number; // 14-24
  lineHeight: number; // 1.5-2.5
  theme: 'light' | 'dark' | 'auto';
  focusMode: boolean;
}

const STORAGE_KEY = 'readingSettings';

const defaultSettings: ReadingSettings = {
  fontSize: 16,
  lineHeight: 1.8,
  theme: 'auto',
  focusMode: false
};

interface Props {
  onSettingsChange?: (settings: ReadingSettings) => void;
}

export function ReadingSettings({ onSettingsChange }: Props) {
  const [showPanel, setShowPanel] = useState(false);
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    // 从 localStorage 读取设置
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // 应用设置到页面
    applySettings(settings);
    // 通知父组件
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  // 应用设置
  const applySettings = (settings: ReadingSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--reading-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--reading-line-height', settings.lineHeight.toString());
    
    // 专注模式
    if (settings.focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
  };

  const updateSetting = <K extends keyof ReadingSettings>(key: K, value: ReadingSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* 设置按钮 */}
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-20 right-6 w-12 h-12 rounded-full bg-white dark:bg-[#2D2D3A] shadow-lg border border-[var(--color-border)] flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="阅读设置"
      >
        <Settings className="w-5 h-5 text-text-muted" />
      </button>

      {/* 设置面板 */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm">
          <div className="h-full w-80 bg-white dark:bg-[#1E1E2E] shadow-2xl overflow-y-auto">
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h3 className="text-lg font-serif font-bold text-primary dark:text-text-light">
                阅读设置
              </h3>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="关闭"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-8">
              {/* 字体大小 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-4 h-4 text-text-muted" />
                  <label className="text-sm font-medium text-primary dark:text-text-light">
                    字体大小
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted">小</span>
                  <input
                    type="range"
                    min="14"
                    max="24"
                    step="1"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <span className="text-xs text-text-muted">大</span>
                </div>
                <p className="text-center text-xs text-text-muted mt-2">
                  {settings.fontSize}px
                </p>
              </div>

              {/* 行高 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlignJustify className="w-4 h-4 text-text-muted" />
                  <label className="text-sm font-medium text-primary dark:text-text-light">
                    行高
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted">紧凑</span>
                  <input
                    type="range"
                    min="1.5"
                    max="2.5"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) => updateSetting('lineHeight', Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <span className="text-xs text-text-muted">宽松</span>
                </div>
                <p className="text-center text-xs text-text-muted mt-2">
                  {settings.lineHeight.toFixed(1)}
                </p>
              </div>

              {/* 阅读模式 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-text-muted" />
                  <label className="text-sm font-medium text-primary dark:text-text-light">
                    阅读模式
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      settings.theme === 'light'
                        ? 'border-accent bg-accent/10'
                        : 'border-[var(--color-border)] hover:border-accent/50'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs">明亮</span>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      settings.theme === 'dark'
                        ? 'border-accent bg-accent/10'
                        : 'border-[var(--color-border)] hover:border-accent/50'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs">暗黑</span>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'auto')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      settings.theme === 'auto'
                        ? 'border-accent bg-accent/10'
                        : 'border-[var(--color-border)] hover:border-accent/50'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span className="text-xs">自动</span>
                  </button>
                </div>
              </div>

              {/* 专注模式 */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-text-muted" />
                    <label className="text-sm font-medium text-primary dark:text-text-light">
                      专注模式
                    </label>
                  </div>
                  <button
                    onClick={() => updateSetting('focusMode', !settings.focusMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.focusMode ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.focusMode ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  开启后将隐藏页面其他元素，专注阅读
                </p>
              </div>

              {/* 重置按钮 */}
              <button
                onClick={resetSettings}
                className="w-full py-2 text-sm text-text-muted hover:text-accent border border-[var(--color-border)] rounded-lg transition-colors"
              >
                恢复默认设置
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
