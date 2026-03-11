// LLM Benchmark Costco — HeroStats (i18n + lazy-cow-47 title fx + young-walrus-64 flame)
import React from 'react';
import type { Benchmark } from '@/types/benchmark';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

interface Props {
  data: Benchmark[];
}

/** young-walrus-64 火焰球 SVG Loader（使用项目原配色 #10A37F） */
function FlameLoader() {
  return (
    <div className="flame-loader" aria-hidden="true">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <mask id="flame-clipping">
            <polygon points="0,0 100,0 100,100 0,100" fill="black" />
            <polygon points="25,25 75,25 50,75" fill="white" />
            <polygon points="50,25 75,75 25,75" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
          </mask>
        </defs>
      </svg>
      <div className="flame-box" />
    </div>
  );
}

export default function HeroStats({ data }: Props) {
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';

  const total        = data.length;
  const categories   = new Set(data.map(b => b.l1)).size;
  const families     = new Set(data.filter(b => b.family).map(b => b.family)).size;
  const widelyTested = data.filter(b => b.widely_tested).length;

  const stats = [
    { value: total,        label: t.statBenchmarks, color: '#10A37F' },
    { value: categories,   label: t.statDims,        color: '#1A73E8' },
    { value: families,     label: t.statFamilies,    color: '#7C3AED' },
    { value: widelyTested, label: t.statWidely,      color: '#F59E0B' },
  ];

  return (
    <div
      className="border-b transition-colors duration-200"
      style={{ borderColor: isDark ? '#1F1F1F' : '#F3F4F6' }}
    >
      <div className="container py-10">
        {/* Title row — lazy-cow-47 特效 + 火焰球装饰 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2.5">
            {/* young-walrus-64 火焰球 — 仅暗色模式显示，亮色模式透明度降低 */}
            <div
              style={{
                opacity: isDark ? 1 : 0.55,
                transition: 'opacity 0.3s ease',
                flexShrink: 0,
              }}
            >
              <FlameLoader />
            </div>

            {/* 标题 — lazy-cow-47 特效 */}
            <h1
              className={`hero-title-fx text-[30px] font-semibold tracking-tight`}
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                /* lazy-cow-47: 文字颜色通过 CSS 变量控制，适配亮/暗主题 */
                color: isDark ? '#34D399' : '#10A37F',
              }}
            >
              {t.heroTitle}
            </h1>
          </div>

          <p
            className="text-[14px] max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#6B7280' : '#9CA3AF' }}
          >
            {t.heroDesc(total, categories)}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span
                className="text-[32px] font-bold tabular-nums leading-none"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em', color: s.color }}
              >
                {s.value}
              </span>
              <span
                className="text-[12px]"
                style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#4B5563' : '#9CA3AF' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
