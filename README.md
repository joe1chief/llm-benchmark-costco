# Benchmark Hub

> 340 个大模型评测基准的完整数据库，OpenAI 风格展示界面，支持搜索、筛选和在线阅读完整论文。

## 功能特性

- **340 个 Benchmark** 完整收录，涵盖 12 个能力维度
- **实时搜索**：按名称、机构、分类即时过滤
- **多维筛选**：L1 分类、年份、难度级别
- **在线 PDF 阅读**：点击卡片直接阅读完整论文
- **OpenAI 风格**：极简白底设计，专业研究人员友好

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 构建（用于 Manus 平台）
pnpm build

# 构建 GitHub Pages 版本
pnpm build:ghpages
```

## 部署到 GitHub Pages

### 方法一：GitHub Actions 自动部署（推荐）

1. 将本项目推送到 GitHub 仓库（`main` 分支）
2. 进入仓库 **Settings → Pages**
3. Source 选择 **GitHub Actions**
4. 推送代码后，Actions 会自动构建并部署

访问地址：`https://<username>.github.io/<repo-name>/`

### 方法二：手动部署

```bash
# 构建静态文件
pnpm build:ghpages

# 将 dist-ghpages/ 目录的内容推送到 gh-pages 分支
# 方法：使用 gh-pages 工具
npx gh-pages -d dist-ghpages
```

### 配置子路径（重要）

如果部署在子路径（如 `https://username.github.io/benchmark-hub/`），需要修改 `vite.ghpages.config.ts`：

```ts
// 将 base 从 './' 改为你的仓库名
base: '/benchmark-hub/',
```

如果部署在根路径（如 `https://username.github.io/`），保持 `base: './'` 即可。

## 更新 PDF 数据

PDF 论文通过 CDN URL 访问。更新数据时，修改 `client/public/benchmarks.json` 中的 `pdf_cdn_url` 字段即可。

## 技术栈

- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Vite 7**
- **Wouter**（轻量路由）
- **Lucide React**（图标）

## 目录结构

```
benchmark-hub/
├── client/
│   ├── public/
│   │   └── benchmarks.json      # 340 个 Benchmark 数据
│   └── src/
│       ├── components/
│       │   ├── BenchmarkCard.tsx  # 胶囊卡片
│       │   ├── BenchmarkDrawer.tsx # 详情抽屉 + PDF 阅读器
│       │   ├── FilterBar.tsx      # 筛选栏
│       │   ├── HeroStats.tsx      # 统计区
│       │   └── Navbar.tsx         # 顶部导航
│       ├── hooks/
│       │   └── useBenchmarks.ts   # 数据加载和筛选逻辑
│       ├── pages/
│       │   └── Home.tsx           # 主页面
│       └── types/
│           └── benchmark.ts       # 类型定义
├── vite.ghpages.config.ts         # GitHub Pages 构建配置
├── .github/workflows/deploy.yml  # 自动部署工作流
└── README.md
```
