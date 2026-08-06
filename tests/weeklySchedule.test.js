import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateWeeklyProgress, filterTasksForSupervisor, getCurrentSemesterWeek, getFullyCompletedWeeks, getWeekDateRange, isWeekFullyComplete, toPerformanceWeek } from '../src/utils/weeklySchedule.js'
import { completionStorageKey, loadTaskCompletions, saveTaskCompletions } from '../src/utils/weeklyTaskStorage.js'

test('calculates T-2, T-1, week boundaries, week 14, and post-semester', () => {
  const start = '2026-09-14'
  assert.equal(getCurrentSemesterWeek(start, new Date(2026, 7, 30)).state, 'pre-semester')
  assert.equal(getCurrentSemesterWeek(start, new Date(2026, 8, 1)).week, 'T-2')
  assert.equal(getCurrentSemesterWeek(start, new Date(2026, 8, 7)).week, 'T-1')
  assert.equal(getCurrentSemesterWeek(start, new Date(2026, 8, 14)).week, 1)
  assert.equal(getCurrentSemesterWeek(start, new Date(2026, 11, 14)).week, 14)
  assert.equal(getCurrentSemesterWeek(start, new Date(2026, 11, 21)).state, 'post-semester')
})

test('creates the inclusive date range for a semester week', () => {
  const range = getWeekDateRange('2026-09-14', 4)
  assert.deepEqual([range.start.getFullYear(), range.start.getMonth(), range.start.getDate()], [2026, 9, 5])
  assert.deepEqual([range.end.getFullYear(), range.end.getMonth(), range.end.getDate()], [2026, 9, 11])
})

test('filters unrelated roles and calculates task progress', () => {
  const tasks = [
    { id: 'a', assignedTo: ['Supervisors'] },
    { id: 'b', assignedTo: ['Everyone'] },
    { id: 'c', assignedTo: ['Instructors'] },
  ]
  const filtered = filterTasksForSupervisor(tasks)
  assert.deepEqual(filtered.map(task => task.id), ['a', 'b'])
  assert.deepEqual(filterTasksForSupervisor(tasks, 'Administrator').map(task => task.id), ['b'])
  assert.deepEqual(calculateWeeklyProgress(filtered, new Set(['a'])), { completed: 1, total: 2, percentage: 50 })
})

test('persists completion independently by supervisor, semester, and week', () => {
  const values = new Map()
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  const weekOne = { supervisorId: 'supervisor-a', semesterId: 'fall-2026', week: 1 }
  const weekTwo = { ...weekOne, week: 2 }
  saveTaskCompletions(weekOne, new Set(['task-a']))
  assert.deepEqual([...loadTaskCompletions(weekOne)], ['task-a'])
  assert.deepEqual([...loadTaskCompletions(weekTwo)], [])
  assert.notEqual(completionStorageKey(weekOne), completionStorageKey(weekTwo))
})

test('maps schedule weeks to performance weeks', () => {
  assert.equal(toPerformanceWeek(4), 4)
  assert.equal(toPerformanceWeek('T-1'), null)
})

test('marks a week complete only when every visible task is checked', () => {
  const tasks = [
    { id: 'a', week: 1, assignedTo: ['Supervisors'] },
    { id: 'b', week: 1, assignedTo: ['Everyone'] },
    { id: 'c', week: 2, assignedTo: ['Supervisors'] },
  ]
  const completedByWeek = {
    1: new Set(['a']),
    2: new Set(['c']),
  }

  assert.equal(isWeekFullyComplete(1, completedByWeek[1], tasks), false)
  assert.equal(isWeekFullyComplete(1, new Set(['a', 'b']), tasks), true)
  assert.equal(isWeekFullyComplete(2, completedByWeek[2], tasks), true)
  assert.deepEqual([...getFullyCompletedWeeks(completedByWeek, tasks)], ['2'])
})
