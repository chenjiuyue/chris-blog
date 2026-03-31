import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, ShieldCheck, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { sendSmsCode, loginWithSms } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verificationInfo, setVerificationInfo] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [logging, setLogging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser, isLoggedIn } = useAuth();

  const from = (location.state as any)?.from || '/';

  // 已登录则跳转
  useEffect(() => {
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn, navigate, from]);

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone);

  const handleSendCode = useCallback(async () => {
    if (!isPhoneValid || countdown > 0 || sending) return;
    setError('');
    setSending(true);
    try {
      const info = await sendSmsCode(phone);
      setVerificationInfo(info);
      setCountdown(60);
    } catch (e: any) {
      setError(e.message || '验证码发送失败，请稍后重试');
    }
    setSending(false);
  }, [phone, isPhoneValid, countdown, sending]);

  const handleLogin = useCallback(async () => {
    if (!verificationInfo || code.length < 4 || logging) return;
    setError('');
    setLogging(true);
    try {
      await loginWithSms(phone, code, verificationInfo);
      setSuccess(true);
      await refreshUser();
      setTimeout(() => navigate(from, { replace: true }), 600);
    } catch (e: any) {
      const messages: Record<string, string> = {
        INVALID_CREDENTIALS: '验证码错误，请重新输入',
        VERIFICATION_CODE_EXPIRED: '验证码已过期，请重新获取',
        VERIFICATION_CODE_INVALID: '验证码错误',
        RATE_LIMIT_EXCEEDED: '请求过于频繁，请稍后再试',
      };
      setError(messages[e.code] || e.message || '登录失败，请重试');
      setLogging(false);
    }
  }, [verificationInfo, code, phone, logging, refreshUser, navigate, from]);

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] dark:bg-[#1A1A2E]">
      {/* 左侧装饰区 */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574] via-[#E8C9A8] to-[#B8864A]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
            Chris Know
          </h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-md">
            探索技术的边界，记录思考的轨迹。<br />
            登录后享受完整的阅读体验。
          </p>
          <div className="mt-12 flex gap-6 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span>收藏文章</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span>互动评论</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span>个性化推荐</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-[slideUp_0.5s_ease-out]">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <h2 className="text-3xl font-bold text-[#D4A574]">Chris Know</h2>
            <p className="text-sm text-[#B8B6B3] mt-2">登录以获得完整体验</p>
          </div>

          {/* 卡片 */}
          <div className="bg-white/80 dark:bg-[#2D2D3A]/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-white/20 dark:border-white/5">
            <h3 className="text-2xl font-semibold text-[#1A1A2E] dark:text-[#F5F5F5] mb-2">
              欢迎回来
            </h3>
            <p className="text-sm text-[#B8B6B3] mb-8">
              使用手机号快速登录或注册
            </p>

            {/* 手机号 */}
            <div className="mb-5">
              <label className="text-xs font-medium text-[#B8B6B3] uppercase tracking-wider mb-2 block">手机号</label>
              <div className="flex items-center gap-3 border-b-2 border-gray-200 dark:border-gray-600 focus-within:border-[#D4A574] transition-colors pb-2">
                <Phone size={18} className="text-[#B8B6B3] flex-shrink-0" />
                <span className="text-sm text-[#B8B6B3] flex-shrink-0">+86</span>
                <input
                  type="tel"
                  maxLength={11}
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="请输入手机号"
                  className="flex-1 bg-transparent border-none outline-none text-[#1A1A2E] dark:text-[#F5F5F5] placeholder:text-[#B8B6B3]/50 text-base"
                />
              </div>
            </div>

            {/* 验证码 */}
            <div className="mb-6">
              <label className="text-xs font-medium text-[#B8B6B3] uppercase tracking-wider mb-2 block">验证码</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 border-b-2 border-gray-200 dark:border-gray-600 focus-within:border-[#D4A574] transition-colors pb-2">
                  <ShieldCheck size={18} className="text-[#B8B6B3] flex-shrink-0" />
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={e => {
                      setCode(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    placeholder="输入验证码"
                    className="flex-1 bg-transparent border-none outline-none text-[#1A1A2E] dark:text-[#F5F5F5] placeholder:text-[#B8B6B3]/50 text-base"
                  />
                </div>
                <button
                  onClick={handleSendCode}
                  disabled={!isPhoneValid || countdown > 0 || sending}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                    ${!isPhoneValid || countdown > 0 || sending
                      ? 'bg-gray-100 dark:bg-gray-700 text-[#B8B6B3] cursor-not-allowed'
                      : 'bg-[#D4A574]/10 text-[#D4A574] hover:bg-[#D4A574]/20 active:scale-95'
                    }`}
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    '获取验证码'
                  )}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 text-sm text-[#EF4444] bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-lg animate-[slideUp_0.2s_ease-out]">
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <button
              onClick={handleLogin}
              disabled={!verificationInfo || code.length < 4 || logging || success}
              className={`w-full py-3.5 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                ${success
                  ? 'bg-[#10B981] text-white shadow-lg shadow-green-500/30'
                  : !verificationInfo || code.length < 4 || logging
                    ? 'bg-gray-200 dark:bg-gray-700 text-[#B8B6B3] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D4A574] to-[#B8864A] text-white shadow-lg shadow-[#D4A574]/30 hover:shadow-xl hover:shadow-[#D4A574]/40 hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {success ? (
                <><CheckCircle size={20} /> 登录成功</>
              ) : logging ? (
                <><Loader2 size={20} className="animate-spin" /> 登录中...</>
              ) : (
                <>登录 / 注册 <ArrowRight size={18} /></>
              )}
            </button>

            <p className="text-center text-xs text-[#B8B6B3] mt-5">
              未注册的手机号将自动创建账号
            </p>
          </div>

          {/* 返回首页 */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-[#B8B6B3] hover:text-[#D4A574] transition-colors cursor-pointer"
            >
              ← 返回首页
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
