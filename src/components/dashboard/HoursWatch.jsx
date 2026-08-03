import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import { hoursCapWatch } from '../../data/dashboard'

export default function HoursWatch() {
  return <Card className="flex min-h-[322px] flex-col justify-between p-5"><div><h2 className="section-label mb-3 font-semibold tracking-wider">Hours-to-Cap Watch</h2><p className="text-5xl font-bold leading-none">{hoursCapWatch.count}</p><p className="mt-2 text-sm text-slate-500">TAs at {hoursCapWatch.threshold}%+ of max hours</p></div><button type="button" className="group mt-6 flex w-fit items-center gap-1 text-sm text-brand hover:underline" aria-label={`Review ${hoursCapWatch.count} teaching assistants nearing their maximum hours`}>Review list <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" /></button></Card>
}
