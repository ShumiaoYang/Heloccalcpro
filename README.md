# AI 工具站模板

一个基于 Next.js App Router 打造的多语言 AI 工具站模板，目标是在 Vercel 上快速上线、验证业务想法，同时保证 SEO、国际化与基础合规能力。

## 环境要求
- Node.js 18+
- npm 9+（推荐使用 `npm ci` 安装依赖）

## 快速开始
```bash
npm install
cp .env.example .env.local
# 编辑 .env.local，按需更新 APP_DOMAIN
npm run dev
```
本地访问 `http://localhost:3000`，默认展示英文站点，可通过 `/zh` 预览中文版本。

## 关键环境变量
| 变量名 | 说明 | 示例 |
| ------ | ---- | ---- |
| `APP_DOMAIN` | 站点对外访问域名，用于生成 canonical、hreflang 等 SEO 链接 | `https://ai-tools.example.com` |
| `TOOL_SUMMARIZER_PROVIDER` | 工具卡使用的摘要 provider（`mock` / `openai`） | `mock` |
| `TOOL_SUMMARIZER_MODEL` | 摘要所用模型名称，OpenAI 模式下应与可用模型一致 | `gpt-4o-mini` |
| `OPENAI_API_KEY` | （可选）启用 OpenAI provider 时的 API Key | `sk-xxxx` |
| `OPENAI_BASE_URL` | （可选）自定义 OpenAI 兼容 API 地址 | `https://api.openai.com/v1` |
| `OPENAI_SUMMARIZER_TEMP` | （可选）摘要温度，默认 `0.2` | `0.2` |
| `NEXTAUTH_SECRET` | NextAuth 签名密钥（生产环境必须随机值） | `long-random-secret` |
| `GOOGLE_CLIENT_ID` | Google OAuth 应用的 Client ID | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 应用的 Client Secret | `xxxx-abcdef` |

> ⚠️ 未设置 `APP_DOMAIN` 时将默认回退为 `https://example.com`，可能导致 SEO 数据异常。

## 常用命令
- `npm run dev`：本地开发（自动热重载）
- `npm run lint`：运行 ESLint 校验
- `npm run test`：运行 Vitest 单元与交互测试
- `npm run test:e2e`：运行 Playwright 端到端测试
- `npm run build`：构建生产包
- `npm run generate:sitemap`：生成 `public/sitemap.xml`
- `npm run generate:robots`：生成 `public/robots.txt`

## 质量保障
CI 默认执行 `npm run lint`、`npm run test`、`npm run build`。建议开发过程中在提交前本地运行：
```bash
npm run lint
npm run test
npm run build
```

## 部署指引（Vercel）
1. Fork 或推送代码至自己的仓库。
2. 在 Vercel 创建新项目，选择对应仓库。
3. 在项目设置的 Environment Variables 中配置：
   - `APP_DOMAIN=https://<你的正式域名>`
   - `TOOL_SUMMARIZER_PROVIDER=openai`（如需接入 OpenAI）
   - `TOOL_SUMMARIZER_MODEL=gpt-4o-mini`（或你的模型）
   - `OPENAI_API_KEY=sk-***`（如适用）
   - `NEXTAUTH_SECRET=<随机字符串>`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
4. 触发部署（Vercel 会自动执行 `npm install`、`npm run build`）。
5. 若使用自定义域名，完成 DNS 解析并在 Vercel 验证。

更多部署细节与故障排查请参考 `docs/Deployment.md` 与 `docs/internal/Runbook.md`。
