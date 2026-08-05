import test from 'node:test'
import assert from 'node:assert/strict'
import { getWorkdayStatus, getHoursWatchAlerts, manualEntryTone, summarizeWorkdayPerformance } from '../src/utils/profileMetrics.js'

const record = overrides => ({ expectedHours: 20, workedHours: 20, daysUnder25Minutes: 0, manualEntryPercentage: 5, ...overrides })

test('classifies a single weekly Workday record', () => {
  assert.equal(getWorkdayStatus(record({})), 'On Track')
  assert.equal(getWorkdayStatus(record({ workedHours: 17 })), 'Below Hours')
  assert.equal(getWorkdayStatus(record({ workedHours: 23 })), 'Over Hours')
  assert.equal(getWorkdayStatus(record({ manualEntryPercentage: 52 })), 'Needs Review')
  assert.equal(getWorkdayStatus(record({ daysUnder25Minutes: 3 })), 'Needs Review')
  assert.equal(getWorkdayStatus(null), 'Unavailable')
})

test('uses four readable manual-entry severity bands', () => {
  assert.equal(manualEntryTone(10), 'green')
  assert.equal(manualEntryTone(25), 'yellow')
  assert.equal(manualEntryTone(40), 'orange')
  assert.equal(manualEntryTone(41), 'red')
})

test('summarizes weekly records without duplicating values per course', () => {
  const summary = summarizeWorkdayPerformance([
    record({ workedHours: 18, manualEntryPercentage: 10 }),
    record({ workedHours: 22, manualEntryPercentage: 20 }),
  ])
  assert.equal(summary.totalMax, 40)
  assert.equal(summary.totalWorked, 40)
  assert.equal(summary.entries, 2)
  assert.equal(summary.manualPercentage, 15)
  assert.equal(summary.utilization, 100)
})

test('handles unavailable Workday weeks safely', () => {
  const summary = summarizeWorkdayPerformance([null, undefined])
  assert.equal(summary.entries, 0)
  assert.equal(summary.totalWorked, 0)
  assert.equal(summary.score, 0)
})

test('flags TAs with Below Hours or more than assigned plus 0.5 hours', () => {
  const profiles = [{
    id: 'low-hours',
    name: 'Low Hours',
    workdayData: [{ week: 2, expectedHours: 20, workedHours: 17, daysUnder25Minutes: 0, manualEntryPercentage: 5 }],
  }, {
    id: 'high-hours',
    name: 'High Hours',
    workdayData: [{ week: 2, expectedHours: 18, workedHours: 18.6, daysUnder25Minutes: 0, manualEntryPercentage: 5 }],
  }, {
    id: 'on-track',
    name: 'On Track',
    workdayData: [{ week: 2, expectedHours: 20, workedHours: 19.5, daysUnder25Minutes: 0, manualEntryPercentage: 5 }],
  }]

  const alerts = getHoursWatchAlerts(profiles, 2)
  assert.deepEqual(alerts.map(alert => alert.id), ['low-hours', 'high-hours'])
  assert.equal(alerts[0].reason, 'below-hours')
  assert.equal(alerts[1].reason, 'over-hours')
})
