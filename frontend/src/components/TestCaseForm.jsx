import { useState } from 'react'
import StepsList from './StepsList.jsx'
import { Input } from './ui/Input.jsx'
import Button from './ui/Button.jsx'

const EMPTY_STEP = { action: '', assertion: '' }

export default function TestCaseForm({
  initial = {},
  projectId,
  onSubmit,
  loading,
  error,
  submitLabel = 'Save',
}) {
  const [name, setName]   = useState(initial.name ?? '')
  const [type, setType]   = useState(initial.type ?? 'P')
  const [url, setUrl]     = useState(initial.target_url ?? '')
  const [steps, setSteps] = useState(initial.steps?.length ? initial.steps : [EMPTY_STEP])
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!url.trim()) e.url = 'Target URL is required'
    const badSteps = steps.some((s) => !s.action.trim() || !s.assertion.trim())
    if (badSteps) e.steps = 'Every step needs an action and an assertion'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    onSubmit({
      project_id: projectId,
      name: name.trim(),
      type,
      target_url: url.trim(),
      steps: steps.map((s) => ({ action: s.action.trim(), assertion: s.assertion.trim() })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-slate-100">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            label="Test Case Name"
            placeholder="e.g. Login & Add To Cart Flow"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((v) => ({ ...v, name: null })) }}
            error={errors.name}
            autoFocus
          />
        </div>

        <div className="shrink-0 pb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Test Type</p>
          <div className="flex rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs font-bold font-mono">
            {['P', 'N'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-2 transition-colors ${
                  type === t
                    ? t === 'P' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'P' ? 'Positive Flow' : 'Negative Flow'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Input
        label="Target URL"
        type="url"
        placeholder="https://www.example.com"
        value={url}
        onChange={(e) => { setUrl(e.target.value); setErrors((v) => ({ ...v, url: null })) }}
        error={errors.url}
      />

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Action & Assertion Steps</p>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
          <StepsList
            steps={steps}
            editing
            onChange={(updated) => {
              setSteps(updated)
              setErrors((v) => ({ ...v, steps: null }))
            }}
          />
        </div>
        {errors.steps && <p className="text-xs text-rose-400">{errors.steps}</p>}
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" variant="primary" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
