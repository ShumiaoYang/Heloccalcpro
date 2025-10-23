PRD：AI工具站（MVP）v1.6
版本：1.6
状态：已定稿（US-01～US-04；新增技术、交付与质量规范）

一、背景与目标
- 目标：以最短时间交付可运行的 AI 工具网站，验证核心交互、SEO 与多语言框架，支持后续扩展。
- 参考：pollo.ai/ai-image-generator（交互布局）；《AI工具站快速启动-想法.md》《AI工具站快速启动-规划纪要.md》；仓库 `docs/samples/frontend-skeleton`。
- 技术基线：Next.js 14（App Router）+ TypeScript + Tailwind CSS；国际化采用 `next-intl`；Mock 数据与 SEO 注入依托 Next.js Server Components。
- 迭代路径：Phase 1（MVP：US-01～US-04）→ Phase 2（用户体系与商业化）→ Phase 3（内容与国际化扩展）→ Phase 4（高级能力）。

二、MVP范围（本次交付）
- US-01：构建核心页面框架（左侧功能导航 + 主内容纵向滚动）。
- US-02：实现核心 AI 工具卡交互（1/4 输入配置 + 3/4 输出展示，移动端堆叠）。
- US-03：多语言支持（EN `/` 默认、ZH `/zh`；浏览器检测 + 切换器）。
- US-04：SEO 配置（站点级与页面级；Title/Description/Keywords/H1-H3 多语言；canonical/hreflang）。
- 明确不在范围：真实 EXAMPLE/Features/BLOG 内容、后台管理、真实模型调用与账号体系，仅保留导航锚点；登录入口仅为占位体验。

三、用户故事与需求详情
US-01 核心页面框架
1) 价值与目标
- 提供稳定、可扩展的页面骨架，桌面端固定左侧导航与顶栏，移动端折叠为汉堡菜单。
- 支撑 HERO→TOOL→EXAMPLE→Features→BLOG→Friendly Links→FOOTER 顺序的锚点跳转与平滑滚动。
2) 页面结构
- 顶部导航：站点名、语言切换器、登录按钮（跳转 `/auth/login` 占位页）。
- 左侧功能导航：配置驱动（`content/navigation.{locale}.json`），桌面固定、移动端折叠；支持高亮当前锚点。
- 主内容区：在 `app/(locale)/layout.tsx` 中定义模块顺序与段落 ID（如 `hero`、`tool`）。
3) 验收标准
- 桌面端布局：large breakpoint（≥1200px）左侧导航固定，主区纵向滚动。
- 导航高亮：滚动进入各模块视窗 40% 时，对应导航项高亮。
- 移动端折叠：≤768px 时左侧导航折叠为抽屉；选择条目后页面平滑滚动并自动关闭抽屉。
- 锚点跳转：导航使用 `next/link` + `scroll={false}`；点击后更新 hash（如 `/#tool`、`/zh#tool`）并触发 `scrollIntoView`。

US-02 核心 AI 工具卡
1) 价值与目标
- 用通用“工具卡”展示文本摘要 Demo，后续可替换为任意模型任务。
2) 布局与交互
- 桌面端：左侧（25%）为输入配置区，右侧（75%）为输出展示区；移动端上下堆叠。
- 输入区：多行文本框“输入文本”、下拉占位“模型：gpt-4-turbo（Mock）”、滑块占位“摘要长度”、主按钮“生成”。
- 输出区：包含加载态（Skeleton + Spinner）、成功卡片、错误提示三种状态。
3) 行为规则
- 成功流程：点击生成→至少 600ms Loading→展示示例响应“成功：这是一个模拟的 AI 摘要结果。”
- 错误流程：当输入框值为 `trigger-error` 时→至少 600ms Loading→展示错误提示“生成失败，请稍后再试。”
- 清空行为：提交后保留输入内容；提供“清空”二级按钮重置。
- 触屏适配：按钮区域保持 ≥48px 高度，交互区域支持键盘无障碍焦点。

