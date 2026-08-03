import { useState } from 'react'
import Card from '../ui/Card'
import { surveyWeeks } from '../../data/dashboard'

export default function SurveyCard() {
  const [activeWeek, setActiveWeek] = useState(surveyWeeks[0])
  const total = activeWeek.completed + activeWeek.pending
  const responseRate = Math.round((activeWeek.completed / total) * 100)

  return <Card className="min-h-[322px] p-5"><span className="section-label">TA survey</span><div className="mt-3 grid grid-cols-4 gap-1">{surveyWeeks.map(survey => <button type="button" key={survey.week} aria-pressed={activeWeek.week === survey.week} onClick={() => setActiveWeek(survey)} className={`h-6 rounded text-xs transition-all duration-200 active:scale-95 ${activeWeek.week === survey.week ? 'scale-[1.03] bg-brand font-bold text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:-translate-y-px'}`}>Wk {survey.week}</button>)}</div><div className="flex h-[180px] items-center justify-center gap-4 pt-8"><SurveyDonut percentage={responseRate} week={activeWeek.week} /><div key={activeWeek.week} className="survey-details text-xs text-slate-500"><Legend color="bg-emerald-500" label="Completed" value={activeWeek.completed} total={total} /><Legend color="bg-slate-200" label="Pending" value={activeWeek.pending} total={total} /><div className="mt-4 text-muted">{responseRate}% response danger rate</div></div></div></Card>
}

function SurveyDonut({ percentage, week }) {
  return <div role="img" aria-label={`${percentage}% survey response rate for week ${week}`} className="survey-donut relative h-[84px] w-[84px] shrink-0 rounded-full" style={{ '--survey-angle': `${percentage * 3.6}deg` }}><span className="absolute inset-[12px] grid place-items-center rounded-full bg-white text-xs font-bold text-slate-700">{percentage}%</span></div>
}

function Legend({ color, label, value, total }) {
  return <div className="my-1.5 flex items-start gap-2"><i className={`mt-0.5 size-2.5 rounded-full ${color}`} /><div>{label}<br /><b className="font-medium text-slate-700">{value} <span className="text-muted">/ {total}</span></b></div></div>
}
