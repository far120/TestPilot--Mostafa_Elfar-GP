import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjectStats } from '../api/projects.js'
import { MoreVertical, Edit2, Trash2, ArrowRight, Folder, CheckCircle, XCircle } from 'lucide-react'

function PassRateBar({ rate }) {
  const pct = Number(rate ?? 0).toFixed(1)
  const good = pct >= 80
  const warn = pct >= 50 && pct < 80

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Pass Rate</span>
        <span className={`font-mono font-semibold ${good ? 'text-emerald-400' : warn ? 'text-amber-400' : 'text-rose-400'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950/80 border border-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            good ? 'bg-gradient-to-r from-emerald-500 to-teal-400 glow-emerald' :
            warn ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
            'bg-gradient-to-r from-rose-500 to-red-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function KebabMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        aria-label="Project options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 z-20 w-36 rounded-xl border border-slate-800 bg-slate-900/95 py-1 text-xs shadow-xl backdrop-blur-xl">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit() }}
            >
              <Edit2 className="h-3.5 w-3.5 text-cyan-400" />
              Edit Project
            </button>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete() }}
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

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      try {
        const response = await getProjectStats(project.id)
        if (!cancelled) setStats(response)
      } catch {
        if (!cancelled) setStats({ success_rate: 0, total_runs: 0, passed_runs: 0, failed_runs: 0 })
      }
    }

    loadStats()
    return () => { cancelled = true }
  }, [project.id])

  const formattedDate = new Date(project.created_at || Date.now()).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <article
      onClick={() => navigate(`/projects/${project.id}`)}
      className="glass-card glass-card-hover group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 cursor-pointer space-y-4"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

      {/* Title & Kebab */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-transform">
            <Folder className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <KebabMenu
            onEdit={() => onEdit(project)}
            onDelete={() => onDelete(project)}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="space-y-2">
        <PassRateBar rate={stats?.success_rate ?? 100} />
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span><strong className="text-white">{stats?.total_runs ?? 0}</strong> runs</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{stats?.passed_runs ?? 0} passed</span>
          <span>•</span>
          <span className="text-rose-400 font-semibold">{stats?.failed_runs ?? 0} failed</span>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <span className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300">
          {project.test_cases_count ?? 0} {project.test_cases_count === 1 ? 'test case' : 'test cases'}
        </span>

        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs group-hover:translate-x-1 transition-transform">
          Open Workspace <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  )
}
