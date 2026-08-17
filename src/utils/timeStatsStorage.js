const STORAGE_KEY = 'tams-time-stats-imports-v1'

export function loadTimeStatsImports(storage = localStorage) {
  try { return JSON.parse(storage.getItem(STORAGE_KEY)) ?? {} } catch { return {} }
}

export function getTimeStatsImport(week, storage = localStorage) {
  return loadTimeStatsImports(storage)[week] ?? null
}

export function saveTimeStatsImport(week, data, { replace = false, storage = localStorage } = {}) {
  const imports = loadTimeStatsImports(storage)
  if (imports[week] && !replace) throw new Error(`Week ${week} has already been imported.`)
  imports[week] = { ...data, week, savedAt: new Date().toISOString() }
  storage.setItem(STORAGE_KEY, JSON.stringify(imports))
  return imports[week]
}

export function applyTimeStatsImports(profiles, imports) {
  return profiles.map(profile => {
    const entries = Object.values(imports).sort((a, b) => a.week - b.week)
    const importedRecords = entries.flatMap(entry => {
      const record = entry.records?.[profile.id]
      return record ? [record] : []
    })
    if (!importedRecords.length) return profile
    const importedWeeks = new Set(importedRecords.map(record => record.week))
    const importedName = entries.flatMap(entry => entry.matched ?? []).filter(match => match.profileId === profile.id && match.name).at(-1)?.name
    return { ...profile, name: importedName ?? profile.name, workdayData: [...profile.workdayData.filter(record => !importedWeeks.has(record.week)), ...importedRecords].sort((a, b) => a.week - b.week) }
  })
}
