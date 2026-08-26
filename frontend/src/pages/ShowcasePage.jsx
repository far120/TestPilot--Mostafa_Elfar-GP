import { useState } from 'react'
import {
  Bot,
  Eye,
  Brain,
  Play,
  CheckCircle2,
  RotateCcw,
  Layers,
  Cpu,
  Server,
  Globe,
  Database,
  Terminal,
  Zap,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code2
} from 'lucide-react'

export default function ShowcasePage() {
  const [activeStep, setActiveStep] = useState(0)

  const AGENT_STEPS = [
    {
      id: "observe",
      title: "1. Visual Perception (Observe)",
      icon: Eye,
      color: "emerald",
      bgClass: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400",
      description: "Playwright captures high-resolution DOM snapshots and full-page screenshots of the target browser viewport.",
      details: [
        "Interactive element extraction & bounding box calculations",
        "DOM accessibility tree mapping to structured JSON",
        "Multimodal visual encoding sent directly to Vision LLMs"
      ]
    },
    {
      id: "plan",
      title: "2. LLM Decision Graph (Plan)",
      icon: Brain,
      color: "cyan",
      bgClass: "from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400",
      description: "LangGraph agent analyzes test step objectives, compares visual state, and selects optimal browser tool actions.",
      details: [
        "Structured tool calling (fill_input, click, scroll, select_option)",
        "Multi-provider LLM support (Mistral, Gemini, Ollama, OpenRouter)",
        "Heuristic prompt validation to prevent action loops"
      ]
    },
    {
      id: "execute",
      title: "3. Browser Execution (Execute)",
      icon: Play,
      color: "amber",
      bgClass: "from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400",
      description: "Playwright executes action instructions on the Chromium browser instance in real-time.",
      details: [
        "Human-like typing and click event dispatching",
        "Automatic wait for network idle & element visibility",
        "Real-time event stream broadcasted via EventBus & WebSockets"
      ]
    },
    {
      id: "verify",
      title: "4. Assertion & Verification (Verify)",
      icon: CheckCircle2,
      color: "purple",
      bgClass: "from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400",
      description: "Evaluates step assertions against DOM state, URL patterns, or visual text evidence.",
      details: [
        "DOM selector assertions and text match validation",
        "LLM visual verification for non-standard UI components",
        "Pass/Fail outcome logging with timestamped evidence"
      ]
    },
    {
      id: "recover",
      title: "5. Self-Healing & Recovery (Recover)",
      icon: RotateCcw,
      color: "rose",
      bgClass: "from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-400",
      description: "If an unexpected popup or dynamic layout change occurs, the agent recalculates and retries gracefully.",
      details: [
        "Popup & modal backdrop auto-dismissal",
        "Alternative selector fallback strategy",
        "Exponential backoff retry policy (max 3 recovery attempts)"
      ]
    }
  ]

  const ARCHITECTURE_COMPONENTS = [
    {
      title: "API & Gateway Layer",
      icon: Server,
      tech: "FastAPI + Uvicorn",
      desc: "REST endpoints for project CRUD, test case creation, execution triggers, and WebSockets for live event streaming."
    },
    {
      title: "Agent Graph Orchestration",
      icon: Cpu,
      tech: "LangGraph + Vision LLMs",
      desc: "Stateful agent lifecycle controlling observation, reasoning, tool selection, and recovery routines."
    },
    {
      title: "Browser Automation Layer",
      icon: Globe,
      tech: "Playwright (Python)",
      desc: "Headless/Headed Chromium controller handling DOM interactions, screenshots, network intercepts, and viewport emulation."
    },
    {
      title: "Persistence & Event Bus",
      icon: Database,
      tech: "SQLite + EventBus Pub/Sub",
      desc: "Async event dispatcher pushing execution telemetry to WebSocket subscribers and SQLite database listeners."
    }
  ]

  const API_ENDPOINTS = [
    { method: "POST", path: "/api/projects", desc: "Create new test project space" },
    { method: "GET", path: "/api/projects/{id}/test-cases", desc: "List project test cases" },
    { method: "POST", path: "/api/test-cases/{id}/run", desc: "Trigger sync/async agent test run" },
    { method: "WS", path: "/api/test-cases/{id}/execute", desc: "Real-time bi-directional agent stream" },
    { method: "GET", path: "/api/test-runs/{id}/screenshots", desc: "Retrieve run screenshot timeline" }
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300 ring-1 ring-inset ring-cyan-500/30">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              Mostafa Elfar Graduation Project 2026
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" /> Autonomous LLM Agent
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight leading-tight">
            TestPilot <span className="gradient-text-cyan">Architecture & Specifications</span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate-300">
            An in-depth technical breakdown of the visual perception agent loop, LangGraph decision graph, Playwright browser engine, and real-time event streaming pipeline.
          </p>
        </div>
      </section>

      {/* Interactive Agent Perception Loop Visualizer */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-400" />
              Interactive Agent Execution Graph
            </h2>
            <p className="text-xs text-slate-400">
              Click any step below to inspect how the visual perception loop executes in real-time.
            </p>
          </div>
          
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Init → Observe → Plan → Execute → Verify → Recover
          </span>
        </div>

        {/* Step Selector Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {AGENT_STEPS.map((step, i) => {
            const Icon = step.icon
            const isSelected = activeStep === i
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? `bg-gradient-to-b ${step.bgClass} shadow-lg ring-1`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-slate-950/80' : 'bg-slate-800'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold opacity-60">0{i+1}</span>
                </div>
                <span className="text-xs font-bold text-white line-clamp-1">{step.title}</span>
              </button>
            )
          })}
        </div>

        {/* Step Inspector Card */}
        {(() => {
          const step = AGENT_STEPS[activeStep]
          const Icon = step.icon
          return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400">{step.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Highlights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 text-xs text-slate-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}
      </section>

      {/* System Architecture Breakdown */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            System Architecture Components
          </h2>
          <p className="text-xs text-slate-400">
            Clean decoupled multi-layer architecture built for performance and scalability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCHITECTURE_COMPONENTS.map((comp, idx) => {
            const Icon = comp.icon
            return (
              <div key={idx} className="glass-card glass-card-hover rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{comp.title}</h3>
                      <span className="text-[11px] font-mono text-cyan-400">{comp.tech}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {comp.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* API Endpoint Reference Explorer */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-amber-400" />
            Backend REST & WebSocket API Specification
          </h2>
          <p className="text-xs text-slate-400">
            FastAPI application endpoints exposed for local desktop integration and automated test triggers.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
          <div className="divide-y divide-slate-800">
            {API_ENDPOINTS.map((api, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className={`rounded-lg px-2.5 py-1 font-bold ${
                    api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    api.method === 'GET'  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {api.method}
                  </span>
                  <span className="text-slate-200 font-semibold">{api.path}</span>
                </div>
                <span className="text-xs text-slate-400">{api.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
