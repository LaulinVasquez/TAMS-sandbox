import { BookOpen, BriefcaseBusiness, CalendarDays, ChevronLeft, ChevronRight, Gauge, GraduationCap, LayoutGrid, SlidersHorizontal, UsersRound, Waypoints } from 'lucide-react'

const primary = [
  { label: 'Dashboard', icon: LayoutGrid, view: 'dashboard' }, { label: 'Sections', icon: BookOpen },
  { label: 'Courses', icon: GraduationCap, view: 'courses' }, { label: 'TAs', icon: UsersRound, view: 'tas' },
  { label: 'TA Training', icon: GraduationCap, view: 'ta-training' }, { label: 'Instructors', icon: UsersRound },
]
const boards = [
  { label: 'Hiring Assistant', icon: BriefcaseBusiness }, { label: 'Scheduling Assistant', icon: CalendarDays },
  { label: 'Monitoring', icon: Waypoints }, { label: 'Management', icon: SlidersHorizontal },
]

function NavItem({ item, collapsed, activeView, onNavigate }) {
  const Icon = item.icon
  const active = item.view === activeView
  return <button type="button" onClick={() => item.view && onNavigate(item.view)} title={item.label} className={`mb-px flex h-[38px] w-full items-center gap-3 rounded-md px-3 text-sm ${collapsed ? 'justify-center' : ''} ${active ? 'border-l-2 border-brand bg-orange-50 pl-[10px] text-brand' : 'text-slate-700 hover:bg-slate-50'}`}><Icon size={16} strokeWidth={1.7} /><span className={collapsed ? 'hidden' : ''}>{item.label}</span></button>
}

export default function Sidebar({ activeView, collapsed, onNavigate, onToggle }) {
  return <aside className={`fixed bottom-0 left-0 top-[3px] z-50 flex flex-col border-r border-slate-200 bg-white transition-all ${collapsed ? 'w-16' : 'w-56'}`}><div className="flex h-[59px] items-center border-b border-slate-100 px-4 font-bold"><div className="grid size-7 place-items-center rounded bg-brand text-[10px] text-white">TAMS</div><span className={`ml-2 ${collapsed ? 'hidden' : ''}`}>TAMS</span></div><nav className="overflow-y-auto p-2 pt-3">{primary.map(item => <NavItem key={item.label} item={item} collapsed={collapsed} activeView={activeView} onNavigate={onNavigate} />)}{!collapsed && <div className="mb-2 mt-4 flex justify-between px-3 text-xs text-muted">ACTION BOARDS <span>⌄</span></div>}{boards.map(item => <NavItem key={item.label} item={item} collapsed={collapsed} activeView={activeView} onNavigate={onNavigate} />)}{!collapsed && <><div className="mb-2 mt-4 flex justify-between px-3 text-xs text-muted">REPORTS <ChevronRight size={13} /></div><div className="mb-2 mt-7 flex justify-between px-3 text-xs text-muted">ADMIN <ChevronRight size={13} /></div></>}</nav><button onClick={onToggle} className="mt-auto flex h-10 items-center gap-2 border-t border-slate-100 px-5 text-xs text-muted hover:bg-slate-50">{collapsed ? <Gauge size={16} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}</button></aside>
}
