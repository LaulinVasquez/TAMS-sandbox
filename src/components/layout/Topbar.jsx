import { Menu, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { searchProfiles } from '../../utils/profiles'

export default function Topbar({ collapsed, darkMode, onToggleTheme, profiles = [], onSelectProfile, onViewAllResults }) {
  const searchRef = useRef(null)
  const containerRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const results = searchProfiles(profiles, query)

  useEffect(() => {
    const focusSearch = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', focusSearch)
    return () => document.removeEventListener('keydown', focusSearch)
  }, [])

  useEffect(() => {
    const close = event => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  function chooseProfile(id) {
    setQuery('')
    setOpen(false)
    onSelectProfile?.(id)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setQuery('')
      setOpen(false)
      searchRef.current?.blur()
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (results.length === 1) {
        chooseProfile(results[0].id)
        return
      }
      if (query.trim()) {
        onViewAllResults?.(query.trim())
        setOpen(false)
      }
    }
  }

  return (
    <header className={`fixed right-0 top-[3px] z-40 flex h-[59px] items-center border-b border-slate-100 bg-white px-6 text-slate-500 transition-all ${collapsed ? 'left-16' : 'left-56'}`}>
      <span className="text-[13px]">Teaching Assistant Management System</span>
      <div className="ml-auto flex items-center gap-4">
        <div ref={containerRef} className="relative hidden sm:block">
          <label className="flex h-[34px] w-[260px] items-center gap-2 rounded-md border border-slate-200 px-3 text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-orange-100">
            <Search size={14} />
            <input
              ref={searchRef}
              value={query}
              onChange={event => {
                setQuery(event.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              className="min-w-0 flex-1 border-0 bg-transparent outline-none"
              placeholder="Search TAs"
              aria-label="Search teaching assistants"
              aria-expanded={open && Boolean(query.trim())}
              aria-controls="topbar-search-results"
              autoComplete="off"
            />
            <kbd className="rounded bg-slate-100 px-1.5 font-mono text-[11px]">ctl k</kbd>
          </label>
          {open && query.trim() && (
            <div id="topbar-search-results" role="listbox" className="absolute right-0 z-50 mt-1 w-[320px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
              {results.length ? (
                <ul>
                  {results.map(profile => (
                    <li key={profile.id}>
                      <button
                        type="button"
                        role="option"
                        onClick={() => chooseProfile(profile.id)}
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <span className="text-sm font-medium text-slate-800">{profile.name}</span>
                        <span className="text-xs text-muted">{profile.email}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-3 text-sm text-muted">No teaching assistants match “{query.trim()}”.</p>
              )}
              {results.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    onViewAllResults?.(query.trim())
                    setOpen(false)
                  }}
                  className="w-full border-t border-slate-100 px-3 py-2 text-left text-xs font-medium text-brand hover:bg-orange-50"
                >
                  View all results in directory
                </button>
              )}
            </div>
          )}
        </div>
        <button type="button" onClick={onToggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Light mode' : 'Dark mode'} className="grid size-8 place-items-center rounded-md border border-slate-200 transition-colors hover:bg-slate-100">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
        <button aria-label="Open menu"><Menu size={15} /></button>
        <div className="grid size-8 place-items-center rounded-full bg-[#c74a24] text-xs font-bold text-white">SP</div>
      </div>
    </header>
  )
}
