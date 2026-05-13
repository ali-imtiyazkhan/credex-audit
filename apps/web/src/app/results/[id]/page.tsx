import { notFound } from 'next/navigation'
import { AuditResult } from '@repo/types'
import ToolResultCard from '@/components/ToolResultCard'
import LeadCapture from '@/components/LeadCapture'
import CredexCTA from '@/components/CredexCTA'
import { TrendingDown } from 'lucide-react'
import ShareButton from '@/components/ShareButton'

interface PageProps {
  params: { id: string }
}

async function getAudit(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/audit/${id}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps) {
  const data = await getAudit(params.id)
  if (!data) return {}

  const savings = data.results.totalMonthlySavings

  return {
    title: savings > 0
      ? `I could save $${savings}/mo on AI tools — SpendSmart AI`
      : 'My AI Spend Audit — SpendSmart AI',
    description: `Free AI tool spend audit. ${savings > 0
      ? `Potential savings: $${savings}/mo ($${savings * 12}/year)`
      : 'Already spending optimally on AI tools.'}`,
    openGraph: {
      title: savings > 0
        ? `💰 I could save $${savings}/mo on AI tools`
        : '✅ My AI spend is already optimized',
      description: 'Get your free AI tool spend audit at SpendSmart AI',
      url: `https://yourdomain.com/results/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: savings > 0
        ? `💰 I could save $${savings}/mo on AI tools`
        : '✅ My AI spend is already optimized',
    },
  }
}

export default async function ResultsPage({ params }: PageProps) {
  const data = await getAudit(params.id)
  if (!data) notFound()

  const results: AuditResult = data.results
  const { totalMonthlySavings, totalAnnualSavings, isHighValue, isAlreadyOptimal } = results

  return (
    <main className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-4 border border-blue-500/30">
            <TrendingDown className="w-4 h-4" />
            Your AI Spend Audit
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {isAlreadyOptimal
              ? "You're spending well ✅"
              : `You could save $${totalMonthlySavings.toFixed(0)}/mo`}
          </h1>
          <p className="text-slate-400 text-lg">
            {isAlreadyOptimal
              ? "Your AI tool stack is already optimized. Nice work."
              : `That's $${totalAnnualSavings.toFixed(0)} back in your pocket every year.`}
          </p>
        </div>

        {/* Hero Numbers */}
        {!isAlreadyOptimal && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-center">
              <p className="text-slate-400 text-sm mb-1">Monthly Savings</p>
              <p className="text-green-400 text-4xl font-bold">
                ${totalMonthlySavings.toFixed(0)}
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-center">
              <p className="text-slate-400 text-sm mb-1">Annual Savings</p>
              <p className="text-green-400 text-4xl font-bold">
                ${totalAnnualSavings.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {data.summary && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
              AI Analysis
            </p>
            <p className="text-slate-300 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Credex CTA for high value */}
        {isHighValue && (
          <div className="mb-6">
            <CredexCTA monthlySavings={totalMonthlySavings} />
          </div>
        )}

        {/* Per tool breakdown */}
        <div className="mb-8">
          <h2 className="text-white font-semibold text-xl mb-4">
            Tool Breakdown
          </h2>
          <div className="space-y-4">
            {results.tools.map((tool, i) => (
              <ToolResultCard key={i} result={tool} />
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Share your audit</p>
            <p className="text-slate-400 text-sm">
              Show your team where you stand
            </p>
          </div>
          <ShareButton id={params.id} />
        </div>

        {/* Lead capture */}
        <LeadCapture auditId={data.id} isHighValue={isHighValue} />

        {/* Start over */}
        <div className="text-center mt-8">
          <a href="/audit" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
            ← Run another audit
          </a>
        </div>

      </div>
    </main>
  )
}
