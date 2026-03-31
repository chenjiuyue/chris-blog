/**
 * 文章分享按钮组件
 * 支持二维码分享和社交平台分享
 */

import { useState } from 'react';
import { Share2, X, Copy, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface Props {
  postId: string;
  title: string;
}

export function ShareButton({ postId, title }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}#/post/${postId}`;

  // 社交平台分享链接
  const sharePlatforms = [
    {
      name: '微信',
      icon: '💬',
      action: () => {
        alert('请截图二维码后分享到微信');
      }
    },
    {
      name: '微博',
      icon: '📱',
      action: () => {
        const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
        window.open(weiboUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'QQ',
      icon: '🐧',
      action: () => {
        const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
        window.open(qqUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Twitter',
      icon: '🐦',
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
      }
    }
  ];

  // 生成二维码
  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(shareUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('生成二维码失败:', error);
    }
  };

  // 复制链接
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    generateQRCode();
  };

  return (
    <>
      {/* 分享按钮 */}
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
        aria-label="分享文章"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">分享</span>
      </button>

      {/* 分享弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#2D2D3A] rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-primary dark:text-text-light">
                分享文章
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="关闭"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 二维码 */}
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="二维码" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-text-muted animate-pulse" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-2">扫码分享</p>
              </div>

              {/* 复制链接 */}
              <div>
                <p className="text-xs text-text-muted mb-2">复制链接</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-[var(--color-border)] rounded-lg focus:outline-none"
                  />
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">复制</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 社交平台 */}
              <div>
                <p className="text-xs text-text-muted mb-3">分享到</p>
                <div className="grid grid-cols-4 gap-3">
                  {sharePlatforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={platform.action}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-xs text-text-muted">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
