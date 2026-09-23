'use client'

import { Check, Link, Save, Trash2 } from 'lucide-react'
import type { SavedConfiguration } from '@/lib/saved-configurations'

type Props = { configurations: SavedConfiguration[]; activeId: string; sharedName: string; shareStatus: 'idle' | 'copied'; onLoad: (id: string) => void; onSave: () => void; onShare: () => void; onDelete: () => void }

export function SavedConfigurations({ configurations, activeId, sharedName, shareStatus, onLoad, onSave, onShare, onDelete }: Props) {
  return <section className="mb-6" aria-labelledby="saved-configurations-title">
    <div className="mb-2 flex items-center justify-between gap-3 px-1">
      <div className="flex min-w-0 items-center gap-2">
        <h2 id="saved-configurations-title" className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Site configurations</h2>
        {sharedName ? <span className="truncate text-xs text-slate-500">Shared: {sharedName}</span> : null}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button type="button" onClick={onSave} aria-label="Save current site configuration" title="Save current configuration" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-sm transition hover:border-[#bfe2d8] hover:bg-[#f1faf7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"><Save size={15} /></button>
        <button type="button" onClick={onShare} aria-label={shareStatus === 'copied' ? 'Share link copied' : 'Share current site configuration'} title={shareStatus === 'copied' ? 'Link copied' : 'Share configuration'} className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#12604f] shadow-sm transition hover:border-[#bfe2d8] hover:bg-[#f1faf7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100">{shareStatus === 'copied' ? <Check size={15} /> : <Link size={15} />}</button>
        <button type="button" onClick={onDelete} disabled={!activeId} aria-label="Delete selected saved configuration" title="Delete selected configuration" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={15} /></button>
      </div>
    </div>
    <div className="flex min-w-0 items-end gap-1 overflow-x-auto border-b border-slate-200" role="tablist" aria-label="Site configurations">
      <button type="button" role="tab" aria-selected={!activeId} onClick={() => onLoad('')} className={`shrink-0 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 ${!activeId ? 'border border-b-white border-slate-200 bg-white text-primary -mb-px' : 'text-slate-500 hover:bg-white/70 hover:text-primary'}`}>Current estimate</button>
      {configurations.map(configuration => <button type="button" role="tab" aria-selected={activeId === configuration.id} key={configuration.id} onClick={() => onLoad(configuration.id)} className={`max-w-52 shrink-0 truncate rounded-t-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 ${activeId === configuration.id ? 'border border-b-white border-slate-200 bg-white text-primary -mb-px' : 'text-slate-500 hover:bg-white/70 hover:text-primary'}`} title={configuration.name}>{configuration.name}</button>)}
    </div>
  </section>
}
