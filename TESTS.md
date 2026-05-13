# Test Documentation

## Audit Engine Tests
The core logic resides in `packages/audit-engine/tests/audit.test.ts`.

### Test Suites
1. **Cursor**: Verifies downgrades from Business to Pro and switches to Claude for non-coding tasks.
2. **GitHub Copilot**: Tests Enterprise to Business downgrades based on seat count.
3. **Claude**: Tests Max to Pro downgrades for small teams.
4. **ChatGPT**: Recommends switching to Cursor for coding-focused teams.
5. **Gemini**: Handles tier downgrades for general writing use cases.

### Edge Cases Covered
- **High Value Detection**: Ensures audits saving >$500/mo are flagged for sales.
- **Already Optimal**: Ensures well-configured stacks aren't forced into changes.
- **Annual Calculation**: Validates the 12x multiplier logic.

### Running Tests
```bash
npx turbo run test
```
