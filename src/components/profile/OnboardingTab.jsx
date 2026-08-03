import Card from '../ui/Card'
import StatusBadge from './StatusBadge'

export default function OnboardingTab({ profile }) {
  const toneFor = status => status === 'Complete' ? 'green' : status === 'In Progress' ? 'blue' : 'neutral'
  return <Card className="p-6"><h2 className="mb-4 text-base font-semibold">Onboarding</h2>{profile.onboarding.map(item => <div key={item.step} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0"><span>{item.step}</span><StatusBadge tone={toneFor(item.status)}>{item.status}</StatusBadge></div>)}</Card>
}
