import test from 'node:test'
import assert from 'node:assert/strict'
import { filterProfilesByTrainingStatus, getOverdueTrainingModules, getTrainingProgress, getTrainingStatus } from '../src/utils/training.js'

test('calculates training progress and status labels', () => {
  const completion = { start: true, academicPartnership: false, generalNotes: false }
  assert.deepEqual(getTrainingProgress(completion), { completed: 1, total: 3, percentage: 33 })
  assert.equal(getTrainingStatus(completion), 'In progress')
  assert.equal(getTrainingStatus({ start: true, academicPartnership: true, generalNotes: true }), 'Complete')
  assert.equal(getTrainingStatus({}), 'Not started')
})

test('filters profiles by training status', () => {
  const profiles = [
    { id: 'a', trainingCompletion: { start: true, academicPartnership: true, generalNotes: true } },
    { id: 'b', trainingCompletion: { start: false, academicPartnership: false, generalNotes: false } },
    { id: 'c', trainingCompletion: { start: true, academicPartnership: false, generalNotes: false } },
  ]
  assert.deepEqual(filterProfilesByTrainingStatus(profiles, 'Complete').map(profile => profile.id), ['a'])
  assert.deepEqual(filterProfilesByTrainingStatus(profiles, 'Not started').map(profile => profile.id), ['b'])
})

test('identifies incomplete training modules after their deadlines', () => {
  const completion = { start: false, academicPartnership: true, generalNotes: false }
  assert.deepEqual(getOverdueTrainingModules(completion, new Date('2026-08-18T12:00:00')).map(module => module.id), ['start'])
  assert.deepEqual(getOverdueTrainingModules(completion, new Date('2026-08-22T12:00:00')).map(module => module.id), ['start', 'generalNotes'])
  assert.equal(getOverdueTrainingModules({ start: true, academicPartnership: true, generalNotes: true }, new Date('2026-09-01T12:00:00')).length, 0)
})
