import { useDropdown } from "./widgets"

/**
 * Single-select filter as a dropdown, with an "all" entry.
 *
 * The convention on the site: three or fewer choices stay as pills, because
 * they read at a glance; more than three become one of these, because a row of
 * pills starts to crowd the bar and bury the controls next to it.
 */
export function FilterSelect<T extends string | number>({
  label, allLabel = "All", value, options, onPick, minWidth = "min-w-[160px]",
}: {
  label: string
  allLabel?: string
  value: T | null
  options: { value: T; label: string; count?: number }[]
  onPick: (v: T | null) => void
  minWidth?: string
}) {
  const { open, setOpen, ref } = useDropdown()
  const current = options.find((o) => o.value === value)?.label ?? allLabel

  const pick = (v: T | null) => { onPick(v); setOpen(false) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.07em] transition-colors ${
          open || value !== null
            ? "border-asphalt text-asphalt"
            : "border-black/15 text-slate-600 hover:border-asphalt hover:text-asphalt"
        }`}
      >
        {current}
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute left-0 z-40 mt-2 max-h-[300px] ${minWidth} overflow-y-auto rounded-xl border border-black/10 bg-white py-1.5 shadow-[0_30px_70px_-40px_rgba(11,38,74,.5)]`}
        >
          <li>
            <button
              onClick={() => pick(null)}
              className={`block w-full px-4 py-2 text-left text-[0.86rem] transition-colors hover:bg-mist ${
                value === null ? "font-semibold text-eurored" : "text-slate-600"
              }`}
            >
              {allLabel}
            </button>
          </li>
          {options.map((o) => (
            <li key={String(o.value)}>
              <button
                onClick={() => pick(o.value)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-[0.86rem] transition-colors hover:bg-mist ${
                  o.value === value ? "font-semibold text-eurored" : "text-slate-600"
                }`}
              >
                {o.label}
                {o.count !== undefined && (
                  <span className="text-[0.74rem] tabular-nums text-slate-400">{o.count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
