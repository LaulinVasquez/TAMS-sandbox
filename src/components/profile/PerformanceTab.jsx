import { useState } from 'react'
import Card from '../ui/Card'
import NotesCard from './NotesCard'
import StatusBadge from './StatusBadge'
import { getCourseStatus } from '../../utils/profileMetrics'

const statusTone = status => status === 'Below Hours' ? 'red' : status === 'Over Hours' ? 'amber' : 'green'

export default function PerformanceTab({ profile }) {
  const [week, setWeek] = useState(1)
  const rows = profile.weeklyData[week - 1].courses.map(row => ({ ...row, difference: Number((row.worked - row.maxHours).toFixed(2)), status: getCourseStatus(row.worked - row.maxHours, row.worked) }))
  const totalMax = rows.reduce((sum, row) => sum + row.maxHours, 0)
  const totalWorked = rows.reduce((sum, row) => sum + row.worked, 0)
  const net = totalWorked - totalMax
  const averageManual = rows.reduce((sum, row) => sum + row.manualEntries, 0) / rows.length

  return <div className="space-y-4"><Card className="overflow-x-auto p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">Hours Performance</h2><select value={week} onChange={event => setWeek(Number(event.target.value))} className="rounded border border-slate-300 bg-white px-3 py-1.5">{profile.weeklyData.map(item => <option value={item.week} key={item.week}>Week {item.week}</option>)}</select></div><table className="w-full min-w-[850px] text-left"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-muted"><th className="pb-2">Course</th><th className="pb-2">Max Hrs</th><th className="pb-2">Total Worked Hrs</th><th className="pb-2">Difference</th><th className="pb-2">Status</th><th className="pb-2">Days Under 25 Min</th><th className="pb-2">Manual Entries</th></tr></thead><tbody>{rows.map(row => <tr key={row.course} className="border-b border-slate-50 last:border-0"><td className="py-3 font-semibold">{row.course}</td><td>{row.maxHours}</td><td>{row.worked}</td><td className={row.difference < 0 ? 'text-red-500' : 'text-emerald-600'}>{row.difference > 0 ? '+' : ''}{row.difference}</td><td><StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge></td><td className={row.daysUnder25 < 0 ? 'text-red-500' : 'text-emerald-600'}>{row.daysUnder25}</td><td className={row.manualEntries > 49 ? 'text-red-500' : row.manualEntries >= 20 ? 'text-amber-500' : 'text-emerald-600'}>{row.manualEntries}%</td></tr>)}</tbody></table></Card>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Card className="p-6"><h2 className="text-base font-semibold">Week Performance</h2><p className="mb-5 text-xs text-muted">Week {week} summary</p><div className="grid grid-cols-2 gap-x-6 gap-y-5"><Summary label="Total Max Hrs" value={totalMax} /><Summary label="Total Worked Hrs" value={totalWorked.toFixed(2)} /><Summary label="Net Difference" value={`${net > 0 ? '+' : ''}${net.toFixed(2)}`} tone={net < 0 ? 'text-red-500' : 'text-emerald-600'} /><Summary label="Courses Below Hours" value={`${rows.filter(row => row.status === 'Below Hours').length} / ${rows.length}`} /><Summary label="Days Under 25 Min" value={rows.reduce((sum, row) => sum + row.daysUnder25, 0)} /><Summary label="Avg Manual Entries" value={`${averageManual.toFixed(1)}%`} tone={averageManual > 49 ? 'text-red-500' : 'text-amber-500'} /></div></Card><NotesCard initialNotes={profile.notes} /></div>
    <Card className="p-6"><h2 className="mb-4 text-base font-semibold">Student Support Performance</h2><p className="mb-2 text-slate-500">Grading Turnaround</p><p className="text-slate-500">Communication Practices</p></Card></div>
}

function Summary({ label, value, tone = 'text-slate-900' }) {
  return <div><p className="field-label">{label}</p><b className={tone}>{value}</b></div>
}
