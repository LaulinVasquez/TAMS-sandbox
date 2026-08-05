import { ArrowRight, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import StatusBadge from '../components/profile/StatusBadge'
import { summarizeWorkdayPerformance, statusDetails } from '../utils/profileMetrics'

export default function TADirectory({ collapsed, profiles, onSelect, filterIds = null, filterLabel = null, onClearFilter }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    let list = profiles
    if (filterIds?.length) list = list.filter(profile => filterIds.includes(profile.id))
    if (query.trim()) {
      const normalized = query.toLowerCase()
      list = list.filter(profile => `${profile.name} ${profile.email} ${profile.assignments.map(item => item.course).join(' ')}`.toLowerCase().includes(normalized))
    }
    return list
  }, [profiles, filterIds, query])

  return (
    <main className={`min-h-screen px-[31px] pb-16 pt-[130px] transition-all ${collapsed ? 'ml-16' : 'ml-56'}`}>
      <div className="mx-auto max-w-[1291px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[25px] font-bold">Teaching Assistants</h1>
            <p className="mt-1 text-slate-500">{profiles.length} TAs · Fall 2026</p>
          </div>
          <label className="flex h-10 w-72 items-center gap-2 rounded border border-slate-300 bg-white px-3">
            <Search size={16} className="text-muted" />
            <input
              aria-label="Search teaching assistants"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search name, email, or course"
              className="w-full outline-none"
            />
          </label>
        </header>

        {filterLabel && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>Showing {filtered.length} TA{filtered.length === 1 ? '' : 's'} from <strong>{filterLabel}</strong></span>
            <button type="button" onClick={onClearFilter} className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:underline">
              <X size={14} />
              Clear filter
            </button>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Teaching Assistant</th>
                  <th>Hiring status</th>
                  <th>Level</th>
                  <th>Assignments</th>
                  <th>Supervisor</th>
                  <th>Team status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(profile => {
                  const metric = summarizeWorkdayPerformance(profile.workdayData)
                  const status = statusDetails(metric.score)
                  return (
                    <tr key={profile.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <button onClick={() => onSelect(profile.id)} className="text-left">
                          <b className="block text-sm">{profile.name}</b>
                          <span className="text-xs text-muted">{profile.email}</span>
                        </button>
                      </td>
                      <td>
                        <StatusBadge tone={profile.returning ? 'green' : 'blue'}>{profile.returning ? 'Returning' : 'New Hire'}</StatusBadge>
                      </td>
                      <td>{profile.level}</td>
                      <td>{profile.assignments.length} courses</td>
                      <td>{profile.supervisor}</td>
                      <td>
                        <span className={`rounded border px-2 py-0.5 text-xs ${status.classes}`}>{status.label} ({metric.score}%)</span>
                      </td>
                      <td className="pr-5 text-right">
                        <button onClick={() => onSelect(profile.id)} aria-label={`View ${profile.name}`} className="text-brand">
                          <ArrowRight size={17} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="p-8 text-center text-muted">No teaching assistants match your current view.</p>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
