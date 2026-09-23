'use client'

import { Minus, Plus } from 'lucide-react'
import { formatINR, sanitizeNumericInput } from '@/lib/calculator'

type FieldProps = { label: string; hint: string; value: string; onChange: (value: string) => void; prefix: string; secondary: string; secondaryLabel: string; step?: number }

export function Field({ label, hint, value, onChange, prefix, secondary, secondaryLabel, step }: FieldProps) {
  const inputId = label === 'Bid price' ? 'price' : 'area'
  const updateByStep = (direction: 1 | -1) => onChange(String(Math.max(0, (Number(value) || 0) + direction * (step ?? 1))))

  return <div>
    <label htmlFor={inputId} className="mb-2 flex items-center justify-between text-sm font-semibold text-foreground"><span>{label}</span><span className="font-normal text-slate-400">{hint}</span></label>
    <div className="flex gap-2">
      {step ? <div className="flex shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-sm" aria-label={`${label} controls`}>
        <button type="button" onClick={() => updateByStep(-1)} disabled={!Number(value)} aria-label={`Decrease ${label} by ${formatINR(step)}`} className="flex size-14 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-[#103c52] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40"><Minus size={18} /></button>
        <div className="w-px bg-slate-200" />
        <button type="button" onClick={() => updateByStep(1)} aria-label={`Increase ${label} by ${formatINR(step)}`} className="flex size-14 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-[#103c52] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"><Plus size={18} /></button>
      </div> : null}
      <div className="relative min-w-0 flex-1"><input id={inputId} aria-label={label} role="spinbutton" inputMode="decimal" type="text" min="0" value={value} onChange={event => onChange(sanitizeNumericInput(event.currentTarget.value))} className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-20 text-lg font-semibold outline-none transition focus:border-[#e68a4a] focus:ring-4 focus:ring-orange-100" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">{prefix}</span></div>
    </div>
    {step ? <p className="mt-2 text-xs text-slate-500">Use + or − to adjust by {formatINR(step)}.</p> : null}
    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-[#bfe2d8] bg-[#f1faf7] px-3 py-2 text-xs"><span className="font-medium text-[#12604f]">{secondaryLabel}</span><span className="font-bold text-[#103c52]">{secondary}</span></div>
  </div>
}

export function Charge({ label, value, format }: { label: string; value: number; format: (value: number) => string }) { return <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0"><span className="text-[#d2e0e4]">{label}</span><span className="font-semibold">{format(value)}</span></div> }
export function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) { return <div className={emphasis ? 'rounded-2xl bg-[#e68a4a] p-4 text-[#103c52]' : 'rounded-2xl border border-white/15 p-4'}><p className={emphasis ? 'text-xs font-semibold text-[#74451f]' : 'text-xs text-[#a9c8d1]'}>{label}</p><p className="mt-2 text-xl font-bold">{value}</p></div> }
export function Info({ text }: { text: string }) { return <div className="flex items-center gap-2"><span className="text-[#3b927f]">✓</span><span>{text}</span></div> }
