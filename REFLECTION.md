# Reflection

### 1. What was the most challenging part of the build?
Managing the shared type system across the monorepo while dealing with TypeScript's `moduleResolution` settings was surprisingly tricky. Ensuring that the Express API, Next.js frontend, and the standalone Audit Engine all "spoke the same language" required careful configuration of `tsconfig.json`.

### 2. What would you do differently if you had to start over?
I would implement a more robust "Plan Comparison" data structure early on. Currently, the pricing logic is hardcoded into `pricing.ts`. Moving this to a database or a headless CMS would make it easier to update prices without redeploying the engine.

### 3. Which feature are you most proud of?
The AI Summary integration. Seeing Claude take raw spending data and turn it into a punchy, actionable recommendation makes the platform feel much more premium and professional.

### 4. How did you handle "deceptively simple" tasks like audit recommendations?
I broke them down into a strict hierarchy of rules: 1. Keep (if optimal), 2. Downgrade (if over-provisioned), 3. Switch (if a better tool exists for the use case). This prevented the logic from becoming a "spaghetti" of if-else statements.

### 5. What's the biggest lesson you learned about AI tool spend?
Teams are almost always overpaying by staying on "Business" or "Enterprise" tiers when they only have 2-3 seats, or by paying for multiple tools that have significant feature overlap.
