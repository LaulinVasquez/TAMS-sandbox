import { useState } from 'react'
import Card from '../ui/Card'
import ProfileMetric from './ProfileMetric'
import StatusBadge from './StatusBadge'
import { statusDetails, summarizeWorkdayPerformance } from '../../utils/profileMetrics'

export default function OverviewTab({ profile }) {
  const [assignments, setAssignments] = useState(profile.assignments)
  const metrics = summarizeWorkdayPerformance(profile.workdayData)
  const teamStatus = statusDetails(metrics.score)
  const fields = [
    ['Name', profile.name], ['Email', profile.email], ['Phone', profile.phone],
    ['Hiring Assistant', profile.hiringAssistant], ['Supervisor', profile.supervisor],
    ['I-number', profile.iNumber], ['Workday ID', profile.workdayId],
  ]

  const updateLevel = (course, section, status) => setAssignments(current => current.map(item => item.course === course && item.section === section ? { ...item, status } : item))

  return <div className="space-y-4"><Card className="p-6"><h2 className="mb-4 text-base font-semibold">General Information</h2><div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, value]) => <div key={label}><p className="field-label">{label}</p><p>{value}</p></div>)}<div><p className="field-label">Hiring Status</p><StatusBadge tone={profile.returning ? 'green' : 'blue'}>{profile.returning ? 'Returning' : 'New Hire'}</StatusBadge></div></div></Card>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Card className="overflow-x-auto p-6"><h2 className="mb-4 text-base font-semibold">Assignments</h2><table className="w-full min-w-[560px] text-left"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-muted"><th className="pb-2">Course</th><th className="pb-2">Status</th><th className="pb-2">Instructor</th><th className="pb-2">Max Hrs</th></tr></thead><tbody>{assignments.map(row => <tr className="border-b border-slate-50 last:border-0" key={`${row.course}-${row.section}`}><td className="py-3 font-semibold">{row.course} {row.section}</td><td><select aria-label={`${row.course} ${row.section} level`} value={row.status} onChange={event => updateLevel(row.course, row.section, event.target.value)} className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"><option>Level 1</option><option>Level 2</option><option>Level 3</option></select></td><td>{row.instructor}</td><td>{row.maxHours}</td></tr>)}</tbody></table></Card>
      <Card className="p-6"><div className="mb-1 flex items-center justify-between"><h2 className="text-base font-semibold">Overall Performance</h2><span className={`rounded border px-2 py-0.5 text-xs ${teamStatus.classes}`}>{teamStatus.label} ({metrics.score}%)</span></div><p className="mb-5 text-xs text-muted">All weeks (1–14) aggregated</p><ProfileMetric label="Total Hours Worked" detail={`${metrics.totalWorked.toFixed(2)} / ${metrics.totalMax} hrs worked`} percentage={metrics.utilization} color={metrics.utilization >= 85 ? 'bg-emerald-500' : metrics.utilization >= 60 ? 'bg-amber-400' : 'bg-rose-400'} /><ProfileMetric label="Pacing Policy (On Track)" detail={`${metrics.onTrack} / ${metrics.entries} course-weeks on track`} percentage={metrics.onTrackPercentage} color={metrics.onTrackPercentage >= 85 ? 'bg-emerald-500' : 'bg-amber-400'} /><ProfileMetric label="Pacing Policy Missing %" detail={`${metrics.missedDays} / 70 required days missed`} percentage={metrics.missingPercentage} color={metrics.missingPercentage <= 10 ? 'bg-amber-400' : 'bg-rose-400'} /><ProfileMetric label="Manual Entry Weeks" detail={`${metrics.manualWeeks} / 14 weeks had manual entries`} percentage={metrics.manualPercentage} color={metrics.manualPercentage <= 30 ? 'bg-amber-400' : 'bg-rose-400'} /></Card></div></div>
}
