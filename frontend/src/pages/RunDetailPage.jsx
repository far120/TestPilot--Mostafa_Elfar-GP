import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  getTestRun,
  getScreenshots,
  getLogs,
  deleteTestRun,
  screenshotUrl,
} from '../api/testRuns.js'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { DEMO_EXECUTION_EVENTS } from '../data/demoData.js'
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Layers,
  Image as ImageIcon,
  Terminal,
  ExternalLink
} from 'lucide-react'

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function duration(seconds) {
  if (seconds == null) return '—'
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
}

function StatBox({ label, value, valueClass = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`text-xl font-mono font-bold tracking-tight ${valueClass}`}>{value}</p>
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function StepResultsTable({ stepResults, testCaseSteps }) {
  if (!stepResults?.length) {
    return <p className="text-xs text-slate-400">No step results recorded.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 text-left">
            <th className="pb-3 w-10">#</th>
            <th className="pb-3">Action</th>
            <th className="pb-3">Assertion</th>
            <th className="pb-3 w-24">Status</th>
            <th className="pb-3 w-20 text-center">Retries</th>
            <th className="pb-3">Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {stepResults.map((sr) => {
            const def = testCaseSteps?.[sr.step_number - 1]
            return (
              <tr key={sr.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 font-mono text-slate-400">{sr.step_number}</td>
                <td className="py-3 text-slate-200 font-medium max-w-[200px]">{def?.action ?? sr.action ?? '—'}</td>
                <td className="py-3 text-slate-400 max-w-[200px]">{def?.assertion ?? sr.assertion ?? '—'}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    sr.status === 'passed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}>
                    {sr.status === 'passed' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {sr.status}
                  </span>
                </td>
                <td className="py-3 text-slate-400 font-mono text-center">{sr.retry_count ?? 0}</td>
                <td className="py-3 text-slate-400 max-w-[220px]">{sr.result_reason ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ScreenshotGrid({ runId, isDemoMode }) {
  if (isDemoMode) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-mono text-slate-400">Step 1 — Page Observation</p>
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
            alt="Step 1 Observation"
            className="w-full h-44 object-cover rounded-xl border border-slate-800 shadow-md"
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-mono text-slate-400">Step 2 — Action Verification</p>
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
            alt="Step 2 Verification"
            className="w-full h-44 object-cover rounded-xl border border-slate-800 shadow-md"
          />
        </div>
      </div>
    )
  }

  const [screenshots, setScreenshots] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadScreenshots() {
      setIsLoading(true)
      try {
        const response = await getScreenshots(runId)
        if (!cancelled) setScreenshots(response?.screenshots ?? [])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadScreenshots()
    return () => { cancelled = true }
  }, [runId])

  if (isLoading) return <Spinner size="sm" />
  if (!screenshots.length) return <p className="text-xs text-slate-400">No screenshots captured.</p>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {screenshots.map((ss) => (
        <a
          key={ss.id}
          href={screenshotUrl(runId, ss.id)}
          target="_blank"
          rel="noreferrer"
          className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 transition-all"
        >
          <img
            src={screenshotUrl(runId, ss.id)}
            alt={`Step ${ss.step_number}`}
            className="h-32 w-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="p-2 text-[10px] font-mono text-slate-400 flex justify-between bg-slate-900/90">
            <span>Step {ss.step_number}</span>
            <span className="text-cyan-400">{ss.kind}</span>
          </div>
        </a>
      ))}
    </div>
  )
}

export default function RunDetailPage({ isDemoMode }) {
  const { runId } = useParams()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [run, setRun] = useState(null)

  useEffect(() => {
    if (isDemoMode) {
      setRun({
        id: "demo-run-1",
        project_id: "demo-proj-1",
        test_case_name: "SauceDemo Login & Add To Cart",
        status: "passed",
        duration_seconds: 10.3,
        provider: "mistral",
        model: "mistral-large-2512",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        steps_passed: 2,
        steps_failed: 0,
        step_results: [
          { id: 1, step_number: 1, action: "Login with standard_user", assertion: "Redirect to inventory", status: "passed", retry_count: 0, result_reason: "Success" },
          { id: 2, step_number: 2, action: "Click Add to Cart", assertion: "Cart badge shows 1", status: "passed", retry_count: 0, result_reason: "Success" }
        ]
      })
      return
    }

    let cancelled = false
    async function loadRun() {
      try {
        const res = await getTestRun(runId)
        if (!cancelled) setRun(res)
      } catch {
        if (!cancelled) setRun(null)
      }
    }
    loadRun()
    return () => { cancelled = true }
  }, [runId, isDemoMode])

  const deleteMutation = useMutation({
    mutationFn: () => deleteTestRun(runId),
    onSuccess: () => navigate(-1),
  })

  if (!run) return <div className="p-12 text-center text-slate-400 text-xs">Loading Run Details…</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Back & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {run.test_case_name}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Run ID: {run.id} • Started {fmt(run.started_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            run.status === 'passed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
            'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            {run.status === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {run.status.toUpperCase()}
          </span>

          <button
            onClick={() => setShowDelete(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox label="Execution Time" value={duration(run.duration_seconds)} />
        <StatBox label="LLM Provider" value={run.provider ?? 'mistral'} valueClass="text-emerald-400" />
        <StatBox label="Steps Passed" value={`${run.steps_passed} / ${run.steps_passed + run.steps_failed}`} valueClass="text-cyan-400" />
        <StatBox label="Success Rate" value="100%" valueClass="text-emerald-400" />
      </div>

      {/* Step Results Table */}
      <Section title="Automated Step Results">
        <StepResultsTable stepResults={run.step_results} testCaseSteps={run.steps} />
      </Section>

      {/* Screenshots Grid */}
      <Section title="Visual Perception Snapshots">
        <ScreenshotGrid runId={runId} isDemoMode={isDemoMode} />
      </Section>

      {/* Delete Modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Run">
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-300">Are you sure you want to delete run {run.id}?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteMutation.mutate()}>Delete</Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}
