import { runAudit } from '../src/calculator'

describe('Audit Engine - Detailed Scenarios', () => {

  describe('Cursor', () => {
    test('downgrades Business to Pro for small teams', () => {
      const result = runAudit({
        tools: [{ toolName: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 }],
        teamSize: 3,
        useCase: 'coding',
      })
      expect(result.tools[0].recommendedAction).toBe('downgrade')
      expect(result.tools[0].recommendedPlan).toBe('Pro')
      expect(result.tools[0].monthlySavings).toBe(60)
    })

    test('switches to Claude for non-coding use cases', () => {
      const result = runAudit({
        tools: [{ toolName: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
        teamSize: 1,
        useCase: 'writing',
      })
      expect(result.tools[0].recommendedAction).toBe('switch')
      expect(result.tools[0].recommendedTool).toBe('claude')
    })
  })

  describe('GitHub Copilot', () => {
    test('downgrades Enterprise to Business for < 10 seats', () => {
      const result = runAudit({
        tools: [{ toolName: 'github-copilot', plan: 'enterprise', monthlySpend: 195, seats: 5 }],
        teamSize: 5,
        useCase: 'coding',
      })
      expect(result.tools[0].recommendedAction).toBe('downgrade')
      expect(result.tools[0].recommendedPlan).toBe('Business')
      expect(result.tools[0].monthlySavings).toBe((39 - 19) * 5)
    })
  })

  describe('Claude', () => {
    test('downgrades Max to Pro for small usage', () => {
      const result = runAudit({
        tools: [{ toolName: 'claude', plan: 'max', monthlySpend: 200, seats: 2 }],
        teamSize: 2,
        useCase: 'mixed',
      })
      expect(result.tools[0].recommendedAction).toBe('downgrade')
      expect(result.tools[0].monthlySavings).toBe(160)
    })
  })

  describe('ChatGPT', () => {
    test('switches to Cursor for coding teams', () => {
      const result = runAudit({
        tools: [{ toolName: 'chatgpt', plan: 'plus', monthlySpend: 60, seats: 3 }],
        teamSize: 3,
        useCase: 'coding',
      })
      expect(result.tools[0].recommendedAction).toBe('switch')
      expect(result.tools[0].recommendedTool).toBe('cursor')
    })
  })

  describe('Gemini', () => {
    test('downgrades Ultra for non-data use cases', () => {
      const result = runAudit({
        tools: [{ toolName: 'gemini', plan: 'ultra', monthlySpend: 30, seats: 1 }],
        teamSize: 1,
        useCase: 'writing',
      })
      expect(result.tools[0].recommendedAction).toBe('downgrade')
      expect(result.tools[0].recommendedPlan).toBe('Pro')
    })
  })

  describe('Edge Cases & Totals', () => {
    test('marks high value audits correctly', () => {
      const result = runAudit({
        tools: [{ toolName: 'claude', plan: 'max', monthlySpend: 1000, seats: 10 }],
        teamSize: 10,
        useCase: 'mixed',
      })
      expect(result.isHighValue).toBe(true)
    })

    test('marks already optimal audits', () => {
      const result = runAudit({
        tools: [{ toolName: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
        teamSize: 1,
        useCase: 'coding',
      })
      expect(result.isAlreadyOptimal).toBe(true)
    })
  })
})
