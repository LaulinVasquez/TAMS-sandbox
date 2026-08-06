import { useMemo, useState } from 'react'
import Card from '../ui/Card'
import { semesterConfig, semesterWeeks, weeklyTaskSchedule } from '../../data/weeklyTaskSchedule'
import { calculateWeeklyProgress, filterTasksForSupervisor, formatWeekDateRange, getCurrentSemesterWeek, getFullyCompletedWeeks, getTasksForWeek } from '../../utils/weeklySchedule'
import { loadTaskCompletions, saveTaskCompletions } from '../../utils/weeklyTaskStorage'
import WeekIndicatorList from './weeklySchedule/WeekIndicatorList'
import WeeklyProgress from './weeklySchedule/WeeklyProgress'
import WeeklyScheduleState from './weeklySchedule/WeeklyScheduleState'
import WeeklyTaskItem from './weeklySchedule/WeeklyTaskItem'

const supervisorId = 'seda-hancer'

export default function WeeklyTaskScheduleCard({ viewingAs = 'Supervisor', selectedWeek, onWeekChange }) {
  const current = getCurrentSemesterWeek(semesterConfig.startDate)
  const defaultWeek = current.week ?? 'T-2'
  const [inactivePreview, setInactivePreview] = useState(false)
  const [storageError, setStorageError] = useState('')
  const scope = useMemo(() => ({ supervisorId, semesterId: semesterConfig.id, week: selectedWeek }), [selectedWeek])
  const [completedByWeek, setCompletedByWeek] = useState(() => {
    try { return { [String(defaultWeek)]: loadTaskCompletions({ supervisorId, semesterId: semesterConfig.id, week: defaultWeek }) } }
    catch { return { [String(defaultWeek)]: new Set() } }
  })
  const tasks = filterTasksForSupervisor(getTasksForWeek(weeklyTaskSchedule, selectedWeek), viewingAs)
  const completedIds = completedByWeek[String(selectedWeek)] ?? new Set()
  const progress = calculateWeeklyProgress(tasks, completedIds)
  const completedWeeks = useMemo(
    () => getFullyCompletedWeeks(completedByWeek, weeklyTaskSchedule, viewingAs),
    [completedByWeek, viewingAs],
  )
  const previewing = inactivePreview || (current.week != null && String(selectedWeek) !== String(current.week))

  function selectWeek(week) {
    onWeekChange?.(week)
    setInactivePreview(current.state !== 'active')
    setStorageError('')
    if (!completedByWeek[String(week)]) {
      try {
        const saved = loadTaskCompletions({ supervisorId, semesterId: semesterConfig.id, week })
        setCompletedByWeek(previous => ({ ...previous, [String(week)]: saved }))
      } catch { setStorageError('Task completion data could not be loaded.') }
    }
  }

  function toggleTask(taskId) {
    const next = new Set(completedIds)
    next.has(taskId) ? next.delete(taskId) : next.add(taskId)
    setCompletedByWeek(previous => ({ ...previous, [String(selectedWeek)]: next }))
    try { saveTaskCompletions(scope, next); setStorageError('') }
    catch { setStorageError('Completion could not be saved.'); setCompletedByWeek(previous => ({ ...previous, [String(selectedWeek)]: completedIds })) }
  }

  function returnToCurrent() {
    setInactivePreview(false)
    if (current.week != null) selectWeek(current.week)
  }

  const emptyWeekMessage = `No ${viewingAs.toLowerCase()} tasks are scheduled for this week.`

  return <Card className="flex min-h-[322px] min-w-0 flex-col p-5"><header className="mb-3 flex flex-wrap items-start justify-between gap-2"><div><h2 className="section-label font-semibold tracking-wider">Weekly Task Schedule</h2><p className="mt-1 text-xl font-bold">{typeof selectedWeek === 'number' ? `Week ${selectedWeek}` : selectedWeek}</p><p className="text-xs text-muted">{formatWeekDateRange(semesterConfig.startDate, selectedWeek)}</p></div>{previewing && <button type="button" onClick={returnToCurrent} className="rounded bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">{current.week == null ? 'Previewing week' : 'Preview · Return to current'}</button>}</header><WeekIndicatorList weeks={semesterWeeks} currentWeek={current.week} selectedWeek={selectedWeek} completedWeeks={completedWeeks} onSelect={selectWeek} /><div className="my-3"><WeeklyProgress {...progress} /></div>{storageError && <WeeklyScheduleState message={storageError} onRetry={() => selectWeek(selectedWeek)} />}{!storageError && current.state === 'pre-semester' && !inactivePreview && <WeeklyScheduleState message="The semester has not started. Preview a week to review its tasks." />}{!storageError && current.state === 'post-semester' && !inactivePreview && <WeeklyScheduleState message="The semester has ended." />}{!storageError && (current.state === 'active' || inactivePreview) && (tasks.length ? <ul className="max-h-40 space-y-2 overflow-y-auto pr-1">{tasks.map(task => <WeeklyTaskItem key={task.id} task={task} completed={completedIds.has(task.id)} onToggle={toggleTask} />)}</ul> : <WeeklyScheduleState message={emptyWeekMessage} />)}</Card>
}
