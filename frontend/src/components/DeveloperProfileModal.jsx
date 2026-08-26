import Modal from './ui/Modal.jsx'
import { DEMO_DEVELOPER_INFO } from '../data/demoData.js'
import {
  User,
  GraduationCap,
  Mail,
  MapPin,
  CheckCircle2,
  Award,
  ExternalLink,
  Code,
  Sparkles,
  FileText
} from 'lucide-react'

export default function DeveloperProfileModal({ open, onClose }) {
  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="space-y-6 pt-2 text-slate-100">
        
        {/* Header Profile Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-6 border border-slate-700/60 shadow-xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 p-1 shadow-lg shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950 text-2xl font-black tracking-widest text-emerald-400">
                ME
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {DEMO_DEVELOPER_INFO.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3" /> Available for Hire
                </span>
              </div>
              
              <p className="text-sm font-medium text-emerald-400">
                {DEMO_DEVELOPER_INFO.title}
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                  {DEMO_DEVELOPER_INFO.degree}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-400" />
                  {DEMO_DEVELOPER_INFO.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project & Role Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-400" />
            Graduation Project & Engineering Focus
          </h3>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs leading-relaxed text-slate-300 space-y-2">
            <p>
              <strong className="text-white">TestPilot</strong> represents Mostafa's graduation project showcasing an end-to-end autonomous visual web testing agent built with Playwright, FastAPI REST & WebSockets, LangGraph LLM decision graphs, and React 18.
            </p>
            <p className="text-slate-400">
              {DEMO_DEVELOPER_INFO.summary}
            </p>
          </div>
        </div>

        {/* Core Competencies Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Code className="h-4 w-4 text-cyan-400" />
            Technical Skillset
          </h3>
          <div className="flex flex-wrap gap-2">
            {DEMO_DEVELOPER_INFO.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-500/40 hover:text-white transition-all"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Social & Resume Action Links */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <a
              href={DEMO_DEVELOPER_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <svg className="h-3.5 w-3.5 fill-current text-slate-300" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a
              href={DEMO_DEVELOPER_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <svg className="h-3.5 w-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href={`mailto:${DEMO_DEVELOPER_INFO.email}`}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <Mail className="h-3.5 w-3.5 text-emerald-400" />
              Email
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:from-emerald-400 hover:to-teal-500 transition-all"
          >
            Close Overview
          </button>
        </div>

      </div>
    </Modal>
  )
}
