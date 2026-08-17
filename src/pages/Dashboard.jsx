import { useMemo, useState } from 'react'
import ActionBoard from '../components/dashboard/ActionBoard'
import HoursWatch from '../components/dashboard/HoursWatch'
import WeeklyTaskScheduleCard from '../components/dashboard/WeeklyTaskScheduleCard'
import PerformanceCard from '../components/dashboard/PerformanceCard'
import SurveyCard from '../components/dashboard/SurveyCard'
import { semesterConfig } from '../data/weeklyTaskSchedule'
import { getCurrentSemesterWeek, toPerformanceWeek } from '../utils/weeklySchedule'

const roles = ['Supervisor', 'Administrator', 'Instructor']

export default function Dashboard({ collapsed, profiles, onSelectProfile, onReviewHoursWatch, onSelectAction }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const current = useMemo(() => getCurrentSemesterWeek(semesterConfig.startDate), [])
  const defaultWeek = current.week ?? 'T-2'
  const [scheduleWeek, setScheduleWeek] = useState(defaultWeek)
  const performanceWeek = toPerformanceWeek(scheduleWeek) ?? (typeof defaultWeek === 'number' ? defaultWeek : 1)

  function handleScheduleWeekChange(week) {
    setScheduleWeek(week)
  }

  function handlePerformanceWeekChange(week) {
    setScheduleWeek(week)
  }

  return (
    <main className={`min-h-screen px-[31px] pb-16 pt-[130px] transition-all ${collapsed ? 'ml-16' : 'ml-56'}`}>
      <div className="mx-auto max-w-[1291px]">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="mt-1 text-[25px] font-bold leading-none">My team this term</h1>
            <p className="mt-2 text-[13px] text-slate-500">Online TAs · Fall 2026 ·</p>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="section-label font-semibold">Term</span>
            <select className="h-9 min-w-[158px] rounded border border-slate-300 bg-white px-3">
              <option>Fall 2026 · default</option>
              <option>Spring 2027</option>
            </select>
            <button
              onClick={() => setRoleIndex(index => (index + 1) % roles.length)}
              className="flex h-10 min-w-[315px] items-center gap-2 rounded border-2 border-brand bg-white px-3"
            >
              <span className="section-label font-semibold">Viewing as</span>
              <strong className="font-medium text-brand">{roles[roleIndex]}</strong>
              <span className="ml-auto text-brand">⌄</span>
              <span className="text-muted">—</span>
              <span>Seda Hancer</span>
            </button>
          </div>
        </header>

        <div className="mt-[26px] grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[2.06fr_1fr_1fr_1fr]">
          <div className="lg:col-span-2 xl:col-span-1">
            <ActionBoard onSelectAction={onSelectAction} />
          </div>
          <WeeklyTaskScheduleCard
            viewingAs={roles[roleIndex]}
            selectedWeek={scheduleWeek}
            onWeekChange={handleScheduleWeekChange}
          />
          <SurveyCard />
          <HoursWatch
            profiles={profiles}
            week={performanceWeek}
            scheduleWeek={scheduleWeek}
            onSelectProfile={onSelectProfile}
            onReviewList={alerts => onReviewHoursWatch?.(performanceWeek, alerts)}
          />
        </div>

        <PerformanceCard selectedWeek={performanceWeek} onWeekChange={handlePerformanceWeekChange} />
      </div>
    </main>
  )
}
