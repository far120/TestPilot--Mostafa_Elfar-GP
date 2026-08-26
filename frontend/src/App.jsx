import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import DeveloperProfileModal from './components/DeveloperProfileModal.jsx'
import QuickDemoModal from './components/QuickDemoModal.jsx'

const ProjectsPage  = lazy(() => import('./pages/ProjectsPage.jsx'))
const WorkspacePage = lazy(() => import('./pages/WorkspacePage.jsx'))
const RunDetailPage = lazy(() => import('./pages/RunDetailPage.jsx'))
const ShowcasePage  = lazy(() => import('./pages/ShowcasePage.jsx'))

function PageLoader() {
  return (
    <div className="flex h-96 items-center justify-center text-sm text-slate-400">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-4 shadow-xl backdrop-blur-xl">
        <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-medium text-slate-200">Loading TestPilot Interface…</span>
      </div>
    </div>
  )
}

export default function App() {
  const [showProfile, setShowProfile] = useState(false)
  const [showDemo, setShowDemo]       = useState(false)
  const [isDemoMode, setIsDemoMode]   = useState(false)
  const navigate = useNavigate()

  const handleLaunchPresetDemo = (suite) => {
    // If demo suite launched, redirect to demo run page or workspace
    navigate(`/projects/demo-proj-1?demoSuite=${suite.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenProfile={() => setShowProfile(true)}
        onOpenDemo={() => setShowDemo(true)}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<ProjectsPage isDemoMode={isDemoMode} />} />
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/projects/:projectId" element={<WorkspacePage isDemoMode={isDemoMode} />} />
            <Route path="/runs/:runId" element={<RunDetailPage isDemoMode={isDemoMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Mostafa Elfar. Graduation Project — Autonomous LLM Browser Testing.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setShowProfile(true)} className="hover:text-emerald-400 transition-colors">
              Developer Profile
            </button>
            <span>•</span>
            <button onClick={() => setShowDemo(true)} className="hover:text-amber-400 transition-colors">
              Quick Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Developer Profile Modal */}
      <DeveloperProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Quick Demo Modal */}
      <QuickDemoModal
        open={showDemo}
        onClose={() => setShowDemo(false)}
        onLaunchDemo={handleLaunchPresetDemo}
      />
    </div>
  )
}