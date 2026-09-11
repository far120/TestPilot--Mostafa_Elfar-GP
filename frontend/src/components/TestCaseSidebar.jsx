import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listTestCases } from '../api/testCases.js'
import { ArrowLeft, Plus, Folder, FileCode2, CheckCircle2, Play, ChevronRight } from 'lucide-react'

function TestCaseItem({ tc, isActive, isRunning, onSelect }) {
  return (
    <button
      onClick={() => onSelect(tc.id)}
      className={`w-full text-left rounded-xl p-3 transition-all duration-150 border ${
        isActive
          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500/50 text-white shadow-md glow-emerald'
          : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold leading-tight truncate">{tc.name}</span>
        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
          tc.type === 'P' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}>
          {tc.type}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>{tc.steps?.length ?? 0} Steps</span>
        {isRunning ? (
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" /> Running
          </span>
        ) : (
          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
            Ready <ChevronRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </button>
  )
}

export default function TestCaseSidebar({
  projectId,
  projectName,
  activeId,
  onSelect,
  onNewTestCase,
  runningId = null,
  refreshToken = 0,
}) {
  const navigate = useNavigate()
  const [testCases, setTestCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadTestCases() {
      if (!projectId) return
      setIsLoading(true)
      try {
        const response = await listTestCases(projectId)
        if (!cancelled) setTestCases(response?.items ?? [])
      } catch {
        if (!cancelled) setTestCases([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadTestCases()
    return () => { cancelled = true }
  }, [projectId, refreshToken])

  return (
    <aside className="flex flex-col h-full w-72 shrink-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Projects
        </button>
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-emerald-400 shrink-0" />
          <h2 className="text-sm font-bold text-white truncate">{projectName}</h2>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Test Suites ({testCases.length})
        </span>

        {isLoading ? (
          <p className="text-xs text-slate-400 p-2">Loading test suites…</p>
        ) : (
          testCases.map((tc) => (
            <TestCaseItem
              key={tc.id}
              tc={tc}
              isActive={tc.id === activeId}
              isRunning={tc.id === runningId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>

      {/* Action Button */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onNewTestCase}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-700 hover:text-white transition-all"
        >
          <Plus className="h-4 w-4 text-emerald-400" />
          Add Test Case
        </button>
      </div>

    </aside>
  )
}
