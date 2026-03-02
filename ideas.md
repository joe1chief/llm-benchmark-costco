# Benchmark Hub 设计方案

## 方案一：OpenAI Research Portal 风格
<response>
<text>
**Design Movement**: 极简主义 + 科技感 (Minimalist Tech)
**Core Principles**:
- 大量留白，内容为王，克制的视觉装饰
- 黑白灰为主色调，以单一强调色（深绿/蓝绿）点缀
- 清晰的信息层级，数据优先展示

**Color Philosophy**: 
- 背景：纯白 (#FFFFFF) / 浅灰 (#F7F7F7)
- 文字：近黑 (#0D0D0D) / 深灰 (#6B6B6B)
- 强调色：#10A37F (OpenAI 绿)
- 边框：#E5E5E5

**Layout Paradigm**: 
- 顶部固定导航栏（Logo + 搜索 + 筛选）
- 主体区域：瀑布流/网格胶囊卡片
- 右侧滑出面板展示详情 + PDF 阅读器

**Signature Elements**:
- 胶囊形标签（L1/L2 分类、年份、难度）
- 细线分隔符，无阴影的极简卡片
- 单色图标系统

**Interaction Philosophy**: 
- 卡片 hover 时轻微上移 + 边框变色
- 筛选器即时响应，无需提交
- 详情面板从右侧滑入

**Animation**: 
- 页面加载：卡片依次淡入（stagger 20ms）
- 面板滑入：ease-out 300ms
- 搜索结果：crossfade 150ms

**Typography System**:
- 标题：Söhne / SF Pro Display（无衬线，几何感）
- 正文：Inter 400/500
- 代码：JetBrains Mono
</text>
<probability>0.07</probability>
</response>

## 方案二：学术数据库 + 暗色科技风
<response>
<text>
**Design Movement**: Dark Academic Tech
**Core Principles**:
- 深色背景，荧光强调色，高对比度
- 数据密集但有序，表格+卡片混合布局
- 科技感强，适合研究人员使用

**Color Philosophy**:
- 背景：#0A0A0B (近黑)
- 卡片：#141414
- 强调色：#7C3AED (紫色) + #06B6D4 (青色)
- 文字：#E5E7EB

**Layout Paradigm**:
- 左侧固定筛选面板
- 右侧主内容区网格展示
- 全屏 Modal 展示 PDF

**Signature Elements**:
- 发光边框效果（glow border）
- 渐变标签徽章
- 数据可视化迷你图表

**Interaction Philosophy**:
- 卡片 hover 时发光效果
- 筛选动画流畅
- PDF 全屏沉浸式阅读

**Animation**:
- 卡片进入：从下方淡入
- 筛选切换：流体过渡
- Modal：缩放进入

**Typography System**:
- 标题：Space Grotesk Bold
- 正文：Inter
- 标签：Mono 字体
</text>
<probability>0.06</probability>
</response>

## 方案三：OpenAI 官网风格（选定方案）
<response>
<text>
**Design Movement**: OpenAI Official Style - Clean Research Portal
**Core Principles**:
- 极致克制：白底、黑字、单一强调色（#10A37F）
- 信息密度适中：胶囊卡片展示核心信息，不过度堆砌
- 专业感：字体、间距、对齐都精确到位
- 功能优先：搜索、筛选、分类浏览是核心交互

**Color Philosophy**:
- 主背景：#FFFFFF
- 次背景：#F9F9F9（卡片、侧边栏）
- 主文字：#0D0D0D
- 次文字：#6B6B6B
- 强调色：#10A37F（OpenAI 绿，用于 hover、标签、链接）
- 边框：#E5E5E5
- 危险/警告：#EF4444

**Layout Paradigm**:
- 顶部 Sticky 导航：Logo（左）+ 搜索框（中）+ 统计数字（右）
- Hero 区域：简洁标题 + 副标题 + 快速统计
- 筛选栏：水平滚动的分类标签 + 下拉筛选器
- 主体：响应式网格（3列 desktop / 2列 tablet / 1列 mobile）
- 胶囊卡片：Benchmark 名称 + 机构 + 年份 + L1/L2 标签 + 难度 + 简介
- 右侧抽屉：点击卡片后滑出，展示完整信息 + 内嵌 PDF 阅读器

**Signature Elements**:
- 圆角胶囊标签（L1分类用不同颜色区分）
- 卡片左侧细色条（按 L1 分类着色）
- 搜索框带实时高亮匹配

**Interaction Philosophy**:
- 卡片 hover：轻微阴影 + 左侧色条加深
- 标签点击：即时筛选
- 抽屉滑入：smooth 300ms
- PDF 阅读器：内嵌 iframe，支持全屏

**Animation**:
- 初始加载：卡片 stagger 淡入（每张延迟 30ms）
- 筛选切换：AnimatePresence fade
- 抽屉：translateX 300ms ease-out

**Typography System**:
- 标题：'Söhne', system-ui, sans-serif（模拟 OpenAI 字体）
- 正文：-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- 代码/标签：'JetBrains Mono', monospace
- 字号层级：48px 大标题 / 24px 节标题 / 16px 正文 / 13px 标签
</text>
<probability>0.09</probability>
</response>

## 选定方案：方案三（OpenAI 官网风格）

选择理由：最符合用户"OpenAI 风格"的需求，极简白底、绿色强调色、精确的信息层级，专业研究人员友好。
