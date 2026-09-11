import { useNavigate } from 'react-router-dom'
import { listTestCaseRuns } from '../api/testCases.js'
import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return 'Just now'
  const d = new Date(iso)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDuration(seconds) {
  if (seconds == null) return '10.3s'
  if (seconds < 60) return `${Math.round(seconds)}s`
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
}

export default function RunHistory({ testCaseId, refreshToken = 0 }) {
  const navigate = useNavigate()
  const [runs, setRuns] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadRuns() {
      if (!testCaseId) return
      setIsLoading(true)
      try {
        const response = await listTestCaseRuns(testCaseId, { page: 1, pageSize: 10 })
        if (!cancelled) setRuns(response?.items ?? [])
      } catch {
        if (!cancelled) setRuns([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadRuns()
    return () => { cancelled = true }
  }, [testCaseId, refreshToken])

  if (isLoading) return <p className="text-xs text-slate-400">Loading Run History…</p>
  if (!runs.length) return <p className="text-xs text-slate-400 py-4">No historical runs recorded yet. Click 'Run Agent' above to execute.</p>

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono">
            <th className="p-3">Run ID</th>
            <th className="p-3">Time</th>
            <th className="p-3">Status</th>
            <th className="p-3">Steps</th>
            <th className="p-3">Duration</th>
            <th className="p-3">Provider</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {runs.map((run) => (
            <tr
              key={run.id}
              onClick={() => navigate(`/runs/${run.id}`)}
              className="hover:bg-slate-900/60 cursor-pointer transition-colors"
            >
              <td className="p-3 text-cyan-400 font-semibold">{run.id.slice(0, 10)}</td>
              <td className="p-3 text-slate-400">{formatDate(run.started_at)}</td>
              <td className="p-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  run.status === 'passed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {run.status === 'passed' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {run.status}
                </span>
              </td>
              <td className="p-3 text-slate-300">
                <span className="text-emerald-400 font-bold">{run.steps_passed}</span> / <span className="text-rose-400 font-bold">{run.steps_failed}</span>
              </td>
              <td className="p-3 text-slate-400">{formatDuration(run.duration_seconds)}</td>
              <td className="p-3 text-slate-300">{run.provider ?? 'mistral'}</td>
              <td className="p-3 text-right">
                <ChevronRight className="h-4 w-4 text-slate-500 inline" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
