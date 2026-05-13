'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'

// ─── Context ──────────────────────────────────────────────────────────────────

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error('Select components must be used within <Select>')
  return ctx
}

// ─── Select Root ──────────────────────────────────────────────────────────────

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)

  // close on outside click
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

function SelectTrigger({ className, children }: SelectTriggerProps) {
  const { open, setOpen } = useSelectContext()

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900',
        className
      )}
    >
      {children}
      <ChevronDown className={cn('ml-2 h-4 w-4 opacity-50 transition-transform', open && 'rotate-180')} />
    </button>
  )
}

// ─── Value ────────────────────────────────────────────────────────────────────

function SelectValue() {
  const { value } = useSelectContext()
  return <span className="truncate">{value}</span>
}

// ─── Content ──────────────────────────────────────────────────────────────────

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

function SelectContent({ className, children }: SelectContentProps) {
  const { open } = useSelectContext()

  if (!open) return null

  return (
    <div
      className={cn(
        'absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-lg animate-in fade-in-0 zoom-in-95',
        className
      )}
    >
      <div className="max-h-60 overflow-auto p-1">
        {children}
      </div>
    </div>
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface SelectItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

function SelectItem({ value: itemValue, className, children }: SelectItemProps) {
  const { value, onValueChange, setOpen } = useSelectContext()
  const isSelected = value === itemValue

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(itemValue)
        setOpen(false)
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
        isSelected && 'font-medium',
        className
      )}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
      {children}
    </button>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
