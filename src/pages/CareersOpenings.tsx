import { useEffect, useMemo, useState } from "react"
import { Reveal, SectionHead, Btn, Arrow } from "@/components/site/ui"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"

const APPLY = "/careers/apply"

/* Client-requested provision (2026-08-06 call): region + department dropdowns,
   only departments with live vacancies appear, 1–2 lines per opening, apply
   through the existing form. OPENINGS below is SAMPLE data — swap in the
   client's real list when it arrives; the page renders from data alone. */
export const OPENINGS: { region: string; dept: string; title: string; exp: string; place: string }[] = [
  { region: "India", dept: "Sales", title: "Area Sales Manager", exp: "3–5 years of experience", place: "Chennai, Tamil Nadu" },
  { region: "India", dept: "Sales", title: "Territory Sales Executive", exp: "2–4 years of experience", place: "Madurai, Tamil Nadu" },
  { region: "India", dept: "Marketing", title: "Digital Marketing Executive", exp: "2–3 years of experience", place: "Chennai, Tamil Nadu" },
  { region: "India", dept: "Supply Chain", title: "Logistics Coordinator", exp: "3+ years of experience", place: "Madurai, Tamil Nadu" },
  { region: "Europe", dept: "R&D & Design", title: "Tyre Design Engineer", exp: "4+ years of experience", place: "Milan, Italy" },
]

/** Dedicated openings page — reached from the Careers teaser. */
export function CareersOpenings() {
  const { path, navigate } = useRouter()
  const [region, setRegion] = useState("All")
  const [dept, setDept] = useState("All")

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [path])

  const regions = useMemo(() => ["All", ...new Set(OPENINGS.map((o) => o.region))], [])
  /* only departments that actually have vacancies in the chosen region */
  const depts = useMemo(() => {
    const pool = region === "All" ? OPENINGS : OPENINGS.filter((o) => o.region === region)
    return ["All", ...new Set(pool.map((o) => o.dept))]
  }, [region])
  const shown = OPENINGS.filter((o) => (region === "All" || o.region === region) && (dept === "All" || o.dept === dept))

  const pickRegion = (r: string) => { setRegion(r); setDept("All") }
  const select =
    "w-full appearance-none rounded-md border border-black/15 bg-white px-3.5 py-2.5 pr-9 text-[0.92rem] text-asphalt focus:border-racing focus:outline-none focus:ring-2 focus:ring-racing/20"
  const crumb = "transition-colors hover:text-asphalt"

  return (
    <main>
      <section className="bg-mist pb-[clamp(56px,9vh,110px)] pt-[clamp(112px,17vh,160px)] text-asphalt">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[0.78rem] font-medium text-slate-500">
              <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }} className={crumb}>Home</a>
              <span className="text-slate-400">›</span>
              <a href="/careers" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/careers") } }} className={crumb}>Careers</a>
              <span className="text-slate-400">›</span>
              <span className="text-asphalt">Open positions</span>
            </nav>
          </Reveal>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              light
              eyebrow="Open positions"
              title={<>Where you could<br />start on Monday</>}
              lede="Filter by region and department — every listed role takes applications through the same form."
              className="mb-0"
            />
            {/* filters */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <label className="block">
                <span className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Region</span>
                <span className="relative block">
                  <select value={region} onChange={(e) => pickRegion(e.target.value)} className={select} aria-label="Filter by region">
                    {regions.map((r) => <option key={r} value={r}>{r === "All" ? "All regions" : r}</option>)}
                  </select>
                  <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-500">Department</span>
                <span className="relative block">
                  <select value={dept} onChange={(e) => setDept(e.target.value)} className={select} aria-label="Filter by department">
                    {depts.map((d) => <option key={d} value={d}>{d === "All" ? "All departments" : d}</option>)}
                  </select>
                  <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                </span>
              </label>
            </div>
          </div>

          {/* listings */}
          <div className="mt-[clamp(28px,4vh,44px)]">
            {shown.length > 0 ? (
              <ul className="divide-y divide-black/10 overflow-hidden rounded-2xl border border-black/10 bg-white">
                {shown.map((o, i) => (
                  <Reveal key={o.title + o.region} i={i % 4}>
                    <li className="flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-mist sm:px-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-display text-[1.02rem] font-extrabold uppercase italic leading-tight text-asphalt">{o.title}</h3>
                          <span className="rounded-full bg-racing/10 px-2.5 py-0.5 font-display text-[0.64rem] font-extrabold uppercase tracking-[0.08em] text-racing">{o.dept}</span>
                          <span className="rounded-full bg-black/5 px-2.5 py-0.5 font-display text-[0.64rem] font-extrabold uppercase tracking-[0.08em] text-slate-500">{o.region}</span>
                        </div>
                        <p className="mt-1.5 text-[0.86rem] font-light text-slate-600">{o.exp} · {o.place}</p>
                      </div>
                      <Btn
                        href={`${APPLY}?role=${encodeURIComponent(o.title)}&dept=${encodeURIComponent(o.dept)}&place=${encodeURIComponent(o.place)}`}
                        variant="line-dark"
                        className="!px-5 !py-2.5 text-[0.78rem]"
                      >
                        Apply <Arrow />
                      </Btn>
                    </li>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <Reveal>
                <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
                  <p className="font-display text-[1.05rem] font-extrabold uppercase italic text-asphalt">Nothing open here right now</p>
                  <p className="mx-auto mt-2 max-w-[46ch] text-[0.9rem] font-light text-slate-600">
                    New roles open through the year — send us your CV and we'll keep it on file for the next one.
                  </p>
                  <div className="mt-5 flex justify-center"><Btn href={APPLY} variant="red">Send your CV <Arrow /></Btn></div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
