// OpenAI 风格右侧抽屉 - 展示 Benchmark 详情 + PDF 阅读器
// 设计：白底，#10A37F 强调色，Inter 字体，精确信息层级
import React, { useState, useEffect } from 'react';
import type { Benchmark } from '@/types/benchmark';
import {
  X, ExternalLink, FileText, Calendar, Building2,
  BarChart3, Globe, Layers, ChevronRight, BookOpen,
  AlertCircle, Maximize2, Download
} from 'lucide-react';

interface Props {
  benchmark: Benchmark | null;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value || value === 'nan' || value === 'None' || value === 'NaN') return null;
  return (
    <div className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-[12px] text-gray-400 w-20 shrink-0 pt-0.5">{label}</span>
      <span className="text-[13px] text-gray-700 leading-relaxed">{value}</span>
    </div>
  );
}

// 构建可嵌入的 PDF URL
function buildEmbedUrl(pdfUrl: string): string {
  if (!pdfUrl) return '';
  // CDN URL 直接嵌入
  if (!pdfUrl.includes('arxiv.org')) {
    return pdfUrl;
  }
  // arXiv PDF 使用 Google Docs Viewer 绕过跨域限制
  return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
}

export default function BenchmarkDrawer({ benchmark: b, onClose }: Props) {
  const [tab, setTab] = useState<'info' | 'pdf'>('info');
  const [pdfLoaded, setPdfLoaded] = useState(false);

  useEffect(() => {
    if (b) {
      setTab('info');
      setPdfLoaded(false);
    }
  }, [b?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!b) return null;

  const rawPdfUrl = b.pdf_cdn_url || b.arxiv_pdf_url || '';
  const embedUrl = buildEmbedUrl(rawPdfUrl);
  const hasPdf = !!rawPdfUrl;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* 抽屉主体 */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[680px] bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.25s ease-out' }}>

        {/* 头部 */}
        <div className="flex items-start gap-3 px-6 py-5 border-b border-gray-100 shrink-0">
          <div
            className="w-1 h-12 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: b.l1_color }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-semibold text-gray-900 leading-snug mb-1.5">
              {b.name}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: b.l1_color + '18', color: b.l1_color, fontFamily: 'var(--font-mono)' }}
              >
                <Layers size={9} />
                {b.l1}
              </span>
              {b.l2 && b.l2 !== b.l1 && b.l2 !== 'nan' && (
                <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500"
                  style={{ fontFamily: 'var(--font-mono)' }}>
                  {b.l2}
                </span>
              )}
              {b.difficulty && b.difficulty !== 'nan' && (
                <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100"
                  style={{ fontFamily: 'var(--font-mono)' }}>
                  {b.difficulty}
                </span>
              )}
              {b.year && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 px-2 py-0.5">
                  <Calendar size={10} />
                  {b.published || b.year}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="flex border-b border-gray-100 px-6 shrink-0">
          {[
            { key: 'info', icon: BookOpen, label: '详细信息' },
            { key: 'pdf', icon: FileText, label: '完整论文', disabled: !hasPdf },
          ].map(({ key, icon: Icon, label, disabled }) => (
            <button
              key={key}
              className={`flex items-center gap-1.5 px-1 py-3 text-[13px] font-medium border-b-2 mr-6 transition-colors ${
                tab === key
                  ? 'border-[#10A37F] text-[#10A37F]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && setTab(key as 'info' | 'pdf')}
              disabled={disabled}
            >
              <Icon size={13} />
              {label}
              {key === 'pdf' && !hasPdf && <span className="text-[10px] ml-1">(暂无)</span>}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-hidden">
          {tab === 'info' ? (
            <div className="h-full overflow-y-auto px-6 py-5 space-y-5">
              {/* 简介 */}
              <p className="text-[14px] text-gray-600 leading-relaxed">{b.intro}</p>

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-2">
                {hasPdf && (
                  <button
                    onClick={() => setTab('pdf')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg text-white transition-colors"
                    style={{ backgroundColor: '#10A37F' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0D8F6F')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#10A37F')}
                  >
                    <FileText size={13} />
                    阅读完整论文
                    <ChevronRight size={13} />
                  </button>
                )}
                {rawPdfUrl && (
                  <a
                    href={rawPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Download size={13} />
                    下载 PDF
                  </a>
                )}
                {b.paper_url && b.paper_url !== 'nan' && b.paper_url !== 'None' && (
                  <a
                    href={b.paper_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Globe size={13} />
                    项目主页
                  </a>
                )}
              </div>

              {/* 基本信息 */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">基本信息</span>
                </div>
                <div className="px-4">
                  <InfoRow label="发布时间" value={b.published} />
                  <InfoRow label="发布机构" value={b.org} />
                  <InfoRow label="模态" value={b.modality} />
                  <InfoRow label="语言" value={b.language} />
                  <InfoRow label="任务类型" value={b.task_type} />
                  <InfoRow label="数据规模" value={b.scale} />
                </div>
              </div>

              {/* 评测信息 */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">评测信息</span>
                </div>
                <div className="px-4">
                  <InfoRow label="构建方法" value={b.build_method} />
                  <InfoRow label="评估指标" value={b.metric} />
                  <InfoRow label="评测特性" value={b.eval_feature} />
                  <InfoRow label="数据公开" value={b.openness} />
                  <div className="flex gap-3 py-2.5">
                    <span className="text-[12px] text-gray-400 w-20 shrink-0 pt-0.5">排行榜</span>
                    <span className={`text-[13px] font-medium flex items-center gap-1 ${b.has_leaderboard ? 'text-[#10A37F]' : 'text-gray-400'}`}>
                      {b.has_leaderboard ? (
                        <><BarChart3 size={13} /> 有公开排行榜</>
                      ) : '暂无'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PDF 阅读器 */
            <div className="h-full flex flex-col bg-gray-50">
              <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 shrink-0">
                <span className="text-[12px] text-gray-500 truncate max-w-[400px] font-medium">{b.name}</span>
                <div className="flex items-center gap-3">
                  <a
                    href={rawPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-[#10A37F] transition-colors"
                  >
                    <Maximize2 size={12} />
                    新标签页
                  </a>
                </div>
              </div>
              <div className="flex-1 relative">
                {!pdfLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50 z-10">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-[#10A37F] rounded-full animate-spin" />
                    <span className="text-[13px]">加载论文中...</span>
                  </div>
                )}
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0"
                  title={`${b.name} PDF`}
                  onLoad={() => setPdfLoaded(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
