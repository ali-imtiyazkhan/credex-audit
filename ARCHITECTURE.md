# Architecture & System Design

## System Overview

SpendSmart AI is built as a high-performance monorepo using **Turborepo**. This allows for shared types and logic between the frontend and backend, ensuring a robust and maintainable codebase.

## Data Flow

1. **Input Phase**: User enters their AI tool stack and team size in the Next.js frontend.
2. **Persistence**: The audit form state is persisted in `localStorage` to prevent data loss.
3. **Execution**: On submission, the frontend calls the `/audit` endpoint on the Express API.
4. **Logic Engine**: The API calls `@repo/audit-engine`, which uses a centralized pricing database (`pricing.ts`) and a rule engine (`rules.ts`) to calculate optimizations.
5. **Enrichment**: The API sends the raw results to **Anthropic Claude** to generate a natural language summary.
6. **Storage**: Results are stored in **PostgreSQL** via **Prisma**.
7. **Delivery**: The API returns a `publicId`, and the user is redirected to a unique results page.

## Component Breakdown

### `@repo/audit-engine`
The "brain" of the app. It is entirely stateless and deterministic. It takes an `AuditInput` and returns an `AuditResult`. It contains:
- `pricing.ts`: A dictionary of current AI tool prices.
- `rules.ts`: The conditional logic for recommending switches or downgrades.

### `@repo/database`
A shared package containing the Prisma schema. It centralizes the data models (`Audit`, `Lead`, `RateLimit`) so they are consistent across the API and any future worker services.

### `apps/web` (The Frontend)
A Next.js application that prioritizes user experience and SEO.
- **Dynamic Routes**: `[id]/page.tsx` uses server-side fetching for SEO previews.
- **Client Components**: Used for interactive forms and real-time state management.

## Security & Reliability
- **Rate Limiting**: Implemented at the API level using a `RateLimit` table to prevent abuse of the Anthropic API.
- **Bot Protection**: Honeypot fields on lead capture forms.
- **Type Safety**: End-to-end type safety using `@repo/types`.
