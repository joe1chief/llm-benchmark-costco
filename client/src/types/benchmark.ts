export interface Benchmark {
  id: string;
  name: string;
  l1: string;
  l1_color: string;
  l2: string;
  intro: string;
  paper_url: string;
  arxiv_pdf_url: string;
  pdf_cdn_url: string;
  published: string;
  year: string;
  org: string;
  build_method: string;
  metric: string;
  openness: string;
  modality: string;
  language: string;
  task_type: string;
  difficulty: string;
  eval_feature: string;
  scale: string;
  has_leaderboard: boolean;
  pdf_filename: string;
}

export const L1_CATEGORIES = [
  '通用语言能力',
  'Agent能力',
  '多模态理解',
  '代码能力',
  '科学推理',
  '安全对齐',
  '数学推理',
  '长文本理解',
  '医疗健康',
  '视频理解',
  '图表与文档理解',
  '空间与3D理解',
] as const;

export const DIFFICULTY_LEVELS = ['前沿', '专家', '进阶', '基础'] as const;

export const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012'] as const;
