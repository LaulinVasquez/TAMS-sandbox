import { LifeBuoy } from 'lucide-react'
import { useMemo, useState } from 'react'
import Card from '../ui/Card'
import CourseAssignmentsCard from './CourseAssignmentsCard'
import NotesCard from './NotesCard'
import WeeklyHoursTrend from './WeeklyHoursTrend'
import WorkdayPerformanceCard from './WorkdayPerformanceCard'

export default function PerformanceTab({ profile }) {
  const [week, setWeek] = useState(12)
  const selectedRecord = useMemo(() => profile.workdayData.find(record => record?.week === week), [profile.workdayData, week])

  return <div className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-label">Performance analytics</p><h2 className="mt-1 text-lg font-semibold text-slate-900">Workday and workload overview</h2><p className="mt-1 text-xs text-muted">Course allocation is separate from weekly Workday activity.</p></div><label className="flex items-center gap-2 text-xs font-medium text-slate-600">Selected week<select value={week} onChange={event => setWeek(Number(event.target.value))} className="h-9 min-w-[112px] rounded border border-slate-300 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{Array.from({ length: 14 }, (_, index) => <option value={index + 1} key={index + 1}>Week {index + 1}</option>)}</select></label></div><CourseAssignmentsCard assignments={profile.assignments} /><WorkdayPerformanceCard record={selectedRecord} /><WeeklyHoursTrend records={profile.workdayData} selectedWeek={week} onSelectWeek={setWeek} /><NotesCard initialNotes={profile.notes} selectedWeek={week} /><Card className="p-6"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-lg bg-violet-50 text-violet-600"><LifeBuoy size={18} /></span><div><h2 className="font-semibold">Student Support Performance</h2><p className="mt-1 text-xs text-muted">Student-support metrics will appear here as reliable data sources become available.</p><div className="mt-4 flex flex-wrap gap-2"><Placeholder>Grading turnaround</Placeholder><Placeholder>Communication practices</Placeholder><Placeholder>Student satisfaction</Placeholder></div></div></div></Card></div>
}

function Placeholder({ children }) { return <span className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-500">{children} · Coming later</span> }
