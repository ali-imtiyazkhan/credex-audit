'use client'

import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  monthlySavings: number
}

export default function CredexCTA({ monthlySavings }: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 border border-blue-500">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 rounded-lg p-2">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">
            Save even more with Credex
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            You could save ${monthlySavings}/mo by switching plans — but Credex
            customers save an additional 20-40% by purchasing discounted AI credits
            directly. That&apos;s real money back in your runway.
          </p>
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            onClick={() => window.open('https://credex.rocks', '_blank')}
          >
            Book a Free Credex Consultation
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
