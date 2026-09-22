'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calculator, Check, CircleHelp, Ruler, RotateCcw, ShieldCheck } from 'lucide-react'
import { Field, Info } from '@/components/bidwise/field'
import { ResultsPanel } from '@/components/bidwise/results-panel'
import { SavedConfigurations } from '@/components/bidwise/saved-configurations'
import { calculateBid, DEFAULT_AREA, DEFAULT_PRICE, formatINR, formatNumber, PRICE_STEP } from '@/lib/calculator'
import { readSavedConfigurations, writeSavedConfigurations, type SavedConfiguration } from '@/lib/saved-configurations'

export default function Page() {
  const [price, setPrice] = useState(DEFAULT_PRICE)
  const [area, setArea] = useState(DEFAULT_AREA)
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>([])
  const [activeConfigurationId, setActiveConfigurationId] = useState('')
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const [sharedConfigurationName, setSharedConfigurationName] = useState('')
  const result = useMemo(() => calculateBid(price, area), [price, area])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedPrice = params.get('price')
    const sharedArea = params.get('area')
    const sharedName = params.get('name')?.trim() ?? ''
    if (sharedPrice && Number.isFinite(Number(sharedPrice)) && Number(sharedPrice) >= 0) setPrice(sharedPrice)
    if (sharedArea && Number.isFinite(Number(sharedArea)) && Number(sharedArea) >= 0) setArea(sharedArea)
    if (sharedName) setSharedConfigurationName(sharedName)
    setSavedConfigurations(readSavedConfigurations())
  }, [])

  const persist = (next: SavedConfiguration[]) => { setSavedConfigurations(next); writeSavedConfigurations(next) }
  const saveConfiguration = () => {
    const name = window.prompt('Name this site configuration', sharedConfigurationName || undefined)?.trim()
    if (!name) return
    const existing = savedConfigurations.find(item => item.name.toLowerCase() === name.toLowerCase())
    const configuration = { id: existing?.id ?? crypto.randomUUID(), name, price, area }
    persist(existing ? savedConfigurations.map(item => item.id === existing.id ? configuration : item) : [...savedConfigurations, configuration])
    setActiveConfigurationId(configuration.id); setSharedConfigurationName(name)
  }
  const loadConfiguration = (id: string) => { const item = savedConfigurations.find(configuration => configuration.id === id); if (item) { setPrice(item.price); setArea(item.area); setActiveConfigurationId(id) } }
  const deleteConfiguration = () => { const item = savedConfigurations.find(configuration => configuration.id === activeConfigurationId); if (!item || !window.confirm(`Delete “${item.name}”?`)) return; persist(savedConfigurations.filter(configuration => configuration.id !== activeConfigurationId)); setActiveConfigurationId('') }
  const shareConfiguration = async () => {
    const params = new URLSearchParams({ price, area })
    const active = savedConfigurations.find(item => item.id === activeConfigurationId)
    if (active) params.set('name', active.name)
    const url = `${window.location.origin}${window.location.pathname}?${params}`
    try { await navigator.clipboard.writeText(url) } catch { window.prompt('Copy this shareable link', url) }
    setShareStatus('copied'); window.setTimeout(() => setShareStatus('idle'), 2200)
  }

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#fff4e8_0,_transparent_34%),linear-gradient(135deg,_#f5f7fb_0%,_#eef5f4_100%)] text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-5 lg:px-8"><div className="flex items-center gap-3"><div className="relative flex size-10 items-center justify-center rounded-xl bg-[#103c52] text-white shadow-[0_8px_18px_rgba(16,60,82,0.2)]"><Calculator size={20} /><span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[#e68a4a] ring-2 ring-white" /></div><div><p className="text-[15px] font-bold tracking-tight">BDA BidWise</p><p className="text-xs text-slate-500">Auction cost calculator</p></div></div><button onClick={() => { setPrice(DEFAULT_PRICE); setArea(DEFAULT_AREA) }} className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#103c52]"><RotateCcw size={15} /> Reset</button></div></header><div className="mx-auto max-w-6xl px-4 py-4 sm:px-5 sm:py-10 lg:px-8 lg:py-14"><div className="mb-5 hidden max-w-2xl sm:block sm:mb-10"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#bfe2d8] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#12604f] shadow-sm"><ShieldCheck size={14} /> Plan your bid with confidence</div><h1 className="text-4xl font-bold tracking-[-0.04em] text-[#103c52] sm:text-5xl">Know your true site cost<br /><span className="text-[#e68a4a]">before you bid.</span></h1><p className="mt-4 text-base leading-7 text-slate-600">Estimate the total site value, 25% upfront payment, and registration charges in seconds.</p></div><SavedConfigurations configurations={savedConfigurations} activeId={activeConfigurationId} sharedName={sharedConfigurationName} shareStatus={shareStatus} onLoad={loadConfiguration} onSave={saveConfiguration} onShare={shareConfiguration} onDelete={deleteConfiguration} /><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(16,60,82,0.06)] sm:p-8"><div className="mb-7 flex items-center justify-between"><div><h2 className="text-lg font-bold text-[#103c52]">Enter auction details</h2><p className="mt-1 text-sm text-slate-500">Enter values in square metres; we&apos;ll show familiar square feet in the estimate.</p></div><Ruler className="text-[#e68a4a]" size={23} /></div><div className="flex flex-col gap-5"><Field label="Bid price" hint="₹ per sq m" value={price} onChange={setPrice} prefix="₹ / sq m" secondary={`${formatINR(result.pricePerSqft)} / sq ft`} secondaryLabel="Displayed for quick reference" step={PRICE_STEP} /><Field label="Total site area" hint="in square metres" value={area} onChange={setArea} prefix="sq m" secondary={`${formatNumber(result.areaSqft)} sq ft`} secondaryLabel="Displayed for quick reference" /><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-700">Built-in BDA cost assumptions</p><p className="mt-2 text-xs leading-5 text-slate-500">Includes 1% income-tax TDS, 5% stamp duty, 2% registration fee, applicable urban charges, BDA Khata transfer, and ₹80,000 estimated legal / fencing costs.</p></div></div><div className="mt-7 flex items-start gap-2 rounded-xl bg-[#fff8ef] p-3.5 text-xs leading-5 text-[#8c5b2a]"><CircleHelp size={15} className="mt-0.5 shrink-0" /> Registration rates can vary by property and government notification. This is an estimate, not an official quote.</div></section><ResultsPanel result={result} /></div><div className="mt-8 grid gap-4 text-sm text-slate-500 sm:grid-cols-3"><Info text="Inputs use square metres; estimates show square feet" /><Info text="Upfront payment calculated at 25%" /><Info text="All amounts rounded to nearest rupee" /></div></div></main>
}
