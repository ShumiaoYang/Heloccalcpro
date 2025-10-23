PRD：AI工具站（MVP）v1.5
版本：1.5
状态：已定稿（US-01、US-02、US-03、US-04）

一、背景与目标
- 目标：以最短时间交付可运行的 AI 工具网站，验证核心交互与页面框架，支持后续快速扩展。
- 参考：pollo.ai/ai-image-generator（交互与布局参考）、工作区文件《AI工具站快速启动-想法.md》《AI工具站快速启动-规划纪要.md》。
- 迭代路径：
  1) Phase 1：MVP核心功能（US-01、US-02、US-03、US-04）
  2) Phase 2：用户与商业化
  3) Phase 3：内容与国际化
  4) Phase 4：高级能力扩展

二、MVP范围（本次交付）
- US-01：构建核心页面框架（含左侧功能导航 + 主内容纵向滚动结构）
- US-02：实现核心AI工具交互（通用“工具卡”框架，1/4输入配置 + 3/4输出展示，移动端堆叠）
- US-03：多语言支持（i18n）（EN 默认根路径；ZH 通过 /zh；浏览器语言自动检测与语言切换器）
- US-04：SEO配置（站点级与页面级；Title/Description/Keywords/H1-H3 多语言配置；继承与覆盖；注入 `<head>`）
- 明确不在MVP范围内：EXAMPLE、Features、BLOG 的真实内容与后台管理，仅保留占位与锚点，后续迭代实现。

三、用户故事与需求详情

US-01：构建核心页面框架
1) 价值与目标
- 为后续所有功能模块提供稳定、可扩展的页面骨架：固定左侧功能导航 + 右侧主内容区纵向滚动展示。
- 对齐 pollo.ai 的“应用级左侧导航 + 主工作区”思路，同时支持从 HERO 到 FOOTER 的整页内容浏览与锚点跳转。

2) 页面结构（高层次）
- NAV（顶栏）：展示站点名、语言切换、登录入口。
- 左侧功能导航（固定）：包含“概览、工具”等一级入口；在桌面端固定于视口；在移动端以汉堡菜单形式展开。
- 主内容区（可滚动）：包含模块顺序：HERO → TOOL → EXAMPLE → Features → BLOG → Friendly Links → FOOTER。
- 锚点导航：左侧导航或顶栏可快速跳转到主内容各模块。

3) 验收标准（Acceptance Criteria）
- 桌面端布局
  - GIVEN 在桌面浏览器
  - WHEN 打开首页
  - THEN 左侧功能导航固定在视口，主内容区以纵向滚动展示 HERO→TOOL→…→FOOTER。
- 导航固定与高亮
  - GIVEN 用户在主内容区滚动
  - WHEN 页面滚动到各模块可视范围
  - THEN 左侧导航保持固定并根据当前模块高亮对应项。
- 移动端布局
  - GIVEN 在移动设备（≤768px）
  - WHEN 打开首页
  - THEN 左侧导航以汉堡菜单折叠；主内容区为单列纵向布局，模块依次堆叠。
- 移动端导航交互
  - GIVEN 用户点击汉堡菜单
  - WHEN 选择任意模块
  - THEN 页面平滑滚动到对应模块并自动关闭菜单。
- 锚点与平滑滚动
  - GIVEN 用户点击任意锚点链接
  - WHEN 导航触发
  - THEN 页面以平滑滚动到对应模块，且URL可选更新片段（如 #tool）。

US-02：实现核心AI工具交互（通用“工具卡”）
1) 价值与目标
- 以“通用工具卡”形式搭建应用功能区：快速演示、可扩展、可替换具体模型或任务（文本生成/总结、后续的文转图/文转视频等）。

2) 通用工具卡布局
- 桌面端比例：左侧 输入与配置 = 1/4，右侧 输出结果 = 3/4。
- 移动端：自动堆叠为上下结构（上：输入与配置；下：输出结果）。
- 左侧（输入与配置）：提示词输入框、模型选择（占位）、参数设置（占位）、“生成”按钮。
- 右侧（输出结果）：加载态、成功结果、错误提示的统一展示区域。

3) 交互与业务规则（MVP演示）
- Happy Path：用户输入 → 点击生成 → 显示加载 → 延时后显示预设成功结果（模拟AI响应）。
- 错误路径：输入“trigger-error”触发模拟失败 → 显示加载 → 延时后显示错误信息。

4) 验收标准（Acceptance Criteria）
- 桌面端成功生成
  - GIVEN 桌面端 1/4-3/4 布局可见
  - WHEN 左侧输入任意文本并点击“生成”
  - THEN 右侧先显示加载，再显示预设成功结果（如“成功：这是一个模拟的AI响应。”）。
- 桌面端失败处理
  - GIVEN 工具卡可见
  - WHEN 输入“trigger-error”并点击“生成”
  - THEN 右侧先显示加载，再显示错误提示（如“生成失败，请稍后再试。”）。
