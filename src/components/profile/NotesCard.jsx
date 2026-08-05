import { CheckCircle2, Plus, Search, StickyNote, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Card from '../ui/Card'
import { NOTE_CATEGORIES, NOTE_CATEGORY_STYLES } from '../../data/noteCategories'
import { filterAndSortNotes, formatNoteDate } from '../../utils/notes'

export default function NotesCard({ initialNotes, selectedWeek }) {
  const [notes, setNotes] = useState(initialNotes)
  const [composerOpen, setComposerOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [filter, setFilter] = useState('All Categories')
  const [weekFilter, setWeekFilter] = useState(String(selectedWeek))
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const visibleNotes = useMemo(() => filterAndSortNotes(notes, { category: filter, week: weekFilter, query }), [notes, filter, weekFilter, query])
  const hasFilters = filter !== 'All Categories' || weekFilter !== String(selectedWeek) || Boolean(query.trim())

  useEffect(() => setWeekFilter(String(selectedWeek)), [selectedWeek])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(timer)
  }, [toast])

  const openComposer = () => {
    setComposerOpen(true)
    setError('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const addNote = () => {
    if (!category) { setError('Choose a category before adding this note.'); return }
    if (!draft.trim()) { setError('Write a note before saving.'); inputRef.current?.focus(); return }
    const now = new Date().toISOString()
    const note = { id: globalThis.crypto?.randomUUID?.() ?? Date.now().toString(), category, author: 'Laurin Vasquez', content: draft.trim(), createdAt: now, updatedAt: now, week: selectedWeek }
    setNotes(current => [note, ...current])
    setDraft('')
    setError('')
    setComposerOpen(false)
    setFilter('All Categories')
    setQuery('')
    setToast('Note added successfully')
    requestAnimationFrame(() => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      addNote()
    }
  }

  const clearFilters = () => { setFilter('All Categories'); setWeekFilter(String(selectedWeek)); setQuery('') }

  return <Card className="relative overflow-hidden">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
      <div>
        <h2 className="flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><StickyNote size={16} /></span>Supervisor Notes</h2>
        <p className="ml-10 mt-0.5 text-xs text-muted">Searchable communication history for this TA</p>
      </div>
      <button type="button" onClick={composerOpen ? () => setComposerOpen(false) : openComposer} className={`flex h-9 items-center gap-2 rounded-md px-3 text-xs font-medium transition ${composerOpen ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{composerOpen ? <><X size={15} />Close</> : <><Plus size={15} />Add note</>}</button>
    </header>

    {composerOpen && <form className="border-b border-slate-200 bg-slate-100/70 p-5 backdrop-blur-md dark:bg-slate-800/60 sm:p-6" onSubmit={event => { event.preventDefault(); addNote() }}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold text-slate-800">New supervisor note</h3><p className="mt-1 text-xs text-muted">This note will be associated with Week {selectedWeek}.</p></div><span className="rounded bg-white px-2.5 py-1 text-[11px] font-medium text-blue-700 shadow-sm">Week {selectedWeek}</span></div>
      <div className="grid items-end gap-4 lg:grid-cols-[230px_minmax(300px,1fr)_120px]">
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-slate-700">Category <span className="text-red-500">*</span></span><select value={category} onChange={event => { setCategory(event.target.value); setError('') }} aria-invalid={Boolean(error && !category)} className="h-10 w-full rounded-md border border-slate-300 bg-white/60 px-3 backdrop-blur outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-900/60"><option value="">Choose category</option>{NOTE_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="block" htmlFor="performance-note"><span className="mb-1.5 block text-xs font-medium text-slate-700">Note <span className="text-red-500">*</span></span><textarea id="performance-note" ref={inputRef} value={draft} onChange={event => { setDraft(event.target.value); setError('') }} onKeyDown={handleKeyDown} aria-invalid={Boolean(error && !draft.trim())} placeholder="What should another supervisor know?" rows="3" className="block h-[78px] w-full resize-none rounded-md border border-slate-300 bg-white/60 px-3 py-2 backdrop-blur outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-900/60" /></label>
        <button type="submit" className="h-10 rounded bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700">Save note</button>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><p className="text-[10px] text-muted">Enter to save · Shift+Enter for a new line</p>{error && <p className="text-xs font-medium text-red-600" role="alert">{error}</p>}</div>
    </form>}

    <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
      <div className="grid items-end gap-3 md:grid-cols-[160px_190px_minmax(220px,1fr)_auto]">
        <label className="block"><span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-muted">Week</span><select value={weekFilter} onChange={event => setWeekFilter(event.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="all">All weeks</option>{Array.from({ length: 14 }, (_, index) => <option value={String(index + 1)} key={index + 1}>Week {index + 1}</option>)}</select></label>
        <label className="block"><span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-muted">Category</span><select value={filter} onChange={event => setFilter(event.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option>All Categories</option>{NOTE_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="block"><span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-muted">Search</span><span className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"><Search size={14} className="text-muted" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search note text or supervisor..." className="min-w-0 flex-1 border-0 bg-transparent text-xs outline-none" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="text-muted hover:text-slate-700"><X size={13} /></button>}</span></label>
        <div className="flex h-9 items-center justify-between gap-3 md:justify-end"><span className="whitespace-nowrap text-xs text-muted">{visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}</span>{hasFilters && <button type="button" onClick={clearFilters} className="whitespace-nowrap text-xs font-medium text-blue-600 hover:text-blue-700">Clear filters</button>}</div>
      </div>
    </div>

    <section className="p-5 sm:p-6" aria-label="Notes history">
      <div ref={listRef} className="max-h-[520px] overflow-y-auto pr-1">
        {visibleNotes.length ? <div className="space-y-3">{visibleNotes.map(note => <article key={note.id} className={`grid gap-3 rounded-lg border p-4 shadow-sm backdrop-blur-md transition-all hover:-translate-y-px hover:shadow sm:grid-cols-[170px_minmax(0,1fr)] sm:p-5 ${note.week === selectedWeek ? 'border-blue-200 bg-blue-50/40 dark:bg-blue-950/30' : 'border-white/70 bg-white/55 dark:border-slate-700 dark:bg-slate-800/55'}`}>
          <div><span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${NOTE_CATEGORY_STYLES[note.category]}`}>{note.category}</span>{note.week && <span className="mt-2 block text-[11px] text-muted">Week {note.week}</span>}</div>
          <div className="min-w-0"><div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs"><b className="font-medium text-slate-700">{note.author}</b><time className="text-muted" dateTime={note.createdAt}>{formatNoteDate(note.createdAt)}</time></div><p className="whitespace-pre-wrap leading-relaxed text-slate-600">{note.content}</p></div>
        </article>)}</div> : <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/30 px-5 text-center backdrop-blur"><span className="mb-3 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-400"><StickyNote size={17} /></span><h3 className="text-sm font-medium">{filter !== 'All Categories' ? `No notes found for ${filter}.` : weekFilter !== 'all' ? `No notes found for Week ${weekFilter}.` : 'No notes match your search.'}</h3><p className="mt-1 text-xs text-muted">Choose another week or category, or add a new note.</p>{hasFilters && <button type="button" onClick={clearFilters} className="mt-3 text-xs font-medium text-blue-600">Reset to current week</button>}</div>}
      </div>
    </section>

    {toast && <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-4 py-3 text-xs font-medium text-emerald-700 shadow-lg" role="status"><CheckCircle2 size={16} />{toast}</div>}
  </Card>
}
