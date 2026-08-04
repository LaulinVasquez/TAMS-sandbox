import { StickyNote } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import Card from '../ui/Card'

export default function NotesCard({ initialNotes, selectedWeek }) {
  const [notes, setNotes] = useState(initialNotes)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const sortedNotes = useMemo(() => [...notes].sort((a, b) => new Date(b.date) - new Date(a.date)), [notes])
  const addNote = () => {
    if (!draft.trim()) return
    setNotes(current => [{ id: Date.now(), author: 'You', week: selectedWeek, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), text: draft.trim() }, ...current])
    setDraft('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }
  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); addNote() }
  }
  return <Card className="p-6"><div className="mb-4 flex flex-wrap items-start justify-between gap-2"><div><h2 className="flex items-center gap-2 font-semibold"><StickyNote size={16} className="text-muted" />Supervisor Notes</h2><p className="mt-1 text-xs text-muted">Notes are connected to the week selected above.</p></div><span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Week {selectedWeek}</span></div><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="max-h-72 space-y-3 overflow-y-auto pr-1">{sortedNotes.length ? sortedNotes.map(note => <article key={note.id} className={`rounded-lg border p-4 ${note.week===selectedWeek?'border-blue-200 bg-blue-50/50':'border-slate-100 bg-slate-50'}`}><div className="mb-2 flex flex-wrap justify-between gap-2 text-xs"><div><b className="font-medium text-slate-700">{note.author}</b>{note.week&&<span className="ml-2 text-muted">Week {note.week}</span>}</div><time className="text-muted">{note.date}</time></div><p className="whitespace-pre-wrap leading-relaxed text-slate-600">{note.text}</p></article>) : <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-xs text-muted">No supervisor notes have been added.</p>}</div><div className="rounded-lg border border-slate-100 bg-slate-50 p-4"><label className="mb-2 block text-xs font-medium text-slate-700" htmlFor="performance-note">Add a note for Week {selectedWeek}</label><textarea id="performance-note" ref={inputRef} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={handleKeyDown} placeholder="Add context for another supervisor…" rows="5" className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><p className="mt-1 text-[10px] text-muted">Enter to add · Shift+Enter for a new line</p><button disabled={!draft.trim()} onClick={addNote} className="mt-3 w-full rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">Add note</button></div></div></Card>
}