- 移动端布局自适应
  - GIVEN 移动设备访问
  - WHEN 滚动到核心AI工具部分
  - THEN 输入/配置与输出区自动上下堆叠，视觉与交互正常。
- 移动端成功生成
  - GIVEN 移动端堆叠布局
  - WHEN 在输入框输入并点击“生成”
  - THEN 输出区同样先显示加载，再显示预设成功结果。

US-03：多语言支持（i18n）
1) 价值陈述
- 作为网站访客，我希望站点默认以英文呈现（`/`），中文通过 `/zh` 路径访问，并在导航处可随时切换语言，以便于不同语言用户快速访问与理解站点内容。

2) 业务规则与逻辑
- 前置条件：EN 为默认语言路径 `/`；ZH 为 `/zh`；顶栏包含语言切换器（EN/ZH）。
- 操作流程（Happy Path）：
  - 首次访问：检测浏览器语言（如 `zh-CN/zh`）→ 若为中文且用户未选择过语言，则跳转到 `/zh/`；否则停留在 `/`。
  - 手动切换：点击切换器选择 EN/ZH → 路由跳转至对应路径（`/` 或 `/zh/`），文案实时更新；用户选择持久化（localStorage/cookie）。
  - 文案加载：EN/ZH 文案分离；缺失字段降级为 EN（同时记录日志）。
- 异常处理：访问不支持的语言前缀（如 `/jp`）返回 404（英文文案）；文案文件加载失败时降级为 EN，并在切换器处提示“暂不可用”。
- 性能与约束：语言切换后 100ms 内有视觉反馈；首次自动跳转不超过 300ms；移动端适配一致。

3) 验收标准
- 场景1：默认英文访问
  - GIVEN 浏览器语言非中文
  - WHEN 访问 `https://site.com/`
  - THEN 页面以英文呈现，切换器显示 `[EN v]`。
- 场景2：自动跳转到中文
  - GIVEN 浏览器首选语言为中文（`zh-CN`/`zh`），且用户未选择过语言
  - WHEN 首次访问 `https://site.com/`
  - THEN 自动跳转到 `https://site.com/zh/`，切换器显示 `[中文 v]`。
- 场景3：从英文切换到中文
  - GIVEN 当前在 `https://site.com/`
  - WHEN 选择“中文（简体）”
  - THEN 跳转到 `https://site.com/zh/`，页面文案更新为中文。
- 场景4：从中文切换到英文
  - GIVEN 当前在 `https://site.com/zh/`
  - WHEN 选择“English”
  - THEN 跳转到 `https://site.com/`，页面文案更新为英文。
- 场景5：访问不存在的语言
  - GIVEN 用户尝试访问 `https://site.com/jp`
  - WHEN 请求到达
  - THEN 返回 404（英文文案）。

US-04：SEO 配置能力（站点级与页面级）
1) 价值陈述
- 作为网站运营者，我希望通过配置文件管理 Title、Description、Keywords 以及 H1-H3（多语言），以便于搜索引擎更好地理解与索引，提高自然流量。

2) 业务规则与逻辑
- 配置分离：全局（global，站点默认，EN/ZH）与页面（pages，按路径键，如 `/tools/text-summarizer`，EN/ZH）。
- 字段与多语言：`title`、`description`、`keywords`、`h1`、`h2[]`、`h3[]`（均支持 EN/ZH）。
- 继承与回退：页面缺失字段从全局同语言继承；仍缺失则回退到 EN；最后兜底为空（保留标签结构）。
- 注入方式：
  - SSR/SSG：根据 URL 与语言在构建/服务端渲染时注入 `<head>`（`<title>`、`<meta name="description">`、`<meta name="keywords">`）与 `<h1>`/`<h2>`/`<h3>`。
  - SPA：路由变更使用 `react-helmet-async` 实时更新。
- 配置文件路径：`d:\5ExpLabs\33AITWebsite\configs\seo.config.json`。

3) 验收标准
- 场景1：首页使用全局配置（ZH）
  - GIVEN 存在 `global.zh` 配置
  - WHEN 访问 `https://site.com/zh/`
  - THEN `<head>` 中包含对应的 `<title>`、`description`、`keywords`，页面 `<h1>` 为“欢迎使用AI工具箱”。
- 场景2：工具页覆盖全局（ZH）
  - GIVEN `/tools/text-summarizer.zh` 提供专属配置
  - WHEN 访问 `https://site.com/zh/tools/text-summarizer`
  - THEN `<title>` 为“文本摘要工具 - AI工具箱”，`<h1>` 为“AI文本摘要工具”。
- 场景3：页面缺失字段继承全局（keywords）
  - GIVEN `/tools/text-summarizer` 未定义 `keywords`
  - WHEN 访问对应页面（ZH）
  - THEN `keywords` 取自 `global.zh.keywords`。
- 场景4：英文页面使用 EN 全局
  - GIVEN 新页面 `/tools/new-tool` 无专属配置
  - WHEN 访问 `https://site.com/`
  - THEN `<head>` 与 `<h1>` 使用 `global.en` 全量配置。

