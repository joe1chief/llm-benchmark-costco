# Skill: 更新 LLM Benchmark Costco 数据与前端兼容性

## 简介
本 Skill 旨在指导如何将最新的 `benchmarks.json` 数据更新到 `llm-benchmark-costco` 项目中，并处理可能出现的前端兼容性问题。由于数据结构的演进（如新增字段、可能为空的字段等），直接替换数据文件可能会导致前端渲染错误。本指南提供了一套标准的操作流程，确保数据更新后站点能够稳定运行。

## 适用场景
- 获取了最新的 `benchmarks.json` 数据需要更新到网站。
- 数据中新增了字段（如 `default_l1`, `default_l2`）。
- 数据中某些字段可能存在空值（如 `mermaid_flowchart` 为 `null`）。
- 需要重新构建并部署到 GitHub Pages。

## 操作流程

### 1. 数据同步与类型更新
首先，将最新的 `benchmarks.json` 文件放置到 `client/public/` 目录下，并同步到项目根目录（如果需要）。
接着，更新前端的类型定义文件 `client/src/types/benchmark.ts`，确保所有新字段都被正确声明。

```typescript
// client/src/types/benchmark.ts 示例更新
export interface Benchmark {
  // ... 现有字段
  default_l1?: string;
  default_l2?: string;
  mermaid_flowchart?: string | null;
  // 确保所有可能为空的字段都标记为可选或允许 null
}
```

### 2. 移除 `as any` 强制类型转换
在前端代码中，应避免使用 `as any` 来访问未在类型中声明的字段。这会掩盖潜在的类型错误。
全局搜索 `as any`，并将其替换为安全的类型访问。

```bash
# 查找可能存在 as any 的文件
grep -rn "as any" client/src/
```

### 3. 加强空值防护
对于可能为空的字段（特别是 `mermaid_flowchart` 和 `related_benchmarks`），在渲染前必须进行空值检查。

**BenchmarkDrawer.tsx 中的处理示例：**
```tsx
// 检查是否有流程图
const hasFlowchart = Boolean(benchmark.mermaid_flowchart && benchmark.mermaid_flowchart.trim() !== '');

// 检查是否有相关基准
const hasRelated = Boolean(benchmark.related_benchmarks && Array.isArray(benchmark.related_benchmarks) && benchmark.related_benchmarks.length > 0);

// 渲染相关基准时，确保引用的基准确实存在于数据中
{hasRelated && (
  <div className="space-y-2">
    {benchmark.related_benchmarks.map((relatedName) => {
      const relatedBench = benchmarks.find(b => b.name === relatedName);
      if (!relatedBench) return null; // 如果找不到对应的基准，则不渲染
      return <BenchmarkCard key={relatedName} benchmark={relatedBench} />;
    })}
  </div>
)}
```

### 4. 搜索与筛选逻辑的健壮性
在 `useBenchmarks.ts` 和 `Home.tsx` 中，确保搜索和筛选逻辑能够处理字段缺失的情况。

```typescript
// useBenchmarks.ts 示例
const matchesSearch = !searchQuery || 
  b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (b.institution && b.institution.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (b.l1 && b.l1.toLowerCase().includes(searchQuery.toLowerCase()));
```

### 5. 排版与视觉优化
在更新数据后，检查标签和卡片的排版是否整齐。建议使用 `flex-wrap` 和适当的 `gap` 来处理可能变长的标签列表。
可以使用分隔符（如 `|`）对不同类型的标签进行视觉分组。

### 6. 本地测试与验证
在提交代码前，必须在本地启动预览服务器进行全面测试。

```bash
# 构建项目
pnpm build

# 启动预览服务器
npx serve dist-ghpages -p 3457
```

**测试清单：**
- [ ] 首页列表是否正常渲染，无重复、无空白卡片。
- [ ] 搜索功能是否正常工作。
- [ ] 各项筛选（年份、分类、难度等）是否生效。
- [ ] 点击卡片打开详情抽屉是否正常。
- [ ] 详情抽屉中的 Basic Info, Evaluation, Related Benchmarks 是否正确显示。
- [ ] Homepage, Paper Page, PDF, Build Process 入口是否可用。
- [ ] 中英文切换是否正常。
- [ ] 深色/浅色模式切换是否正常。
- [ ] 浏览器控制台是否有报错。

### 7. 部署到 GitHub Pages
本项目使用 `gh-pages` 分支进行部署。构建完成后，需要将 `dist-ghpages` 目录的内容推送到 `gh-pages` 分支。

```bash
# 提交 main 分支的更改
git add .
git commit -m "Update benchmarks data and fix compatibility"
git push origin main

# 部署到 gh-pages
pnpm build
npx gh-pages -d dist-ghpages
```

## 常见问题排查
- **页面白屏**：通常是因为渲染时访问了 `null` 或 `undefined` 的属性。检查控制台报错，定位到具体的组件并添加空值防护。
- **Related Benchmarks 渲染异常**：检查 `related_benchmarks` 数组中的名称是否在总数据集中存在。如果不存在，应在渲染时过滤掉。
- **Mermaid 流程图报错**：确保传递给 Mermaid 组件的代码字符串是有效的。如果 `mermaid_flowchart` 为空，不应渲染该组件。
- **部署后未更新**：GitHub Pages 的 CDN 缓存可能需要几分钟才能刷新。可以尝试强制刷新浏览器或等待一段时间。如果长时间未更新，检查 GitHub Actions 的 Pages build and deployment 工作流是否成功执行。
