import test from 'node:test'
import assert from 'node:assert/strict'
import { filterProfilesByFlag, searchProfiles } from '../src/utils/profiles.js'

const profiles = [
  { id: 'a', name: 'Jordan Park', email: 'jpark@byui.edu', assignments: [{ course: 'ENG 101' }], introCallComplete: true, addedToTeams: true },
  { id: 'b', name: 'Marcus Reed', email: 'mreed@byui.edu', assignments: [{ course: 'BIO 180' }], introCallComplete: false, addedToTeams: false },
  { id: 'c', name: 'Sofia Martinez', email: 'smartinez@byui.edu', assignments: [{ course: 'COMM 130' }], introCallComplete: false, addedToTeams: true },
]

test('searches teaching assistants by name, email, or course', () => {
  assert.deepEqual(searchProfiles(profiles, 'jordan').map(profile => profile.id), ['a'])
  assert.deepEqual(searchProfiles(profiles, 'byui.edu').map(profile => profile.id), ['a', 'b', 'c'])
  assert.deepEqual(searchProfiles(profiles, 'comm').map(profile => profile.id), ['c'])
  assert.deepEqual(searchProfiles(profiles, '   '), [])
})

test('filters teaching assistants by action-board flags', () => {
  assert.deepEqual(filterProfilesByFlag(profiles, 'introCallComplete').map(profile => profile.id), ['a'])
  assert.deepEqual(filterProfilesByFlag(profiles, 'addedToTeams').map(profile => profile.id), ['a', 'c'])
})
