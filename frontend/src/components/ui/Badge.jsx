import Spinner from './Spinner.jsx'

const variants = {
  passed:  'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80',
  failed:  'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/80',
  error:   'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/80',
  running: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/80',
  aborted: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/80',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/80',
  accent:  'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80',
}

export default function Badge({ variant = 'neutral', dot = false, className = '', children }) {
  const isRunning = variant === 'running'

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full px-2.5 py-1
        text-[10px] font-semibold uppercase tracking-[0.14em] leading-none whitespace-nowrap
        ${variants[variant] ?? variants.neutral}
        ${className}
      `}
    >
      {/* Animated spinner for running, static dot for others when dot=true */}
      {isRunning && <Spinner size="xs" />}
      {!isRunning && dot && (
        <span className="block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  )
}
