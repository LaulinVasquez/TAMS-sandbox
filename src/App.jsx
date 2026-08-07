import { useEffect, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { getTAProfile, taProfiles } from './data/taProfiles'
import Dashboard from './pages/Dashboard'
import TADirectory from './pages/TADirectory'
import TAProfile from './pages/TAProfile'
import TATraining from './pages/TATraining'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('tams-theme')
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [view, setView] = useState('dashboard')
  const [selectedTA, setSelectedTA] = useState(taProfiles[0].id)
  const [hoursWatchFilter, setHoursWatchFilter] = useState(null)

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
    setHoursWatchFilter({ week, ids: alerts.map(alert => alert.id) })
    setView('tas')
  }

  if (view === 'profile') {
    return <TAProfile profile={getTAProfile(selectedTA)} onBack={() => setView('tas')} onDashboard={() => setView('dashboard')} />
  }

  return <div className="min-h-screen border-t-[3px] border-neutral-800 bg-surface text-ink transition-colors"><Sidebar activeView={view} collapsed={collapsed} onNavigate={setView} onToggle={() => setCollapsed(value => !value)} /><Topbar collapsed={collapsed} darkMode={darkMode} onToggleTheme={() => setDarkMode(value => !value)} /><div className={`fixed right-0 top-[62px] z-30 flex h-9 items-center justify-center bg-brand text-xs text-white transition-all ${collapsed ? 'left-16' : 'left-56'}`}><strong>Wireframe preview</strong>&nbsp;· stakeholder review only · use the role switcher to compare layouts</div>{view === 'dashboard' && <Dashboard collapsed={collapsed} profiles={taProfiles} onSelectProfile={openProfile} onReviewHoursWatch={openHoursWatchList} />}{view === 'tas' && <TADirectory collapsed={collapsed} profiles={taProfiles} onSelect={openProfile} filterIds={hoursWatchFilter?.ids} filterLabel={hoursWatchFilter ? `Hours watch · Week ${hoursWatchFilter.week}` : null} onClearFilter={() => setHoursWatchFilter(null)} />}{view === 'ta-training' && <TATraining collapsed={collapsed} profiles={taProfiles} onSelectProfile={openProfile} />}<button aria-label="Open help" className="fixed bottom-3 right-3 grid size-[34px] place-items-center rounded-full border-2 border-neutral-500 bg-neutral-800 text-xl text-white shadow-md">?</button></div>
}
