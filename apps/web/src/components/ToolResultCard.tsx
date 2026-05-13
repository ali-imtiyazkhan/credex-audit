'use client'

import { ToolAuditResult } from '@repo/types'
import { CheckCircle, AlertCircle, ArrowRight, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  result: ToolAuditResult
}

const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  'github-copilot': 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
}

const ACTION_CONFIG = {
  keep: {
    label: 'Already Optimal ✓',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    icon: <CheckCircle className="w-4 h-4 text-green-400" />,
  },
  downgrade: {
    label: 'Downgrade Plan',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    icon: <TrendingDown className="w-4 h-4 text-yellow-400" />,
  },
  switch: {
    label: 'Switch Tool',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: <ArrowRight className="w-4 h-4 text-blue-400" />,
  },
  optimize: {
    label: 'Optimize Usage',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
  },
}

export default function ToolResultCard({ result }: Props) {
  const config = ACTION_CONFIG[result.recommendedAction]

  return (
    <div className={cn(
      'rounded-xl border p-5 transition-all',
      config.bg
    )}>

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg">
            {TOOL_LABELS[result.toolName]}
          </h3>
          <p className="text-slate-400 text-sm">
            {result.currentPlan} plan · ${result.currentSpend}/mo
          </p>
        </div>
        <div className={cn(
          'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border',
          config.bg, config.color
        )}>
          {config.icon}
          {config.label}
        </div>
      </div>

      {/* Recommendation */}
      {result.recommendedAction !== 'keep' && (
        <div className="flex items-center gap-3 mb-3">
          <div className="text-slate-400 text-sm line-through">
            ${result.currentSpend}/mo
          </div>
          <ArrowRight className="w-3 h-3 text-slate-500" />
          <div className="text-green-400 text-sm font-medium">
            ${(result.currentSpend - result.monthlySavings).toFixed(0)}/mo
          </div>
          {result.recommendedPlan && (
            <span className="text-slate-400 text-xs">
              ({result.recommendedPlan} plan)
            </span>
          )}
          {result.recommendedTool && (
            <span className="text-slate-400 text-xs">
              (Switch to {TOOL_LABELS[result.recommendedTool]})
            </span>
          )}
        </div>
      )}

      {/* Reason */}
      <p className="text-slate-300 text-sm leading-relaxed">
        {result.reason}
      </p>

      {/* Savings badge */}
      {result.monthlySavings > 0 && (
        <div className="mt-3 flex items-center gap-4">
          <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
            Save ${result.monthlySavings}/mo
          </div>
          <div className="text-slate-500 text-xs">
            ${result.annualSavings}/year
          </div>
        </div>
      )}

    </div>
  )
}
