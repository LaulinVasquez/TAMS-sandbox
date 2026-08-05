import { CheckCircle2, Search, StickyNote } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Card from '../ui/Card'
import { NOTE_CATEGORIES, NOTE_CATEGORY_STYLES } from '../../data/noteCategories'
import { filterAndSortNotes, formatNoteDate } from '../../utils/notes'

export default function NotesCard({ initialNotes, selectedWeek }) {
  const [notes, setNotes] = useState(initialNotes)
  const [category, setCategory] = useState('')
  const [filter, setFilter] = useState('All Categories')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const visibleNotes = useMemo(() => filterAndSortNotes(notes, { category: filter, query }), [notes, filter, query])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(timer)
  }, [toast])

  const addNote = () => {
    if (!category) { setError('Select a note category.'); return }
    if (!draft.trim()) { setError('Add note details before saving.'); inputRef.current?.focus(); return }
    const now = new Date().toISOString()
    const note = { id: globalThis.crypto?.randomUUID?.() ?? Date.now().toString(), category, author: 'Laurin Vasquez', content: draft.trim(), createdAt: now, updatedAt: now, week: selectedWeek }
    setNotes(current => [note, ...current])
    setDraft('')
    setError('')
    setFilter('All Categories')
    setQuery('')
    setToast('Note added successfully')
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      inputRef.current?.focus()
    })
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      addNote()
    }
  }

  return <Card className="relative overflow-hidden">
    <header className="border-b border-slate-100 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold"><StickyNote size={17} className="text-blue-600" />Supervisor Notes</h2>
          <p className="mt-1 text-xs text-muted">A categorized communication history across the semester</p>
        </div>
        <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">Adding to Week {selectedWeek}</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[220px_1fr]">
        <label className="block"><span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted">Filter notes</span><select value={filter} onChange={event => setFilter(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option>All Categories</option>{NOTE_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted">Search notes</span><span className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"><Search size={15} className="text-muted" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search notes or supervisor names..." className="min-w-0 flex-1 border-0 bg-transparent outline-none" /></span></label>
      </div>
    </header>

    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r" aria-label="Notes history">
        <div className="mb-3 flex items-center justify-between text-xs"><span className="font-medium text-slate-700">{visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}</span><span className="text-muted">Newest first</span></div>
        <div ref={listRef} className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
          {visibleNotes.length ? visibleNotes.map(note => <article key={note.id} className={`rounded-lg border p-4 transition-colors ${note.week === selectedWeek ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-slate-50'}`}>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2"><span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${NOTE_CATEGORY_STYLES[note.category]}`}>{note.category}</span>{note.week && <span className="text-[11px] text-muted">Week {note.week}</span>}</div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs"><b className="font-medium text-slate-700">{note.author}</b><time className="text-muted" dateTime={note.createdAt}>{formatNoteDate(note.createdAt)}</time></div>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-600">{note.content}</p>
          </article>) : <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 px-5 text-center"><span className="mb-3 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-400"><StickyNote size={16} /></span><h3 className="text-sm font-medium">{filter === 'All Categories' ? 'No notes match your search.' : `No notes found for ${filter}.`}</h3><p className="mt-1 text-xs text-muted">Adjust the filter or add a new note.</p></div>}
        </div>
      </section>

      <form className="bg-slate-50 p-6" onSubmit={event => { event.preventDefault(); addNote() }}>
        <h3 className="font-semibold text-slate-800">Add supervisor note</h3>
        <p className="mb-5 mt-1 text-xs text-muted">Category and note details are required.</p>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-slate-700">Category <span className="text-red-500">*</span></span><select value={category} onChange={event => { setCategory(event.target.value); setError('') }} aria-invalid={Boolean(error && !category)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="">Select a category</option>{NOTE_CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="mt-4 block" htmlFor="performance-note"><span className="mb-1.5 block text-xs font-medium text-slate-700">Notes <span className="text-red-500">*</span></span><textarea id="performance-note" ref={inputRef} value={draft} onChange={event => { setDraft(event.target.value); setError('') }} onKeyDown={handleKeyDown} aria-invalid={Boolean(error && !draft.trim())} placeholder="Add context for another supervisor..." rows="7" className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
        {error && <p className="mt-2 text-xs font-medium text-red-600" role="alert">{error}</p>}
        <p className="mt-2 text-[10px] text-muted">Enter to add · Shift+Enter for a new line</p>
        <button type="submit" disabled={!category || !draft.trim()} className="mt-4 w-full rounded bg-blue-600 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">Add note</button>
      </form>
    </div>

    {toast && <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-4 py-3 text-xs font-medium text-emerald-700 shadow-lg" role="status"><CheckCircle2 size={16} />{toast}</div>}
  </Card>
}
