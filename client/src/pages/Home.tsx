// LLM Benchmark Costco — Home (i18n)
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
import { useLang } from '@/contexts/LangContext';

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
  const { t, lang } = useLang();
  const isDark = theme === 'dark';
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useFilteredBenchmarks(data, filters);
  const widelyTestedCount = useMemo(() => data.filter(b => b.widely_tested === true).length, [data]);

  const counts = useMemo(() => {
    const base = data.filter(b => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        return (b.name || '').toLowerCase().includes(q) || (b.intro || '').toLowerCase().includes(q) || (b.org || '').toLowerCase().includes(q);
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

  // Infinite scroll
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
          <span className="text-[13px]" style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#6B7280' : '#9CA3AF' }}>
            {t.loading}
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
          <p className="text-[15px] font-medium mb-1" style={{ color: isDark ? '#E5E7EB' : '#374151' }}>{t.loadError}</p>
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
      {/* Dynamic gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute rounded-full animate-orb-1" style={{
          width: '55vw', height: '55vw', top: '-20vw', left: '-10vw',
          background: isDark ? 'radial-gradient(circle, rgba(16,163,127,0.14) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(16,163,127,0.07) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }} />
        <div className="absolute rounded-full animate-orb-2" style={{
          width: '45vw', height: '45vw', top: '15vh', right: '-8vw',
          background: isDark ? 'radial-gradient(circle, rgba(26,115,232,0.12) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(26,115,232,0.06) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }} />
        <div className="absolute rounded-full animate-orb-3" style={{
          width: '50vw', height: '50vw', bottom: '-8vw', left: '15vw',
          background: isDark ? 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)',
          filter: 'blur(120px)',
        }} />
        <div className="absolute rounded-full animate-orb-4" style={{
          width: '30vw', height: '30vw', bottom: '5vh', right: '5vw',
          background: isDark ? 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }} />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        <Navbar
          search={filters.search}
          onSearchChange={v => handleFilterChange({ search: v })}
          total={data.length}
          filtered={filtered.length}
        />

        <HeroStats data={data} />

        {/* quiet-dog-6 Brutalist Banner — 筛选标签上方 */}
        <div
          className="border-b transition-colors duration-200"
          style={{
            borderColor: isDark ? '#1F1F1F' : '#F3F4F6',
            backgroundColor: isDark ? '#0F0F0F' : '#FAFAFA',
          }}
        >
          <div className="container py-3 flex items-center justify-end">
            <div className="brutalist-banner" title={lang === 'zh' ? '由 Ant AQ eval team 提供支持' : 'Powered by Ant AQ eval team'}>
              {/* OpenAI-style logo circle */}
              <div className="brutalist-logo">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F"/>
                </svg>
              </div>
              {/* Text */}
              <div className="brutalist-text">
                <span>{lang === 'zh' ? '由' : 'powered by'}</span>
                <span>Ant AQ eval team</span>
              </div>
            </div>
          </div>
        </div>

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
              <p className="text-[15px] font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#6B7280' : '#9CA3AF' }}>
                {t.noResults}
              </p>
              <p className="text-[13px]" style={{ color: isDark ? '#4B5563' : '#D1D5DB' }}>
                {t.noResultsHint}
              </p>
            </div>
          ) : (
            <>
              {/* Result count */}
              <div className="flex items-center mb-5">
                <p className="text-[13px]" style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#4B5563' : '#9CA3AF' }}>
                  {lang === 'zh' ? '共 ' : ''}
                  <span style={{ fontWeight: 600, color: isDark ? '#D1D5DB' : '#374151' }}>
                    {filtered.length}
                  </span>
                  {' '}{t.results}
                  {filters.l1 && <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}> · {t.l1[filters.l1] || filters.l1}</span>}
                  {filters.year && <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}> · {filters.year}{lang === 'zh' ? '年' : ''}</span>}
                  {filters.difficulty && <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}> · {t.difficulty[filters.difficulty] || filters.difficulty}</span>}
                  {filters.widelyTested && <span style={{ color: '#F59E0B' }}> · 🏅 {t.widelyAdopted}</span>}
                </p>
              </div>

              {/* Card grid: 3 columns */}
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

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center items-center py-10 gap-2">
                  <Loader2 size={16} className="animate-spin" style={{ color: '#10A37F' }} />
                  <span className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif", color: isDark ? '#4B5563' : '#D1D5DB' }}>
                    {t.loadingMore}
                  </span>
                </div>
              )}

              {!hasMore && filtered.length > PAGE_SIZE && (
                <div className="flex justify-center py-8">
                  <span className="text-[12px]" style={{ color: isDark ? '#2D2D2D' : '#E5E7EB' }}>
                    {t.allShown(filtered.length)}
                  </span>
                </div>
              )}
            </>
          )}
        </main>

        {/* Bottom decorative line */}
        <div className="h-px w-full" style={{
          background: 'linear-gradient(90deg, transparent 0%, #10A37F 25%, #1A73E8 50%, #7C3AED 75%, transparent 100%)',
          opacity: 0.3,
        }} />
        <div className="h-8" />
      </div>

      {/* Detail drawer */}
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
