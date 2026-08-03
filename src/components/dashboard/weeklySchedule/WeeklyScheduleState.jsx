export default function WeeklyScheduleState({ message, onRetry }) {
  return <div className="grid min-h-32 place-items-center rounded-md border border-dashed border-slate-200 px-4 text-center"><div><p className="text-sm text-slate-500">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-2 rounded border border-brand px-3 py-1 text-xs text-brand focus-visible:ring-2 focus-visible:ring-brand">Retry</button>}</div></div>
}
