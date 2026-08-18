import { AlertCircle, CheckCircle2, FileSpreadsheet, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { parseTimeStatsRows } from '../../utils/timeStatsImport'

function workbookToRows(workbook, XLSX) {
  return Object.fromEntries(workbook.SheetNames.map(sheetName => [
    sheetName.trim().toLowerCase(),
    XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null, raw: true }),
  ]))
}

export default function TimeStatsImport({ profiles, existingWeeks, onImport }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [week, setWeek] = useState(1)
  const [reading, setReading] = useState(false)
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(null)

  async function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    setComplete(null)
    setError('')
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setError('Choose an .xlsx Time Stats report.')
      return
    }
    setReading(true)
    try {
      const XLSX = await import('xlsx')
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true })
      const parsed = parseTimeStatsRows(workbookToRows(workbook, XLSX), { fileName: file.name, profiles })
      setPreview(parsed)
      setWeek(parsed.week && parsed.week <= 14 ? parsed.week : 1)
    } catch {
      setError('The workbook could not be read. Confirm it is a valid, unencrypted .xlsx file.')
    } finally {
      setReading(false)
    }
  }

  function confirmImport() {
    try {
      onImport(preview, week, existingWeeks.includes(week))
      setComplete({ week, matched: preview.matched.length, unmatched: preview.unmatched.length })
      setPreview(null)
    } catch (caught) {
      setError(caught.message || 'The import could not be saved.')
    }
  }

  return <>
    <input ref={inputRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="sr-only" onChange={handleFile} />
    <button type="button" onClick={() => inputRef.current?.click()} disabled={reading} className="flex h-9 items-center gap-2 rounded border border-brand bg-white px-3 text-sm font-medium text-brand hover:bg-orange-50 disabled:opacity-60">
      <Upload size={15} /> {reading ? 'Validating…' : 'Import Time Stats'}
    </button>
    {error && !preview && <p role="alert" className="absolute right-8 top-[105px] rounded bg-red-50 px-3 py-2 text-xs text-red-700 shadow">{error}</p>}
    {complete && <div role="status" className="fixed bottom-5 right-5 z-50 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-lg"><strong className="block">Week {complete.week} Time Stats imported successfully.</strong><span>{complete.matched} matched · {complete.unmatched} unmatched</span></div>}
    {preview && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-labelledby="import-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <header className="flex items-start justify-between border-b border-slate-100 p-5"><div className="flex gap-3"><span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><FileSpreadsheet size={20} /></span><div><h2 id="import-title" className="text-lg font-semibold">Import Time Stats</h2><p className="text-xs text-muted">Validate → Preview → Confirm</p></div></div><button type="button" aria-label="Close import preview" onClick={() => setPreview(null)} className="rounded p-1 hover:bg-slate-100"><X size={18} /></button></header>
        <div className="space-y-5 p-5">
          <div className="grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2"><Detail label="File name" value={preview.fileName} /><label className="text-sm"><span className="field-label block">Week being imported</span><select value={week} onChange={event => setWeek(Number(event.target.value))} className="h-9 w-full rounded border border-slate-300 bg-white px-3">{Array.from({ length: 14 }, (_, index) => <option key={index + 1} value={index + 1}>Week {index + 1}</option>)}</select></label><Detail label="TA records found" value={preview.recordCount} /><Detail label="Available sheets" value={preview.availableSheets.join(', ') || 'None'} /></div>
          <div className="grid grid-cols-2 gap-3"><Stat label="Matched" value={preview.matched.length} good /><Stat label="Unmatched" value={preview.unmatched.length} /></div>
          {existingWeeks.includes(week) && <Notice tone="warning">Week {week} already has an import. Confirming will replace that week’s imported data; other weeks are unchanged.</Notice>}
          {!!preview.missingSheets.length && <Notice tone="warning">Missing optional sheets: {preview.missingSheets.filter(name => name !== 'total_hours').join(', ') || 'None'}</Notice>}
          {!!preview.unsupportedSheets.length && <Notice tone="warning">Unsupported sheets will be ignored: {preview.unsupportedSheets.join(', ')}</Notice>}
          {!!preview.errors.length && <Notice tone="error">{preview.errors.join(' ')}</Notice>}
          {!!preview.warnings.length && <Notice tone="warning">{preview.warnings.slice(0, 6).join(' ')}{preview.warnings.length > 6 ? ` +${preview.warnings.length - 6} more warnings.` : ''}</Notice>}
          {!!preview.unmatched.length && <section><h3 className="mb-2 text-sm font-semibold">Unmatched TAs</h3><div className="max-h-36 overflow-auto rounded border border-slate-200"><table className="w-full text-left text-xs"><thead className="sticky top-0 bg-slate-50"><tr><th className="p-2">i-number</th><th className="p-2">Name (reference only)</th></tr></thead><tbody>{preview.unmatched.map(row => <tr key={row.iNumber} className="border-t border-slate-100"><td className="p-2 font-medium">{row.iNumber}</td><td className="p-2 text-muted">{row.name || 'Not supplied'}</td></tr>)}</tbody></table></div><p className="mt-2 text-xs text-muted">Unmatched rows will be retained in the weekly import, but no TA accounts will be created or assigned by name.</p></section>}
        </div>
        <footer className="flex justify-end gap-2 border-t border-slate-100 p-5"><button type="button" onClick={() => setPreview(null)} className="rounded border border-slate-300 px-4 py-2 text-sm">Cancel</button><button type="button" onClick={confirmImport} disabled={preview.errors.length > 0} className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{existingWeeks.includes(week) ? 'Replace Week' : 'Import'}</button></footer>
      </div>
    </div>}
  </>
}

function Detail({ label, value }) { return <div className="min-w-0"><span className="field-label block">{label}</span><strong className="block truncate text-sm">{value}</strong></div> }
function Stat({ label, value, good }) { return <div className={`rounded-lg border p-4 ${good ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}><span className="text-xs text-muted">{label}</span><strong className="mt-1 block text-2xl">{value}</strong></div> }
function Notice({ children, tone }) { const error = tone === 'error'; return <div className={`flex gap-2 rounded-lg border p-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>{error ? <AlertCircle className="shrink-0" size={17} /> : <CheckCircle2 className="shrink-0" size={17} />}{children}</div> }
