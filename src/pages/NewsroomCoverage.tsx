import { useEffect, useMemo, useState } from "react"
import { Reveal, Eyebrow } from "@/components/site/ui"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import { TYPE_LABEL, TYPE_SLUG, type NewsType } from "@/lib/newsroom"
import { COVERAGE, DOCKET_PDF } from "@/lib/coverage-data"
import { YearMonthPicker, MONTH_NAME } from "@/components/site/YearMonthPicker"
import { CoverageCard, ClippingLightbox } from "@/components/site/CoverageCard"
import { KIND_LABEL, type CoverageItem, type CoverageKind } from "@/lib/coverage-types"

const PAGE = 24

/* -------------------------------------------------------------- filters ---- */
function Pill({
  on, children, onClick,
}: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.07em] transition-colors ${
        on ? "border-eurored bg-eurored text-white" : "border-black/15 text-slate-600 hover:border-asphalt hover:text-asphalt"
      }`}
    >
      {children}
    </button>
  )
}

/* ----------------------------------------------------------------- page ---- */
/** every year/month in the archive, and the counts behind each */
const PERIODS = (() => {
  const byYear = new Map<number, Map<number, number>>()
  for (const c of COVERAGE) {
    const y = Number(c.date.slice(0, 4))
    const m = Number(c.date.slice(5, 7))
    if (!byYear.has(y)) byYear.set(y, new Map())
    const ms = byYear.get(y)!
    ms.set(m, (ms.get(m) ?? 0) + 1)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)
  return { years, byYear }
})()

/** the newest period that actually holds articles — "current" once the client's dockets are up to date */
const LATEST = (() => {
  const y = PERIODS.years[0]
  const ms = [...(PERIODS.byYear.get(y)?.keys() ?? [1])].sort((a, b) => b - a)
  return { year: y, month: ms[0] }
})()
export function NewsroomCoverage() {
  const { path, navigate } = useRouter()
  const [year, setYear] = useState(LATEST.year)
  const [month, setMonth] = useState(LATEST.month)
  const [kind, setKind] = useState<CoverageKind | null>(null)
  const [q, setQ] = useState("")
  const [shown, setShown] = useState(PAGE)
  const [open, setOpen] = useState<{ item: CoverageItem; index: number } | null>(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [path])

  const monthCounts = useMemo(
    () => Object.fromEntries(PERIODS.byYear.get(year) ?? []) as Record<number, number>,
    [year]
  )
  const months = useMemo(
    () => [...(PERIODS.byYear.get(year)?.keys() ?? [])].sort((a, b) => a - b),
    [year]
  )

  /* changing year keeps the latest month that year actually has */
  const pickYear = (y: number) => {
    const ms = [...(PERIODS.byYear.get(y)?.keys() ?? [1])].sort((a, b) => b - a)
    setYear(y)
    setMonth(ms[0])
    setShown(PAGE)
  }
  const pickMonth = (m: number) => { setMonth(m); setShown(PAGE) }

  const needle = q.trim().toLowerCase()
  const searching = needle.length > 1

  const matchesText = (c: CoverageItem) =>
    c.headline.toLowerCase().includes(needle) ||
    c.publication.toLowerCase().includes(needle) ||
    (c.group ?? "").toLowerCase().includes(needle)

  /* A search spans the whole archive — with the month always set, searching
     inside one month would miss almost everything. Browsing is by month. */
  const list = useMemo(
    () =>
      COVERAGE.filter((c) => {
        if (kind && c.kind !== kind) return false
        if (searching) return matchesText(c)
        return c.date.startsWith(`${year}-${String(month).padStart(2, "0")}`)
      }),
    [year, month, kind, needle, searching]
  )

  const clear = () => {
    setYear(LATEST.year); setMonth(LATEST.month); setKind(null); setQ(""); setShown(PAGE)
  }
  const filtered = Boolean(kind || searching || year !== LATEST.year || month !== LATEST.month)

  /* the compiled report for the selected month, when there is one */
  const docket = searching ? undefined : DOCKET_PDF[`${year}-${String(month).padStart(2, "0")}`]

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#f4f7fb] pb-[clamp(28px,5vh,56px)] pt-[clamp(110px,17vh,158px)] text-asphalt">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(10,110,216,.07) 0%, transparent 48%, rgba(237,28,36,.04) 100%)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[0.78rem] font-medium text-slate-500">
              <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }} className="transition-colors hover:text-asphalt">Home</a>
              <span className="text-slate-400">›</span>
              <a href="/newsroom" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/newsroom") } }} className="transition-colors hover:text-asphalt">Newsroom</a>
              <span className="text-slate-400">›</span>
              <span className="text-asphalt">Campaigns &amp; coverage</span>
            </nav>
          </Reveal>
          <Reveal><Eyebrow>Newsroom</Eyebrow></Reveal>
          <Reveal i={1}>
            <h1 className="italic-display mt-3 text-asphalt leading-[1.02] text-[clamp(1.7rem,4vw,3rem)]">
              In the press
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 max-w-[62ch] text-[clamp(0.9rem,1.2vw,1.05rem)] font-light leading-relaxed text-slate-600">
              Every article, review and mention we have been able to collect — {COVERAGE.length.toLocaleString("en-GB")} pieces
              across {PERIODS.years.length} years. Pick a month to browse, or search to look across all of them.
              Online pieces open at the publisher; print clippings open here.
            </p>
          </Reveal>

          <Reveal i={3} className="mt-7 flex flex-wrap gap-2">
            {(Object.keys(TYPE_LABEL) as NewsType[]).map((t) => (
              <a
                key={t}
                href={`/newsroom/${TYPE_SLUG[t]}`}
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate(`/newsroom/${TYPE_SLUG[t]}`) } }}
                className={`rounded-full border px-4 py-2 font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.08em] transition-colors ${
                  t === "coverage" ? "border-asphalt bg-asphalt text-white" : "border-black/15 text-slate-600 hover:border-asphalt hover:text-asphalt"
                }`}
              >
                {TYPE_LABEL[t]}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* filters */}
      {/* the bar wraps to ~150px on a phone, so it only sticks from tablet up */}
      <section className="relative z-30 border-y border-black/10 bg-white/92 py-3.5 backdrop-blur-md sm:sticky sm:top-[58px]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-4 gap-y-3 px-5 sm:px-8">
          <YearMonthPicker
            years={PERIODS.years}
            year={year}
            onYear={pickYear}
            months={months}
            month={month}
            onMonth={pickMonth}
            monthCounts={monthCounts}
          />

          <div className="flex flex-wrap items-center gap-1.5">
            {(["online", "print", "social"] as CoverageKind[]).map((k) => (
              <Pill key={k} on={kind === k} onClick={() => { setKind(kind === k ? null : k); setShown(PAGE) }}>
                {KIND_LABEL[k]}
              </Pill>
            ))}
          </div>

          <label className="relative flex w-full items-center sm:w-auto">
            <span className="sr-only">Search coverage</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3 text-slate-400" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-4.3-4.3" />
            </svg>
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setShown(PAGE) }}
              placeholder="Publication or headline"
              className="w-full rounded-full border border-black/15 bg-white py-1.5 pl-9 pr-3 text-[0.84rem] text-asphalt placeholder:text-slate-400 focus:border-racing focus:outline-none focus:ring-2 focus:ring-racing/20 sm:w-[210px]"
            />
          </label>

          <span className="ml-auto whitespace-nowrap text-[0.78rem] text-slate-500">
            {list.length.toLocaleString("en-GB")} {list.length === 1 ? "article" : "articles"}
            {searching && <span className="text-slate-400"> · all years</span>}
            {filtered && (
              <button onClick={clear} className="ml-3 font-display text-[0.72rem] font-extrabold uppercase italic tracking-wide text-racing hover:text-eurored">
                Reset
              </button>
            )}
          </span>
        </div>
      </section>

      <section className="py-[clamp(36px,6vh,72px)]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          {docket && (
            <Reveal className="mb-7">
              <a
                href={docket}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2.5 rounded-xl border border-black/10 bg-mist px-4 py-3 text-[0.84rem] font-medium text-asphalt transition-colors hover:border-racing hover:text-racing"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" />
                </svg>
                Download the full {MONTH_NAME[month - 1]} {year} report (PDF)
              </a>
            </Reveal>
          )}

          {list.length === 0 ? (
            <p className="py-16 text-center text-[0.95rem] font-light text-slate-500">
              Nothing matches those filters.{" "}
              <button onClick={clear} className="font-display text-[0.8rem] font-extrabold uppercase italic text-racing hover:text-eurored">Clear them</button>
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.slice(0, shown).map((c, i) => (
                  <CoverageCard key={c.id} item={c} i={i} onOpen={(item, index) => setOpen({ item, index })} />
                ))}
              </div>

              {shown < list.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <button
                    onClick={() => setShown((s) => s + PAGE)}
                    className="inline-flex items-center gap-2 rounded-[3px] bg-asphalt px-7 py-3 font-display text-[0.84rem] font-extrabold uppercase italic tracking-[0.04em] text-white transition-transform hover:-translate-y-0.5"
                  >
                    Load more
                    <span className="text-slate-400">
                      {Math.min(PAGE, list.length - shown)} of {(list.length - shown).toLocaleString("en-GB")} left
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
      {open && (
        <ClippingLightbox
          item={open.item}
          startIndex={open.index}
          onClose={() => setOpen(null)}
        />
      )}
    </main>
  )
}
