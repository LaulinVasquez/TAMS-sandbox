import { Check } from 'lucide-react'

function weekOrder(week) {
  if (week === 'T-2') return -2
  if (week === 'T-1') return -1
  return Number(week)
}

export default function WeekIndicatorList({ weeks, currentWeek, selectedWeek, completedWeeks, onSelect }) {
  const currentOrder = weekOrder(currentWeek)
  return <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" aria-label="Semester weeks">{weeks.map(week => { const isCurrent = String(week) === String(currentWeek); const isSelected = String(week) === String(selectedWeek); const isPast = currentWeek != null && weekOrder(week) < currentOrder; const isComplete = completedWeeks.has(String(week)); return <button type="button" key={week} onClick={() => onSelect(week)} aria-current={isCurrent ? 'step' : undefined} aria-label={`${weekOrder(week) > 0 ? `Week ${week}` : week}${isComplete ? ', completed' : ''}${isCurrent ? ', current week' : ''}`} className={`grid size-7 shrink-0 place-items-center rounded text-[10px] font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${isSelected ? 'bg-brand text-white' : isPast ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{isComplete ? <Check size={12} aria-hidden="true" /> : week}</button> })}</div>
}
