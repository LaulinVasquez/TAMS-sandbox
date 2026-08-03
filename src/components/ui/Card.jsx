export default function Card({ children, className = '' }) {
  return <section className={`rounded-[10px] border border-slate-200 bg-white shadow-card ${className}`}>{children}</section>
}
