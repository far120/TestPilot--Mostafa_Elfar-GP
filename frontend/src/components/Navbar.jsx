import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bot,
  GraduationCap,
  LayoutDashboard,
  User,
  Zap,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles
} from 'lucide-react'

export default function Navbar({ onOpenProfile, onOpenDemo, isDemoMode, setIsDemoMode }) {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Left: Brand + Graduation Badge */}
        <div className="flex items-center gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Bot className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  TestPilot<span className="text-emerald-500">.ai</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                  <Sparkles className="h-3 w-3" /> v2.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                Autonomous Visual LLM Testing Agent
              </p>
            </div>
          </Link>

          {/* Graduation Badge */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Graduation Project 2026</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-1 backdrop-blur-md">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
              location.pathname === '/' || location.pathname.startsWith('/projects')
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Workspace</span>
          </Link>

          <Link
            to="/showcase"
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
              location.pathname === '/showcase'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Architecture & Specs</span>
          </Link>
        </nav>

        {/* Right: Quick Action Buttons & Developer Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Preset Button */}
          <button
            onClick={onOpenDemo}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-all"
            title="Launch preset test cases"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Quick Demo</span>
          </button>

          {/* Mode Switcher Badge */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all ${
              isDemoMode
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Toggle between real FastAPI backend and Simulated Demo mode"
          >
            {isDemoMode ? (
              <>
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="hidden md:inline">Demo Mode</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden md:inline">Live API</span>
              </>
            )}
          </button>

          {/* Developer Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="group flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-[10px] font-bold text-slate-950">
              ME
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[11px] font-bold leading-none text-white group-hover:text-emerald-400 transition-colors">
                Mostafa Elfar
              </p>
              <p className="text-[9px] text-slate-400 leading-tight">Junior QA / Dev</p>
            </div>
          </button>
        </div>

      </div>
    </header>
  )
}
