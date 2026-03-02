// OpenAI 风格 Hero 统计区
import React from 'react';
import type { Benchmark } from '@/types/benchmark';

interface Props {
  data: Benchmark[];
}

export default function HeroStats({ data }: Props) {
  const total = data.length;
  const categories = new Set(data.map(b => b.l1)).size;
  const orgs = new Set(data.flatMap(b => b.org.split('、').map(o => o.trim()))).size;
  const years = new Set(data.map(b => b.year)).size;

  const stats = [
    { value: total, label: '评测基准', suffix: '个' },
    { value: categories, label: '能力维度', suffix: '个' },
    { value: orgs, label: '发布机构', suffix: '+' },
    { value: years, label: '年份跨度', suffix: '年' },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container py-10">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight mb-2">
            AI Benchmark Hub
          </h1>
          <p className="text-[15px] text-gray-500 max-w-2xl leading-relaxed">
            覆盖大型语言模型评测领域的 {total} 个主流基准，涵盖 Agent 能力、多模态理解、代码能力等 12 个核心维度。
            每个基准均附有完整论文文档，支持在线阅读。
          </p>
        </div>

        {/* 统计数字 */}
        <div className="flex flex-wrap gap-8">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="text-[28px] font-bold text-gray-900 tabular-nums">{s.value}</span>
                <span className="text-[16px] font-medium text-gray-400 ml-0.5">{s.suffix}</span>
              </div>
              <span className="text-[13px] text-gray-400 mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
