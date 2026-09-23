'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, BarChart3, Calculator, Check, ChevronDown, Download, Info, Link2, Ruler, ShieldCheck, Sparkles, WalletCards } from 'lucide-react'
import { calculateBid, DEFAULT_AREA, DEFAULT_PRICE, formatINR, formatNumber, SQFT_PER_SQM } from '@/lib/calculator'

const presets = [
  { label: '20 × 30 ft', sqft: 600, sqm: 55.7 },
  { label: '30 × 40 ft', sqft: 1200, sqm: 111.48 },
  { label: '40 × 60 ft', sqft: 2400, sqm: 222.96 },
  { label: '50 × 80 ft', sqft: 4000, sqm: 371.61 },
]

function Metric({ label, value, caption, accent }: { label: string; value: string; caption: string; accent: 'emerald' | 'amber' | 'blue' }) {
  const colors = { emerald: 'text-emerald-300', amber: 'text-amber-300', blue: 'text-sky-300' }
  return <article className="metric-card">
    <div className="flex items-center justify-between"><p className="eyebrow">{label}</p><span className={`size-2 rounded-full ${accent === 'emerald' ? 'bg-emerald-400' : accent === 'amber' ? 'bg-amber-400' : 'bg-sky-400'}`} /></div>
    <p className={`mt-4 text-2xl font-semibold tracking-tight tabular-nums ${colors[accent]}`}>{value}</p>
    <p className="mt-2 text-xs text-slate-500">{caption}</p>
  </article>
}

