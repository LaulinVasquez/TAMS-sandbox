export const TIME_STATS_SHEETS = {
  total_hours: ['i_number', 'max_assigned_hours', 'total_hours_worked', 'difference', 'status'],
  manual_entries: ['i_number', 'percentage_manual', 'hours_inputted', 'times_inputted', 'user_or_mobile_entries'],
  above_21hrs: ['i_number', 'total_hr', 'max_assigned_hours', 'over_assignment_by_1hr'],
  pacing_report: ['i_number', 'days_under_25_minutes'],
  unsubmitted_hrs: ['i_number', 'total_hr', 'status'],
  over_8hrs: ['i_number', 'date', 'daily_hours'],
  no_hrs: ['i_number'],
}

const REQUIRED_SHEETS = ['total_hours']
const numericFields = new Set([
  'max_assigned_hours', 'total_hours_worked', 'difference', 'percentage_manual',
  'hours_inputted', 'times_inputted', 'total_hr', 'over_assignment_by_1hr',
  'days_under_25_minutes', 'daily_hours',
])

export function normalizeINumber(value) {
  if (value === null || value === undefined) return ''
  return String(value).trim().replace(/\.0$/, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

export function normalizeHeader(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[%()]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

export function detectWeek(fileName, workbookRows = {}) {
  const fileMatch = String(fileName).match(/(?:week|wk)[-_\s]*(\d{1,2})/i)
  if (fileMatch) return Number(fileMatch[1])
  for (const rows of Object.values(workbookRows)) {
    for (const row of rows.slice(0, 5)) {
      for (const [key, value] of Object.entries(row)) {
        if (normalizeHeader(key) === 'week') {
          const week = Number(String(value).match(/\d{1,2}/)?.[0])
          if (week >= 1 && week <= 14) return week
        }
      }
    }
  }
  return null
}

function parseValue(field, value, warnings, sheet, rowNumber) {
  if (!numericFields.has(field)) return value === null || value === undefined ? null : String(value).trim()
  if (value === '' || value === null || value === undefined) return null
  const number = Number(String(value).replace('%', '').replace(/,/g, ''))
  if (!Number.isFinite(number)) {
    warnings.push(`${sheet}, row ${rowNumber}: ${field} is not a valid number.`)
    return null
  }
  return number
}

export function parseTimeStatsRows(workbookRows, { fileName = '', profiles = [] } = {}) {
  const errors = []
  const warnings = []
  const availableSheets = Object.keys(workbookRows).filter(name => TIME_STATS_SHEETS[name])
  const missingSheets = Object.keys(TIME_STATS_SHEETS).filter(name => !availableSheets.includes(name))
  const unsupportedSheets = Object.keys(workbookRows).filter(name => !TIME_STATS_SHEETS[name])

  if (!availableSheets.length) errors.push('This workbook is not a recognizable Time Stats report.')
  for (const sheet of REQUIRED_SHEETS) if (!availableSheets.includes(sheet)) errors.push(`Required sheet “${sheet}” is missing.`)

  const sheets = {}
  for (const sheet of availableSheets) {
    const rawRows = workbookRows[sheet] ?? []
    if (!rawRows.length) {
      sheets[sheet] = []
      warnings.push(`${sheet} is empty.`)
      continue
    }
    const headers = Object.keys(rawRows[0]).map(normalizeHeader)
    const missingColumns = TIME_STATS_SHEETS[sheet].filter(column => !headers.includes(column))
    if (missingColumns.length) {
      const message = `${sheet} is missing columns: ${missingColumns.join(', ')}.`
      if (REQUIRED_SHEETS.includes(sheet)) errors.push(message)
      else warnings.push(`${message} Its KPI will be unavailable.`)
      sheets[sheet] = []
      continue
    }
    sheets[sheet] = rawRows.flatMap((raw, index) => {
      const normalized = Object.fromEntries(Object.entries(raw).map(([key, value]) => [normalizeHeader(key), value]))
      const iNumber = normalizeINumber(normalized.i_number)
      if (!iNumber) {
        warnings.push(`${sheet}, row ${index + 2}: missing i_number; row skipped.`)
        return []
      }
      return [{
        ...Object.fromEntries(TIME_STATS_SHEETS[sheet].map(field => [field, field === 'i_number' ? iNumber : parseValue(field, normalized[field], warnings, sheet, index + 2)])),
        sourceRow: index + 2,
      }]
    })
  }

  const allINumbers = [...new Set(Object.values(sheets).flat().map(row => row.i_number))]
  const profilesByINumber = new Map(profiles.map(profile => [normalizeINumber(profile.iNumber), profile]))
  const matched = allINumbers.flatMap(iNumber => profilesByINumber.has(iNumber) ? [{ iNumber, profileId: profilesByINumber.get(iNumber).id, name: profilesByINumber.get(iNumber).name }] : [])
  const unmatched = allINumbers.filter(iNumber => !profilesByINumber.has(iNumber)).map(iNumber => {
    const source = Object.values(sheets).flat().find(row => row.i_number === iNumber)
    return { iNumber, name: source?.name ?? null }
  })

  return {
    fileName,
    week: detectWeek(fileName, workbookRows),
    sheets,
    availableSheets,
    missingSheets,
    unsupportedSheets,
    errors,
    warnings,
    recordCount: allINumbers.length,
    matched,
    unmatched,
  }
}

export function buildImportedWorkdayRecord(parsed, iNumber, week) {
  const id = normalizeINumber(iNumber)
  const find = sheet => parsed.sheets[sheet]?.find(row => row.i_number === id)
  const total = find('total_hours')
  if (!total) return null
  const manual = find('manual_entries')
  const pacing = find('pacing_report')
  const unsubmitted = find('unsubmitted_hrs')
  return {
    week,
    expectedHours: total.max_assigned_hours,
    workedHours: total.total_hours_worked,
    difference: total.difference,
    importedStatus: total.status,
    manualEntryPercentage: manual?.percentage_manual ?? null,
    manualEntryHours: manual?.hours_inputted ?? null,
    manualEntryCount: manual?.times_inputted ?? null,
    userOrMobileEntries: manual?.user_or_mobile_entries ?? null,
    daysUnder25Minutes: pacing?.days_under_25_minutes ?? 0,
    pacingFlag: Boolean(pacing),
    aboveAssignedThreshold: Boolean(find('above_21hrs')),
    noHours: Boolean(find('no_hrs')),
    overEightHourDays: parsed.sheets.over_8hrs?.filter(row => row.i_number === id) ?? [],
    unsubmittedHours: unsubmitted ? { totalHours: unsubmitted.total_hr, status: unsubmitted.status } : null,
    unsubmittedHoursAvailable: Boolean(unsubmitted),
    importedAt: new Date().toISOString(),
    sourceFile: parsed.fileName,
  }
}

export function summarizeImportedWeek(parsed, supervisedCount) {
  const totals = parsed.sheets.total_hours ?? []
  const assigned = totals.reduce((sum, row) => sum + (row.max_assigned_hours ?? 0), 0)
  const worked = totals.reduce((sum, row) => sum + (row.total_hours_worked ?? 0), 0)
  const pacingCount = new Set((parsed.sheets.pacing_report ?? []).map(row => row.i_number)).size
  const manualRows = parsed.sheets.manual_entries ?? []
  return {
    hoursUtilization: assigned ? worked / assigned * 100 : null,
    pacingMissing: supervisedCount ? pacingCount / supervisedCount * 100 : null,
    pacingOnTrack: supervisedCount ? (supervisedCount - pacingCount) / supervisedCount * 100 : null,
    manualEntries: manualRows.length ? manualRows.reduce((sum, row) => sum + (row.percentage_manual ?? 0), 0) / manualRows.length : null,
    pacingCount,
    totalTAs: supervisedCount,
  }
}
