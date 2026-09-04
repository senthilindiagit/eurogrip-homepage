import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Reveal, Eyebrow } from "@/components/site/ui"
import { useDropdown } from "@/components/site/widgets"
import { FilterSelect } from "@/components/site/FilterSelect"
import { SiteFooter } from "@/components/site/CtaFooter"
import { MediaLightbox } from "@/components/site/MediaLightbox"
import { NewsCard, opensAsPage } from "@/components/site/NewsCard"
import { useRouter } from "@/lib/router"
import {
  byType, yearsFor, regionsFor, tagsFor, REGION_LABEL, TYPE_LABEL, TYPE_SLUG,
  NEWS_SORTED, type NewsItem, type NewsType, type Region,
} from "@/lib/newsroom"

const INTRO: Record<NewsType, string> = {
  "press-release": "Official announcements from the brand — product launches, OEM partnerships and show news.",
  event: "Every trade fair, festival and race weekend we've shown up to, with the photos and films from each.",
  newsletter: "Eurogrip News, issue by issue. Open one to read it, or download the PDF in your language.",
  coverage: "Campaign and press-coverage compilations, month by month.",
}

/** small pill used by all three filters */
function Pill({
  on, children, onClick,
}: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.07em] transition-colors ${
        on
          ? "border-eurored bg-eurored text-white"
          : "border-black/15 text-slate-600 hover:border-asphalt hover:text-asphalt"
      }`}
    >
      {children}
    </button>
  )
}

/**
 * Tag filter menu.
 *
 * A controlled panel rather than a native <details>, which stays open until
 * its own summary is clicked again — it ignores both a click outside and the
 * selection itself.
 */
function TagMenu({
  tags, tag, onPick,
}: { tags: string[]; tag: string | null; onPick: (t: string | null) => void }) {
  /* same dismiss behaviour as the header selectors */
  const { open, setOpen, ref } = useDropdown()
  const pick = (t: string | null) => { onPick(t); setOpen(false) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.07em] transition-colors ${
          open || tag ? "border-asphalt text-asphalt" : "border-black/15 text-slate-600 hover:border-asphalt hover:text-asphalt"
        }`}
      >
        {tag ?? "Tags"}
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-2 flex max-h-[260px] w-[min(320px,80vw)] flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-black/10 bg-white p-3 shadow-[0_30px_70px_-40px_rgba(11,38,74,.5)]">
          <Pill on={!tag} onClick={() => pick(null)}>All</Pill>
          {tags.map((t) => (
            <Pill key={t} on={tag === t} onClick={() => pick(tag === t ? null : t)}>{t}</Pill>
          ))}
        </div>
      )}
    </div>
  )
}

export function NewsroomList({ type }: { type: NewsType }) {
  const { path, navigate } = useRouter()
  const reduce = useReducedMotion()
  const all = useMemo(() => byType(type), [type])

  const [year, setYear] = useState<string | null>(null)
  const [region, setRegion] = useState<Region | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [open, setOpen] = useState<NewsItem | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    setYear(null); setRegion(null); setTag(null)
  }, [path])

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("story")
    if (id) {
      const hit = NEWS_SORTED.find((n) => n.id === id)
      if (hit && !opensAsPage(hit)) setOpen(hit)
    }
  }, [])

  const years = yearsFor(all)
  const regions = regionsFor(all)
  const tags = tagsFor(all)

  const shown = all.filter(
    (n) =>
      (!year || n.date.startsWith(year)) &&
      (!region || n.regions.includes(region)) &&
      (!tag || n.tags.includes(tag))
  )
  const filtered = Boolean(year || region || tag)

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
              <span className="text-asphalt">{TYPE_LABEL[type]}</span>
            </nav>
          </Reveal>

          <Reveal><Eyebrow>Newsroom</Eyebrow></Reveal>
          <Reveal i={1}>
            <h1 className="italic-display mt-3 text-asphalt leading-[1.02] text-[clamp(1.7rem,4vw,3rem)]">
              {TYPE_LABEL[type]}
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 max-w-[62ch] text-[clamp(0.9rem,1.2vw,1.05rem)] font-light leading-relaxed text-slate-600">
              {INTRO[type]}
            </p>
          </Reveal>

          {/* other categories */}
          <Reveal i={3} className="mt-7 flex flex-wrap gap-2">
            {(Object.keys(TYPE_LABEL) as NewsType[]).map((t) => (
              <a
                key={t}
                href={`/newsroom/${TYPE_SLUG[t]}`}
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate(`/newsroom/${TYPE_SLUG[t]}`) } }}
                className={`rounded-full border px-4 py-2 font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.08em] transition-colors ${
                  t === type ? "border-asphalt bg-asphalt text-white" : "border-black/15 text-slate-600 hover:border-asphalt hover:text-asphalt"
                }`}
              >
                {TYPE_LABEL[t]}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* filters */}
      <section className="sticky top-[58px] z-30 border-y border-black/10 bg-white/92 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-5 gap-y-3 px-5 sm:px-8">
          {/* three or fewer choices read fine as pills; more become a dropdown */}
          {years.length > 1 && (
            years.length > 3 ? (
              <FilterSelect
                label="Year"
                allLabel="All years"
                value={year}
                options={years.map((y) => ({ value: y, label: y }))}
                onPick={setYear}
                minWidth="min-w-[130px]"
              />
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-slate-400">Year</span>
                <Pill on={!year} onClick={() => setYear(null)}>All</Pill>
                {years.map((y) => (
                  <Pill key={y} on={year === y} onClick={() => setYear(year === y ? null : y)}>{y}</Pill>
                ))}
              </div>
            )
          )}

          {regions.length > 1 && (
            regions.length > 3 ? (
              <FilterSelect
                label="Region"
                allLabel="All regions"
                value={region}
                options={regions.map((r) => ({ value: r, label: REGION_LABEL[r] }))}
                onPick={setRegion}
                minWidth="min-w-[170px]"
              />
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-slate-400">Region</span>
                <Pill on={!region} onClick={() => setRegion(null)}>All</Pill>
                {regions.map((r) => (
                  <Pill key={r} on={region === r} onClick={() => setRegion(region === r ? null : r)}>{REGION_LABEL[r]}</Pill>
                ))}
              </div>
            )
          )}

          {tags.length > 1 && <TagMenu tags={tags} tag={tag} onPick={setTag} />}

          <span className="ml-auto text-[0.78rem] text-slate-500">
            {shown.length} {shown.length === 1 ? "item" : "items"}
            {filtered && (
              <button
                onClick={() => { setYear(null); setRegion(null); setTag(null) }}
                className="ml-3 font-display text-[0.72rem] font-extrabold uppercase italic tracking-wide text-racing hover:text-eurored"
              >
                Clear
              </button>
            )}
          </span>
        </div>
      </section>

      {/* results */}
      <section className="py-[clamp(36px,6vh,72px)]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          {shown.length ? (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((n, i) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* the newsletter masthead is a nameplate, not a photo — it
                        only needs a shallow plate on this list */}
                    <NewsCard
                      item={n}
                      i={i}
                      onOpen={setOpen}
                      showType={false}
                      shortCover={n.type === "newsletter"}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 bg-mist py-16 text-center">
              <p className="font-display text-[1rem] font-extrabold uppercase italic text-asphalt">Nothing matches those filters</p>
              <button
                onClick={() => { setYear(null); setRegion(null); setTag(null) }}
                className="mt-3 font-display text-[0.78rem] font-extrabold uppercase italic tracking-wide text-racing hover:text-eurored"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
      {open && <MediaLightbox item={open} onClose={() => setOpen(null)} />}
    </main>
  )
}
