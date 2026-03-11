// LLM Benchmark Costco — HeroStats (English + lazy-cow-47 title fx + young-walrus-64 flame)
import React from 'react';
import type { Benchmark } from '@/types/benchmark';
import { useTheme } from '@/contexts/ThemeContext';

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
  const isDark = theme === 'dark';

  const total        = data.length;
  const categories   = new Set(data.map(b => b.l1)).size;
  const families     = new Set(data.filter(b => b.family).map(b => b.family)).size;
  const widelyTested = data.filter(b => (b as any).widely_tested).length;

  const stats = [
    { value: total,        label: 'Benchmarks',       color: '#10A37F' },
    { value: categories,   label: 'Capability Dims',  color: '#1A73E8' },
    { value: families,     label: 'Families',         color: '#7C3AED' },
    { value: widelyTested, label: 'Widely Adopted',   color: '#F59E0B' },
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
            {/* young-walrus-64 火焰球 */}
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
              className="hero-title-fx text-[30px] font-semibold tracking-tight"
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                color: isDark ? '#34D399' : '#10A37F',
              }}
            >
              LLM Benchmark Costco
            </h1>
          </div>

          <p
            className="text-[14px] max-w-xl leading-relaxed"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: isDark ? '#6B7280' : '#9CA3AF',
            }}
          >
            A curated database of{' '}
            <strong style={{ color: isDark ? '#D1D5DB' : '#374151', fontWeight: 600 }}>{total}</strong>{' '}
            LLM evaluation benchmarks across{' '}
            <strong style={{ color: isDark ? '#D1D5DB' : '#374151', fontWeight: 600 }}>{categories}</strong>{' '}
            capability dimensions. Each entry includes the full paper for inline reading.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[32px] font-bold tabular-nums leading-none"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.03em',
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
              </div>
              <span
                className="text-[12px]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: isDark ? '#4B5563' : '#9CA3AF',
                }}
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
