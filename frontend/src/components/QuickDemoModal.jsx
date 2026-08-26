import Modal from './ui/Modal.jsx'
import { DEMO_TEST_SUITES } from '../data/demoData.js'
import { useNavigate } from 'react-router-dom'
import { Zap, Play, CheckCircle, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react'

export default function QuickDemoModal({ open, onClose, onLaunchDemo }) {
  const navigate = useNavigate()

  if (!open) return null

  const handleSelectDemo = (suite) => {
    onClose()
    if (onLaunchDemo) {
      onLaunchDemo(suite)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="space-y-5 pt-2 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Preset Demo Launcher</h2>
            <p className="text-xs text-slate-400">
              Run pre-configured test scenarios with 1-click for instant evaluation.
            </p>
          </div>
        </div>

        {/* Preset Cards */}
        <div className="grid gap-3 sm:grid-cols-1">
          {DEMO_TEST_SUITES.map((suite) => (
            <div
              key={suite.id}
              onClick={() => handleSelectDemo(suite)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-amber-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      suite.type === 'P'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {suite.type === 'P' ? 'Positive Flow' : 'Negative Flow'}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {suite.name}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                    {suite.target_url}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
              </div>

              {/* Steps overview */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{suite.steps.length} Automated Action Steps</span>
                <span className="flex items-center gap-1 text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                  Launch Suite <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-3 text-xs text-slate-400 border border-slate-800">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            Works in both simulated <strong>Demo Mode</strong> and connected <strong>FastAPI Live Backend</strong>.
          </span>
        </div>

      </div>
    </Modal>
  )
}
