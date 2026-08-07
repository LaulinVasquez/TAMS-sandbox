import { BookOpenCheck, CalendarClock, Check, CheckCircle2, Circle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Card from '../ui/Card'

const completionKey = 'tams-training-video-completion'
const defaultCompletion = { start: null, academicPartnership: null, generalNotes: null }

export default function TATrainingPlayer({ onBack }) {
  const [activeTab, setActiveTab] = useState('start')
  const [completion, setCompletion] = useState(() => {
    try { return { ...defaultCompletion, ...JSON.parse(localStorage.getItem(completionKey)) } }
    catch { return defaultCompletion }
  })
  const completed = Object.values(completion).filter(Boolean).length
  const overallProgress = Math.round(completed / 3 * 100)

  useEffect(() => localStorage.setItem(completionKey, JSON.stringify(completion)), [completion])

  const updateCompletion = (video, watched) => setCompletion(current => ({ ...current, [video]: watched }))

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">TA experience preview</p>
          <h1 className="mt-1 text-[25px] font-bold">TA Training</h1>
          <p className="mt-2 text-[13px] text-slate-500">Preview how a teaching assistant watches videos and confirms completion.</p>
        </div>
        {onBack && (
          <button type="button" onClick={onBack} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Back to supervisor view
          </button>
        )}
      </header>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Summary icon={<BookOpenCheck size={18} />} label="Training videos" value="3" detail="Assigned this term" />
        <Summary icon={<CheckCircle2 size={18} />} label="Completed" value={`${completed} of 3`} detail={`${overallProgress}% overall progress`} />
        <Summary icon={<CalendarClock size={18} />} label="Current status" value={completed === 3 ? 'Complete' : 'In progress'} detail={completed === 3 ? 'All videos confirmed' : `${3 - completed} video${3 - completed === 1 ? '' : 's'} remaining`} />
      </div>

      <Card className="overflow-hidden">
        <header className="p-6 pb-0">
          <h2 className="font-semibold">Required training</h2>
          <p className="mt-1 text-xs text-muted">Watch each video and confirm your completion below it.</p>
          <nav aria-label="Required training sections" className="mt-5 flex overflow-x-auto border-b border-slate-200">
            <TrainingTab active={activeTab === 'start'} onClick={() => setActiveTab('start')}>Start Here</TrainingTab>
            <TrainingTab active={activeTab === 'academic-partnership'} onClick={() => setActiveTab('academic-partnership')}>Academic Partnership Weekly Communication</TrainingTab>
            <TrainingTab active={activeTab === 'general-notes'} onClick={() => setActiveTab('general-notes')}>General Teaching Notes and TA Notes</TrainingTab>
          </nav>
        </header>
        {activeTab === 'start' && (
          <section className="p-6 pt-5" aria-labelledby="start-here-heading">
            <div className="mb-4">
              <h3 id="start-here-heading" className="font-semibold text-slate-900">TA Training Orientation</h3>
              <p className="mt-1 text-xs text-muted">Watch this introduction before beginning the required modules.</p>
            </div>
            <ResponsiveKalturaPlayer
              title="TA Training Orientation"
              src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/41338032/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player&amp;entry_id=1_p1qlb8dj&amp;flashvars[localizationCode]=en&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&amp;wid=1_1j4dayje"
            />
            <VideoCompletionQuestion watched={completion.start} onChange={watched => updateCompletion('start', watched)} />
          </section>
        )}
        {activeTab === 'academic-partnership' && (
          <section className="p-6 pt-5" aria-labelledby="academic-partnership-heading">
            <div className="mb-4">
              <h3 id="academic-partnership-heading" className="font-semibold text-slate-900">Academic Partnership Weekly Communication</h3>
              <p className="mt-1 text-xs text-muted">Review the weekly communication expectations for supporting a strong academic partnership.</p>
            </div>
            <ResponsiveKalturaPlayer
              title="Academic Partnership Weekly Communication"
              src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/41338032/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player&amp;entry_id=1_3ppt8f72&amp;flashvars[localizationCode]=en&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&amp;wid=1_ucnsgb7f"
            />
            <VideoCompletionQuestion watched={completion.academicPartnership} onChange={watched => updateCompletion('academicPartnership', watched)} />
          </section>
        )}
        {activeTab === 'general-notes' && (
          <section className="p-6 pt-5" aria-labelledby="general-notes-heading">
            <div className="mb-4">
              <h3 id="general-notes-heading" className="font-semibold text-slate-900">General Teaching Notes and TA Notes</h3>
              <p className="mt-1 text-xs text-muted">Review expectations for documenting general teaching notes and TA-specific notes.</p>
            </div>
            <ResponsiveKalturaPlayer
              width={480}
              height={270}
              title="General Teaching Notes and TA Notes"
              src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/47306393/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1725575865379&amp;entry_id=1_4u86ye8m"
            />
            <VideoCompletionQuestion watched={completion.generalNotes} onChange={watched => updateCompletion('generalNotes', watched)} />
          </section>
        )}
      </Card>
    </>
  )
}

function ResponsiveKalturaPlayer({ src, title, width = 608, height = 402 }) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const resize = () => setScale(Math.min(container.clientWidth / width, 1))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [width])

  return (
    <div ref={containerRef} className="mx-auto w-full overflow-hidden rounded-lg border border-slate-200 bg-black shadow-sm" style={{ maxWidth: `${width}px`, height: `${height * scale}px` }}>
      <iframe
        width={width}
        height={height}
        className="block origin-top-left"
        style={{ transform: `scale(${scale})` }}
        src={src}
        title={title}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function TrainingTab({ active, onClick, children }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-left text-sm font-medium ${active ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
      {children}
    </button>
  )
}

function VideoCompletionQuestion({ watched, onChange }) {
  return (
    <fieldset className="mx-auto mt-5 max-w-[608px] rounded-lg border border-slate-200 bg-slate-50 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-900">Did you finish watching this video?</legend>
      <p className="mb-3 text-xs text-muted">Your answer is saved on this device and updates your training progress.</p>
      <div className="flex flex-wrap gap-2">
        <CompletionChoice tone="green" selected={watched === true} onClick={() => onChange(true)}>Yes, I watched it</CompletionChoice>
        <CompletionChoice tone="red" selected={watched === false} onClick={() => onChange(false)}>Not yet</CompletionChoice>
      </div>
      <p className={`mt-3 text-xs font-medium ${watched ? 'text-emerald-600' : 'text-slate-500'}`} role="status">
        {watched === true ? 'Completed · Video marked as watched' : watched === false ? 'Not completed · Return after watching the video' : 'No answer selected'}
      </p>
    </fieldset>
  )
}

function CompletionChoice({ tone, selected, onClick, children }) {
  const colors = tone === 'green'
    ? selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
    : selected ? 'border-red-600 bg-red-600 text-white' : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onClick} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${colors}`}>
      {selected ? <Check size={16} strokeWidth={3} /> : <Circle size={16} />}
      {children}
    </button>
  )
}

function Summary({ icon, label, value, detail }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-orange-50 text-brand">{icon}</span>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <strong className="mt-1 block text-xl text-slate-900">{value}</strong>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
      </div>
    </Card>
  )
}
