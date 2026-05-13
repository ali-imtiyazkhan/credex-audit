import { UserTool, ToolAuditResult, UseCase } from '@repo/types'
import { PRICING } from './pricing'

export function auditTool(
  tool: UserTool,
  teamSize: number,
  useCase: UseCase
): ToolAuditResult {
  switch (tool.toolName) {
    case 'cursor':
      return auditCursor(tool, teamSize, useCase)
    case 'github-copilot':
      return auditGithubCopilot(tool, teamSize, useCase)
    case 'claude':
      return auditClaude(tool, teamSize, useCase)
    case 'chatgpt':
      return auditChatGPT(tool, teamSize, useCase)
    case 'gemini':
      return auditGemini(tool, teamSize, useCase)
    case 'windsurf':
      return auditWindsurf(tool, teamSize, useCase)
    case 'anthropic-api':
    case 'openai-api':
      return auditAPI(tool)
    default:
      return keepAsIs(tool, 'No specific recommendation available.')
  }
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function auditCursor(tool: UserTool, teamSize: number, useCase: UseCase): ToolAuditResult {
  const expectedSpend = tool.seats * PRICING.cursor.pro.price

  // non-coding use case — cursor is overkill
  if (useCase !== 'coding' && useCase !== 'mixed') {
    const savings = tool.monthlySpend
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'switch',
      recommendedTool: 'claude',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Cursor is built for coding. For ${useCase} use cases, Claude Pro at $20/user is more capable and costs less.`,
    }
  }

  // on business but small team (< 5) — downgrade to pro
  if (tool.plan === 'business' && tool.seats < 5) {
    const currentCost = tool.seats * PRICING.cursor.business.price
    const recommendedCost = tool.seats * PRICING.cursor.pro.price
    const savings = currentCost - recommendedCost
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Cursor Business at $40/user is designed for teams 5+. With ${tool.seats} users, Pro at $20/user gives same core features and saves $${savings}/mo.`,
    }
  }

  // overpaying vs expected
  if (tool.monthlySpend > expectedSpend * 1.1) {
    const savings = tool.monthlySpend - expectedSpend
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'optimize',
      recommendedPlan: tool.plan,
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `You're paying $${tool.monthlySpend}/mo but ${tool.seats} seats on ${tool.plan} should cost $${expectedSpend}/mo. Review your seat count.`,
    }
  }

  return keepAsIs(tool, `Cursor Pro at $20/user is the right plan for a ${tool.seats}-person coding team.`)
}

// ─── GitHub Copilot ───────────────────────────────────────────────────────────

function auditGithubCopilot(tool: UserTool, teamSize: number, useCase: UseCase): ToolAuditResult {

  // non-coding — copilot is useless
  if (useCase !== 'coding' && useCase !== 'mixed') {
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'switch',
      recommendedTool: 'claude',
      monthlySavings: tool.monthlySpend,
      annualSavings: tool.monthlySpend * 12,
      reason: `GitHub Copilot is code-only. For ${useCase} tasks, Claude Pro ($20/user) covers writing, research, and data analysis far better.`,
    }
  }

  // enterprise for small team
  if (tool.plan === 'enterprise' && tool.seats < 10) {
    const savings = tool.seats * (PRICING['github-copilot'].enterprise.price - PRICING['github-copilot'].business.price)
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Business',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Copilot Enterprise ($39/user) is for large orgs needing custom models. Business ($19/user) covers your ${tool.seats}-person team fully. Saves $${savings}/mo.`,
    }
  }

  return keepAsIs(tool, `GitHub Copilot ${tool.plan} is appropriate for your ${tool.seats}-person coding team.`)
}

// ─── Claude ───────────────────────────────────────────────────────────────────

function auditClaude(tool: UserTool, teamSize: number, useCase: UseCase): ToolAuditResult {

  // on Max but small usage
  if (tool.plan === 'max' && tool.seats <= 3) {
    const savings = tool.seats * (PRICING.claude.max.price - PRICING.claude.pro.price)
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Claude Max ($100/user) is for heavy power users. For a ${tool.seats}-person team, Pro ($20/user) provides sufficient usage limits. Saves $${savings}/mo.`,
    }
  }

  // team plan for 1-2 users
  if (tool.plan === 'team' && tool.seats <= 2) {
    const savings = tool.seats * (PRICING.claude.team.price - PRICING.claude.pro.price)
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Claude Team ($30/user) requires minimum 5 users to be cost-effective. With ${tool.seats} users, Pro ($20/user) is identical in features. Saves $${savings}/mo.`,
    }
  }

  return keepAsIs(tool, `Claude ${tool.plan} is well-suited for your ${useCase} use case with ${tool.seats} users.`)
}

