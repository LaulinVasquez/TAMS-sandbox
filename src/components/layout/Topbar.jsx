import { Menu, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function Topbar({ collapsed, darkMode, onToggleTheme }) {
  const searchRef = useRef(null)
  useEffect(() => {
    const focusSearch = event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus() } }
    document.addEventListener('keydown', focusSearch)
    return () => document.removeEventListener('keydown', focusSearch)
  }, [])

  return <header className={`fixed right-0 top-[3px] z-40 flex h-[59px] items-center border-b border-slate-100 bg-white px-6 text-slate-500 transition-all ${collapsed ? 'left-16' : 'left-56'}`}><span className="text-[13px]">Teaching Assistant Management System</span><div className="ml-auto flex items-center gap-4"><label className="hidden h-[34px] w-[153px] items-center gap-2 rounded-md border border-slate-200 px-3 text-muted sm:flex"><Search size={14} /><input ref={searchRef} className="w-[52px] border-0 bg-transparent outline-none" placeholder="Search" /><kbd className="rounded bg-slate-100 px-1.5 font-mono text-[11px]">ctl↵k</kbd></label><button type="button" onClick={onToggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Light mode' : 'Dark mode'} className="grid size-8 place-items-center rounded-md border border-slate-200 transition-colors hover:bg-slate-100">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button><button aria-label="Open menu"><Menu size={15} /></button><div className="grid size-8 place-items-center rounded-full bg-[#c74a24] text-xs font-bold text-white">SP</div></div></header>
}
