import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import { actionItems } from '../../data/dashboard'

export default function ActionBoard({ onSelectAction }) {
  return (
    <Card className="min-h-[322px] p-5">
      <header className="mb-[18px] flex justify-between">
        <span className="section-label">Action board</span>
        <span className="text-xs text-slate-600">56 TAs total</span>
      </header>
      <div>
        {actionItems.map((item, index) => (
          <button
            type="button"
            key={item.label}
            onClick={() => onSelectAction?.(item)}
            aria-label={`View ${item.label}, ${item.count} of ${item.total}`}
            className={`group w-full rounded-md px-1 py-1 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${index === actionItems.length - 1 ? '' : 'mb-3'}`}
          >
            <div className="mb-1 flex justify-between gap-2">
              <span className="inline-flex items-center gap-1">
                {item.label}
                <ArrowRight size={14} className="text-brand opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
              </span>
              <b className="text-[13px]">{item.count} <span className="font-normal text-muted">/ {item.total}</span></b>
            </div>
            <ProgressBar percentage={item.percentage} color={item.color} />
            <div className="mt-1 text-xs text-muted">{item.caption}</div>
          </button>
        ))}
      </div>
    </Card>
  )
}
