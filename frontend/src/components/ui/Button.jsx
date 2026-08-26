import Spinner from './Spinner.jsx'

const base = `
  inline-flex items-center justify-center gap-2 rounded-xl
  font-bold leading-none transition-all duration-150
  focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50
  shadow-md
`

const variants = {
  primary:   'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20',
  secondary: 'border border-slate-700 bg-slate-800 text-slate-200 hover:border-emerald-500/40 hover:bg-slate-700 hover:text-white',
  ghost:     'text-slate-400 hover:bg-slate-800 hover:text-slate-200 shadow-none',
  danger:    'border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-xs',
  lg: 'px-5 py-3 text-sm',
}

export default function Button({
  variant   = 'secondary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size="xs" />}
      {children}
    </button>
  )
}
