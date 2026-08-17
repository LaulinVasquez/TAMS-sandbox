import assert from 'node:assert/strict'
import test from 'node:test'
import { buildImportedWorkdayRecord, parseTimeStatsRows, summarizeImportedWeek } from '../src/utils/timeStatsImport.js'
import { applyTimeStatsImports, saveTimeStatsImport } from '../src/utils/timeStatsStorage.js'

const rows = {
  total_hours: [{ i_number: 'I-123', ta_name: 'Report Name', max_assigned_hours: 20, total_hours_worked: 22, difference: 2, status: 'Over' }],
  manual_entries: [{ i_number: 'I-123', ta_name: 'Report Name', percentage_manual: 25, hours_inputted: 2, times_inputted: 1, user_or_mobile_entries: 'User' }],
  pacing_report: [{ i_number: 'I-123', ta_name: 'Report Name', days_under_25_minutes: 2 }],
}
const profiles = [{ id: 'ta-1', iNumber: 'I123', name: 'Test TA', workdayData: [{ week: 11, workedHours: 10 }] }]

test('parses by sheet name, matches only i-number, and reports missing sheets', () => {
  const parsed = parseTimeStatsRows(rows, { fileName: 'time_stats_week12.xlsx', profiles })
  assert.equal(parsed.week, 12)
  assert.equal(parsed.matched[0].profileId, 'ta-1')
  assert.equal(parsed.matched[0].name, 'Report Name')
  assert.equal(parsed.unmatched.length, 0)
  assert.ok(parsed.missingSheets.includes('over_8hrs'))
})

test('builds imported weekly metrics without converting unavailable data to zero', () => {
  const parsed = parseTimeStatsRows(rows, { profiles })
  const record = buildImportedWorkdayRecord(parsed, 'I123', 12)
  assert.equal(record.week, 12)
  assert.equal(record.manualEntryPercentage, 25)
  assert.equal('unsubmittedHoursAvailable' in record, false)
  assert.equal(summarizeImportedWeek(parsed, 4).pacingMissing, 25)
})

test('storage rejects duplicates unless replace is explicit and preserves other weeks', () => {
  const values = new Map()
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  saveTimeStatsImport(12, { records: {} }, { storage })
  assert.throws(() => saveTimeStatsImport(12, { records: {} }, { storage }), /already been imported/)
  saveTimeStatsImport(13, { records: {} }, { storage })
  const profilesWithImport = applyTimeStatsImports(profiles, { 12: { matched: [{ profileId: 'ta-1', name: 'Report Name' }], records: { 'ta-1': { week: 12, workedHours: 22 } } } })
  assert.deepEqual(profilesWithImport[0].workdayData.map(row => row.week), [11, 12])
  assert.equal(profilesWithImport[0].name, 'Report Name')
})
