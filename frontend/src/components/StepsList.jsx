import { useEffect, useState } from 'react'
import Button from './ui/Button.jsx'
import { Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck, PlayCircle } from 'lucide-react'

function EditRow({ index, step, total, onChange, onRemove, onMove }) {
  return (
    <div className="group flex gap-3 items-start p-3 rounded-xl border border-slate-800 bg-slate-950/60">
      
      <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
        <span className="text-xs font-mono font-bold text-cyan-400 w-5 text-center">
          0{index + 1}
        </span>
        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="text-slate-500 hover:text-slate-300 disabled:opacity-20"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            className="text-slate-500 hover:text-slate-300 disabled:opacity-20"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Action</label>
          <textarea
            rows={2}
            value={step.action}
            onChange={(e) => onChange(index, 'action', e.target.value)}
            placeholder="e.g. Type 'standard_user' into #user-name"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Assertion</label>
          <textarea
            rows={2}
            value={step.assertion}
            onChange={(e) => onChange(index, 'assertion', e.target.value)}
            placeholder="e.g. Inventory page loads with class .app_logo"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={total <= 1}
        className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-20 transition-colors shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

function ReadRow({ index, step }) {
  return (
    <div className="flex gap-3 items-start p-3 rounded-xl border border-slate-800/80 bg-slate-950/40">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-cyan-400">
        {index + 1}
      </span>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-mono text-slate-400 block mb-0.5">ACTION</span>
          <p className="text-slate-200 font-medium leading-relaxed">{step.action}</p>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 block mb-0.5">ASSERTION</span>
          <p className="text-emerald-400/90 font-medium leading-relaxed">{step.assertion}</p>
        </div>
      </div>
    </div>
  )
}

export default function StepsList({ steps, editing = false, onChange }) {
  const [draft, setDraft] = useState(steps)
  useEffect(() => { setDraft(steps) }, [steps, editing])

  const update = (updated) => {
    setDraft(updated)
    onChange?.(updated)
  }

  const handleChange = (idx, field, value) => {
    const next = draft.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    update(next)
  }

  const handleRemove = (idx) => {
    update(draft.filter((_, i) => i !== idx))
  }

  const handleMove = (idx, dir) => {
    const next = [...draft]
    const swap = idx + dir
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    update(next)
  }

  const handleAdd = () => {
    update([...draft, { action: '', assertion: '' }])
  }

  if (!steps?.length && !editing) {
    return <p className="text-xs text-slate-400 py-2">No steps defined.</p>
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {(editing ? draft : steps).map((step, i) =>
          editing ? (
            <EditRow
              key={i}
              index={i}
              step={step}
              total={draft.length}
              onChange={handleChange}
              onRemove={handleRemove}
              onMove={handleMove}
            />
          ) : (
            <ReadRow key={i} index={i} step={step} />
          )
        )}
      </div>

      {editing && (
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-slate-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Step Pair
        </button>
      )}
    </div>
  )
}
