import ProgressBar from '../ui/ProgressBar'

export default function ProfileMetric({ label, detail, percentage, color }) {
  return <div className="mb-5"><div className="mb-0.5 flex items-baseline justify-between"><span className="font-medium text-slate-800">{label}</span><b>{percentage.toFixed(1)}%</b></div><p className="mb-1.5 text-xs text-muted">{detail}</p><ProgressBar percentage={Math.min(Math.abs(percentage), 100)} color={color} /></div>
}
