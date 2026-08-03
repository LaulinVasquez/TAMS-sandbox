const STORAGE_PREFIX = 'tams-weekly-tasks'

export function completionStorageKey({ supervisorId, semesterId, week }) {
  return `${STORAGE_PREFIX}:${supervisorId}:${semesterId}:${week}`
}

export function loadTaskCompletions(scope) {
  const saved = localStorage.getItem(completionStorageKey(scope))
  return new Set(saved ? JSON.parse(saved) : [])
}

export function saveTaskCompletions(scope, completedIds) {
  localStorage.setItem(completionStorageKey(scope), JSON.stringify([...completedIds]))
}
