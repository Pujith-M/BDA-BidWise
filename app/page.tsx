'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calculator, Check, CircleHelp, RotateCcw, ShieldCheck } from 'lucide-react'
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
    setActiveConfigurationId(configuration.id)
    setSharedConfigurationName(name)
  }
  const loadConfiguration = (id: string) => {
    if (!id) { setActiveConfigurationId(''); return }
    const item = savedConfigurations.find(configuration => configuration.id === id)
    if (item) { setPrice(item.price); setArea(item.area); setActiveConfigurationId(id) }
  }
  const deleteConfiguration = () => {
    const item = savedConfigurations.find(configuration => configuration.id === activeConfigurationId)
    if (!item || !window.confirm(`Delete “${item.name}”?`)) return
    persist(savedConfigurations.filter(configuration => configuration.id !== activeConfigurationId))
    setActiveConfigurationId('')
  }
  const shareConfiguration = async () => {
    const params = new URLSearchParams({ price, area })
    const active = savedConfigurations.find(item => item.id === activeConfigurationId)
    if (active) params.set('name', active.name)
    const url = `${window.location.origin}${window.location.pathname}?${params}`
    try { await navigator.clipboard.writeText(url) } catch { window.prompt('Copy this shareable link', url) }
    setShareStatus('copied')
    window.setTimeout(() => setShareStatus('idle'), 2200)
  }
  const reset = () => { setPrice(DEFAULT_PRICE); setArea(DEFAULT_AREA); setActiveConfigurationId('') }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
              <Calculator aria-hidden="true" className="size-5" />
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-accent ring-2 ring-card" />
            </div>
            <div><p className="text-[15px] font-bold tracking-tight">BDA BidWise</p><p className="text-xs text-muted-foreground">Auction cost calculator</p></div>
          </div>
          <button type="button" onClick={reset} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RotateCcw aria-hidden="true" className="size-4" /> Reset</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
        <section className="mb-9 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.48fr)] lg:items-end lg:gap-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-foreground"><ShieldCheck aria-hidden="true" className="size-4" /> Plan your bid with confidence</div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.05em] text-primary sm:text-5xl lg:text-6xl">Know your true site cost <span className="text-accent">before you bid.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Estimate the total site value, upfront payment, and registration charges in seconds — with a clear number you can act on.</p>
          </div>
          <div className="hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:block"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">At a glance</p><div className="mt-4 grid grid-cols-2 gap-4"><div><p className="text-2xl font-bold text-primary">25%</p><p className="mt-1 text-xs text-muted-foreground">Upfront BDA payment</p></div><div><p className="text-2xl font-bold text-primary">3</p><p className="mt-1 text-xs text-muted-foreground">Costs included</p></div></div><div className="mt-4 flex items-center gap-2 text-xs font-medium text-accent-foreground"><Check aria-hidden="true" className="size-4" /> Ready for a smarter estimate</div></div>
        </section>

        <SavedConfigurations configurations={savedConfigurations} activeId={activeConfigurationId} sharedName={sharedConfigurationName} shareStatus={shareStatus} onLoad={loadConfiguration} onSave={saveConfiguration} onShare={shareConfiguration} onDelete={deleteConfiguration} />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:gap-8">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="calculator-title">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">Inputs</p><h2 id="calculator-title" className="mt-2 text-2xl font-bold tracking-tight text-primary">Build your estimate</h2></div><div className="rounded-xl bg-muted p-3 text-primary"><CircleHelp aria-hidden="true" className="size-5" /></div></div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Start with the auction rate and plot area. We&apos;ll calculate the rest automatically.</p>
            <div className="mt-7 flex flex-col gap-6"><Field label="Bid price" hint="per square metre" value={price} onChange={setPrice} prefix="₹ / sq m" secondary={formatINR(result.pricePerSqft)} secondaryLabel="Equivalent per sq ft" step={PRICE_STEP} /><Field label="Plot area" hint="site size" value={area} onChange={setArea} prefix="sq m" secondary={formatNumber(result.areaSqft)} secondaryLabel="Equivalent in sq ft" /></div>
            <div className="mt-7 rounded-2xl bg-muted/70 p-4 text-sm text-muted-foreground"><p className="mb-3 font-semibold text-primary">Included in your estimate</p><div className="flex flex-col gap-2"><Info text="25% upfront payment to BDA" /><Info text="Registration and stamp duty" /><Info text="One-time service charges" /></div></div>
          </section>
          <ResultsPanel result={result} price={price} area={area} onPriceChange={setPrice} onAreaChange={setArea} />
        </div>
        <footer className="mt-8 flex items-center justify-between gap-4 border-t border-border/70 pt-5 text-xs text-muted-foreground"><span>Use this estimate as a planning guide.</span><span className="hidden sm:inline">Values are calculated from your current inputs.</span></footer>
      </div>
    </main>
  )
}
