import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import { actionItems } from '../../data/dashboard'

export default function ActionBoard() {
  return <Card className="min-h-[322px] p-5"><header className="mb-[18px] flex justify-between"><span className="section-label">Action board</span><span className="text-xs text-slate-600">56 TAs total</span></header><div>{actionItems.map((item, index) => <div className={index === actionItems.length - 1 ? '' : 'mb-3'} key={item.label}><div className="mb-1 flex justify-between"><span>{item.label}</span><b className="text-[13px]">{item.count} <span className="font-normal text-muted">/ {item.total}</span></b></div><ProgressBar percentage={item.percentage} color={item.color} /><div className="mt-1 text-xs text-muted">{item.caption}</div></div>)}</div></Card>
}
