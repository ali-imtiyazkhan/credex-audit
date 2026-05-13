import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Audit not found</h1>
        <p className="text-slate-400 mb-6">
          This audit link may have expired or is invalid.
        </p>
        <Link href="/audit">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Run a new audit →
          </Button>
        </Link>
      </div>
    </main>
  )
}
