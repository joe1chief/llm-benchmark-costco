// OpenAI 风格顶部导航栏
import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  total: number;
  filtered: number;
}

export default function Navbar({ search, onSearchChange, total, filtered }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container">
        <div className="flex items-center gap-4 h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10A37F' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.7" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.7" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.4" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] text-gray-900 tracking-tight">Benchmark Hub</span>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 max-w-xl relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="搜索 Benchmark 名称、机构、分类..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#10A37F] focus:ring-2 focus:ring-[#10A37F]/10 transition-all placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* 统计 */}
          <div className="hidden sm:flex items-center gap-1 text-[13px] text-gray-400 shrink-0">
            <span className="font-semibold text-gray-700">{filtered}</span>
            {filtered !== total && <span>/ {total}</span>}
            <span>个 Benchmark</span>
          </div>
        </div>
      </div>
    </header>
  );
}
