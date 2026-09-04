import { useDropdown } from "./widgets"

export const MONTH_NAME = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

/**
 * Compact year + month selector.
 *
 * Two dropdowns rather than a row of month chips — twelve chips plus an "all"
 * pill crowded the filter bar and buried the year. Both lists only offer
 * periods that actually contain something, so a selection can never land on an
 * empty page.
 *
 * Shared so other listing sections can use the same control.
 */
function Menu({
  label, value, options, onPick, width = "min-w-[150px]",
}: {
  label: string
  value: string
  options: { value: number; label: string; count?: number }[]
  onPick: (v: number) => void
  width?: string
}) {
  const { open, setOpen, ref } = useDropdown()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.07em] transition-colors ${
          open ? "border-asphalt text-asphalt" : "border-black/15 text-slate-700 hover:border-asphalt hover:text-asphalt"
        }`}
      >
        {value}
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
          className={`absolute left-0 z-40 mt-2 max-h-[300px] ${width} overflow-y-auto rounded-xl border border-black/10 bg-white py-1.5 shadow-[0_30px_70px_-40px_rgba(11,38,74,.5)]`}
        >
          {options.map((o) => {
            const on = o.label === value
            return (
              <li key={o.value}>
                <button
                  onClick={() => { onPick(o.value); setOpen(false) }}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-[0.86rem] transition-colors hover:bg-mist ${
                    on ? "font-semibold text-eurored" : "text-slate-600"
                  }`}
                >
                  {o.label}
                  {o.count !== undefined && (
                    <span className="text-[0.74rem] tabular-nums text-slate-400">{o.count}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function YearMonthPicker({
  years, year, onYear, months, month, onMonth, monthCounts,
}: {
  years: number[]
  year: number
  onYear: (y: number) => void
  /** 1–12, only the months that hold something for the selected year */
  months: number[]
  month: number
  onMonth: (m: number) => void
  monthCounts?: Record<number, number>
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Menu
        label="Year"
        value={String(year)}
        options={years.map((y) => ({ value: y, label: String(y) }))}
        onPick={onYear}
        width="min-w-[120px]"
      />
      <Menu
        label="Month"
        value={MONTH_NAME[month - 1]}
        options={months.map((m) => ({
          value: m,
          label: MONTH_NAME[m - 1],
          count: monthCounts?.[m],
        }))}
        onPick={onMonth}
        width="min-w-[178px]"
      />
    </div>
  )
}
