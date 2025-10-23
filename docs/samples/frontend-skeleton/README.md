Frontend Skeleton (i18n + SEO)

目的：提供最小可参考的代码样板，展示以下能力：
- 路由前缀：英文 `/`，中文 `/zh`
- 浏览器语言自动检测与首访跳转
- 语言切换器（持久化 localStorage）
- 读取并解析 `configs/seo.config.json`，注入 `<title>`、`<meta>`、`canonical`、`hreflang`

说明：本样板用于参考，不保证可直接运行；如需运行，请在真实项目中安装依赖：
- react、react-dom、react-router-dom、react-helmet-async、i18next、react-i18next

文件结构：
- src/main.tsx：入口与 HelmetProvider
- src/App.tsx：路由、首访语言检测、SEO 注入
- src/i18n.ts：i18next 初始化与语言应用
- src/seo.ts：SEO 配置加载与解析、canonical/hreflang 构造
- src/components/LanguageSwitcher.tsx：语言切换组件
- src/pages/Home.tsx：首页示例
- src/pages/ToolsTextSummarizer.tsx：工具页示例（含 1/4-3/4 交互）

注意：`loadSEOConfig()` 默认从 `/configs/seo.config.json` 读取，确保在项目静态资源可访问到该路径。