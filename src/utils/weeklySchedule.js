const DAY_MS = 24 * 60 * 60 * 1000

function parseDate(value) {
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(value) {
  const date = value instanceof Date ? new Date(value) : parseDate(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function getCurrentSemesterWeek(startDate, currentDate = new Date()) {
  const start = startOfDay(startDate)
  const current = startOfDay(currentDate)
  const days = Math.floor((current - start) / DAY_MS)
  if (days < -14) return { state: 'pre-semester', week: null }
  if (days < -7) return { state: 'active', week: 'T-2' }
  if (days < 0) return { state: 'active', week: 'T-1' }
  const week = Math.floor(days / 7) + 1
  if (week > 14) return { state: 'post-semester', week: null }
  return { state: 'active', week }
}

export function getWeekDateRange(startDate, week) {
  const offsets = { 'T-2': -14, 'T-1': -7 }
  const offset = typeof week === 'number' ? (week - 1) * 7 : offsets[week]
  const start = startOfDay(startDate)
  start.setDate(start.getDate() + offset)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return { start, end }
}

export function formatWeekDateRange(startDate, week) {
  const { start, end } = getWeekDateRange(startDate, week)
  const startLabel = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const endLabel = end.toLocaleDateString('en-US', { month: start.getMonth() === end.getMonth() ? undefined : 'long', day: 'numeric' })
  return `${startLabel} – ${endLabel}`
}

export function getTasksForWeek(tasks, week) {
  return tasks.filter(task => String(task.week) === String(week))
}

export function filterTasksForSupervisor(tasks, assignedRole = 'Supervisor') {
  const allowed = new Set(['Everyone'])
  if (assignedRole === 'Supervisor') allowed.add('Supervisors')
  else allowed.add(assignedRole)
  return tasks.filter(task => task.assignedTo.some(role => allowed.has(role)))
}

export function calculateWeeklyProgress(tasks, completedIds) {
  const completed = tasks.filter(task => completedIds.has(task.id)).length
  return { completed, total: tasks.length, percentage: tasks.length ? Math.round((completed / tasks.length) * 100) : 0 }
}

export function toPerformanceWeek(week) {
  return typeof week === 'number' ? week : null
}
