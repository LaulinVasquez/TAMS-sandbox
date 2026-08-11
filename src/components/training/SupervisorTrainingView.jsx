import { AlertTriangle, ArrowRight, BookOpenCheck, CheckCircle2, Search, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import StatusBadge from '../profile/StatusBadge'
import { teamTrainingSummary, trainingModules } from '../../data/training'
import { filterProfilesByTrainingStatus, getOverdueTrainingModules, getTrainingProgress, getTrainingStatus } from '../../utils/training'

const statusFilters = ['all', 'Overdue', 'Not started', 'In progress', 'Complete']
const statusTone = {
  Complete: 'green',
  'In progress': 'amber',
  'Not started': 'red',
  Overdue: 'red',
}

const formatDeadline = date => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function SupervisorTrainingView({ profiles, onSelectProfile, onPreviewTAView }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const sedaTeam = useMemo(() => profiles.filter(profile => profile.supervisor === 'Seda Hancer'), [profiles])
  const overdueByProfile = useMemo(() => new Map(sedaTeam.map(profile => [profile.id, getOverdueTrainingModules(profile.trainingCompletion)])), [sedaTeam])
  const overdueAssignments = useMemo(() => [...overdueByProfile.values()].reduce((total, modules) => total + modules.length, 0), [overdueByProfile])
  const overdueTAs = useMemo(() => [...overdueByProfile.values()].filter(modules => modules.length).length, [overdueByProfile])
  const filtered = useMemo(() => {
    let list = statusFilter === 'Overdue'
      ? sedaTeam.filter(profile => overdueByProfile.get(profile.id)?.length)
      : filterProfilesByTrainingStatus(sedaTeam, statusFilter)
    if (query.trim()) {
      const normalized = query.toLowerCase()
      list = list.filter(profile => `${profile.name} ${profile.email}`.toLowerCase().includes(normalized))
    }
    return list
  }, [sedaTeam, statusFilter, query, overdueByProfile])

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Supervisor view</p>
          <h1 className="mt-1 text-[25px] font-bold">TA Training</h1>
          <p className="mt-2 text-[13px] text-slate-500">Monitor training enrollment and video completion for Seda Hancer&apos;s team · Fall 2026</p>
        </div>
        <button type="button" onClick={onPreviewTAView} className="rounded border border-brand bg-white px-3 py-2 text-sm font-medium text-brand hover:bg-orange-50">
          Preview TA experience
        </button>
      </header>

      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <Summary icon={<UsersRound size={18} />} label="Team TAs" value={String(teamTrainingSummary.total)} detail="Online TAs this term" />
        <Summary icon={<BookOpenCheck size={18} />} label="Enrolled in training" value={`${teamTrainingSummary.enrolled} / ${teamTrainingSummary.total}`} detail={`${Math.round(teamTrainingSummary.enrolled / teamTrainingSummary.total * 100)}% enrolled`} />
        <Summary icon={<CheckCircle2 size={18} />} label="Completed training" value={`${teamTrainingSummary.completed} / ${teamTrainingSummary.total}`} detail={`${Math.round(teamTrainingSummary.completed / teamTrainingSummary.total * 100)}% complete`} />
        <Summary icon={<AlertTriangle size={18} />} label="Overdue requirements" value={String(overdueAssignments)} detail={`${overdueTAs} TA${overdueTAs === 1 ? '' : 's'} need follow-up`} tone={overdueAssignments ? 'red' : 'green'} />
      </div>

      {overdueAssignments > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} />
          <div><strong className="text-sm">Training follow-up needed</strong><p className="mt-1 text-xs">{overdueAssignments} overdue video requirement{overdueAssignments === 1 ? '' : 's'} across {overdueTAs} teaching assistant{overdueTAs === 1 ? '' : 's'}. Select the Overdue filter to review them.</p></div>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold">Team training progress</h2>
            <p className="mt-1 text-xs text-muted">Track the three required videos for each teaching assistant.</p>
          </div>
          <label className="flex h-10 w-72 items-center gap-2 rounded border border-slate-300 bg-white px-3">
            <Search size={16} className="text-muted" />
            <input
              aria-label="Search teaching assistants"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search name or email"
              className="w-full outline-none"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">
          {statusFilters.map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusFilter === status ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {status === 'all' ? 'All statuses' : status}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Teaching Assistant</th>
                <th>Status</th>
                <th>Progress</th>
                {trainingModules.map(module => (
                  <th key={module.id} className="px-2 text-center"><span className="block">{module.shortLabel}</span><span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal">Due {formatDeadline(module.dueDate)}</span></th>
                ))}
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(profile => {
                const progress = getTrainingProgress(profile.trainingCompletion)
                const overdueModules = overdueByProfile.get(profile.id) ?? []
                const status = overdueModules.length ? 'Overdue' : getTrainingStatus(profile.trainingCompletion)
                return (
                  <tr key={profile.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => onSelectProfile?.(profile.id)} className="text-left">
                        <b className="block text-sm">{profile.name}</b>
                        <span className="text-xs text-muted">{profile.email}</span>
                      </button>
                    </td>
                    <td>
                      <StatusBadge tone={statusTone[status]}>{status}</StatusBadge>
                    </td>
                    <td className="min-w-[180px] pr-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{progress.completed} of {progress.total} videos</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <ProgressBar percentage={progress.percentage} color={progress.percentage === 100 ? 'bg-emerald-500' : 'bg-amber-400'} />
                    </td>
                    {trainingModules.map(module => (
                      <td key={module.id} className="text-center">
                        <ModuleStatus complete={Boolean(profile.trainingCompletion?.[module.id])} overdue={overdueModules.some(item => item.id === module.id)} label={module.shortLabel} />
                      </td>
                    ))}
                    <td className="pr-5 text-right">
                      <button type="button" onClick={() => onSelectProfile?.(profile.id)} aria-label={`View ${profile.name}`} className="text-brand">
                        <ArrowRight size={17} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-muted">No teaching assistants match this filter.</p>
          )}
        </div>
      </Card>
    </>
  )
}

function ModuleStatus({ complete, overdue, label }) {
  return (
    <span
      aria-label={`${label} ${complete ? 'completed' : overdue ? 'overdue' : 'not completed'}`}
      className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-bold ${complete ? 'bg-emerald-100 text-emerald-700' : overdue ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}
    >
      {complete ? '✓' : '·'}
    </span>
  )
}

function Summary({ icon, label, value, detail, tone = 'brand' }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className={`grid size-9 place-items-center rounded-lg ${tone === 'red' ? 'bg-red-50 text-red-600' : tone === 'green' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-brand'}`}>{icon}</span>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <strong className="mt-1 block text-xl text-slate-900">{value}</strong>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
      </div>
    </Card>
  )
}
