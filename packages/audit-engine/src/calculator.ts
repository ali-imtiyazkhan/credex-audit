import { AuditInput, AuditResult, ToolAuditResult } from '@repo/types'
import { auditTool } from './rules'

export function runAudit(input: AuditInput): AuditResult {
  const toolResults = input.tools.map(tool =>
    auditTool(tool, input.teamSize, input.useCase)
  )

  const totalMonthlySavings = toolResults.reduce(
    (sum: number, r: ToolAuditResult) => sum + r.monthlySavings, 0
  )

  return {
    tools: toolResults,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isHighValue: totalMonthlySavings > 500,
    isAlreadyOptimal: totalMonthlySavings < 100,
    useCase: input.useCase,
    teamSize: input.teamSize,
  }
}
