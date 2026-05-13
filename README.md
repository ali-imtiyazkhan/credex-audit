# SpendSmart AI 💰

SpendSmart AI is a specialized audit platform designed to help teams and startups optimize their AI tool spend. It analyzes your current stack (Cursor, Copilot, Claude, ChatGPT, etc.) and provides data-backed recommendations to save up to 60% on monthly subscriptions.

## 🚀 Features

- **Multi-Tool Audit**: Supports 8+ major AI tools and their various pricing tiers.
- **Smart Recommendations**: Logic-driven suggestions (Keep, Switch, Downgrade, Optimize).
- **AI-Powered Summary**: Integrated with Anthropic Claude to give you a punchy executive summary.
- **Lead Generation**: Captures high-value leads for personalized consultation.
- **Shareable Results**: Generates unique URLs for every audit with custom SEO previews.

## 🛠️ Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: Next.js 15 (App Router), Tailwind CSS 3, Lucide React
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **AI**: Anthropic SDK (Claude 3.5 Sonnet)
- **Email**: Resend
- **Testing**: Jest

## 📦 Project Structure

```text
├── apps
│   ├── api          # Express server with Prisma & AI integration
│   └── web          # Next.js frontend with shadcn-style UI
├── packages
│   ├── audit-engine # Core calculation logic & pricing rules
│   ├── database     # Shared Prisma client & schema
│   └── types        # Shared TypeScript interfaces
```

## 🚥 Quick Start

1. **Clone the repo**
2. **Install dependencies**: `npm install`
3. **Set up Environment Variables**:
   - Create `.env` in the root and `apps/web/.env.local`.
   - Add `DATABASE_URL`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, and `NEXT_PUBLIC_API_URL`.
4. **Run migrations**: `npx turbo run db:generate`
5. **Start development**: `npm run dev`

## 🧪 Testing

Run the audit engine test suite:
```bash
npm run test
```
