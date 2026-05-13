'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ShareButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/results/${id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="border-slate-600 text-slate-300 hover:bg-slate-700"
    >
      {copied ? (
        <><Check className="w-4 h-4 mr-2 text-green-400" /> Copied!</>
      ) : (
        <><Share2 className="w-4 h-4 mr-2" /> Copy Link</>
      )}
    </Button>
  )
}
