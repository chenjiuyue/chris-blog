import { useState, useEffect } from 'react';
import { CalendarDays, Eye, MessageCircle, Heart, FileText, ExternalLink, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogStatistics } from '../../types';

interface Props {
  stats: BlogStatistics | null;
}

const WEEK_DAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0,
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
  0x0d520,
];

function lunarYearDays(y: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
  return sum + leapDays(y);
}
function leapMonth(y: number): number { return LUNAR_INFO[y - 1900] & 0xf; }
function leapDays(y: number): number { return leapMonth(y) ? (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29 : 0; }
function monthDays(y: number, m: number): number { return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29; }

function solarToLunar(y: number, m: number, d: number) {
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(y, m - 1, d);
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
  let lunarYear: number, temp = 0;
  for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) { temp = lunarYearDays(lunarYear); offset -= temp; }
  if (offset < 0) { offset += temp; lunarYear--; }
  const leap = leapMonth(lunarYear);
  let isLeap = false, lunarMonth: number;
  for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
    if (leap > 0 && lunarMonth === (leap + 1) && !isLeap) { --lunarMonth; isLeap = true; temp = leapDays(lunarYear); }
    else { temp = monthDays(lunarYear, lunarMonth); }
    if (isLeap && lunarMonth === (leap + 1)) isLeap = false;
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && lunarMonth === leap + 1) { if (isLeap) isLeap = false; else { isLeap = true; --lunarMonth; } }
  if (offset < 0) { offset += temp; --lunarMonth; }
  const ganIndex = (lunarYear - 4) % 10, zhiIndex = (lunarYear - 4) % 12;
  return { lunarMonth, lunarDay: offset + 1, isLeap, ganZhiYear: TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex], zodiac: ZODIAC[zhiIndex], lunarMonthStr: (isLeap ? '闰' : '') + LUNAR_MONTHS[lunarMonth - 1] + '月', lunarDayStr: LUNAR_DAYS[offset] };
}

function getTodayInfo() {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
  const lunar = solarToLunar(y, m, d);
  return { dateStr: `${y}年${m}月${d}日`, weekDay: WEEK_DAYS[now.getDay()], ganZhiYear: lunar.ganZhiYear, zodiac: lunar.zodiac, lunarMonthStr: lunar.lunarMonthStr, lunarDayStr: lunar.lunarDayStr, day: d };
}

function formatNumber(num: number | undefined | null): string {
  const n = num ?? 0;
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export function AboutCard({ stats }: Props) {
  const [info, setInfo] = useState<ReturnType<typeof getTodayInfo> | null>(null);

  useEffect(() => { setInfo(getTodayInfo()); }, []);

  const statItems = stats ? [
    { icon: FileText, label: '文章', value: stats.totalPosts, color: 'text-blue-500' },
    { icon: Eye, label: '浏览', value: stats.totalViews, color: 'text-emerald-500' },
    { icon: MessageCircle, label: '评论', value: stats.totalComments, color: 'text-amber-500' },
    { icon: Heart, label: '点赞', value: stats.totalLikes, color: 'text-rose-400' },
  ] : [];

  return (
    <div className="rounded-xl bg-white dark:bg-[#2D2D3A]/40 border border-[var(--color-border)] overflow-hidden">
      {/* Profile header */}
      <div className="relative p-6 pb-5">
        {/* Online dot */}
        <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-green-500 rounded-full">
          <div className="w-full h-full rounded-full bg-green-500 animate-ping opacity-75" />
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-xl font-serif shadow-md flex-shrink-0">
            C
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="font-serif text-lg text-[var(--color-text)] leading-tight">Chris</h3>
            <p className="text-xs text-accent mt-0.5">前端开发工程师</p>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-1.5">
              热爱技术与设计，专注于构建优雅的用户界面。
            </p>
            <div className="flex gap-3 mt-2 text-xs text-[var(--color-text-secondary)]">
              <a href="https://github.com/chenjiuyue/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-1"><ExternalLink size={12} /> GitHub</a>
              <a href="mailto:contact@example.com" className="hover:text-accent transition-colors flex items-center gap-1"><Mail size={12} /> Email</a>
              <Link to="/about" className="hover:text-accent transition-colors">关于</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      {statItems.length > 0 && (
        <div className="grid grid-cols-4 border-t border-[var(--color-border)]">
          {statItems.map(item => (
            <div key={item.label} className="py-3 text-center border-r border-[var(--color-border)] last:border-r-0">
              <p className="text-base font-semibold text-primary dark:text-text-light leading-none">{formatNumber(item.value)}</p>
              <p className="text-[10px] text-text-muted mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Today info footer */}
      {info && (
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-[#2D2D3A]/30 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <CalendarDays size={13} className="text-accent" />
            <span>{info.dateStr} {info.weekDay}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-medium">
              {info.ganZhiYear}
            </span>
            <span className="text-accent/80">{info.zodiac}年</span>
            <span>农历{info.lunarMonthStr}{info.lunarDayStr}</span>
          </div>
        </div>
      )}
    </div>
  );
}
