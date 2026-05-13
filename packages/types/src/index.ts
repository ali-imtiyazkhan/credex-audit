export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

// what user fills in the form
export interface UserTool {
  toolName: ToolName
  plan: string
  monthlySpend: number  // what they actually pay
  seats: number
}

export interface AuditInput {
  tools: UserTool[]
  teamSize: number
  useCase: UseCase
}

// result for a single tool
export interface ToolAuditResult {
  toolName: ToolName
  currentPlan: string
  currentSpend: number
  recommendedAction: 'keep' | 'downgrade' | 'switch' | 'optimize'
  recommendedPlan?: string
  recommendedTool?: ToolName
  monthlySavings: number
  annualSavings: number
  reason: string
}

// final audit result
export interface AuditResult {
  tools: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  isHighValue: boolean        // savings > $500/mo
  isAlreadyOptimal: boolean   // savings < $100/mo
  useCase: UseCase
  teamSize: number
}
