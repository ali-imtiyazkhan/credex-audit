'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AuditResult } from '@repo/types'
import ToolResultCard from '@/components/ToolResultCard'
import LeadCapture from '@/components/LeadCapture'
import { Loader2, ArrowLeft, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ResultsPage() {
  const params = useParams()
  const publicId = params.publicId as string

  const [audit, setAudit] = useState<AuditResult | null>(null)
  const [auditId, setAuditId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit/${publicId}`)
        if (!res.ok) throw new Error('Audit not found')
        const data = await res.json()
        setAudit(data.results)
        setAuditId(data.id)
      } catch {
        setError('Audit not found or has expired.')
      } finally {
        setLoading(false)
      }
    }
    fetchAudit()
  }, [publicId])

  const handleShare = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your audit results...</p>
        </div>
      </main>
    )
  }

  if (error || !audit) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Link href="/audit">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Run a New Audit
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/audit" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            New Audit
          </Link>
          <Button
            variant="outline"
            onClick={handleShare}
            className="text-slate-300 border-slate-600 hover:bg-slate-800"
          >
            <Share2 className="mr-2 w-4 h-4" />
            {copied ? 'Copied!' : 'Share Results'}
          </Button>
        </div>

        {/* Summary */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Your AI Spend Audit
          </h1>

          {audit.isAlreadyOptimal ? (
            <div className="inline-block bg-green-500/20 text-green-400 text-sm px-4 py-1.5 rounded-full border border-green-500/30 mb-4">
              ✓ Your stack is well-optimized!
            </div>
          ) : (
            <div className="inline-block bg-blue-500/20 text-blue-300 text-sm px-4 py-1.5 rounded-full border border-blue-500/30 mb-4">
              We found potential savings
            </div>
          )}

          {/* Savings hero */}
          {audit.totalMonthlySavings > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mt-4">
              <p className="text-slate-400 text-sm mb-1">Potential Savings</p>
              <p className="text-5xl font-bold text-green-400 mb-1">
                ${audit.totalMonthlySavings.toLocaleString()}/mo
              </p>
              <p className="text-slate-400 text-lg">
                ${audit.totalAnnualSavings.toLocaleString()}/year
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400">
            <span>{audit.tools.length} tool{audit.tools.length !== 1 ? 's' : ''} analyzed</span>
            <span>·</span>
            <span>Team of {audit.teamSize}</span>
            <span>·</span>
            <span className="capitalize">{audit.useCase} use case</span>
          </div>
        </div>

        {/* Tool Results */}
        <div className="space-y-4 mb-10">
          <h2 className="text-white font-semibold text-lg">Tool-by-Tool Breakdown</h2>
          {audit.tools.map((result, i) => (
            <ToolResultCard key={i} result={result} />
          ))}
        </div>

        {/* Lead Capture */}
        <LeadCapture auditId={auditId} isHighValue={audit.isHighValue} />

        {/* Footer CTA */}
        <div className="text-center mt-10">
          <Link href="/audit">
            <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-800">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Run Another Audit
            </Button>
          </Link>
        </div>

      </div>
    </main>
  )
}
