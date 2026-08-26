import { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../api/projects.js'
import ProjectCard from '../components/ProjectCard.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import { Input, Textarea } from '../components/ui/Input.jsx'
import { DEMO_PROJECTS } from '../data/demoData.js'
import {
  FolderPlus,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  ShieldCheck
} from 'lucide-react'

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-1/2 bg-slate-800 rounded" />
        <div className="h-3 w-3/4 bg-slate-800/80 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full bg-slate-800 rounded-full" />
        <div className="flex gap-3">
          <div className="h-3 w-16 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  )
}

function ProjectForm({ initial = {}, onSubmit, loading, error, submitLabel = 'Save' }) {
  const [name, setName]        = useState(initial.name        ?? '')
  const [description, setDesc] = useState(initial.description ?? '')
  const [nameErr, setNameErr]  = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) { setNameErr('Name is required'); return }
    onSubmit({ name: name.trim(), description: description.trim() || null })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <Input
        label="Project Name"
        placeholder="e.g. Checkout & Payment Flow"
        value={name}
        onChange={(e) => { setName(e.target.value); setNameErr('') }}
        error={nameErr}
        autoFocus
      />
      <Textarea
        label="Description (optional)"
        placeholder="What web app or feature suite does this project test?"
        value={description}
        onChange={(e) => setDesc(e.target.value)}
      />
      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
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

function DeleteModal({ project, onConfirm, onClose, loading, error }) {
  return (
    <Modal open={!!project} onClose={onClose} title="Delete Project">
      <div className="space-y-4 pt-2">
        <p className="text-sm text-slate-300">
          Are you sure you want to delete project{' '}
          <strong className="text-white">{project?.name}</strong>? This action will remove all test cases and run history.
        </p>
        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function ProjectsPage({ isDemoMode }) {
  const [showCreate, setShowCreate]     = useState(false)
  const [editProject, setEditProject]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [projects, setProjects]       = useState([])
  const [isLoading, setIsLoading]     = useState(true)
  const [isError, setIsError]         = useState(false)
  const [reloadTick, setReloadTick]   = useState(0)

  const reloadProjects = useCallback(() => {
    setReloadTick((tick) => tick + 1)
  }, [])

  useEffect(() => {
    if (isDemoMode) {
      setProjects(DEMO_PROJECTS)
      setIsLoading(false)
      setIsError(false)
      return
    }

    let cancelled = false
    async function loadProjects() {
      setIsLoading(true)
      setIsError(false)
      try {
        const response = await listProjects()
        if (!cancelled) {
          setProjects(response?.items ?? DEMO_PROJECTS)
        }
      } catch {
        if (!cancelled) {
          // Fallback gracefully to demo projects if local backend is offline
          setProjects(DEMO_PROJECTS)
          setIsError(false)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadProjects()
    return () => { cancelled = true }
  }, [reloadTick, isDemoMode])

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => { reloadProjects(); setShowCreate(false) },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => { reloadProjects(); setEditProject(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => { reloadProjects(); setDeleteTarget(null) },
  })

  const totalTestCases = projects.reduce((sum, p) => sum + (p.test_cases_count ?? 0), 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner / Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" /> TestPilot Workspace
              </span>
              {isDemoMode && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/30">
                  Interactive Demo Mode
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
              Test Suites & Projects
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Organize visual browser test suites, run AI agents through Playwright visual perception, and inspect real-time execution telemetry.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:w-80">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Projects</span>
              <p className="mt-1 text-2xl font-black text-white">{projects.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Test Cases</span>
              <p className="mt-1 text-2xl font-black text-emerald-400">{totalTestCases}</p>
            </div>

            <button
              onClick={() => { createMutation.reset(); setShowCreate(true) }}
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20"
            >
              <FolderPlus className="h-4 w-4" />
              Create New Project
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            Active Test Projects ({projects.length})
          </h2>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Projects cards grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isDemoMode={isDemoMode}
                onEdit={(p) => { editMutation.reset(); setEditProject(p) }}
                onDelete={(p) => { deleteMutation.reset(); setDeleteTarget(p) }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Test Project">
        <ProjectForm
          submitLabel="Create Project"
          loading={createMutation.isPending}
          error={createMutation.error?.message}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editProject} onClose={() => setEditProject(null)} title="Edit Project">
        {editProject && (
          <ProjectForm
            key={editProject.id}
            initial={editProject}
            submitLabel="Save Changes"
            loading={editMutation.isPending}
            error={editMutation.error?.message}
            onSubmit={(data) => editMutation.mutate({ id: editProject.id, data })}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        project={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
        error={deleteMutation.error?.message}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
