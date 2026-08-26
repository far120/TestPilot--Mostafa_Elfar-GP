import useLocalStorage from '../hooks/useLocalStorage.js'
import { Play, Square, Cpu, Eye, EyeOff } from 'lucide-react'

const PROVIDERS = ['mistral', 'google', 'ollama', 'openrouter', 'llama_cpp']

export default function RunControls({ isRunning, onRun, onStop, disabled = false }) {
  const [provider, setProvider] = useLocalStorage('run_provider', 'mistral')
  const [models, setModels] = useLocalStorage('run_models', {
    mistral: 'mistral-large-2512',
    google: 'gemini-3-flash-preview',
    ollama: 'gemma4:31b-cloud',
    openrouter: 'sourceful/riverflow-v2-pro',
    llama_cpp: '',
  })
  const [headless, setHeadless] = useLocalStorage('run_headless', true)

  const currentModel = models[provider] ?? ''

  const handleRun = () => {
    if (isRunning) {
      onStop()
      return
    }
    onRun({ provider, model: provider === 'llama_cpp' ? null : (currentModel || null), headless })
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Provider Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Provider</span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              disabled={isRunning || disabled}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono font-medium text-emerald-400 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Model Input */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Model</span>
            <input
              type="text"
              value={provider === 'llama_cpp' ? '' : currentModel}
              onChange={(e) => setModels({ ...models, [provider]: e.target.value })}
              placeholder="Model string"
              disabled={provider === 'llama_cpp' || isRunning || disabled}
              className="w-48 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Headless Toggle */}
          <button
            type="button"
            onClick={() => setHeadless((v) => !v)}
            disabled={isRunning || disabled}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
              headless
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            {headless ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{headless ? 'Headless' : 'Headed Browser'}</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRun}
          disabled={disabled}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-lg ${
            isRunning
              ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20 animate-pulse'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20'
          }`}
        >
          {isRunning ? (
            <>
              <Square className="h-3.5 w-3.5 fill-current" />
              Stop Execution
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current ml-0.5" />
              Run Agent
            </>
          )}
        </button>

      </div>
    </div>
  )
}
