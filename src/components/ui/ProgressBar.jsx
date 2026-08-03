export default function ProgressBar({ percentage, color }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className={`progress-bar-fill h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
    </div>
  )
}
