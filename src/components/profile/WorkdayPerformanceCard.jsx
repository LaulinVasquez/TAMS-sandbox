import { AlertTriangle, CheckCircle2, Clock3, FilePenLine, Gauge } from 'lucide-react'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import StatusBadge from './StatusBadge'
import { getWorkdayStatus, manualEntryTone } from '../../utils/profileMetrics'

const statusTone = status => status === 'Below Hours' || status === 'Needs Review' ? 'red' : status === 'Over Hours' ? 'amber' : 'green'
const manualClasses = { green: 'text-emerald-600 bg-emerald-50', yellow: 'text-amber-600 bg-amber-50', orange: 'text-orange-600 bg-orange-50', red: 'text-red-600 bg-red-50' }

export default function WorkdayPerformanceCard({ record }) {
  if (!record) return <Card className="p-6"><div className="flex min-h-48 flex-col items-center justify-center text-center"><span className="mb-3 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500"><AlertTriangle size={18} /></span><h2 className="font-semibold">No Workday data available for this week.</h2><p className="mt-1 max-w-md text-xs text-muted">This week has not synced yet. No hours or status will be inferred until data is available.</p></div></Card>
  const difference = Number(((record.workedHours ?? 0) - (record.expectedHours ?? 0)).toFixed(2))
  const status = getWorkdayStatus(record)
  const utilization = record.expectedHours ? Math.min((record.workedHours ?? 0) / record.expectedHours * 100, 100) : 0
  const manualTone = manualEntryTone(record.manualEntryPercentage ?? 0)
  const manualValue = record.manualEntryPercentage == null ? 'Unavailable' : `${record.manualEntryPercentage}%`
  return <Card className="overflow-hidden"><header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-6"><div><div className="mb-1 flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-orange-50 text-brand"><Gauge size={17} /></span><h2 className="font-semibold">Weekly Workday Performance</h2></div><p className="ml-10 text-xs text-muted">One combined Workday record across all assignments</p></div><StatusBadge tone={statusTone(status)}>{status}</StatusBadge></header><div className="p-6"><div className="mb-6"><div className="mb-2 flex items-end justify-between gap-4"><div><p className="field-label">Worked hours</p><p className="text-3xl font-bold tracking-tight text-slate-900">{record.workedHours ?? 'Unavailable'}<span className="ml-1.5 text-sm font-medium text-muted">/ {record.expectedHours ?? 'Unavailable'} hrs</span></p></div><p className={`text-sm font-semibold ${difference < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{difference > 0 ? '+' : ''}{difference} hrs</p></div><ProgressBar percentage={utilization} color={difference < -2 ? 'bg-red-500' : difference > 2 ? 'bg-amber-400' : 'bg-emerald-500'} /><p className="mt-2 text-right text-[11px] text-muted">{utilization.toFixed(0)}% of expected hours</p></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><Metric icon={<CheckCircle2 />} label="Status" value={record.importedStatus || status} /><Metric icon={<Clock3 />} label="Days under 25 min" value={record.daysUnder25Minutes ?? 'Unavailable'} alert={record.pacingFlag || record.daysUnder25Minutes > 0} /><Metric icon={<FilePenLine />} label="Manual entries" value={manualValue} className={manualClasses[manualTone]} /></div>{record.sourceFile && <div className="mt-4 flex flex-wrap gap-2 text-xs"><Flag active={record.noHours}>No hours recorded</Flag><Flag active={record.aboveAssignedThreshold}>Above assigned threshold</Flag><Flag active={record.overEightHourDays?.length}>{record.overEightHourDays?.length ?? 0} day(s) over 8 hours</Flag></div>}</div></Card>
}

function Flag({ active, children }) { return <span className={`rounded px-2 py-1 ${active ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500'}`}>{children}</span> }

function Metric({ icon, label, value, alert = false, className = '' }) {
  return <div className="rounded-lg border border-slate-100 bg-slate-50 p-4"><div className="mb-3 flex items-center gap-2 text-xs text-muted">{icon}{label}</div><strong className={`inline-flex rounded px-1.5 py-0.5 text-base ${alert ? 'bg-red-50 text-red-600' : className}`}>{value}</strong></div>
}
