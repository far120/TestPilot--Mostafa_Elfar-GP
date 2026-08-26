import { useEffect, useRef, useState, useCallback } from 'react'

function rowConfig(ev) {
  switch (ev.type) {
    case 'execution.started':
      return {
        tag: 'start', tagCls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        text: ev.message || `Starting execution${ev.test_case?.total_steps ? ` — ${ev.test_case.total_steps} steps` : ''}`,
        textCls: 'text-slate-300 font-medium',
      }

    case 'step.started':
      return {
        tag: `step ${ev.step_index ?? '?'}/${ev.total_steps ?? '?'}`,
        tagCls: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
        text: ev.message || ev.action || '',
        textCls: 'text-white font-bold',
      }

    case 'agent.observation':
      return {
        tag: 'observe', tagCls: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        text: ev.message || 'Page state captured & elements mapped.',
        textCls: 'text-slate-300 font-mono text-[11px]',
      }

    case 'step.completed': {
      const passed = ev.passed !== false
      return {
        tag: passed ? 'step passed ✓' : 'step failed ✗',
        tagCls: passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        text: ev.message || ev.reason || (passed ? 'Step completed' : 'Step failed'),
        textCls: passed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold',
      }
    }

    case 'agent.tool.called':
      return {
        tag: 'tool', tagCls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        text: ev.message || `→ ${ev.tool_name ?? ''}(${ev.tool_args ? JSON.stringify(ev.tool_args) : ''})`,
        textCls: 'text-amber-300 font-mono text-[11px]',
      }

    case 'agent.tool.result': {
      const ok = ev.success !== false
      return {
        tag: ok ? 'tool ok' : 'tool err',
        tagCls: ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400',
        text: ev.message || `← ${typeof ev.result === 'string' ? ev.result : JSON.stringify(ev.result) ?? ''}`,
        textCls: 'text-slate-300 font-mono text-[11px]',
      }
    }

    case 'verification': {
      const passed = ev.status === 'passed' || ev.passed !== false
      return {
        tag: passed ? 'verify ✓' : 'verify ✗',
        tagCls: passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        text: ev.message || ev.reason || ev.assertion || '',
        textCls: passed ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium',
      }
    }

    case 'execution.completed': {
      const passed = ev.result === 'passed' || !ev.result?.includes('fail')
      return {
        tag: 'done ✓',
        tagCls: 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 glow-emerald',
        text: ev.message || 'All steps completed successfully.',
        textCls: 'text-emerald-300 font-bold',
      }
    }

    default:
      return {
        tag: ev.type,
        tagCls: 'bg-slate-800 text-slate-400',
        text: ev.message || JSON.stringify(ev),
        textCls: 'text-slate-300 font-mono text-[11px]',
      }
  }
}

function EventRow({ ev }) {
  const cfg = rowConfig(ev)

  return (
    <div className="flex items-start gap-2.5 leading-relaxed font-sans text-xs">
      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-bold leading-none mt-0.5 ${cfg.tagCls}`}>
        {cfg.tag}
      </span>
      <span className={`min-w-0 break-words ${cfg.textCls}`}>
        {cfg.text}
      </span>
    </div>
  )
}

export default function EventFeed({ events }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [events])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Real-Time Agent Telemetry Stream
        </span>
        <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
          • WS Connected
        </span>
      </div>

      <div
        ref={containerRef}
        className="h-60 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/90 p-3.5 space-y-2 font-mono text-xs shadow-inner"
      >
        {events.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Waiting for execution events…</p>
        ) : (
          events.map((ev, i) => <EventRow key={i} ev={ev} />)
        )}
      </div>
    </div>
  )
}
