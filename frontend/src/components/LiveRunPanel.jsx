import { useMemo } from 'react'
import StepTracker from './StepTracker.jsx'
import EventFeed from './EventFeed.jsx'
import ScreenshotViewer from './ScreenshotViewer.jsx'
import { CheckCircle2, XCircle, Square, Bot } from 'lucide-react'

function getTotalSteps(events) {
  const ev = events.find((e) => e.type === 'execution.started')
  return ev?.test_case?.total_steps ?? 4
}

function getFinalVerdict(events) {
  const ev = events.find((e) => e.type === 'execution.completed')
  if (!ev) return null
  return { status: ev.result || 'passed', passed: ev.steps?.passed ?? 4, failed: ev.steps?.failed ?? 0 }
}

function VerdictBanner({ verdict }) {
  const ok = verdict.status === 'passed'
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-4 border shadow-xl ${
      ok
        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 glow-emerald'
        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
    }`}>
      <div className={`p-2.5 rounded-xl ${ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
        {ok ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
      </div>
      <div>
        <h4 className="text-sm font-bold">{ok ? 'All Test Steps Passed Successfully' : 'Test Execution Failed'}</h4>
        <p className="text-xs opacity-80 mt-0.5">{verdict.passed} passed • {verdict.failed} failed</p>
      </div>
    </div>
  )
}

export default function LiveRunPanel({ events, sessionId, onStop }) {
  const totalSteps = useMemo(() => getTotalSteps(events), [events])
  const verdict    = useMemo(() => getFinalVerdict(events), [events])
  const isComplete = verdict !== null

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      
      {/* Live Agent Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Agent Perception Active
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            </h3>
            <p className="text-xs text-cyan-300">Playwright browser stream live via WebSockets.</p>
          </div>
        </div>

        {!isComplete && (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-all"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            Stop Run
          </button>
        )}
      </div>

      {/* Step Tracker */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Execution Timeline
        </span>
        <StepTracker events={events} totalSteps={totalSteps} />
      </div>

      {/* Final Verdict Banner */}
      {isComplete && <VerdictBanner verdict={verdict} />}

      {/* Real-time Telemetry Stream */}
      <EventFeed events={events} />

      {/* Screenshots */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Captured Visual Perception Snapshots
        </span>
        <ScreenshotViewer sessionId={sessionId} events={events} />
      </div>

    </div>
  )
}
