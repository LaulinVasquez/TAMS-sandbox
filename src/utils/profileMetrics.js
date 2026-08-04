export function getCourseStatus(difference, worked) {
  if (worked < 7 || difference < -2) return 'Below Hours'
  if (difference > 0) return 'Over Hours'
  return 'On Track'
}

export function getWorkdayStatus(record) {
  if (!record) return 'Unavailable'
  const difference = record.workedHours - record.expectedHours
  if (record.manualEntryPercentage >= 50 || record.daysUnder25Minutes >= 3) return 'Needs Review'
  if (difference > 2) return 'Over Hours'
  if (difference < -2) return 'Below Hours'
  return 'On Track'
}

export function manualEntryTone(percentage) {
  if (percentage <= 10) return 'green'
  if (percentage <= 25) return 'yellow'
  if (percentage <= 40) return 'orange'
  return 'red'
}

export function summarizeWorkdayPerformance(records) {
  const available = records.filter(Boolean)
  if (!available.length) return { totalMax: 0, totalWorked: 0, onTrack: 0, entries: 0, missedDays: 0, manualWeeks: 0, utilization: 0, onTrackPercentage: 0, missingPercentage: 0, manualPercentage: 0, score: 0 }
  const totalExpected = available.reduce((sum, row) => sum + row.expectedHours, 0)
  const totalWorked = available.reduce((sum, row) => sum + row.workedHours, 0)
  const onTrack = available.filter(row => getWorkdayStatus(row) === 'On Track').length
  const missedDays = available.reduce((sum, row) => sum + row.daysUnder25Minutes, 0)
  const manualWeeks = available.filter(row => row.manualEntryPercentage > 0).length
  const utilization = totalExpected ? totalWorked / totalExpected * 100 : 0
  const onTrackPercentage = available.length ? onTrack / available.length * 100 : 0
  const missingPercentage = available.length ? missedDays / (available.length * 5) * 100 : 0
  const manualPercentage = available.length ? available.reduce((sum, row) => sum + row.manualEntryPercentage, 0) / available.length : 0
  const score = Math.max(0, Math.min(100, Math.round((Math.min(utilization, 100) + onTrackPercentage + (100 - missingPercentage) + (100 - manualPercentage)) / 4)))
  return { totalMax: totalExpected, totalWorked, onTrack, entries: available.length, missedDays, manualWeeks, utilization, onTrackPercentage, missingPercentage, manualPercentage, score }
}

export function summarizeProfile(weeklyData) {
  const rows = weeklyData.flatMap(week => week.courses)
  const totalMax = rows.reduce((sum, row) => sum + row.maxHours, 0)
  const totalWorked = rows.reduce((sum, row) => sum + row.worked, 0)
  const onTrack = rows.filter(row => getCourseStatus(row.worked - row.maxHours, row.worked) !== 'Below Hours').length
  const missedDays = rows.reduce((sum, row) => sum + Math.abs(Math.min(row.daysUnder25, 0)), 0)
  const manualWeeks = weeklyData.filter(week => week.courses.some(row => row.manualEntries > 0)).length
  const utilization = totalWorked / totalMax * 100
  const onTrackPercentage = onTrack / rows.length * 100
  const missingPercentage = missedDays / 70 * 100
  const manualPercentage = manualWeeks / weeklyData.length * 100
  const score = Math.round((utilization + onTrackPercentage + (100 - missingPercentage) + (100 - manualPercentage)) / 4)

  return { totalMax, totalWorked, onTrack, entries: rows.length, missedDays, manualWeeks, utilization, onTrackPercentage, missingPercentage, manualPercentage, score }
}

export function statusDetails(score) {
  if (score < 60) return { label: 'Needs Attention', classes: 'border-red-400 bg-red-50 text-red-600' }
  if (score < 80) return { label: 'Monitor', classes: 'border-amber-400 bg-amber-50 text-amber-700' }
  return { label: 'Good Standing', classes: 'border-emerald-500 bg-emerald-50 text-emerald-700' }
}
