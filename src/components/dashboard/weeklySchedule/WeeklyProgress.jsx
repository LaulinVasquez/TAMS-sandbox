export default function WeeklyProgress({ completed, total, percentage }) {
  return <div><div className="mb-1.5 flex justify-between text-xs"><span className="text-muted">{completed} of {total} completed</span><span className="sr-only">{percentage}% complete</span><b aria-hidden="true">{percentage}%</b></div><div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percentage}><div className="progress-bar-fill h-full rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} /></div></div>
}
