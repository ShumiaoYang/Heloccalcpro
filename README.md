# Heloccalcpro

Professional HELOC (Home Equity Line of Credit) Calculator with AI-powered financial analysis.

## 🌟 Features

- **Credit Line Calculator**: Calculate maximum borrowing capacity based on home value, mortgage balance, and credit score
- **Payment Simulator**: Forecast monthly payments with inflation adjustment over time
- **Risk Analysis**: Comprehensive risk scoring system (0-100 scale) with detailed health metrics
- **Credit Score Impact**: Simulate how HELOC utilization affects your credit score
- **Stress Testing**: Test financial resilience under various interest rate scenarios
- **AI Expert Reports**: Generate detailed financial analysis reports using GPT-5 and Gemini
- **PDF Reports**: Professional PDF report generation with charts and recommendations
- **Stripe Integration**: Secure payment processing for premium features
- **Email Notifications**: Automated email delivery for reports
- **Multi-language**: Full support for English and Chinese (中文)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Payment**: Stripe
- **AI**: OpenAI GPT-5, Google Gemini
- **PDF Generation**: @react-pdf/renderer
- **Email**: Nodemailer
- **Storage**: Cloudflare R2
- **Charts**: Chart.js with react-chartjs-2
- **i18n**: next-intl
- **Testing**: Vitest + Playwright

## 📦 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/Heloccalcpro.git
cd Heloccalcpro
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and fill in your API keys and configuration values.

4. **Set up the database**:
```bash
npx prisma generate
npx prisma migrate dev
```

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

See `.env.example` for all required environment variables. Key variables include:

### Core
- `APP_DOMAIN`: Your application domain
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string

### Authentication
- `NEXTAUTH_URL`: NextAuth URL
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google OAuth credentials

### AI Services
- `OPENAI_API_KEY_GPT5`: OpenAI API key
- `GEMINI_API_KEY`: Google Gemini API key

### Payment
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY`: Stripe credentials
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `STRIPE_PRICE_HELOC_REPORT`: Stripe price ID for reports

### Storage
- `R2_*`: Cloudflare R2 storage credentials

### Email
- `SMTP_*`: SMTP configuration for email notifications

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 📖 Project Structure

```
Heloccalcpro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── page.tsx       # Homepage (HELOC Calculator)
│   │   │   ├── heloc/         # HELOC related pages
│   │   │   ├── about/         # About page
│   │   │   └── account/       # Account management
│   │   └── api/               # API routes
│   │       ├── heloc/         # HELOC API endpoints
│   │       ├── auth/          # Authentication
│   │       └── billing/       # Stripe billing
│   ├── components/            # React components
│   │   ├── calculator/        # Calculator components
│   │   ├── charts/           # Chart components
│   │   ├── heloc/            # HELOC specific components
│   │   ├── billing/          # Billing components
│   │   ├── home/             # Homepage sections
│   │   ├── layout/           # Layout components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Business logic
│   │   ├── heloc/           # HELOC calculations
│   │   │   ├── credit-calculator.ts
│   │   │   ├── risk-score.ts
│   │   │   ├── stress-test.ts
│   │   │   └── amortization.ts
│   │   ├── ai/              # AI analysis
│   │   ├── pdf/             # PDF generation
│   │   ├── email/           # Email service
│   │   ├── storage/         # R2 storage
│   │   ├── tasks/           # Background tasks
│   │   ├── auth/            # Auth configuration
│   │   └── billing/         # Billing logic
│   └── types/               # TypeScript types
├── prisma/                  # Database schema & migrations
├── config/                  # Configuration files
│   ├── seo.config.json
│   └── billing.config.json
├── content/                 # i18n content
│   ├── en.json
│   └── zh.json
├── public/                  # Static assets
├── scripts/                 # Utility scripts
└── tests/                   # Tests (Vitest + Playwright)
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:headed
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint errors
npm run format             # Check formatting
npm run format:write       # Fix formatting

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations

# SEO
npm run generate:sitemap   # Generate sitemap.xml
npm run generate:robots    # Generate robots.txt
```

## 🎯 Key Features Explained

### HELOC Credit Calculator
Calculates the maximum Home Equity Line of Credit amount based on:
- Home value
- Current mortgage balance
- Credit score (affects LTV limits and interest rates)
- Desired LTV ratio (Loan-to-Value)

### Risk Scoring System
Provides a 0-100 risk health score based on:
- LTV ratio
- DTI (Debt-to-Income) ratio
- Credit score
- Financial stability indicators

### Stress Testing
Simulates financial scenarios over 10 years:
- Interest rate increases (Prime Rate fluctuations)
- Income growth projections
- Inflation-adjusted payment analysis

### AI Analysis
Uses GPT-5 and Gemini to generate:
- Personalized financial recommendations
- Risk analysis and warnings
- Actionable next steps
- Long-term financial planning advice

### PDF Reports
Professional reports including:
- Executive summary
- Detailed calculations with charts
- Risk analysis
- AI-generated recommendations
- Payment schedules and amortization

## 🌍 Internationalization

The application supports both English and Chinese:
- `/en` - English version
- `/zh` - Chinese version (中文)

Content is managed through JSON files in the `content/` directory.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Bug Reports

If you find a bug, please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/)
- [OpenAI](https://openai.com/)
- [Google Gemini](https://ai.google.dev/)
- [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- And many other amazing open-source projects

---

**Note**: This is a financial calculator tool. Always consult with a qualified financial advisor before making important financial decisions.
