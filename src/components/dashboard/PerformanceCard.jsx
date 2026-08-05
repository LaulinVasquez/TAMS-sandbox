import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import { weeklyPerformance } from '../../data/dashboard'

const totalTAs = 56

function standardColor(value) {
  return value >= 85 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-400' : 'bg-rose-400'
}

function inverseColor(value, good, monitor) {
  return value <= good ? 'bg-emerald-500' : value <= monitor ? 'bg-amber-400' : 'bg-rose-400'
}

export default function PerformanceCard({ selectedWeek, onWeekChange }) {
  const week = weeklyPerformance[selectedWeek]
  const score = Math.round((week.hoursUtilization + week.onTrack + (100 - week.missingDays) + (100 - week.manualEntries)) / 4)
  const status = score < 60
    ? { label: 'Needs Attention', classes: 'border-red-500 bg-red-50 text-red-500' }
    : score < 80
      ? { label: 'Monitor', classes: 'border-amber-500 bg-amber-50 text-amber-700' }
      : { label: 'Good Standing', classes: 'border-emerald-500 bg-emerald-50 text-emerald-700' }
  const metrics = [
    { title: 'Hours Utilization', percentage: week.hoursUtilization, subtitle: `Avg ${week.hoursUtilization}% of max hours worked`, color: standardColor(week.hoursUtilization) },
    { title: 'Pacing Policy (On Track)', percentage: week.onTrack, subtitle: `${Math.round((week.onTrack / 100) * totalTAs)} / ${totalTAs} TAs on track`, color: standardColor(week.onTrack) },
    { title: 'Pacing Policy Missing %', percentage: week.missingDays, subtitle: `Avg ${week.missingDays}% of required days missed`, color: inverseColor(week.missingDays, 5, 12) },
    { title: 'Manual Entry Weeks', percentage: week.manualEntries, subtitle: `${Math.round((week.manualEntries / 100) * totalTAs)} / ${totalTAs} TAs had manual entries`, color: inverseColor(week.manualEntries, 20, 40) },
  ]

  return <Card className="mt-4 min-h-[242px] p-6"><header className="flex items-start justify-between gap-4"><div><h2 className="mb-2 mt-1 text-xl font-semibold">TA Performance</h2><p key={selectedWeek} className="performance-details text-xs text-muted">Average across all {totalTAs} TAs — Week {selectedWeek}</p></div><select value={selectedWeek} onChange={event => onWeekChange(Number(event.target.value))} aria-label="Performance week" className="h-9 w-[108px] cursor-pointer rounded border border-slate-300 bg-white px-3 outline-none transition-all duration-200 hover:-translate-y-px hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{Object.keys(weeklyPerformance).map(weekNumber => <option value={weekNumber} key={weekNumber}>Week {weekNumber}</option>)}</select></header><div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">{metrics.map(metric => <div key={metric.title}><div key={`${selectedWeek}-${metric.title}`} className="performance-details"><div className="mb-1 flex justify-between gap-2"><span>{metric.title}</span><b className="whitespace-nowrap">{metric.percentage.toFixed(1)}%</b></div><div className="mb-1.5 text-xs text-muted">{metric.subtitle}</div></div><ProgressBar percentage={metric.percentage} color={metric.color} /></div>)}</div><footer className="mt-6 flex justify-between border-t border-slate-100 pt-3 text-xs text-muted"><span>TEAM STATUS</span><span key={selectedWeek} className={`performance-details rounded border px-2 py-0.5 ${status.classes}`}>{status.label} ({score}%)</span></footer></Card>
}
