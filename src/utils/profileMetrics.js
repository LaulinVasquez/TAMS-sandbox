export function getCourseStatus(difference, worked) {
  if (worked < 7 || difference < -2) return 'Below Hours'
  if (difference > 0) return 'Over Hours'
  return 'On Track'
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
