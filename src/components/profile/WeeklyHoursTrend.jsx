import Card from '../ui/Card'
import { getWorkdayStatus } from '../../utils/profileMetrics'

const width = 840
const height = 268
const left = 48
const right = 24
const top = 28
const bottom = 52

export default function WeeklyHoursTrend({ records, selectedWeek, onSelectWeek }) {
  const available = records.filter(Boolean)
  if (!available.length) return null

  const maxHours = Math.ceil(Math.max(...available.flatMap(row => [row.expectedHours, row.workedHours]), 1) / 5) * 5
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const x = week => left + ((week - 1) / 13) * plotWidth
  const y = value => top + plotHeight - (value / maxHours) * plotHeight
  const line = key => available.map(row => `${x(row.week)},${y(row[key])}`).join(' ')
  const selected = records.find(row => row?.week === selectedWeek)
  const selectedX = selected ? x(selected.week) : null
  const selectedY = selected ? y(selected.workedHours) : null

  return <Card className="overflow-hidden">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6">
      <div>
        <h2 className="font-semibold">Weekly Hours Trend</h2>
        <p className="mt-1 text-xs text-muted">Select a data point to inspect a week</p>
      </div>
      <div className="flex gap-4 rounded-md bg-slate-50 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-slate-400" />Expected hours</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-blue-600" />Worked hours</span>
      </div>
    </header>

    <div className="p-4 sm:p-6">
      <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
        <svg className="min-w-[760px]" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Weekly expected and worked hours trend">
          <text x="16" y={height / 2} textAnchor="middle" transform={`rotate(-90 16 ${height / 2})`} className="fill-slate-400 text-[10px] uppercase tracking-wide">Hours</text>

          {[0, .25, .5, .75, 1].map(mark => {
            const value = Math.round(maxHours * mark)
            return <g key={mark}>
              <line x1={left} x2={width - right} y1={y(value)} y2={y(value)} className="stroke-slate-100" />
              <text x={left - 10} y={y(value) + 4} textAnchor="end" className="fill-slate-400 text-[10px]">{value}</text>
            </g>
          })}

          <polyline points={line('expectedHours')} fill="none" className="stroke-slate-400" strokeWidth="2" strokeDasharray="5 5" />

          {selected && <g aria-hidden="true">
            <line x1={selectedX} x2={selectedX} y1={top} y2={top + plotHeight} className="stroke-blue-300" strokeWidth="1.5" strokeDasharray="3 5" />
            <circle cx={selectedX} cy={selectedY} r="11" className="fill-blue-100 opacity-80" />
          </g>}

          <polyline points={line('workedHours')} fill="none" className="stroke-blue-600" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

          {available.map(row => {
            const active = row.week === selectedWeek
            return <g key={row.week} className="cursor-pointer outline-none" tabIndex="0" role="button" aria-pressed={active} aria-label={`Week ${row.week}: ${row.workedHours} worked of ${row.expectedHours} expected`} onClick={() => onSelectWeek(row.week)} onKeyDown={event => {
              if (['Enter', ' '].includes(event.key)) {
                event.preventDefault()
                onSelectWeek(row.week)
              }
            }}>
              <circle cx={x(row.week)} cy={y(row.workedHours)} r={active ? 6 : 4} className={active ? 'fill-blue-600 stroke-white' : 'fill-white stroke-blue-600 hover:fill-blue-100'} strokeWidth="2">
                <title>{`Week ${row.week}\nWorked: ${row.workedHours} hrs\nExpected: ${row.expectedHours} hrs\nDifference: ${(row.workedHours - row.expectedHours).toFixed(2)} hrs\nStatus: ${getWorkdayStatus(row)}`}</title>
              </circle>
              {active
                ? <g><rect x={x(row.week) - 15} y={height - 32} width="30" height="21" rx="10.5" className="fill-blue-600" /><text x={x(row.week)} y={height - 18} textAnchor="middle" className="fill-white text-[10px] font-semibold">W{row.week}</text></g>
                : <text x={x(row.week)} y={height - 18} textAnchor="middle" className="fill-slate-400 text-[10px]">{row.week}</text>}
            </g>
          })}
        </svg>
      </div>
    </div>

    {selected && <footer className="grid grid-cols-2 gap-px border-t border-slate-100 bg-slate-100 sm:grid-cols-5">
      <TrendDetail label="Selected" value={`Week ${selected.week}`} />
      <TrendDetail label="Worked" value={`${selected.workedHours} hrs`} />
      <TrendDetail label="Expected" value={`${selected.expectedHours} hrs`} />
      <TrendDetail label="Difference" value={`${selected.workedHours - selected.expectedHours > 0 ? '+' : ''}${(selected.workedHours - selected.expectedHours).toFixed(2)} hrs`} tone={selected.workedHours < selected.expectedHours ? 'text-red-600' : 'text-emerald-600'} />
      <TrendDetail label="Status" value={getWorkdayStatus(selected)} />
    </footer>}
  </Card>
}

function TrendDetail({ label, value, tone = 'text-slate-800' }) {
  return <div className="bg-white px-5 py-4"><span className="block text-[10px] uppercase tracking-wide text-muted">{label}</span><strong className={`mt-1 block text-sm ${tone}`}>{value}</strong></div>
}
