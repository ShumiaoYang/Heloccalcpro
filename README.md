# Heloccalcpro

**Financial decision-support SaaS for modeling HELOC borrowing, payment, interest-rate, and repayment scenarios.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-heloccalculator.pro-blue)](https://heloccalculator.pro/en)

## Overview

Heloccalcpro is a financial modeling and decision-support application for **Home Equity Lines of Credit (HELOCs)**.

Instead of treating a HELOC as a simple borrowing-limit calculation, the application models the financial path of a HELOC over time:

- How much home equity may be available
- What monthly payments may look like
- How payments change when interest rates rise
- What happens when the draw period ends
- How repayment can create payment shock
- How the proposed borrowing structure behaves under stress
- How the analysis can be explained in a clear, customer-facing report

The application combines a **deterministic financial calculation engine** with an **AI interpretation layer**.

> **Core principle:** Financial calculations and risk metrics should be deterministic, testable, and auditable. AI should primarily explain and communicate the calculated results rather than act as the financial calculation engine.

## Why I Built It

Many online HELOC calculators focus primarily on estimating available credit.

That answers:

> "How much can I borrow?"

But a more important question is:

> "What happens after I borrow it?"

A HELOC is a variable-rate product with a draw period, a repayment period, and potentially significant changes in required payments.

I built this project to explore how a financial application can move from a simple calculator toward **scenario-based financial decision support**.

The project also reflects my background in banking technology and financial systems. I have spent more than 20 years working with banking software, core banking systems, payment platforms, financial applications, and complex business rules.

## Key Capabilities

### Borrowing & Credit Analysis

- HELOC credit-line estimation
- Home equity and CLTV analysis
- Credit-score-based scenario modeling
- Property and occupancy considerations
- Borrowing-capacity analysis

### Payment Modeling

- Interest-only payment calculations
- Principal-and-interest repayment calculations
- Amortization schedules
- Draw-period and repayment-period modeling
- Payment comparison across scenarios

### Interest-Rate Stress Testing

The application can model how payments change under different interest-rate scenarios.

This helps illustrate questions such as:

- What happens if rates increase?
- How much could the monthly payment change?
- Can the borrower absorb the increase?
- What happens when the loan transitions from interest-only payments to amortizing payments?

### Repayment & Payment-Shock Analysis

One of the key risks modeled by the application is the transition from the draw period to the repayment period.

A borrower may initially see a relatively manageable interest-only payment, followed by a substantially higher payment when principal repayment begins.

The application therefore treats **payment shock** as a first-class risk rather than simply displaying an amortization table.

### Risk Analysis

The application combines calculated financial metrics and stress-test results to provide a structured view of borrowing risk.

The goal is not to make a lending decision, but to help users understand the consequences of different borrowing scenarios.

### AI Financial Analysis

AI is used as an interpretation and communication layer.

The application can use LLM APIs to:

- Explain calculated financial results
- Summarize major risks
- Compare scenarios
- Generate user-facing financial analysis
- Provide contextual explanations in plain language

The underlying financial calculations remain application logic rather than being delegated to the LLM.

### PDF Reports

The application can generate customer-facing PDF reports containing the financial analysis and scenario results.

The report is designed to turn complex calculations into something that can be reviewed and discussed by a homeowner or financial professional.

## Architecture

The key architectural principle is to keep domain calculations deterministic and auditable, while using AI primarily for interpretation and communication.

```text
User Financial Inputs
        ↓
Deterministic Calculation Engine
        ↓
Scenario & Stress Testing Engine
        ↓
Risk Analysis & Financial Metrics
        ↓
AI Analysis Layer
        ↓
Report Generation
```

This separation is intentional:

- **Financial calculations** are implemented as deterministic application logic rather than delegated to an LLM.
- **Scenario analysis and stress testing** operate on structured financial data and defined rules.
- **AI** is used to interpret calculated results, explain risks, and generate user-facing financial reports.
- **PDF generation** converts the structured analysis into a customer-facing report.

This architecture makes the financial logic easier to test, audit, and evolve independently from the AI layer.

## Technology Stack

### Application

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui patterns

### Backend & Data

- Node.js
- PostgreSQL
- Prisma ORM
- NextAuth
- REST/API routes

### AI & Financial Analysis

- OpenAI API
- Google Gemini API
- Deterministic financial calculation engine
- Scenario and stress-testing engine
- AI-generated financial analysis and reports

### Documents & Infrastructure

- React PDF
- Cloudflare R2
- Nodemailer
- Stripe
- Vercel

### Testing

- Vitest
- Playwright

## Project Structure

```text
src/
├── app/                 # Next.js application routes
├── components/          # UI components
├── lib/
│   ├── heloc/           # Financial calculation and risk logic
│   │   ├── credit-calculator.ts
│   │   ├── risk-score.ts
│   │   ├── stress-test.ts
│   │   └── amortization.ts
│   ├── ai/              # AI analysis
│   ├── pdf/             # PDF generation
│   ├── email/           # Email services
│   ├── storage/         # Object storage
│   ├── tasks/           # Background/task logic
│   ├── auth/            # Authentication
│   └── billing/         # Billing and Stripe
├── prisma/              # Database schema and migrations
├── config/              # Application configuration
├── content/             # Localized content
├── public/              # Static assets
└── scripts/             # Utility and deployment scripts

tests/
├── unit/
└── e2e/
```

## Engineering Highlights

### Deterministic Financial Logic

Financial calculations are implemented as application code instead of relying on probabilistic LLM output.

This provides:

- Repeatable results
- Automated testing
- Easier debugging
- Clear separation between calculation and explanation
- A more auditable financial model

### Scenario-First Design

The product is designed around scenarios rather than a single calculated number.

Instead of only presenting a maximum credit line, the application can compare different borrowing and repayment conditions.

### Stress Testing

Interest-rate changes and repayment-period transitions are modeled explicitly so that users can understand potential downside scenarios before borrowing.

### AI as an Interpretation Layer

The architecture deliberately separates:

```text
Calculation → Analysis → Explanation
```

from:

```text
LLM → Calculation
```

This allows AI to add value without becoming a source of truth for financial mathematics.

### Production SaaS Architecture

The project includes the major components required by a production-oriented SaaS application, including:

- Authentication
- Database persistence
- Billing
- Email
- Object storage
- PDF generation
- AI APIs
- Internationalization
- Automated testing

## Running Locally

### Prerequisites

- Node.js
- PostgreSQL
- API credentials for the services you want to use

### Installation

```bash
git clone https://github.com/ShumiaoYang/Heloccalcpro.git
cd Heloccalcpro
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Configure the required environment variables for your local environment.

### Database

Run the Prisma database setup:

```bash
npx prisma generate
npx prisma migrate dev
```

### Development

```bash
npm run dev
```

## Environment Variables

The application uses environment variables for configuration, including:

```text
APP_DOMAIN
NODE_ENV
DATABASE_URL

NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

OPENAI_API_KEY
GEMINI_API_KEY

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME

SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
```

Only configure the services required for the functionality you intend to run locally.

## Testing

Unit tests:

```bash
npm run test
```

End-to-end tests:

```bash
npm run test:e2e
```

## Deployment

The application is designed to support deployment to platforms such as Vercel, with PostgreSQL and external services configured through environment variables.

The production deployment separates application configuration and credentials from source code.

## Product

Live application:

**https://heloccalculator.pro/en**

The product is intended for:

- Homeowners researching HELOC options
- Financial professionals discussing borrowing scenarios
- Mortgage and real-estate professionals who need clearer scenario explanations

## Background

This project is part of my transition from traditional enterprise banking technology into modern AI-native SaaS development.

My background includes more than 20 years of experience across:

- Core banking systems
- Payment platforms
- Financial applications
- Banking data governance
- Enterprise architecture
- Software engineering
- Technical project management

The project combines that domain experience with modern technologies including Next.js, React, Node.js, PostgreSQL, and LLM APIs.

## Disclaimer

Heloccalcpro is a financial modeling and educational decision-support tool.

It does **not** provide loan approval, lending offers, financial advice, or guarantees of eligibility or borrowing terms.

Actual HELOC terms, credit limits, interest rates, fees, and approval decisions are determined by individual lenders based on their own underwriting criteria and applicable regulations.

## License

This project is licensed under the MIT License.

## Contact

For questions, feedback, or collaboration, please open an issue in this repository or contact the project maintainer.
