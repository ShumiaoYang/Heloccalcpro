# AI 工具站模板

一个基于 Next.js App Router 的多语言 AI 工具站模板，聚焦“开箱即用、可快速投产”。通过配置即可扩展工具目录、切换 LLM 提供方，并提供认证、SEO、日志等基础能力，帮助个人开发者或小团队快速验证产品想法。

## 核心亮点
- **配置驱动的工具目录**：`config/tools.config.json` 描述全部工具，自动映射到首页、`/tools` 列表与详情页。
- **可切换的 LLM 调度**：同一后端入口 `/api/tools/[slug]`，支持 `mock` / `openai` Provider，统一注入温度、token 等参数。
- **多语言 & SEO**：`content/en.json` / `content/zh.json` 与 `config/seo.config.json` 完整覆盖站点文案与元信息。
- **认证与日志**：NextAuth 提供 Google 登录；Prisma 记录 `ToolRun`，方便后续分析与计费。
- **可扩展设计**：Tailwind +组件化结构，容易接入更多页面模块、支付等能力。

更多背景、差距分析与路线规划可参考 `docs/internal` 下的资料。

## 目录速览

| 路径 | 说明 |
| ---- | ---- |
| `src/app` | Next.js App Router 目录：本地化路由、API Routes、页面布局等 |
| `src/components` | UI 组件（含工具卡片、首页分区等） |
| `src/lib` | 业务逻辑与工具函数（内容加载、工具配置、LLM 调度、Prisma 等） |
| `config/` | SEO、工具、导航等配置 JSON |
| `content/` | 中英双语文案（需保持 key 对齐） |
| `prisma/` | 数据模型定义与迁移 |
| `docs/` | 部署、运行手册与内部规划文档 |

> 新增的工具与 LLM 配置说明详见 `docs/internal/configs/tools-and-llm-config.md`。

## 环境要求
- Node.js 18+
- npm 9+（推荐使用 `npm ci`）
- 可选：PostgreSQL 14+

## 快速开始
```bash
npm install
cp .env.example .env.local
# 按需编辑 .env.local
npm run dev
```

访问 `http://localhost:3000`（英文），`http://localhost:3000/zh`（中文）。

### HTTPS 本地开发（可选）
```bash
# 生成测试证书（示例）
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout certs/localhost.key \
  -out certs/localhost.crt \
  -config certs/localhost.cnf

node server-https.mjs
```
访问 `https://localhost:3443` 并信任自签证书，以满足 Google OAuth 等需求。

### 初始化数据库
```bash
createdb aitsdb
npm run prisma:migrate
```
迁移会创建 `Tool`、`ToolRun` 等表并生成 Prisma Client。

## 配置清单
| 变量名 | 说明 | 示例 |
| ------ | ---- | ---- |
| `APP_DOMAIN` | 站点对外访问域名（生成 canonical/hreflang） | `https://ai-tools.example.com` |
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://postgres:123@localhost:5432/aitsdb?schema=public` |
| `NEXTAUTH_SECRET` | NextAuth 签名 Key（生产务必随机） | `long-random-secret` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth 凭据 | `xxxx.apps.googleusercontent.com` |
| `TOOL_SUMMARIZER_PROVIDER` | 摘要工具 Provider（`mock` / `openai`） | `mock` |
| `TOOL_SUMMARIZER_MODEL` | 摘要模型名称 | `gpt-4o-mini` |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` | OpenAI 或兼容服务的凭据 | `https://api.openai.com/v1` |
| `OPENAI_SUMMARIZER_TEMP` | 摘要温度，默认 `0.2` | `0.2` |
| `STRIPE_SECRET_KEY` | Stripe API Secret，用于创建 Checkout/Portal | `sk_test_****` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 签名密钥 | `whsec_****` |
| `STRIPE_PRICE_PRO_MONTHLY` | Pro 月度套餐在 Stripe 中的 Price ID | `price_****` |
| `STRIPE_PRICE_PRO_ANNUAL` | Pro 年度套餐在 Stripe 中的 Price ID | `price_****` |
| `STRIPE_MOCK_MODE` | 启用模拟模式（无 Stripe 账号时本地体验） | `true` |

> `config/tools.config.json` 中的 `temperature`、`maxOutputTokens` 也可按工具粒度配置。

### 工具目录配置
- 主配置：`config/tools.config.json`
- 文案：`content/en.json` / `content/zh.json` 的 `toolCatalog.items`
- 处理逻辑：`src/lib/tools/*` 与 `src/app/api/tools/[slug]/route.ts`
- 详细说明：`docs/internal/configs/tools-and-llm-config.md`

## 常用脚本
- `npm run dev`：开发模式（禁止在 CLI 环境直接运行，需本地手动启动）
- `npm run build`：生成生产包
- `npm run lint`：ESLint 校验
- `npm run test`：Vitest 单测 / 组件测试
- `npm run test:e2e`：Playwright 端到端测试（需先启动站点或配置 `PLAYWRIGHT_BASE_URL`，例如 `PLAYWRIGHT_BASE_URL=https://localhost:3443 npm run test:e2e -- --project=chromium-desktop`）
- `npm run prisma:generate`：生成 Prisma Client
- `npm run prisma:migrate`：执行数据库迁移
- `npm run generate:sitemap` / `npm run generate:robots`

## 质量保障
提交前建议执行：
```bash
npm run lint
npm run test
npm run build
```

E2E 测试收录于 `tests/e2e/tool-catalog.spec.ts`，覆盖工具目录渲染与摘要工具交互。若需在无本地服务环境运行，可部署后设置 `PLAYWRIGHT_BASE_URL`。

## 部署指引
1. Fork 或推送代码到自己的仓库。
2. 在 Vercel 创建项目并关联仓库。
3. 在 Environment Variables 中配置上文列出的变量。
4. 触发部署（Vercel 会执行 `npm install` + `npm run build`）。
5. 如需自定义域名，在 Vercel 完成 DNS 验证。

详见 `docs/Deployment.md` 与 `docs/internal/Runbook.md`。

## 更多文档
- `docs/internal/AI工具站快速启动-想法.md`：产品初步设想
- `docs/internal/AI工具站快速启动-规划纪要.md`：MVP 及后续规划
- `docs/internal/configs/tools-and-llm-config.md`：工具 & LLM 配置说明
- `docs/internal/configs/billing-config.md`：订阅计费配置说明
- `docs/internal/差距分析_*.md`：阶段性差距分析
- `docs/internal/Roadmap.md`：路线图

若有新的功能实现或差距分析，请在上述文档中持续同步。
