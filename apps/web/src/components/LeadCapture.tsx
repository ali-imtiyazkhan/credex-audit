'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Loader2, Mail } from 'lucide-react'

interface Props {
  auditId: string
  isHighValue: boolean
}

export default function LeadCapture({ auditId, isHighValue }: Props) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // honeypot field — bots fill this, humans don't
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async () => {
    if (!email) return
    if (honeypot) return // bot detected

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, role, auditId }),
      })

      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
        <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
        <h3 className="text-white font-semibold text-lg mb-1">
          Report sent to your inbox!
        </h3>
        <p className="text-slate-400 text-sm">
          {isHighValue
            ? "Our team will reach out shortly to help you capture these savings with Credex."
            : "We'll notify you when new optimizations apply to your stack."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-semibold">
          {isHighValue
            ? 'Get your full report + save even more with Credex'
            : 'Get notified when new optimizations apply'}
        </h3>
      </div>

      <div className="space-y-3">

        {/* Honeypot - hidden from humans */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        />

        <div>
          <Label className="text-slate-300 text-xs mb-1.5 block">
            Work Email *
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-slate-300 text-xs mb-1.5 block">
              Company (optional)
            </Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300 text-xs mb-1.5 block">
              Role (optional)
            </Label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="CTO"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {loading ? (
            <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Sending...</>
          ) : (
            'Send My Report →'
          )}
        </Button>

        <p className="text-slate-500 text-xs text-center">
          No spam. Unsubscribe anytime.
        </p>

      </div>
    </div>
  )
}
