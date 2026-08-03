export default function StatusBadge({ children, tone = 'neutral' }) {
  const tones = {
    green: 'border-emerald-500 bg-emerald-50 text-emerald-700', blue: 'border-blue-400 bg-blue-50 text-blue-600',
    amber: 'border-amber-400 bg-amber-50 text-amber-700', red: 'border-red-400 bg-red-50 text-red-600', neutral: 'border-slate-300 bg-white text-slate-500',
  }
  return <span className={`inline-block rounded border px-2 py-0.5 text-xs ${tones[tone]}`}>{children}</span>
}
