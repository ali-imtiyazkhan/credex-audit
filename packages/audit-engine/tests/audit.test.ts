import { runAudit } from '../src/calculator'

describe('Audit Engine', () => {

  test('recommends downgrade for Cursor Business with small team', () => {
    const result = runAudit({
      tools: [{ toolName: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 }],
      teamSize: 3,
      useCase: 'coding',
    })
    expect(result.tools[0].recommendedAction).toBe('downgrade')
    expect(result.tools[0].monthlySavings).toBe(60) // 3 * (40-20)
  })

  test('recommends switch for Cursor on non-coding use case', () => {
    const result = runAudit({
      tools: [{ toolName: 'cursor', plan: 'pro', monthlySpend: 40, seats: 2 }],
      teamSize: 2,
      useCase: 'writing',
    })
    expect(result.tools[0].recommendedAction).toBe('switch')
    expect(result.tools[0].recommendedTool).toBe('claude')
  })

  test('marks audit as high value when savings > $500/mo', () => {
    const result = runAudit({
      tools: [
        { toolName: 'cursor', plan: 'business', monthlySpend: 400, seats: 10 },
        { toolName: 'chatgpt', plan: 'team', monthlySpend: 300, seats: 10 },
      ],
      teamSize: 10,
      useCase: 'coding',
    })
    expect(result.isHighValue).toBe(true)
  })

  test('keeps API direct as optimal', () => {
    const result = runAudit({
      tools: [{ toolName: 'anthropic-api', plan: 'direct', monthlySpend: 150, seats: 1 }],
      teamSize: 5,
      useCase: 'mixed',
    })
    expect(result.tools[0].recommendedAction).toBe('keep')
    expect(result.tools[0].monthlySavings).toBe(0)
  })

  test('calculates total annual savings correctly', () => {
    const result = runAudit({
      tools: [{ toolName: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 }],
      teamSize: 3,
      useCase: 'coding',
    })
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  test('marks audit as optimal when savings < $100/mo', () => {
    const result = runAudit({
      tools: [{ toolName: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'writing',
    })
    expect(result.isAlreadyOptimal).toBe(true)
  })
})
