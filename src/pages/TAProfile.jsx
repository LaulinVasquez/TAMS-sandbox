import { ChevronLeft, LayoutDashboard, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import OnboardingTab from '../components/profile/OnboardingTab'
import OverviewTab from '../components/profile/OverviewTab'
import PerformanceTab from '../components/profile/PerformanceTab'
import StatusBadge from '../components/profile/StatusBadge'

const tabs = ['overview', 'onboarding', 'performance']

export default function TAProfile({ profile, onBack, onDashboard }) {
  const [activeTab, setActiveTab] = useState('overview')
  return <main className="min-h-screen bg-slate-100 p-6 sm:p-8 lg:px-[max(32px,calc((100vw-1120px)/2))]"><p className="mb-3 text-sm text-slate-500">TAs / {profile.name}</p><header className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">{profile.name}</h1><p className="mt-1 text-slate-500">{profile.role}</p><div className="mt-2 flex gap-2"><StatusBadge tone={profile.returning ? 'green' : 'blue'}>{profile.returning ? 'Returning' : 'New Hire'}</StatusBadge><StatusBadge tone={profile.level === 'Level 3' ? 'red' : profile.level === 'Level 2' ? 'amber' : 'green'}>{profile.level}</StatusBadge></div></div><div className="flex gap-2"><button onClick={onDashboard} className="profile-button"><LayoutDashboard size={15} />Dashboard</button><button onClick={onBack} className="profile-button"><ChevronLeft size={15} />Back</button><button aria-label="More profile actions" className="profile-button px-2"><MoreHorizontal size={16} /></button></div></header><nav aria-label="Profile sections" className="mb-6 flex border-b border-slate-200">{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`mr-1 border-b-2 px-4 py-2 capitalize ${activeTab === tab ? 'border-blue-600 font-medium text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>{tab}</button>)}</nav>{activeTab === 'overview' && <OverviewTab profile={profile} />}{activeTab === 'onboarding' && <OnboardingTab profile={profile} />}{activeTab === 'performance' && <PerformanceTab profile={profile} />}</main>
}
