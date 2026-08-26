import { Check, X } from 'lucide-react'

function deriveSteps(events, totalSteps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => ({
    number: i + 1,
    state: 'pending',
  }))

  for (const ev of events) {
    if (ev.type === 'step.started') {
      const idx = (ev.step_index ?? 1) - 1
      if (steps[idx]) steps[idx].state = 'active'
    }
    if (ev.type === 'step.completed' || ev.type === 'verification') {
      const idx = (ev.step_index ?? 1) - 1
      if (steps[idx]) {
        steps[idx].state = (ev.passed !== false && ev.status !== 'failed') ? 'passed' : 'failed'
      }
    }
  }

  return steps
}

function Bubble({ number, state }) {
  const base = 'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all duration-300'

  const styles = {
    pending: `${base} border border-slate-800 bg-slate-950 text-slate-400`,
    active:  `${base} border-2 border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-pulse glow-blue`,
    passed:  `${base} border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 glow-emerald`,
    failed:  `${base} border border-rose-500/40 bg-rose-500/20 text-rose-400`,
  }

  return (
    <div className={styles[state]} title={`Step ${number}: ${state}`}>
      {state === 'passed' ? <Check className="h-4 w-4 stroke-[3]" /> :
       state === 'failed' ? <X className="h-4 w-4 stroke-[3]" /> :
       number}
    </div>
  )
}

function Line({ leftState }) {
  const filled = leftState === 'passed' || leftState === 'failed'
  return (
    <div className={`h-1 flex-1 min-w-[12px] rounded-full transition-colors duration-500 ${filled ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
  )
}

export default function StepTracker({ events, totalSteps }) {
  if (!totalSteps) return null

  const steps = deriveSteps(events, totalSteps)

  return (
    <div className="flex items-center gap-2 py-2" role="list" aria-label="Step progress">
      {steps.map((step, i) => (
        <div key={step.number} className="contents">
          <Bubble number={step.number} state={step.state} />
          {i < steps.length - 1 && <Line leftState={step.state} />}
        </div>
      ))}
    </div>
  )
}