export default function Page() {
  const [area, setArea] = useState(DEFAULT_AREA)
  const [price, setPrice] = useState(DEFAULT_PRICE)
  const [unit, setUnit] = useState<'sqm' | 'sqft'>('sqm')
  const [showFees, setShowFees] = useState(true)
  const [copied, setCopied] = useState(false)
  const result = useMemo(() => calculateBid(price, area), [price, area])
  const fees = result.additionalCharges
  const total = result.total
  const registration = result.stampDuty + result.registrationFee + result.urbanCess + result.urbanSurcharge + result.khataTransfer
  const basePercent = total / result.allInTotal * 100
  const feePercent = registration / result.allInTotal * 100
  const fixedPercent = (result.hiddenCosts + result.incomeTaxTds) / result.allInTotal * 100
  const setAreaFromUnit = (value: string) => setArea(unit === 'sqm' ? value : String((Number(value) / SQFT_PER_SQM).toFixed(2)))
  const displayArea = unit === 'sqm' ? area : String((Number(area) * SQFT_PER_SQM).toFixed(2))
  const changePrice = (amount: number) => setPrice(String(Math.max(0, Number(price) + amount)))
  const copyLink = async () => { await navigator.clipboard?.writeText(`${window.location.origin}?area=${area}&price=${price}`); setCopied(true); setTimeout(() => setCopied(false), 1800) }

  const rows = [
    ['Base Bid Value', `${formatNumber(result.areaSqft)} sq.ft × ${formatINR(result.pricePerSqft)}`, total, 'Area × Bid Rate'],
    ['Stamp Duty', '5.6% of Base Value', result.stampDuty, 'Karnataka stamp duty incl. cess'],
    ['Registration Fee', '1.0% of Base Value', result.registrationFee, 'Registration charge estimate'],
    ['Infra & Surcharge Cess', '2.0% on Stamp Duty', result.urbanCess + result.urbanSurcharge, 'Cess and surcharge estimate'],
    ['BBMP Transfer Fee', '0.1% of Base Value', result.khataTransfer, 'Khatha transfer estimate'],
    ['Legal & Scrutiny Charges', 'Fixed estimate', result.hiddenCosts, 'Professional review allowance'],
  ]

  return <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">
        <div className="flex items-center gap-3"><div className="brand-mark"><Calculator /></div><div><h1 className="text-base font-semibold tracking-tight">BDA BidWise</h1><p className="text-xs text-slate-500">BDA Site Cost & Auction Calculator</p></div></div>
        <div className="flex flex-wrap items-center gap-2"><button className="toolbar-button"><Download /> Export Summary</button><button onClick={copyLink} className="toolbar-button">{copied ? <Check /> : <Link2 />} {copied ? 'Copied' : 'Copy Shareable Link'}</button><div className="unit-switch"><button onClick={() => setUnit('sqft')} className={unit === 'sqft' ? 'active' : ''}>Sq.Ft</button><button onClick={() => setUnit('sqm')} className={unit === 'sqm' ? 'active' : ''}>Sq.M</button></div></div>
      </div>
    </header>
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300"><Sparkles /> Live estimate</div><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-100 sm:text-4xl">Model the true cost of your bid.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Turn auction terms into a clear payment plan with Karnataka statutory charges accounted for.</p></div><div className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="text-emerald-400" /> Estimates update instantly as you bid</div></div>
      <div className="mb-7 flex gap-2 overflow-x-auto pb-1">{presets.map((preset) => <button key={preset.label} onClick={() => setArea(String((preset.sqm).toFixed(2)))} className="preset-chip"><span>{preset.label}</span><span className="text-slate-500">{formatNumber(preset.sqft, 0)} sq.ft</span></button>)}</div>
      <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.65fr)]">
        <aside className="flex flex-col gap-5">
          <section className="panel"><div className="panel-heading"><div><p className="eyebrow">01 / Plot dimensions</p><h3>Site area</h3></div><Ruler className="text-emerald-400" /></div><div className="field-label"><label htmlFor="area">Total area</label><div className="unit-switch inline-flex"><button onClick={() => setUnit('sqft')} className={unit === 'sqft' ? 'active' : ''}>Sq.Ft</button><button onClick={() => setUnit('sqm')} className={unit === 'sqm' ? 'active' : ''}>Sq.M</button></div></div><input id="area" type="number" value={displayArea} onChange={(e) => setAreaFromUnit(e.target.value)} className="big-input" /><p className="helper-text">{unit === 'sqm' ? `${formatNumber(result.areaSqft)} sq.ft` : `${formatNumber(Number(area))} sq.m`} <span>• live conversion</span></p></section>
          <section className="panel"><div className="panel-heading"><div><p className="eyebrow">02 / Auction terms</p><h3>Bid rate</h3></div><WalletCards className="text-amber-300" /></div><label className="field-label" htmlFor="price">Bid rate per Sq.Ft (₹)</label><div className="relative"><span className="input-prefix">₹</span><input id="price" type="number" value={Math.round(result.pricePerSqft)} onChange={(e) => setPrice(String(Number(e.target.value) * SQFT_PER_SQM))} className="big-input pl-9" /></div><input aria-label="Bid rate slider" type="range" min="10000" max="200000" step="500" value={result.pricePerSqft} onChange={(e) => setPrice(String(Number(e.target.value) * SQFT_PER_SQM))} className="mt-6 w-full accent-emerald-400" /><div className="mt-3 grid grid-cols-4 gap-1.5">{[-1000, -500, 500, 1000].map((amount) => <button key={amount} onClick={() => changePrice(amount * SQFT_PER_SQM)} className="stepper">{amount > 0 ? '+' : '−'}₹{Math.abs(amount).toLocaleString('en-IN')}</button>)}</div></section>
          <section className="panel"><button onClick={() => setShowFees(!showFees)} className="flex w-full items-center justify-between text-left"><div><p className="eyebrow">03 / Optional fees</p><h3>Fee overrides</h3></div><ChevronDown className={`transition ${showFees ? 'rotate-180' : ''}`} /></button>{showFees && <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-4">{['Bank loan processing estimate', 'Legal / scrutiny fee', 'BBMP Khatha transfer'].map((item, i) => <label key={item} className="flex items-center justify-between text-sm text-slate-300"><span>{item}</span><input type="checkbox" defaultChecked={i !== 0} className="size-4 accent-emerald-400" /></label>)}</div>}</section>
        </aside>
        <section className="flex flex-col gap-5"><div className="grid gap-4 md:grid-cols-3"><Metric label="Total all-in outflow" value={formatINR(result.allInTotal)} caption="Base bid + statutory charges" accent="emerald" /><Metric label="Immediate 25% deposit" value={formatINR(result.upfront)} caption="Payable within 72 hrs of auction" accent="amber" /><Metric label="Statutory & govt charges" value={formatINR(fees)} caption="Stamp duty, registration & cess" accent="blue" /></div>
          <section className="panel"><div className="flex items-start justify-between"><div><p className="eyebrow">Payment schedule</p><h3>Time-bound outflows</h3></div><BarChart3 className="text-slate-500" /></div><div className="timeline">{[['Day 0', 'EMD / 25% upfront', formatINR(result.upfront)], ['Day 60', 'Remaining 75% balance', formatINR(result.total * .75)], ['Day 90', 'Registration + Khatha', formatINR(registration + result.hiddenCosts)]].map((item, i) => <div className="timeline-item" key={item[0]}><div className={`timeline-dot ${i === 0 ? 'current' : ''}`} /><p className="text-xs font-semibold text-slate-400">{item[0]}</p><p className="mt-2 text-sm font-medium text-slate-200">{item[1]}</p><p className="mt-1 text-xs tabular-nums text-slate-500">{item[2]}</p></div>)}</div></section>
          <section className="panel"><div className="flex items-end justify-between"><div><p className="eyebrow">Cost distribution</p><h3>Where your money goes</h3></div><p className="text-xs text-slate-500">Total {formatINR(result.allInTotal)}</p></div><div className="distribution"><span style={{ width: `${basePercent}%` }} /><span style={{ width: `${feePercent}%` }} /><span style={{ width: `${fixedPercent}%` }} /></div><div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-400"><span><i className="legend emerald" /> Base price {basePercent.toFixed(1)}%</span><span><i className="legend blue" /> Govt fees {feePercent.toFixed(1)}%</span><span><i className="legend amber" /> Other {fixedPercent.toFixed(1)}%</span></div></section>
          <section className="panel overflow-hidden p-0"><div className="flex items-center justify-between border-b border-border/70 px-5 py-5"><div><p className="eyebrow">Cost breakdown</p><h3>Estimated line items</h3></div><button className="icon-button" title="Calculation notes"><Info /></button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Fee item</th><th>Calculation basis</th><th className="text-right">Estimated amount</th></tr></thead><tbody>{rows.map(([name, basis, amount, note]) => <tr key={name}><td className="font-medium text-slate-200"><span className="inline-flex items-center gap-2">{name}<span title={note}><Info className="size-3.5 text-slate-600" /></span></span></td><td className="text-slate-500">{basis}</td><td className="text-right font-medium tabular-nums text-slate-200">{formatINR(Number(amount))}</td></tr>)}</tbody></table></div></section>
        </section>
      </div>
      <footer className="mt-7 flex items-center justify-between border-t border-border/60 pt-5 text-xs text-slate-600"><span>For planning purposes only. Verify applicable charges with BDA / BBMP.</span><span className="flex items-center gap-1">Built for confident bidding <ArrowUpRight /></span></footer>
    </div>
  </main>
}

