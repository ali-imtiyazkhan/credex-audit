import Link from 'next/link'
import { ArrowRight, DollarSign, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <span className="text-white font-bold text-xl">⚡ SpendSmart AI</span>
        <Link href="/audit">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
            Start Free Audit →
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="text-center px-4 pt-20 pb-16 max-w-4xl mx-auto">
        <div className="inline-block bg-blue-500/20 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-500/30">
          Free • No signup required • Instant results
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Stop overpaying for
          <span className="text-blue-400"> AI tools</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Get an instant audit of your AI tool spending.
          Find out exactly where you&apos;re wasting money and how much you can save.
        </p>
        <Link href="/audit">
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-xl">
            Audit My AI Spend Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <p className="text-slate-400 text-sm mt-4">
          Takes 2 minutes. No credit card needed.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: <DollarSign className="w-6 h-6 text-green-400" />,
            title: 'Find Hidden Savings',
            desc: 'See exactly which plans are costing you more than they should.',
          },
          {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: 'Instant Results',
            desc: 'No waiting. Your audit is generated in seconds.',
          },
          {
            icon: <Shield className="w-6 h-6 text-blue-400" />,
            title: 'Honest Advice',
            desc: "If you're spending well, we'll tell you that too.",
          },
        ].map((f, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-slate-400">{f.desc}</p>
          </div>
        ))}
      </section>

    </main>
  )
}
