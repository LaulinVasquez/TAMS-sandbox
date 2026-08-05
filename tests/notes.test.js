import test from 'node:test'
import assert from 'node:assert/strict'
import { NOTE_CATEGORIES } from '../src/data/noteCategories.js'
import { filterAndSortNotes, formatNoteDate, isValidNote } from '../src/utils/notes.js'

const notes = [
  { id: '1', category: 'Performance Review', author: 'Laurin Vasquez', content: 'Weekly performance is on track.', createdAt: '2026-06-03T16:00:00.000Z', updatedAt: '2026-06-03T16:00:00.000Z' },
  { id: '2', category: 'Call Summary', author: 'Josh Whitman', content: 'Discussed department expectations.', createdAt: '2026-06-09T16:00:00.000Z', updatedAt: '2026-06-09T16:00:00.000Z' },
  { id: '3', category: 'Hiring Team', author: 'Heather Preece', content: 'Approved for next semester.', createdAt: '2026-06-12T16:00:00.000Z', updatedAt: '2026-06-12T16:00:00.000Z' },
]

test('uses the exact approved note categories', () => {
  assert.deepEqual(NOTE_CATEGORIES, ['Performance Review', 'Personal Outreach 1', 'Personal Outreach 2', 'Intro Calls', 'Call Summary', 'Week 7 Gratitude', 'Hiring Team', 'Other'])
})

test('filters notes by category and sorts newest first', () => {
  const filtered = filterAndSortNotes(notes, { category: 'Call Summary' })
  assert.deepEqual(filtered.map(note => note.id), ['2'])
  assert.deepEqual(filterAndSortNotes(notes).map(note => note.id), ['3', '2', '1'])
})

test('searches note content and author names without case sensitivity', () => {
  assert.deepEqual(filterAndSortNotes(notes, { query: 'LAURIN' }).map(note => note.id), ['1'])
  assert.deepEqual(filterAndSortNotes(notes, { query: 'department' }).map(note => note.id), ['2'])
})

test('validates required note fields and formats compact dates', () => {
  assert.equal(isValidNote(notes[0]), true)
  assert.equal(isValidNote({ ...notes[0], category: 'Custom' }), false)
  assert.equal(isValidNote({ ...notes[0], content: '' }), false)
  assert.equal(formatNoteDate('2026-06-03T16:00:00.000Z'), 'Jun 3, 2026')
})
