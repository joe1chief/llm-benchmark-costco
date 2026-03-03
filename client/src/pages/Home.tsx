// LLM Benchmark Costco — Home
// 设计：OpenAI 极简风格，动态渐变背景，无限滚动，3 列卡片
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useBenchmarks, useFilteredBenchmarks } from '@/hooks/useBenchmarks';
import type { Benchmark } from '@/types/benchmark';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import HeroStats from '@/components/HeroStats';
import BenchmarkCard from '@/components/BenchmarkCard';
import BenchmarkDrawer from '@/components/BenchmarkDrawer';
import { Loader2, SearchX } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const PAGE_SIZE = 60;

type SortType = 'newest' | 'oldest' | 'name';
type FiltersType = {
  search: string;
  l1: string;
  year: string;
  difficulty: string;
  modality: string;
  openness: string;
  sort: SortType;
  widelyTested?: boolean;
};

export default function Home() {
  const { data, loading, error } = useBenchmarks();
  const [selected, setSelected] = useState<Benchmark | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FiltersType>({
    search: '', l1: '', year: '', difficulty: '',
    modality: '', openness: '', sort: 'newest',
  });
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useFilteredBenchmarks(data, filters);
  const widelyTestedCount = useMemo(() => data.filter(b => (b as any).widely_tested === true).length, [data]);

  const counts = useMemo(() => {
    const base = data.filter(b => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.intro.toLowerCase().includes(q) || b.org.toLowerCase().includes(q);
      }
      return true;
    });
    const c: Record<string, number> = {};
    base.forEach(b => { c[b.l1] = (c[b.l1] || 0) + 1; });
    return c;
  }, [data, filters.search]);

  const handleFilterChange = useCallback((partial: Partial<FiltersType>) => {
    setFilters(prev => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const handleSelectBenchmark = useCallback((b: Benchmark) => setSelected(b), []);

  const paged = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < filtered.length;

  // 无限滚动
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setPage(p => p + 1); },
      { rootMargin: '300px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, paged.length]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA' }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin" style={{ color: '#10A37F' }} />
          <span
            className="text-[13px]"
            style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#6B7280' : '#9CA3AF' }}
          >
            加载 Benchmark 数据...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA' }}
      >
        <div className="text-center">
          <p className="text-[15px] font-medium mb-1" style={{ color: isDark ? '#E5E7EB' : '#374151' }}>数据加载失败</p>
          <p className="text-[13px]" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA' }}
    >
      {/* ── 动态渐变背景（OpenAI 风格：极轻柔，不抢眼） ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* 绿色光球 */}
        <div
          className="absolute rounded-full animate-orb-1"
          style={{
            width: '55vw', height: '55vw',
            top: '-20vw', left: '-10vw',
            background: isDark
              ? 'radial-gradient(circle, rgba(16,163,127,0.14) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(16,163,127,0.07) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
        {/* 蓝色光球 */}
        <div
          className="absolute rounded-full animate-orb-2"
          style={{
            width: '45vw', height: '45vw',
            top: '15vh', right: '-8vw',
            background: isDark
              ? 'radial-gradient(circle, rgba(26,115,232,0.12) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(26,115,232,0.06) 0%, transparent 65%)',
            filter: 'blur(100px)',
          }}
        />
        {/* 紫色光球 */}
        <div
          className="absolute rounded-full animate-orb-3"
          style={{
            width: '50vw', height: '50vw',
            bottom: '-8vw', left: '15vw',
            background: isDark
              ? 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)',
            filter: 'blur(120px)',
          }}
        />
        {/* 琥珀色光球 */}
        <div
          className="absolute rounded-full animate-orb-4"
          style={{
            width: '30vw', height: '30vw',
            bottom: '5vh', right: '5vw',
            background: isDark
              ? 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ── 内容层 ── */}
      <div className="relative z-10">
        <Navbar
          search={filters.search}
          onSearchChange={v => handleFilterChange({ search: v })}
          total={data.length}
          filtered={filtered.length}
        />

        <HeroStats data={data} />

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          counts={counts}
          widelyTestedCount={widelyTestedCount}
        />

        <main className="container py-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <SearchX size={36} style={{ color: isDark ? '#374151' : '#D1D5DB' }} className="mb-3" />
              <p
                className="text-[15px] font-medium mb-1"
                style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#6B7280' : '#9CA3AF' }}
              >
                未找到匹配的 Benchmark
              </p>
              <p
                className="text-[13px]"
                style={{ color: isDark ? '#4B5563' : '#D1D5DB' }}
              >
                尝试修改搜索词或清除筛选条件
              </p>
            </div>
          ) : (
            <>
              {/* 结果计数 */}
              <div className="flex items-center mb-5">
                <p
                  className="text-[13px]"
                  style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#4B5563' : '#9CA3AF' }}
                >
                  共{' '}
                  <span style={{ fontWeight: 600, color: isDark ? '#D1D5DB' : '#374151' }}>
                    {filtered.length}
                  </span>{' '}
                  个结果
                  {filters.l1 && <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}> · {filters.l1}</span>}
                  {filters.year && <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}> · {filters.year}年</span>}
                  {filters.difficulty && <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}> · {filters.difficulty}</span>}
                  {filters.widelyTested && <span style={{ color: '#F59E0B' }}> · 🏅 广泛采用</span>}
                </p>
              </div>

              {/* 卡片网格：3 列 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paged.map((b, i) => (
                  <BenchmarkCard
                    key={b.id}
                    benchmark={b}
                    onClick={setSelected}
                    style={{
                      animationDelay: `${Math.min(i % PAGE_SIZE, 24) * 25}ms`,
                      animation: 'fadeInUp 0.28s ease both',
                    }}
                  />
                ))}
              </div>

              {/* 无限滚动哨兵 */}
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center items-center py-10 gap-2">
                  <Loader2 size={16} className="animate-spin" style={{ color: '#10A37F' }} />
                  <span
                    className="text-[12px]"
                    style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#4B5563' : '#D1D5DB' }}
                  >
                    加载更多...
                  </span>
                </div>
              )}

              {!hasMore && filtered.length > PAGE_SIZE && (
                <div className="flex justify-center py-8">
                  <span
                    className="text-[12px]"
                    style={{ color: isDark ? '#2D2D2D' : '#E5E7EB' }}
                  >
                    — 已显示全部 {filtered.length} 个结果 —
                  </span>
                </div>
              )}
            </>
          )}
        </main>

        {/* 底部装饰线 */}
        <div
          className="h-px w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #10A37F 25%, #1A73E8 50%, #7C3AED 75%, transparent 100%)',
            opacity: 0.3,
          }}
        />
        <div className="h-8" />
      </div>

      {/* 详情抽屉 */}
      {selected && (
        <BenchmarkDrawer
          benchmark={selected}
          allBenchmarks={data}
          onClose={() => setSelected(null)}
          onSelectBenchmark={handleSelectBenchmark}
        />
      )}
    </div>
  );
}
