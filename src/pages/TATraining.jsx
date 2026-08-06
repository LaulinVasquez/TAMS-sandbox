import { BookOpenCheck, CalendarClock, CheckCircle2, Clock3, PlayCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'

const modules = [
  { title: 'TA Foundations', description: 'Role expectations, communication standards, and student support.', duration: '35 min', progress: 100 },
  { title: 'Grading and Feedback', description: 'Apply rubrics consistently and provide actionable feedback.', duration: '45 min', progress: 65 },
  { title: 'Workday Timekeeping', description: 'Record hours accurately and follow weekly pacing expectations.', duration: '20 min', progress: 0 },
]

export default function TATraining({ collapsed }) {
  const [activeTab, setActiveTab] = useState('start')
  const completed = modules.filter(module => module.progress === 100).length
  const overallProgress = Math.round(modules.reduce((total, module) => total + module.progress, 0) / modules.length)

  return <main className={`min-h-screen px-[31px] pb-16 pt-[130px] transition-all ${collapsed ? 'ml-16' : 'ml-56'}`}>
    <div className="mx-auto max-w-[1291px]">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Learning and development</p>
          <h1 className="mt-1 text-[25px] font-bold">TA Training</h1>
          <p className="mt-2 text-[13px] text-slate-500">Manage required training and track completion for Fall 2026.</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:opacity-90"><PlayCircle size={16} />Continue training</button>
      </header>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Summary icon={<BookOpenCheck size={18} />} label="Training modules" value={modules.length} detail="Assigned this term" />
        <Summary icon={<CheckCircle2 size={18} />} label="Completed" value={`${completed} of ${modules.length}`} detail={`${overallProgress}% overall progress`} />
        <Summary icon={<CalendarClock size={18} />} label="Next deadline" value="Sep 18" detail="Grading and Feedback" />
      </div>

      <Card className="overflow-hidden">
        <header className="p-6 pb-0"><h2 className="font-semibold">Required training</h2><p className="mt-1 text-xs text-muted">Begin with the orientation video, then complete each assigned module.</p>
          <nav aria-label="Required training sections" className="mt-5 flex overflow-x-auto border-b border-slate-200">
            <TrainingTab active={activeTab === 'start'} onClick={() => setActiveTab('start')}>Start Here</TrainingTab>
            <TrainingTab active={activeTab === 'academic-partnership'} onClick={() => setActiveTab('academic-partnership')}>Academic Partnership Weekly Communication</TrainingTab>
            <TrainingTab active={activeTab === 'modules'} onClick={() => setActiveTab('modules')}>Modules</TrainingTab>
          </nav>
        </header>
        {activeTab === 'start' && <section className="p-6 pt-5" aria-labelledby="start-here-heading">
          <div className="mb-4"><h3 id="start-here-heading" className="font-semibold text-slate-900">TA Training Orientation</h3><p className="mt-1 text-xs text-muted">Watch this introduction before beginning the required modules.</p></div>
          <ResponsiveKalturaPlayer
            title="TA Training Orientation"
            src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/41338032/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player&amp;entry_id=1_p1qlb8dj&amp;flashvars[localizationCode]=en&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&amp;wid=1_1j4dayje"
          />
        </section>}
        {activeTab === 'academic-partnership' && <section className="p-6 pt-5" aria-labelledby="academic-partnership-heading">
          <div className="mb-4"><h3 id="academic-partnership-heading" className="font-semibold text-slate-900">Academic Partnership Weekly Communication</h3><p className="mt-1 text-xs text-muted">Review the weekly communication expectations for supporting a strong academic partnership.</p></div>
          <ResponsiveKalturaPlayer
            title="Academic Partnership Weekly Communication"
            src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/41338032/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player&amp;entry_id=1_3ppt8f72&amp;flashvars[localizationCode]=en&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&amp;wid=1_ucnsgb7f"
          />
        </section>}
        {activeTab === 'modules' && <div className="divide-y divide-slate-100">
          {modules.map(module => <article key={module.title} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${module.progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-brand'}`}>{module.progress === 100 ? <CheckCircle2 size={19} /> : <BookOpenCheck size={19} />}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{module.title}</h3><span className="flex items-center gap-1 text-xs text-muted"><Clock3 size={13} />{module.duration}</span></div>
              <p className="mt-1 text-xs text-slate-500">{module.description}</p>
              <div className="mt-3 flex items-center gap-3"><ProgressBar percentage={module.progress} color={module.progress === 100 ? 'bg-emerald-500' : 'bg-brand'} /><span className="w-9 text-right text-xs font-medium">{module.progress}%</span></div>
            </div>
            <button className="self-start rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:self-center">{module.progress === 100 ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}</button>
          </article>)}
        </div>}
      </Card>
    </div>
  </main>
}

function ResponsiveKalturaPlayer({ src, title }) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const resize = () => setScale(Math.min(container.clientWidth / 608, 1))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return <div ref={containerRef} className="mx-auto w-full max-w-[608px] overflow-hidden rounded-lg border border-slate-200 bg-black shadow-sm" style={{ height: `${402 * scale}px` }}>
    <iframe
      width="608"
      height="402"
      className="block origin-top-left"
      style={{ transform: `scale(${scale})` }}
      src={src}
      title={title}
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  </div>
}

function TrainingTab({ active, onClick, children }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-left text-sm font-medium ${active ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>{children}</button>
}

function Summary({ icon, label, value, detail }) {
  return <Card className="p-5"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-lg bg-orange-50 text-brand">{icon}</span><div><p className="text-xs text-muted">{label}</p><strong className="mt-1 block text-xl text-slate-900">{value}</strong><p className="mt-1 text-xs text-slate-500">{detail}</p></div></div></Card>
}
