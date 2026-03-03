// LLM Benchmark Costco — BenchmarkCard
// 设计语言：OpenAI 极简风格
//   - 无彩色边框装饰，卡片用极细灰色边框
//   - 名称前置勋章（广泛采用），名称本身用分类色
//   - 字体层级清晰：名称 semibold → 简介 regular → 元信息 small
//   - hover 仅用轻微阴影提升，不做大幅位移
import React from 'react';
import type { Benchmark } from '@/types/benchmark';
import { Calendar, Building2, BarChart3, Layers, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  benchmark: Benchmark;
  onClick: (b: Benchmark) => void;
  style?: React.CSSProperties;
}

const DIFFICULTY_COLORS: Record<string, { text: string; bg: string; bgDark: string }> = {
  '前沿': { text: '#DC2626', bg: 'rgba(220,38,38,0.08)', bgDark: 'rgba(220,38,38,0.12)' },
  '专家': { text: '#D97706', bg: 'rgba(217,119,6,0.08)', bgDark: 'rgba(217,119,6,0.12)' },
  '进阶': { text: '#2563EB', bg: 'rgba(37,99,235,0.08)', bgDark: 'rgba(37,99,235,0.12)' },
  '基础': { text: '#6B7280', bg: 'rgba(107,114,128,0.08)', bgDark: 'rgba(107,114,128,0.10)' },
};

const OPENNESS_CONFIG: Record<string, { icon: typeof Unlock; color: string; label: string }> = {
  'public':        { icon: Unlock,      color: '#10A37F', label: 'Public'  },
  'partly public': { icon: ShieldAlert, color: '#F59E0B', label: 'Partly'  },
  'in-house':      { icon: Lock,        color: '#EF4444', label: 'Private' },
};

function truncateOrg(org: string, maxLen = 20): string {
  if (!org) return '';
  const first = org.split(/[、,，]/)[0].trim();
  return first.length <= maxLen ? first : first.slice(0, maxLen - 1) + '…';
}

export default function BenchmarkCard({ benchmark: b, onClick, style }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const widelyTested = (b as any).widely_tested === true;
  const diffColor = DIFFICULTY_COLORS[b.difficulty];
  const opennessInfo = OPENNESS_CONFIG[b.openness];

  return (
    <article
      className="group relative cursor-pointer"
      style={style}
      onClick={() => onClick(b)}
    >
      <div
        className={`
          h-full flex flex-col rounded-2xl border transition-all duration-200
          ${isDark
            ? 'bg-[#161616] border-[#242424] hover:border-[#333] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]'
          }
        `}
      >
        {/* ── 顶部色条（分类色，仅 3px 高，圆角顶部） ── */}
        <div
          className="h-[3px] w-full rounded-t-2xl shrink-0"
          style={{ backgroundColor: b.l1_color }}
        />

        {/* ── 卡片内容 ── */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-4 gap-3">

          {/* 第一行：勋章 + 名称 + 难度 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {/* 广泛采用勋章：名称前，与文字基线对齐 */}
              {widelyTested && (
                <span
                  className="shrink-0 text-[16px] leading-none select-none"
                  title="被主要大模型厂商技术报告广泛采用"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(245,158,11,0.5))' }}
                >
                  🏅
                </span>
              )}
              {/* 名称 */}
              <span
                className="font-semibold text-[14px] leading-snug truncate"
                style={{
                  color: b.l1_color,
                  fontFamily: "'Inter', -apple-system, sans-serif",
                  letterSpacing: '-0.01em',
                }}
              >
                {b.name}
              </span>
            </div>

            {/* 难度标签 */}
            {b.difficulty && diffColor && (
              <span
                className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  color: diffColor.text,
                  backgroundColor: isDark ? diffColor.bgDark : diffColor.bg,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {b.difficulty}
              </span>
            )}
          </div>

          {/* 简介 */}
          <p
            className="text-[13px] leading-relaxed line-clamp-2 flex-1"
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
          >
            {b.intro || '暂无简介'}
          </p>

          {/* 元信息行 */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {b.published && (
              <span className="flex items-center gap-1 text-[11.5px]" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>
                <Calendar size={11} />
                {b.published}
              </span>
            )}
            {b.org && (
              <span
                className="flex items-center gap-1 text-[11.5px]"
                style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
                title={b.org}
              >
                <Building2 size={11} className="shrink-0" />
                <span className="truncate" style={{ maxWidth: '130px' }}>
                  {truncateOrg(b.org)}
                </span>
              </span>
            )}
            {b.has_leaderboard && (
              <span className="flex items-center gap-1 text-[11.5px]" style={{ color: '#10A37F' }}>
                <BarChart3 size={11} />
                排行榜
              </span>
            )}
            {opennessInfo && (
              <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: opennessInfo.color }}>
                <opennessInfo.icon size={10} />
                {opennessInfo.label}
              </span>
            )}
          </div>

          {/* 底部标签行 */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t" style={{ borderColor: isDark ? '#242424' : '#F3F4F6' }}>
            {/* L1 分类标签 */}
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: b.l1_color + (isDark ? '1A' : '12'),
                color: b.l1_color,
              }}
            >
              <Layers size={9} />
              {b.l1}
            </span>
            {/* Family 标签 */}
            {b.family && (
              <span
                className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: isDark ? 'rgba(16,163,127,0.10)' : 'rgba(16,163,127,0.08)',
                  color: '#10A37F',
                }}
              >
                {b.family}
              </span>
            )}
            {/* 模态标签 */}
            {b.modality && (
              <span
                className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: isDark ? '#9CA3AF' : '#9CA3AF',
                }}
              >
                {b.modality.split('+')[0].trim()}
              </span>
            )}
          </div>

        </div>
      </div>
    </article>
  );
}
