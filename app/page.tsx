'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Calculator, Check, CircleHelp, IndianRupee, RotateCcw, Ruler, ShieldCheck } from 'lucide-react'

const SQM_TO_SQFT = 10.7639
const formatINR = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)
const formatNumber = (value: number, digits = 2) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(value || 0)

export default function Page() {
  const [price, setPrice] = useState('50000')
  const [area, setArea] = useState('100')
  const result = useMemo(() => {
    const pricePerSqm = Math.max(0, Number(price) || 0)
    const areaSqm = Math.max(0, Number(area) || 0)
    const total = pricePerSqm * areaSqm
    const incomeTaxTds = total > 5000000 ? total * 0.01 : 0
    const stampDuty = total * 0.05
    const registrationFee = total * 0.02
    const urbanCess = stampDuty * 0.1
    const urbanSurcharge = stampDuty * 0.02
    const khataTransfer = stampDuty * 0.02
    const hiddenCosts = 80000
    const registrationCharges = incomeTaxTds + stampDuty + registrationFee + urbanCess + urbanSurcharge + khataTransfer
    const additionalCharges = registrationCharges + hiddenCosts
    return {
      areaSqft: areaSqm * SQM_TO_SQFT,
      pricePerSqft: pricePerSqm / SQM_TO_SQFT,
      total,
      upfront: total * 0.25,
      incomeTaxTds,
      stampDuty,
      registrationFee,
      urbanCess,
      urbanSurcharge,
      khataTransfer,
      hiddenCosts,
      registrationCharges,
      additionalCharges,
      allInTotal: total + additionalCharges,
    }
  }, [price, area])

  const reset = () => { setPrice('50000'); setArea('100') }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#103c52] text-white shadow-sm"><Calculator size={20} /></div>
            <div><p className="text-[15px] font-bold tracking-tight">BDA BidWise</p><p className="text-xs text-slate-500">Auction cost calculator</p></div>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#103c52]"><RotateCcw size={15} /> Reset</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="mb-10 max-w-2xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#dff3ee] px-3 py-1.5 text-xs font-semibold text-[#12604f]"><ShieldCheck size={14} /> Plan your bid with confidence</div><h1 className="text-4xl font-bold tracking-[-0.04em] text-[#103c52] sm:text-5xl">Know your true site cost<br /><span className="text-[#e68a4a]">before you bid.</span></h1><p className="mt-4 text-base leading-7 text-slate-600">Estimate the total site value, 25% upfront payment, and registration charges in seconds.</p></div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(16,60,82,0.06)] sm:p-8">
            <div className="mb-7 flex items-center justify-between"><div><h2 className="text-lg font-bold text-[#103c52]">Enter auction details</h2><p className="mt-1 text-sm text-slate-500">Use the price quoted per square metre.</p></div><Ruler className="text-[#e68a4a]" size={23} /></div>
            <div className="space-y-5">
              <Field label="Bid price" hint="per sq. metre" value={price} onChange={setPrice} prefix="₹" />
              <Field label="Total site area" hint="square metres" value={area} onChange={setArea} prefix="m²" />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-700">Built-in BDA cost assumptions</p><p className="mt-2 text-xs leading-5 text-slate-500">Includes 1% TDS above ₹50 lakh, 5% stamp duty, 2% registration fee, applicable urban charges, BDA Khata transfer, and ₹80,000 estimated legal / fencing costs.</p></div>
            </div>
            <div className="mt-7 flex items-start gap-2 rounded-xl bg-[#fff8ef] p-3.5 text-xs leading-5 text-[#8c5b2a]"><CircleHelp size={15} className="mt-0.5 shrink-0" /> Registration rates can vary by property and government notification. This is an estimate, not an official quote.</div>
          </section>

          <section className="rounded-3xl bg-[#103c52] p-6 text-white shadow-[0_16px_50px_rgba(16,60,82,0.2)] sm:p-8">
            <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#a9c8d1]">Estimated total site value</p><p className="mt-2 text-4xl font-bold tracking-tight">{formatINR(result.total)}</p></div><div className="rounded-xl bg-white/10 p-3"><IndianRupee size={22} /></div></div>
            <div className="my-8 h-px bg-white/15" />
            <div className="grid gap-4 sm:grid-cols-2"><Metric label="25% upfront to BDA" value={formatINR(result.upfront)} emphasis /><Metric label="Registration & taxes" value={formatINR(result.registrationCharges)} /><Metric label="Area in square feet" value={`${formatNumber(result.areaSqft)} sq ft`} /><Metric label="Rate per square foot" value={`${formatINR(result.pricePerSqft)} / sq ft`} /></div>
            <div className="mt-6 rounded-2xl border border-white/15 p-5"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold text-[#b7d2d9]">Additional cost details</p><span className="text-xs text-[#a9c8d1]">estimate</span></div><div className="grid gap-3 text-sm sm:grid-cols-2"><Charge label="Income tax TDS (1%)" value={result.incomeTaxTds} /><Charge label="Stamp duty (5%)" value={result.stampDuty} /><Charge label="Registration fee (2%)" value={result.registrationFee} /><Charge label="Urban cess (0.5%)" value={result.urbanCess} /><Charge label="Urban surcharge (0.1%)" value={result.urbanSurcharge} /><Charge label="BDA Khata transfer (0.1%)" value={result.khataTransfer} /><Charge label="Legal / fencing estimate" value={result.hiddenCosts} /></div></div>
            <div className="mt-6 rounded-2xl bg-[#1a5269] p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-sm text-[#b7d2d9]">All-in budget including extras</p><p className="mt-1 text-2xl font-bold">{formatINR(result.allInTotal)}</p></div><ArrowRight className="text-[#f0a467]" size={23} /></div></div>
          </section>
        </div>
        <div className="mt-8 grid gap-4 text-sm text-slate-500 sm:grid-cols-3"><Info text="1 m² = 10.7639 sq ft" /><Info text="Upfront payment calculated at 25%" /><Info text="All amounts rounded to nearest rupee" /></div>
      </div>
    </main>
  )
}

function Field({ label, hint, value, onChange, prefix }: { label: string; hint: string; value: string; onChange: (value: string) => void; prefix: string }) {
  return <div><label className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700"><span>{label}</span><span className="font-normal text-slate-400">{hint}</span></label><div className="relative"><input id={label === 'Bid price' ? 'price' : 'area'} aria-label={label} type="number" min="0" step="any" value={value} onChange={e => onChange(e.target.value)} className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-16 text-lg font-semibold outline-none transition focus:border-[#e68a4a] focus:ring-4 focus:ring-orange-100" /><span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">{prefix}</span></div></div>
}

function Charge({ label, value }: { label: string; value: number }) { return <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0"><span className="text-[#d2e0e4]">{label}</span><span className="font-semibold">{formatINR(value)}</span></div> }
function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) { return <div className={emphasis ? 'rounded-2xl bg-[#e68a4a] p-4 text-[#103c52]' : 'rounded-2xl border border-white/15 p-4'}><p className={emphasis ? 'text-xs font-semibold text-[#74451f]' : 'text-xs text-[#a9c8d1]'}>{label}</p><p className="mt-2 text-xl font-bold">{value}</p></div> }
function Info({ text }: { text: string }) { return <div className="flex items-center gap-2"><Check size={15} className="text-[#3b927f]" />{text}</div> }

