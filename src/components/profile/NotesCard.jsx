import { StickyNote } from 'lucide-react'
import { useState } from 'react'
import Card from '../ui/Card'

export default function NotesCard({ initialNotes }) {
  const [notes, setNotes] = useState(initialNotes)
  const [draft, setDraft] = useState('')
  const addNote = () => {
    if (!draft.trim()) return
    setNotes(current => [...current, { id: Date.now(), author: 'You', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), text: draft.trim() }])
    setDraft('')
  }
  return <Card className="flex h-full flex-col p-6"><h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><StickyNote size={16} className="text-muted" />Notes</h2><div className="mb-4 max-h-56 flex-1 space-y-3 overflow-y-auto">{notes.map(note => <article key={note.id} className="rounded-md border border-slate-100 bg-slate-50 p-3"><div className="mb-1 flex justify-between text-xs"><b className="font-medium text-slate-700">{note.author}</b><span className="text-muted">{note.date}</span></div><p className="leading-snug text-slate-600">{note.text}</p></article>)}</div><div className="border-t border-slate-100 pt-3"><textarea aria-label="New note" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Add a note..." rows="2" className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><div className="mt-2 flex justify-end"><button disabled={!draft.trim()} onClick={addNote} className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40">Add Note</button></div></div></Card>
}
