import { ChevronDown, Download, Search, Settings2, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { courses, totalCourseCount } from '../data/courses'

const buttonClass = 'inline-flex h-[30px] items-center gap-1.5 rounded border border-slate-200 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50'

export default function Courses({ collapsed, onSelect }) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('all')
  const [compact, setCompact] = useState(true)
  const departments = [...new Set(courses.map(course => course.department))]
  const filtered = useMemo(() => courses.filter(course => {
    const matchesQuery = `${course.code} ${course.name} ${course.department}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (department === 'all' || course.department === department)
  }), [query, department])

  const exportCourses = () => {
    const rows = [['Course', 'Name', 'Department', 'Status', 'Sections', 'Unassigned'], ...filtered.map(c => [c.code, c.name, c.department, c.status, c.sections, c.unassigned])]
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'courses.csv'; link.click(); URL.revokeObjectURL(link.href)
  }

  return <main className={`min-h-screen px-8 pb-16 pt-[84px] transition-all ${collapsed ? 'ml-16' : 'ml-56'}`}>
    <div className="mx-auto max-w-[1538px]">
      <header className="mb-4">
        <h1 className="text-[25px] font-semibold text-slate-950">Courses</h1>
        <p className="mt-1 text-[13px] text-slate-700">Every course marked Instructor Led TA, across all terms. Section counts cover the current and upcoming terms. Click a row to open course detail.</p>
      </header>
      <div className="mb-3 flex min-h-[48px] flex-wrap items-center gap-2 rounded-[10px] border border-brand bg-white px-3 py-2">
        <label className="flex h-[30px] w-[250px] items-center gap-2 rounded border border-slate-200 px-2.5 text-slate-500 focus-within:border-brand">
          <Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 outline-none" placeholder="Search course, name, department" aria-label="Search courses" />
        </label>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">{query || department !== 'all' ? filtered.length : totalCourseCount} courses</span>
        <label className={buttonClass}><SlidersHorizontal size={13}/><span className="sr-only">Filter by department</span><select value={department} onChange={e => setDepartment(e.target.value)} className="max-w-[130px] border-0 bg-transparent outline-none"><option value="all">+ Filter</option>{departments.map(item => <option key={item}>{item}</option>)}</select></label>
        <div className="ml-auto flex gap-2">
          <button onClick={exportCourses} className={buttonClass}><Download size={14}/>Export<ChevronDown size={12}/></button>
          <button onClick={() => setCompact(value => !value)} className={buttonClass}><Settings2 size={14}/>View<ChevronDown size={12}/></button>
        </div>
      </div>
      <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
        <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-[13px]">
          <thead className="bg-slate-50 text-[11px] uppercase text-slate-700"><tr><th className="px-4 py-2.5">Course</th><th>Name ↕</th><th>Department ↕</th><th>Status</th><th>Sections ↕</th><th>Unassigned</th><th>Notes</th></tr></thead>
          <tbody>{filtered.map(course => <tr key={course.id} tabIndex={0} onClick={() => onSelect(course.id)} onKeyDown={e => e.key === 'Enter' && onSelect(course.id)} className="cursor-pointer border-t border-slate-100 hover:bg-orange-50/50 focus:bg-orange-50 focus:outline-none">
            <td className={`px-4 font-semibold text-slate-950 ${compact ? 'py-[9px]' : 'py-4'}`}>{course.code}</td><td>{course.name}</td><td className="text-slate-600">{course.department || '—'}</td><td><span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">{course.status}</span></td><td>{course.sections}</td><td>{course.unassigned}</td><td>{course.notes || '—'}</td>
          </tr>)}</tbody>
        </table></div>
        {!filtered.length && <p className="p-10 text-center text-sm text-slate-500">No courses match the current filters.</p>}
      </div>
    </div>
  </main>
}
