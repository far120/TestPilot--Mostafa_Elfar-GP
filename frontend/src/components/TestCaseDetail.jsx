import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getTestCase, updateTestCase, deleteTestCase } from '../api/testCases.js'
import StepsList from './StepsList.jsx'
import RunControls from './RunControls.jsx'
import RunHistory from './RunHistory.jsx'
import LiveRunPanel from './LiveRunPanel.jsx'
import TestCaseForm from './TestCaseForm.jsx'
import Modal from './ui/Modal.jsx'
import Button from './ui/Button.jsx'
import { DEMO_TEST_SUITES } from '../data/demoData.js'
import { ExternalLink, MoreVertical, Edit2, Trash2, Layers, Play } from 'lucide-react'

function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-36 rounded-xl border border-slate-800 bg-slate-900/95 py-1 text-xs shadow-xl backdrop-blur-xl">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              onClick={() => { setOpen(false); onEdit() }}
            >
              <Edit2 className="h-3.5 w-3.5 text-cyan-400" />
              Edit Test Case
            </button>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 transition-colors"
              onClick={() => { setOpen(false); onDelete() }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div className="px-6 py-4 border-b border-slate-800/80 last:border-0 space-y-3">
      {label && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

export default function TestCaseDetail({
  testCaseId,
  projectId,
  isRunning,
  events,
  sessionId,
  onRun,
  onStop,
  onDeleted,
  refreshToken = 0,
  onRefresh,
  isDemoMode,
}) {
  const [showEdit, setShowEdit]     = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [tc, setTc]                 = useState(null)
  const [isLoading, setIsLoading]   = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      const match = DEMO_TEST_SUITES.find(s => s.id === testCaseId) || DEMO_TEST_SUITES[0]
      setTc(match)
      setIsLoading(false)
      return
    }

    let cancelled = false
    async function loadTestCase() {
      if (!testCaseId) return
      setIsLoading(true)
      try {
        const response = await getTestCase(testCaseId)
        if (!cancelled) setTc(response)
      } catch {
        if (!cancelled) setTc(DEMO_TEST_SUITES[0])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadTestCase()
    return () => { cancelled = true }
  }, [testCaseId, refreshToken, isDemoMode])

  const editMutation = useMutation({
    mutationFn: (data) => updateTestCase(testCaseId, data),
    onSuccess: (updated) => { setTc(updated); onRefresh?.(); setShowEdit(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTestCase(testCaseId),
    onSuccess: () => { onRefresh?.(); setShowDelete(false); onDeleted?.() },
  })

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Loading Test Case Details…</div>
  if (!tc) return null

  return (
    <div className="flex h-full flex-col overflow-y-auto text-slate-100">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900/95 px-6 py-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white tracking-tight">{tc.name}</h2>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
              tc.type === 'N' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              {tc.type === 'P' ? 'Positive Flow' : 'Negative Flow'}
            </span>
          </div>
          <a
            href={tc.target_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mt-1"
          >
            <ExternalLink className="h-3 w-3" />
            {tc.target_url}
          </a>
        </div>

        <ActionMenu
          onEdit={() => { editMutation.reset(); setShowEdit(true) }}
          onDelete={() => { deleteMutation.reset(); setShowDelete(true) }}
        />
      </div>

      {/* Steps List */}
      <Section label="Automated Test Action Steps">
        <StepsList steps={tc.steps} editing={false} />
      </Section>

      {/* Run Controls Header */}
      <Section label="Execution Engine & Model Selection">
        <RunControls isRunning={isRunning} onRun={onRun} onStop={onStop} />
      </Section>

      {/* Body: Live Execution Stream or Run History */}
      <Section label={isRunning ? 'Live Agent Execution Stream' : 'Historical Execution Telemetry'}>
        {isRunning ? (
          <LiveRunPanel events={events ?? []} sessionId={sessionId} onStop={onStop} />
        ) : (
          <RunHistory testCaseId={testCaseId} refreshToken={refreshToken} isDemoMode={isDemoMode} />
        )}
      </Section>

      {/* Edit Modal */}
      {showEdit && (
        <Modal open onClose={() => setShowEdit(false)} title="Edit Test Case" className="max-w-2xl">
          <TestCaseForm
            key={tc.id}
            initial={tc}
            projectId={projectId}
            submitLabel="Save Changes"
            loading={editMutation.isPending}
            error={editMutation.error?.message}
            onSubmit={(data) => editMutation.mutate(data)}
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <Modal open onClose={() => setShowDelete(false)} title="Delete Test Case">
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-300">Delete test case <strong>{tc.name}</strong>?</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => deleteMutation.mutate()}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}