四、技术与实现说明（供研发参考）
- 前端框架：React/Vue/Svelte/Angular 任一，建议使用组件化、路由与状态管理（示例：React + Vite + Tailwind/SCSS）。
- 响应式：断点建议（示例）：≤768px（移动）、769–1199px（平板）、≥1200px（桌面）。左侧导航桌面固定，移动端折叠。
- 动效与可用性：平滑滚动、加载动画（Spinner/Skeleton），错误提示采用非阻塞Toast或区块提示。
- API策略：MVP阶段使用前端模拟（Mock），后续切换到后端接口（POST /api/tools/execute，payload含输入文本、工具类型、参数等）。
- 可扩展性：工具卡以“配置驱动”设计（如 {inputs, params, runHandler, renderOutput}），支持不同类型任务插拔式扩展。
- 国际化：`react-i18next` + `i18next` + `i18next-http-backend` 加载 JSON 资源；路由前缀 `/` 与 `/zh`；语言偏好持久化（localStorage/cookie）。
- SEO 注入：`react-helmet-async` 注入/更新 `<title>` 与 `<meta>`；SSR/SSG 在构建/首屏渲染时读取 `seo.config.json` 并注入；启用 `canonical` 与 `hreflang`。

五、非功能需求
- 性能：模拟接口响应优化，加载动画在200–500ms内可见；页面首屏加载≤2s（桌面）、≤3s（移动）。语言切换后 100ms 内反馈；自动跳转不超过 300ms。
- 兼容：现代浏览器（Chrome、Edge、Safari、Firefox）近期两个大版本；中英文切换基础能力与 SEO 标签输出一致。
- 可维护性：模块化、样式与逻辑分层；关键交互（生成、错误、语言切换）具备基本单元测试或交互测试。

六、风险与对策
- 视觉参照差异：pollo.ai细节未100%复刻 → 通过组件化样式与主题系统逐步迭代对齐。
- 扩展复杂度：后续多媒体任务参数复杂 → 以配置驱动与组件分层降低耦合。
- 内容为空：EXAMPLE/Features/BLOG阶段内容暂空 → 以占位与锚点，迭代填充。
- 国际化与SEO耦合：多语言路径导致重复内容风险 → 通过 canonical 与 hreflang 明确主副版本；文案缺失统一回退 EN。

七、里程碑与交付（更新）
- M1（US-01）：完成页面框架、导航与锚点；桌面/移动端适配（已完成）。
- M2（US-02）：完成通用工具卡交互（成功/失败/加载），桌面1/4-3/4、移动端堆叠（已完成）。
- M3（US-03）：完成国际化（EN 默认根路径；ZH `/zh`；浏览器自动检测与语言切换器；选择持久化与 404）（已完成）。
- M4（US-04）：完成 SEO 配置（全局+页面；多语言；继承/覆盖；SSR/SSG 注入；Helmet 更新）（已完成）。
- 验收：满足各自验收标准，并通过跨设备视觉与交互走查。

八、附加规范与实现（纳入 V1.1）
- 站点地图与爬虫指令（MVP纳入）：
  - 交付 `sitemap.xml`（SSG/SSR 构建时生成，包含 EN `/` 与 ZH `/zh` 页面以及工具子页面路径；更新频率：daily/weekly 可配置）。
  - 交付 `robots.txt`（允许抓取 `/` 与 `/zh`，禁止抓取 `/api/*`；声明 `Sitemap: https://site.com/sitemap.xml`）。
- hreflang 与 canonical（MVP纳入）：
  - 所有 EN/ZH 页面在 `<head>` 输出成对的 `<link rel="alternate" hreflang="en/zh">` 与唯一 `<link rel="canonical">`。
  - SEO检查清单：唯一 H1；唯一 canonical；存在 en/zh alternates；完整 `title/description/keywords`；避免重复内容。
- SEO 配置文件（MVP纳入）：
  - 路径：`d:\5ExpLabs\33AITWebsite\configs\seo.config.json`；结构：`global` 与 `pages`（EN/ZH）。
  - 加载与注入：构建/首屏渲染读取；运行时使用 `react-helmet-async` 更新；字段继承与回退遵循 US-04 规则。

九、变更记录（Changelog）
- 从 v1.0 升级到 v1.1：新增 US-03（i18n）与 US-04（SEO配置），并纳入 sitemap/robots、hreflang/canonical 与 SEO 配置文件路径与规则。
- 本次整合到 v1.5：将 v1.0 与 v1.1 全量内容合并，统一文档结构与术语，作为发布版本准备。

十、附录
- 参考文档：
  - d:\5ExpLabs\33AITWebsite\AI工具站快速启动-想法.md
  - d:\5ExpLabs\33AITWebsite\AI工具站快速启动-规划纪要.md
- 参考网站：
  - https://pollo.ai/ai-image-generator