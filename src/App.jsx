import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { getTAProfile, taProfiles } from './data/taProfiles'
import Dashboard from './pages/Dashboard'
import TADirectory from './pages/TADirectory'
import TAProfile from './pages/TAProfile'
import TATraining from './pages/TATraining'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import { buildImportedWorkdayRecord, summarizeImportedWeek } from './utils/timeStatsImport'
import { applyTimeStatsImports, loadTimeStatsImports, saveTimeStatsImport } from './utils/timeStatsStorage'
import { filterProfilesByFlag } from './utils/profiles'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('tams-theme')
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [view, setView] = useState('dashboard')
  const [selectedTA, setSelectedTA] = useState(taProfiles[0].id)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [directoryFilter, setDirectoryFilter] = useState(null)
  const [directoryQuery, setDirectoryQuery] = useState('')
  const [trainingStatusFilter, setTrainingStatusFilter] = useState('all')
  const [timeStatsImports, setTimeStatsImports] = useState(() => loadTimeStatsImports())
  const profiles = useMemo(() => applyTimeStatsImports(taProfiles, timeStatsImports), [timeStatsImports])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light'
    localStorage.setItem('tams-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const openProfile = id => {
    setSelectedTA(id)
    setView('profile')
  }

  const openHoursWatchList = (week, alerts) => {
    setDirectoryQuery('')
    setDirectoryFilter({ ids: alerts.map(alert => alert.id), label: `Hours watch · Week ${week}` })
    setView('tas')
  }

  const openDirectorySearch = query => {
    setDirectoryFilter(null)
    setDirectoryQuery(query)
    setView('tas')
  }

  const handleNavigate = nextView => {
    if (nextView === 'tas') {
      setDirectoryFilter(null)
      setDirectoryQuery('')
    }
    if (nextView === 'ta-training') setTrainingStatusFilter('all')
    setView(nextView)
  }

  const handleActionSelect = item => {
    const destination = item.destination
    if (!destination) return
    if (destination.view === 'ta-training') {
      setTrainingStatusFilter(destination.status || 'all')
      setView('ta-training')
      return
    }
    if (destination.view === 'tas') {
      setDirectoryQuery('')
      setDirectoryFilter({
        ids: filterProfilesByFlag(profiles, destination.flag).map(profile => profile.id),
        label: destination.label,
      })
      setView('tas')
    }
  }

  const importTimeStats = (parsed, week, replace) => {
    const records = Object.fromEntries(parsed.matched.map(match => [match.profileId, buildImportedWorkdayRecord(parsed, match.iNumber, week)]).filter(([, record]) => record))
    saveTimeStatsImport(week, {
      fileName: parsed.fileName, sheets: parsed.sheets, availableSheets: parsed.availableSheets,
      missingSheets: parsed.missingSheets, matched: parsed.matched, unmatched: parsed.unmatched,
      recordCount: parsed.recordCount, records, summary: summarizeImportedWeek(parsed, profiles.length),
    }, { replace })
    setTimeStatsImports(loadTimeStatsImports())
  }

  if (view === 'profile') {
    return <TAProfile profile={profiles.find(profile => profile.id === selectedTA) ?? getTAProfile(selectedTA)} onBack={() => setView('tas')} onDashboard={() => setView('dashboard')} />
  }

  if (view === 'course-detail') {
    return <div className="min-h-screen border-t-[3px] border-neutral-800 bg-surface text-ink"><Sidebar activeView="courses" collapsed={collapsed} onNavigate={handleNavigate} onToggle={() => setCollapsed(value => !value)} /><Topbar collapsed={collapsed} darkMode={darkMode} onToggleTheme={() => setDarkMode(value => !value)} profiles={profiles} onSelectProfile={openProfile} onViewAllResults={openDirectorySearch} /><CourseDetail courseId={selectedCourse} collapsed={collapsed} onBack={() => setView('courses')} /><button aria-label="Open help" className="fixed bottom-3 right-3 grid size-[34px] place-items-center rounded-full border-2 border-neutral-500 bg-neutral-800 text-xl text-white shadow-md">?</button></div>
  }

  return (
    <div className="min-h-screen border-t-[3px] border-neutral-800 bg-surface text-ink transition-colors">
      <Sidebar activeView={view} collapsed={collapsed} onNavigate={handleNavigate} onToggle={() => setCollapsed(value => !value)} />
      <Topbar collapsed={collapsed} darkMode={darkMode} onToggleTheme={() => setDarkMode(value => !value)} profiles={profiles} onSelectProfile={openProfile} onViewAllResults={openDirectorySearch} />
      <div className={`fixed right-0 top-[62px] z-30 flex h-9 items-center justify-center bg-brand text-xs text-white transition-all ${collapsed ? 'left-16' : 'left-56'}`}><strong>Wireframe preview</strong>&nbsp;· stakeholder review only · use the role switcher to compare layouts</div>
      {view === 'dashboard' && <Dashboard collapsed={collapsed} profiles={profiles} timeStatsImports={timeStatsImports} onImportTimeStats={importTimeStats} onSelectProfile={openProfile} onReviewHoursWatch={openHoursWatchList} onSelectAction={handleActionSelect} />}
      {view === 'tas' && <TADirectory collapsed={collapsed} profiles={profiles} onSelect={openProfile} filterIds={directoryFilter?.ids} filterLabel={directoryFilter?.label} onClearFilter={() => setDirectoryFilter(null)} initialQuery={directoryQuery} />}
      {view === 'ta-training' && <TATraining collapsed={collapsed} profiles={profiles} onSelectProfile={openProfile} initialStatusFilter={trainingStatusFilter} />}
      {view === 'courses' && <Courses collapsed={collapsed} onSelect={id => { setSelectedCourse(id); setView('course-detail') }} />}
      <button aria-label="Open help" className="fixed bottom-3 right-3 grid size-[34px] place-items-center rounded-full border-2 border-neutral-500 bg-neutral-800 text-xl text-white shadow-md">?</button>
    </div>
  )
}
