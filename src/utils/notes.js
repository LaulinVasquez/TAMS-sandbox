import { NOTE_CATEGORIES } from '../data/noteCategories.js'

export function isValidNote(note) {
  return Boolean(note && NOTE_CATEGORIES.includes(note.category) && note.author?.trim() && note.content?.trim() && note.createdAt)
}

export function filterAndSortNotes(notes, { category = 'All Categories', week = 'all', query = '' } = {}) {
  const normalizedQuery = query.trim().toLowerCase()
  return notes
    .filter(note => category === 'All Categories' || note.category === category)
    .filter(note => week === 'all' || note.week === Number(week))
    .filter(note => !normalizedQuery || `${note.content} ${note.author}`.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function formatNoteDate(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}
