'use client'

import { UserTool, ToolName } from '@repo/types'
import { TOOLS, PLANS } from '@/lib/constants'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  tool: UserTool
  index: number
  onChange: (index: number, tool: UserTool) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export default function ToolRow({ tool, index, onChange, onRemove, canRemove }: Props) {
  const plans = PLANS[tool.toolName] || []

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">Tool #{index + 1}</span>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Tool Name */}
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">Tool</Label>
          <Select
            value={tool.toolName}
            onValueChange={(val) =>
              onChange(index, {
                ...tool,
                toolName: val as ToolName,
                plan: PLANS[val as ToolName][0].value,
              })
            }
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {TOOLS.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-white hover:bg-slate-700">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plan */}
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">Plan</Label>
          <Select
            value={tool.plan}
            onValueChange={(val) => onChange(index, { ...tool, plan: val })}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {plans.map((p) => (
                <SelectItem key={p.value} value={p.value} className="text-white hover:bg-slate-700">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monthly Spend */}
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">Monthly Spend ($)</Label>
          <Input
            type="number"
            min={0}
            value={tool.monthlySpend}
            onChange={(e) =>
              onChange(index, { ...tool, monthlySpend: Number(e.target.value) })
            }
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="0"
          />
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">Seats</Label>
          <Input
            type="number"
            min={1}
            value={tool.seats}
            onChange={(e) =>
              onChange(index, { ...tool, seats: Number(e.target.value) })
            }
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="1"
          />
        </div>

      </div>
    </div>
  )
}