US-03 多语言支持（i18n）
1) 价值与目标
- EN `/` 为默认站点，ZH `/zh` 对应中文；支持浏览器语言检测与手动切换，确保双语体验一致。
2) 实现要点
- 使用 `next-intl` 提供服务器端 `createTranslator` 与客户端 `useTranslations`，文案存放于 `content/en.json`、`content/zh.json`。
- `middleware.ts` 读取 `accept-language` 并在首访设置默认语言；用户手动切换后写入 `NEXT_LOCALE` cookie（365 天），后续访问优先使用该语言。
- 当某字段在当前语言缺失时回退到英文文案，并在 PR 中标注 TODO。
3) 验收标准
- 首次访问：浏览器语言为中文时自动跳转 `/zh`，否则停留 `/`。
- 语言切换：点击切换器刷新 UI 文案并更新 URL，不刷新页面；切换后刷新仍保持所选语言。
- 404 / 其他页面：各语言均提供对应副本；缺失页面返回回退语言。

US-04 SEO 配置
1) 价值与目标
- 页面级 SEO 配置集中管理，保证多语言一致性，满足 canonical/hreflang 要求。
2) 实现要点
- SEO 配置文件：`config/seo.config.json`，结构含 `global.{en,zh}` 与 `pages['/path'].{en,zh}`；新增页面须在两种语言中登记。
- 在页面 `generateMetadata` 中读取配置：默认先合并 `global`，再覆盖 `pages` 条目；缺失字段回退至全球配置。
- 站点地图与爬虫配置：`scripts/generate-sitemap.ts`、`scripts/generate-robots.ts` 从配置与已注册路由生成 `public/sitemap.xml`、`public/robots.txt`；根据 `APP_DOMAIN` 环境变量写入 canonical 域名。
- 元数据输出：每页输出 `<title>`、`description`、`keywords`、唯一 `<h1>`，并生成成对 `<link rel="alternate" hreflang>` 及 `<link rel="canonical">`。
3) 验收标准
- `npm run build` 后产物包含 sitemap/robots；预览地址下 canonical 指向对应域名。
- 每个页面使用浏览器 DevTools 能查看到正确语言的 `<head>` 元信息。
- 缺失字段自动继承，无冗余重复。

四、技术架构与项目结构
- 项目基线：Node.js 18+；依赖 Next.js 14、TypeScript、Tailwind CSS、`next-intl`、React Testing Library、Vitest、Playwright。
- 目录结构：
  - `app/(locale)/en|zh/...`：页面、布局、路由与 Server/Client 组件。
  - `components/`：可复用 UI 组件（导航、工具卡等）。
  - `content/`：`en.json`、`zh.json`、`navigation.{locale}.json` 等文案与导航数据。
  - `config/`：`seo.config.json` 及后续配置。
  - `lib/`：工具函数（如 SEO loader、平滑滚动、i18n helper）。
  - `public/`：静态资源、字体、生成的 `sitemap.xml`、`robots.txt`。
  - `scripts/`：构建期辅助脚本。
  - `docs/`：需求与设计文档。
- UI 规范：Tailwind 结合自定义主题（主色、品牌色、灰阶），字体使用 Inter + Noto Sans SC（通过 Google Fonts 或 `@fontsource` 引入）。

五、内容与文案管理
- HERO、工具介绍、EXAMPLE/Features/BLOG/Links、Footer 文案统一放在 `content/{locale}.json`；提交 PR 时需同步两种语言。
- JSON key 采用命名空间（如 `hero.title`、`tool.summary.demoDescription`），确保 fallback 可预测。
- 若内容由产品/市场更新，先在共享文档（Notion/Sheets）确认，再同步至仓库；缺失翻译暂复制英文并在 TODO 栏提示。

