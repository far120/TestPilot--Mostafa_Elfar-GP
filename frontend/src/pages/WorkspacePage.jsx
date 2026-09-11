import { useState, useCallback, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getProject } from '../api/projects.js'
import { createTestCase, stopTestCase } from '../api/testCases.js'
import { useRunWebSocket } from '../hooks/useRunWebSocket.js'
import TestCaseSidebar from '../components/TestCaseSidebar.jsx'
import TestCaseDetail from '../components/TestCaseDetail.jsx'
import TestCaseForm from '../components/TestCaseForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import { FileCode2, Sparkles, Plus } from 'lucide-react'

function EmptyDetail() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-24 space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400">
        <FileCode2 className="h-8 w-8" />
      </div>
      <div className="space-y-1 max-w-xs">
        <h3 className="text-base font-bold text-white">Select a Test Case</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Choose a test suite from the sidebar to inspect steps, configure LLM provider settings, and execute agent runs.
        </p>
      </div>
    </div>
  )
}

export default function WorkspacePage() {
  const { projectId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeId = searchParams.get('tc') ?? null
  const [project, setProject] = useState(null)
  const [refreshTick, setRefreshTick] = useState(0)

  const refreshWorkspace = useCallback(() => {
    setRefreshTick((tick) => tick + 1)
  }, [])

  const selectTestCase = useCallback((id) => {
    setSearchParams(id ? { tc: id } : {}, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    let cancelled = false
    async function loadProject() {
      if (!projectId) return
      try {
        const response = await getProject(projectId)
        if (!cancelled) setProject(response)
      } catch {
        if (!cancelled) setProject(null)
      }
    }

    loadProject()
    return () => { cancelled = true }
  }, [projectId, refreshTick])

  const [showCreate, setShowCreate] = useState(false)

  const createMutation = useMutation({
    mutationFn: createTestCase,
    onSuccess: (created) => {
      refreshWorkspace()
      setShowCreate(false)
      selectTestCase(created.id)
    },
  })

  const [runningTcId, setRunningTcId] = useState(null)

  const handleFinished = useCallback(() => {
    setRunningTcId(null)
    refreshWorkspace()
  }, [refreshWorkspace])

  const { isRunning, events, sessionId, startRun, stopWatching } = useRunWebSocket(
    activeId ?? '__none__',
    handleFinished,
  )

  const handleRun = useCallback((config) => {
    setRunningTcId(activeId)
    startRun(config)
  }, [activeId, startRun])

  const handleStop = useCallback(() => {
    stopWatching()
    if (runningTcId) {
      stopTestCase(runningTcId).catch(console.error)
    }
    setRunningTcId(null)
    refreshWorkspace()
  }, [stopWatching, runningTcId, refreshWorkspace])

  return (
    <div className="flex h-[calc(100vh-4.5rem)] gap-4 overflow-hidden px-4 py-4 lg:px-6 lg:py-6">
      
      {/* Sidebar */}
      <TestCaseSidebar
        projectId={projectId}
        projectName={project?.name ?? 'Test Project'}
        activeId={activeId}
        onSelect={selectTestCase}
        onNewTestCase={() => { createMutation.reset(); setShowCreate(true) }}
        runningId={runningTcId}
        refreshToken={refreshTick}
      />

      {/* Main Panel */}
      <main className="flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
        {activeId ? (
          <TestCaseDetail
            key={activeId}
            testCaseId={activeId}
            projectId={projectId}
            isRunning={isRunning && runningTcId === activeId}
            events={events}
            sessionId={sessionId}
            onRun={handleRun}
            onStop={handleStop}
            onDeleted={() => selectTestCase(null)}
            refreshToken={refreshTick}
            onRefresh={refreshWorkspace}
          />
        ) : (
          <EmptyDetail />
        )}
      </main>

      {/* New Test Case Modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Test Case"
        className="max-w-2xl"
      >
        <TestCaseForm
          projectId={projectId}
          submitLabel="Create Test Case"
          loading={createMutation.isPending}
          error={createMutation.error?.message}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      </Modal>
    </div>
  )
}
