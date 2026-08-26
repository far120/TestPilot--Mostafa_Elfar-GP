export function Input({ label, error, className = '', ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</span>
      )}
      <input
        className={`
          block w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-100
          placeholder:text-slate-600 outline-none transition-all duration-150
          border-slate-800 bg-slate-950/90 shadow-inner
          focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
          disabled:bg-slate-900 disabled:text-slate-500
          ${error ? 'border-rose-500 focus:border-rose-500' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </label>
  )
}

export function Textarea({ label, error, className = '', ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</span>
      )}
      <textarea
        rows={3}
        className={`
          block w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-100
          placeholder:text-slate-600 outline-none transition-all duration-150 resize-none
          border-slate-800 bg-slate-950/90 shadow-inner
          focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
          ${error ? 'border-rose-500 focus:border-rose-500' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </label>
  )
}
