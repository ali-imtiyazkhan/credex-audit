'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserTool, UseCase } from '@repo/types'
import { TOOLS, PLANS, USE_CASES } from '@/lib/constants'
import ToolRow from '@/components/ToolRow'
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
import { Plus, Loader2 } from 'lucide-react'

const DEFAULT_TOOL: UserTool = {
  toolName: 'cursor',
  plan: 'pro',
  monthlySpend: 20,
  seats: 1,
}

const STORAGE_KEY = 'credex_audit_form'

export default function AuditPage() {
  const router = useRouter()
  const [tools, setTools] = useState<UserTool[]>([{ ...DEFAULT_TOOL }])
  const [teamSize, setTeamSize] = useState(1)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setTools(parsed.tools || [{ ...DEFAULT_TOOL }])
      setTeamSize(parsed.teamSize || 1)
      setUseCase(parsed.useCase || 'coding')
    }
  }, [])

  // save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, teamSize, useCase }))
  }, [tools, teamSize, useCase])

  const addTool = () => {
    if (tools.length >= 8) return
    setTools([...tools, { ...DEFAULT_TOOL }])
  }

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index))
  }

  const updateTool = (index: number, tool: UserTool) => {
    const updated = [...tools]
    updated[index] = tool
    setTools(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools, teamSize, useCase }),
      })

      if (!res.ok) throw new Error('Failed to run audit')

      const data = await res.json()
      router.push(`/results/${data.publicId}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0)

  return (
    <main className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Audit Your AI Spend
          </h1>
          <p className="text-slate-400">
            Add all the AI tools your team pays for
          </p>
        </div>

        {/* Team Info */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">Team Info</h2>
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Team Size</Label>
              <Input
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Primary Use Case</Label>
              <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {USE_CASES.map((u) => (
                    <SelectItem key={u.value} value={u.value} className="text-white">
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4 mb-6">
          {tools.map((tool, i) => (
            <ToolRow
              key={i}
              tool={tool}
              index={i}
              onChange={updateTool}
              onRemove={removeTool}
              canRemove={tools.length > 1}
            />
          ))}
        </div>

        {/* Add Tool */}
        {tools.length < 8 && (
          <button
            onClick={addTool}
            className="w-full border-2 border-dashed border-slate-700 rounded-xl py-4 text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2 mb-8"
          >
            <Plus className="w-4 h-4" />
            Add another tool
          </button>
        )}

        {/* Summary Bar */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Current Monthly Spend</p>
            <p className="text-white text-2xl font-bold">${totalSpend.toLocaleString()}/mo</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Annual</p>
            <p className="text-slate-300 text-lg">${(totalSpend * 12).toLocaleString()}/yr</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg rounded-xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              Analyzing your spend...
            </>
          ) : (
            'Get My Free Audit →'
          )}
        </Button>

        <p className="text-center text-slate-500 text-sm mt-4">
          No signup required. Results are instant.
        </p>

      </div>
    </main>
  )
}