// ─── ChatGPT ──────────────────────────────────────────────────────────────────

function auditChatGPT(tool: UserTool, teamSize: number, useCase: UseCase): ToolAuditResult {

  // coding use case — cursor is better
  if (useCase === 'coding') {
    const cursorCost = tool.seats * PRICING.cursor.pro.price
    const savings = tool.monthlySpend - cursorCost
    if (savings > 0) {
      return {
        toolName: tool.toolName,
        currentPlan: tool.plan,
        currentSpend: tool.monthlySpend,
        recommendedAction: 'switch',
        recommendedTool: 'cursor',
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `For coding teams, Cursor Pro ($20/user) has native IDE integration and code-specific features. Saves $${savings}/mo over ChatGPT ${tool.plan}.`,
      }
    }
  }

  // team plan for 1-2 users
  if (tool.plan === 'team' && tool.seats <= 2) {
    const savings = tool.seats * (PRICING.chatgpt.team.price - PRICING.chatgpt.plus.price)
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Plus',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `ChatGPT Team ($30/user) adds admin features for larger teams. With ${tool.seats} users, Plus ($20/user) gives same AI access. Saves $${savings}/mo.`,
    }
  }

  return keepAsIs(tool, `ChatGPT ${tool.plan} is reasonable for your ${useCase} use case.`)
}

// ─── Gemini ───────────────────────────────────────────────────────────────────

function auditGemini(tool: UserTool, teamSize: number, useCase: UseCase): ToolAuditResult {

  if (tool.plan === 'ultra' && useCase !== 'data' && useCase !== 'research') {
    const savings = tool.seats * (PRICING.gemini.ultra.price - PRICING.gemini.pro.price)
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Gemini Ultra ($30/user) is optimized for data/research tasks. For ${useCase}, Pro ($20/user) is sufficient. Saves $${savings}/mo.`,
    }
  }

  return keepAsIs(tool, `Gemini ${tool.plan} is appropriate for your current usage.`)
}

// ─── Windsurf ─────────────────────────────────────────────────────────────────

function auditWindsurf(tool: UserTool, teamSize: number, useCase: UseCase): ToolAuditResult {

  if (useCase !== 'coding' && useCase !== 'mixed') {
    return {
      toolName: tool.toolName,
      currentPlan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'switch',
      recommendedTool: 'claude',
      monthlySavings: tool.monthlySpend,
      annualSavings: tool.monthlySpend * 12,
      reason: `Windsurf is a coding tool. For ${useCase} tasks, Claude Pro ($20/user) is far more capable and likely cheaper.`,
    }
  }

  // compare with cursor
  if (tool.plan === 'team') {
    const cursorCost = tool.seats * PRICING.cursor.pro.price
    const savings = tool.monthlySpend - cursorCost
    if (savings > 0) {
      return {
        toolName: tool.toolName,
        currentPlan: tool.plan,
        currentSpend: tool.monthlySpend,
        recommendedAction: 'switch',
        recommendedTool: 'cursor',
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `Cursor Pro ($20/user) has a larger plugin ecosystem and better context window for your team size. Saves $${savings}/mo.`,
      }
    }
  }

  return keepAsIs(tool, `Windsurf ${tool.plan} is a solid choice for coding with your team size.`)
}

// ─── API Direct ───────────────────────────────────────────────────────────────

function auditAPI(tool: UserTool): ToolAuditResult {
  return keepAsIs(
    tool,
    `API direct usage is already the most cost-efficient option — you only pay for what you use. Monitor your token usage to avoid surprises.`
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function keepAsIs(tool: UserTool, reason: string): ToolAuditResult {
  return {
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: 'keep',
    monthlySavings: 0,
    annualSavings: 0,
    reason,
  }
}