六、测试与质量保障
- 单元/组件测试：使用 Vitest + Testing Library；重点覆盖 ToolCard 成功/失败流程、600ms Loading、锚点高亮逻辑、语言切换。
- 端到端测试：Playwright 覆盖桌面（1280px）与移动（390px）；验证首访语言跳转、导航锚点、SEO 元数据、工具卡行为。
- 测试命令：`npm run test`、`npm run test:e2e`；E2E 在 CI 与 Vercel Preview 环境执行。
- Flaky 用例处理：允许单次重跑，如仍失败需在 24 小时内修复或回滚；禁止长期跳过核心用例。

七、非功能需求
- 性能：首屏加载 ≤2s（桌面）/≤3s（移动）；Mock 请求响应 Loading 维持 0.6–1.2s；语言切换反馈 ≤100ms，自动重定向 ≤300ms。
- 兼容：Chrome/Edge/Safari/Firefox 最新两个大版本；移动端 Safari/Chrome；需支持深浅主题扩展能力。
- 可访问性：提供键盘导航与 ARIA 标签；颜色对比遵循 WCAG AA。
- 可维护性：组件化拆分，关键逻辑编写注释与 TS 类型，配置驱动的导航、文案、SEO。

八、风险与对策
- 视觉素材缺失 → 使用占位插画与 Tailwind 默认样式，设计稿确认后迭代。
- 多语言/SEO 配置遗漏 → 在 PR 模板中增加“文案/SEO 更新清单”，CI 校验 `content` 与 `config/seo.config.json` 是否同步。
- Mock 体验与真实接口差异 → 将请求逻辑封装在 `lib/services/tool-runner.ts`，后续替换为真实 API。
- 登录功能延后 → `/auth/login` 页面说明“账户系统建设中”，避免用户困惑。

九、里程碑与交付
- M1（US-01）：完成页面框架、导航、锚点、响应式布局（已完成）。
- M2（US-02）：交付工具卡成功/失败/加载、桌面 1/4-3/4 与移动堆叠（已完成）。
- M3（US-03）：完成浏览器语言检测、Cookie 持久化、切换器与 404 多语言（已完成）。
- M4（US-04）：完成 SEO 配置加载、metadata 输出、sitemap/robots 生成脚本（进行中，需在本迭代交付）。
- 验收流程：通过功能验证、跨设备走查、`npm run build` + Playwright 全量测试后，由产品、工程、设计三方共同签字确认。

十、附加规范（V1.6 新增）
- 登录占位：导航按钮链接 `/auth/login`，页面展示占位说明与联系邮箱；后续接入 NextAuth.js 或第三方登录时在此扩展。
- Scroll 行为：统一使用 `lib/utils/scroll-to-anchor.ts` 管理平滑滚动，避免重复实现。
- 字体与主题：在 `app/layout.tsx` 引入主字体，并通过 Tailwind 配置 `fontFamily`、`colors.brand`，确保中英文排版一致。
- 部署：默认部署到 Vercel；`vercel.json` 中配置 rewrites 保证 `/zh` 路径与 sitemap/robots 正确暴露。

十一、变更记录（Changelog）
- v1.6：确定 Next.js 技术栈、目录结构、文案与 SEO 配置策略；新增登录占位、内容管理、测试与 CI 规范；细化 i18n Cookie 策略与工具卡 Mock 逻辑。
- v1.5：整合 v1.0/v1.1 内容，补充 i18n 与 SEO 需求、sitemap/robots、canonical/hreflang 规范。
- v1.0/v1.1：初版 MVP 范围定义与基础需求。

十二、附录
- 参考文档：`docs/AI工具站快速启动-想法.md`、`docs/AI工具站快速启动-规划纪要.md`、`docs/PRD_AI工具站_MVP_v1.5.md`。
- 参考站点：https://pollo.ai/ai-image-generator
- 工具命令：`npm run dev`（开发）、`npm run build`（构建）、`npm run test` / `npm run test:e2e`（测试）、`npm run lint`、`npm run format`。
