import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import Card from '../ui/Card'
import { getHoursWatchAlerts } from '../../utils/profileMetrics'

const reasonLabels = {
  'below-hours': 'Below Hours',
  'over-hours': 'Over Hours',
}

export default function HoursWatch({ profiles, week, scheduleWeek, onSelectProfile, onReviewList }) {
  const alerts = useMemo(() => getHoursWatchAlerts(profiles, week), [profiles, week])
  const trackingWeek = typeof scheduleWeek === 'number' ? scheduleWeek : week

  return (
    <Card className="flex min-h-[322px] min-w-0 flex-col p-5">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="section-label font-semibold tracking-wider">Hours-to-Cap Watch</h2>
          <p className="mt-1 text-xs text-muted">
            {typeof scheduleWeek === 'number'
              ? `Week ${scheduleWeek} · Below Hours or Over Hours`
              : 'Linked to Weekly Task Schedule · select Week 1–14 for hours data'}
          </p>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
          {typeof scheduleWeek === 'number' ? `Wk ${scheduleWeek}` : scheduleWeek}
        </span>
      </header>

      {typeof scheduleWeek !== 'number' ? (
        <p className="mb-4 flex flex-1 items-center rounded-md border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-muted">
          Workday hours are tracked from Week 1. Choose a numbered week in Weekly Task Schedule to review TA hours.
        </p>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-5xl font-bold leading-none">{alerts.length}</p>
            <p className="mt-2 text-sm text-slate-500">TAs outside expected hours this week</p>
          </div>

          {alerts.length > 0 ? (
            <ul className="mb-4 max-h-28 space-y-2 overflow-y-auto pr-1">
              {alerts.map(alert => (
                <li key={alert.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProfile?.(alert.id)}
                    className="flex w-full items-start justify-between gap-2 rounded-md border border-slate-100 px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800">{alert.name}</span>
                      <span className="text-[11px] text-muted">{alert.worked} / {alert.assigned} hrs</span>
                    </span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${alert.reason === 'below-hours' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                      {reasonLabels[alert.reason]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 rounded-md border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-muted">
              No TAs are outside the expected range for Week {trackingWeek}.
            </p>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => onReviewList?.(alerts)}
        disabled={typeof scheduleWeek !== 'number' || !alerts.length}
        className="group mt-auto flex w-fit items-center gap-1 text-sm text-brand hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
        aria-label={alerts.length ? `Review ${alerts.length} teaching assistants outside expected hours` : 'No teaching assistants to review'}
      >
        Review list
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </Card>
  )
}
