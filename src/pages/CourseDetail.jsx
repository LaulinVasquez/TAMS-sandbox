import { useEffect, useMemo, useState } from 'react'
import { getCourse } from '../data/courses'
import { loadCoursePlan, saveCoursePlan } from '../utils/coursePlan'

const card = 'rounded-[11px] border border-slate-200 bg-white p-[18px]'
const input = 'h-9 rounded-md border border-slate-300 bg-white px-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200'
const dutiesSeed = [
  { id: 1, responsibility: 'Grading', description: 'Consistently grade assignments, discussion boards, and projects throughout each week.', hours: 4.5 },
  { id: 2, responsibility: 'StudentOutreach', description: 'Responds to questions, aids struggling students, provides feedback, and/or offers support.', hours: .5 },
]

export default function CourseDetail({ courseId, collapsed, onBack }) {
  const course = getCourse(courseId)
  const notesKey = `tams-course-notes-${course.id}`
  const [note, setNote] = useState('')
  const [staffOnly, setStaffOnly] = useState(true)
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem(notesKey) || '[]'))
  const [duties, setDuties] = useState(dutiesSeed)
  const [nonRegular, setNonRegular] = useState([])
  const [plan, setPlan] = useState(() => loadCoursePlan(course))
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    setNotes(JSON.parse(localStorage.getItem(notesKey) || '[]'))
    setPlan(loadCoursePlan(course))
  }, [course, notesKey])
  const weeklyHours = useMemo(() => duties.reduce((sum, duty) => sum + Number(duty.hours || 0), 0), [duties])
  const updateDuty = (id, field, value) => setDuties(items => items.map(item => item.id === id ? { ...item, [field]: value } : item))
  const addNote = () => { if (!note.trim()) return; const next = [{ id: Date.now(), text: note.trim(), staffOnly, date: new Date().toLocaleDateString() }, ...notes]; setNotes(next); localStorage.setItem(notesKey, JSON.stringify(next)); setNote('') }
  const updatePlan = (field, value) => setPlan(current => ({ ...current, [field]: value }))
  const persistPlan = () => {
    saveCoursePlan(course.id, plan)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return <main className={`min-h-screen px-8 pb-12 pt-[84px] transition-all ${collapsed ? 'ml-16' : 'ml-56'}`}>
    <div className="mx-auto max-w-[1536px] text-[13px]">
      <button onClick={onBack} className="mb-1 text-xs text-slate-700 hover:text-brand">Courses</button>
      <h1 className="text-[25px] font-semibold text-slate-950">{course.code}</h1>
      <p className="mb-4 mt-1 text-slate-700">{course.name} · {course.department}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={card}><h2 className="mb-2 text-xs font-bold uppercase">Course</h2><dl className="grid grid-cols-[110px_1fr] gap-y-2"><dt>Status</dt><dd><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold">{course.status}</span></dd><dt>Sections</dt><dd>{course.sections}</dd><dt>Unassigned</dt><dd>{course.unassigned}</dd><dt>TA Plan</dt><dd>Draft</dd><dt>TAP weekly hrs</dt><dd>{course.tapWeeklyHours ?? '—'}</dd></dl></section>
        <section className={card}><h2 className="mb-2 text-xs font-bold uppercase">Course notes (persistent)</h2><textarea value={note} onChange={e => setNote(e.target.value)} rows="2" className="w-full resize-y rounded-md border border-slate-300 p-2 text-base outline-none focus:border-sky-500" placeholder="Add a note..."/><div className="mt-3 flex items-center gap-3"><label className="flex items-center gap-1.5"><input type="checkbox" checked={staffOnly} onChange={e => setStaffOnly(e.target.checked)}/>Staff-only</label><button onClick={addNote} className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={!note.trim()}>Add note</button></div><div className="mt-3 space-y-2">{notes.length ? notes.map(item => <div key={item.id} className="rounded border border-slate-100 bg-slate-50 p-2"><p>{item.text}</p><small className="text-slate-500">{item.date}{item.staffOnly ? ' · Staff-only' : ''}</small></div>) : <p className="text-slate-600">No notes yet.</p>}</div></section>
      </div>
      <section className={`${card} mt-4`}><h2 className="mb-3 text-xs font-bold uppercase">Resources</h2><ul className="list-disc space-y-1 pl-6 text-sm"><li><b>TA Plan</b> — <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">Draft</span> — edit below</li><li><b>Course notes</b> — persistent, travel with the course every term (panel above)</li><li><b>Section notes</b> — term-scoped, archive with the section (on each section page)</li></ul></section>
      <section className={`${card} mt-4`}><div className="flex items-center gap-2"><h2 className="text-xs font-bold uppercase">TA Plan</h2><span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] uppercase text-amber-700">Draft</span></div><p className="my-3 text-sm"><b>{weeklyHours.toFixed(2)}</b> hrs/week <b className="ml-5">{nonRegular.reduce((sum, item) => sum + Number(item.hours || 0), 0)}</b> non-regular hrs/term</p>
        <h3 className="mb-2 text-xs font-bold uppercase">Weekly duties</h3><div className="hidden grid-cols-[1fr_1.05fr_90px_150px] gap-4 border-b border-slate-200 px-2 pb-2 lg:grid"><span>Responsibility</span><span>Description</span><span>Hrs/wk</span></div>
        {duties.map(duty => <div key={duty.id} className="grid gap-2 border-b border-slate-100 py-2 lg:grid-cols-[1fr_1.05fr_90px_150px] lg:gap-4"><select className={input} value={duty.responsibility} onChange={e => updateDuty(duty.id, 'responsibility', e.target.value)}><option>Grading</option><option>StudentOutreach</option><option>Office Hours</option><option>Course Support</option></select><input aria-label="Duty description" className={input} value={duty.description} onChange={e => updateDuty(duty.id, 'description', e.target.value)}/><input aria-label="Hours per week" type="number" min="0" step="0.25" className={input} value={duty.hours} onChange={e => updateDuty(duty.id, 'hours', e.target.value)}/><button onClick={() => setDuties(items => items.filter(item => item.id !== duty.id))} className="text-brand hover:underline">Remove</button></div>)}
        <button onClick={() => setDuties(items => [...items, { id: Date.now(), responsibility: 'Grading', description: '', hours: 0 }])} className="mt-2 rounded-md border border-sky-600 px-3 py-1.5 font-semibold text-sky-700">+ Weekly duty</button>
        <h3 className="mb-2 mt-5 text-xs font-bold uppercase">Non-regular duties</h3>{nonRegular.length ? nonRegular.map(item => <div key={item.id} className="mb-2 flex gap-2"><input aria-label="Non-regular duty description" className={`${input} flex-1`} value={item.description} onChange={e => setNonRegular(rows => rows.map(row => row.id === item.id ? {...row, description:e.target.value}:row))}/><input aria-label="Non-regular duty hours" type="number" min="0" step="0.25" className={`${input} w-24`} value={item.hours} onChange={e => setNonRegular(rows => rows.map(row => row.id === item.id ? {...row, hours:e.target.value}:row))}/><button onClick={() => setNonRegular(rows => rows.filter(row => row.id !== item.id))} className="px-3 text-brand">Remove</button></div>) : <p>No non-regular duties yet.</p>}<button onClick={() => setNonRegular(items => [...items, {id:Date.now(), description:'', hours:0}])} className="mt-3 rounded-md border border-sky-600 px-3 py-1.5 font-semibold text-sky-700">+ Non-regular duty</button>
        <h3 className="mb-2 mt-5 text-xs font-bold uppercase">Details</h3>
        <label className="block text-xs uppercase">Job description<textarea value={plan.jobDescription} onChange={e => updatePlan('jobDescription', e.target.value)} rows="5" className="mt-2 w-full rounded-md border border-slate-300 p-2 normal-case outline-none focus:border-sky-500"/></label>
        <label className="mt-3 block text-xs uppercase">Job duties<textarea value={plan.jobDuties} onChange={e => updatePlan('jobDuties', e.target.value)} rows="3" className="mt-2 w-full rounded-md border border-slate-300 p-2 normal-case outline-none focus:border-sky-500"/></label>
        <label className="mt-3 block text-xs uppercase">Job expectations<textarea value={plan.jobExpectations} onChange={e => updatePlan('jobExpectations', e.target.value)} rows="7" className="mt-2 w-full rounded-md border border-slate-300 p-2 normal-case outline-none focus:border-sky-500"/></label>
        <label className="mt-3 block text-xs uppercase">Position requirements<textarea value={plan.positionRequirements} onChange={e => updatePlan('positionRequirements', e.target.value)} rows="3" className="mt-2 w-full rounded-md border border-slate-300 p-2 normal-case outline-none focus:border-sky-500"/></label>
        <fieldset className="mt-3 border-0 p-0"><legend className="text-xs uppercase">Supplemental training and/or required certificate</legend><label className="mt-2 block max-w-xs text-xs text-slate-700">Requires certification<select value={plan.requiresCertification} onChange={e => updatePlan('requiresCertification', e.target.value)} className="mt-1 block h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-sky-500"><option>No</option><option>Yes</option></select></label>{plan.requiresCertification === 'Yes' && <label className="mt-3 block text-xs uppercase">Certification / training description<textarea value={plan.certificationDescription} onChange={e => updatePlan('certificationDescription', e.target.value)} rows="3" className="mt-2 w-full rounded-md border border-slate-300 p-2 normal-case outline-none focus:border-sky-500" placeholder="Describe required certification, supplemental training, or course-specific details."/></label>}</fieldset>
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4"><button onClick={persistPlan} className="rounded-md bg-sky-600 px-4 py-2 font-semibold text-white">{saved ? 'Saved' : 'Save'}</button><button onClick={persistPlan} className="rounded-md border border-sky-600 px-4 py-2 font-semibold text-sky-700">Submit for approval</button><button className="ml-auto font-semibold text-sky-700">History</button></div>
      </section>
      <section className={`${card} mt-4`}><h2 className="mb-4 text-xs font-bold uppercase">Sections this term</h2><p>No sections this term.</p></section>
    </div>
  </main>
}
