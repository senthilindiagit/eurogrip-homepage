import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { GlobeInteractive } from "@/components/ui/cobe-globe-interactive"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow, Counter, Marquee } from "@/components/site/ui"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { ReviewCard, VideoLightbox, type PlayTarget } from "@/components/site/ReviewCard"
import { LATEST_REVIEWS } from "@/lib/reviews"
import { useRouter, Link } from "@/lib/router"
import { MARKETS } from "@/lib/site-data"
import { NEWS_SORTED } from "@/lib/newsroom"
import { fmtDate, storyHref } from "@/components/site/NewsCard"
import worldDots from "@/assets/about/world-dots.webp"
import lifeTrack from "@/assets/careers/life-2.webp"
import wetTrack from "@/assets/careers/real-tech-4.webp"
import roadRide from "@/assets/careers/real-eicma.webp"
import certDot from "@/assets/certs/cert-dot.webp"
import certInmetro from "@/assets/certs/cert-inmetro.webp"
import certSni from "@/assets/certs/cert-sni.webp"
import certBis from "@/assets/certs/cert-bis.webp"
import certGso from "@/assets/certs/cert-gso.webp"
import certSabs from "@/assets/certs/cert-sabs.webp"
import certReach from "@/assets/certs/cert-reach.webp"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* deep-navy globe for the dark hero — module constant so the globe isn't
   torn down and rebuilt on every render */
const GLOBE_THEME = {
  dark: 1,
  baseColor: [0.11, 0.18, 0.32] as [number, number, number],
  markerColor: [0.93, 0.11, 0.14] as [number, number, number],
  glowColor: [0.10, 0.30, 0.58] as [number, number, number],
  mapBrightness: 9,
}

/* --------------------------------------------------------------- regions ---
   Grouped from the markets already plotted on the homepage globe. The
   coordinates double as the globe's focus point for each region.
--------------------------------------------------------------------------- */
type Region = {
  id: string
  name: string
  focus: [number, number]
  blurb: string
  markets: string[]
  note: string
}

const REGIONS: Region[] = [
  {
    id: "india",
    name: "India & South Asia",
    focus: [20.6, 78.9],
    blurb:
      "Home ground. Two plants, the R&D centre and a distribution network four decades deep, with a significant share of both OEM and replacement demand.",
    markets: ["India — Madurai HQ", "India — Pantnagar"],
    note: "34 Mn installed capacity",
  },
  {
    id: "europe",
    name: "Europe",
    focus: [48.5, 9.5],
    blurb:
      "Our design centre in Milan shapes the premium range, and European road conditions are one of the three benchmarks every platform is tested against.",
    markets: ["Italy", "Germany", "United Kingdom"],
    note: "Design centre, Milan",
  },
  {
    id: "mea",
    name: "Middle East & Africa",
    focus: [12.0, 40.0],
    blurb:
      "Heat, dust and long distances — the conditions that put compound durability under the most pressure, served through regional distribution partners.",
    markets: ["UAE", "South Africa"],
    note: "Heat and long-haul duty",
  },
  {
    id: "apac",
    name: "Asia-Pacific",
    focus: [-5.0, 115.0],
    blurb:
      "Dense two- and three-wheeler markets where monsoon grip and everyday resilience matter more than anything on the spec sheet.",
    markets: ["Thailand", "Indonesia", "Australia"],
    note: "Monsoon-grade grip",
  },
  {
    id: "americas",
    name: "Americas",
    focus: [5.0, -70.0],
    blurb:
      "From North American highways to Brazilian city traffic — a growing export footprint across the full two-wheeler and off-highway range.",
    markets: ["United States", "Brazil"],
    note: "Growing export footprint",
  },
]

const STATS = [
  { to: 125, suffix: "+", label: "Countries served" },
  { to: 5, suffix: "", label: "Continents reached" },
  { to: 1000, suffix: "+", label: "Distribution partners" },
  { to: 3, suffix: "", label: "Road-test geographies" },
]

/* latest trade fairs & rider events, straight from the newsroom data */
const EVENTS = NEWS_SORTED.filter((n) => n.type === "event").slice(0, 3)

/* the marks our tyres carry into each market — from Corp Info deck */
const CERTS = [
  { img: null, abbr: "E4", name: "ECE", body: "UN ECE homologation" },
  { img: certDot, abbr: "DOT", name: "FMVSS (DOT)", body: "United States" },
  { img: certInmetro, abbr: "INMETRO", name: "Brazilian Standard", body: "Brazil" },
  { img: certSni, abbr: "SNI", name: "Indonesia Standards", body: "Indonesia" },
  { img: certBis, abbr: "BIS", name: "Bureau of Indian Standards", body: "India" },
  { img: certGso, abbr: "GSO", name: "Gulf Standard Organization", body: "Gulf states" },
  { img: certSabs, abbr: "SABS", name: "South Africa Bureau of Standards", body: "South Africa" },
  { img: certReach, abbr: "REACH", name: "REACH Compliance", body: "Registration, Evaluation, Authorization & Restriction of Chemicals" },
]

/* what the three road-test geographies actually put a tyre through */
const PROVING = [
  {
    img: wetTrack,
    alt: "A rider on a standing-wet test track",
    k: "Wet & broken surfaces",
    d: "Monsoon water, standing wet and poor surfaces. India's everyday roads are the hardest durability test we have.",
  },
  {
    img: roadRide,
    alt: "Riders at speed on a European back road",
    k: "Speed & distance",
    d: "Motorway stability, cold-weather grip and long-haul wear — the European benchmark, run out of the Milan centre.",
  },
  {
    img: lifeTrack,
    alt: "Engineers reading test data trackside at dusk",
    k: "Refinement & consistency",
    d: "The Japanese standard: noise, comfort and unit-to-unit consistency, measured against OEM expectations.",
  },
]

/* ======================= HERO — the interactive globe ======================
   The region rail drives the globe: pick a region and it swings round to it
   while the panel swaps. Drag the globe at any point to take over.
========================================================================== */
function GlobeHero() {
  /* nothing selected to begin with, so the globe just turns */
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const region = active === null ? null : REGIONS[active]

  return (
    <section className="relative overflow-hidden bg-midnight pb-[clamp(48px,8vh,90px)] pt-[clamp(112px,17vh,168px)] text-white">
      {/* dotted world watermark */}
      <img
        src={worldDots}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[12%] mx-auto w-[120%] max-w-none opacity-[0.07] mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 78% 38%, rgba(10,110,216,.30) 0%, transparent 62%)" }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[0.78rem] font-medium text-slate-400">
            <Crumb />
          </nav>
        </Reveal>

        <div className="grid items-center gap-[clamp(30px,4vw,64px)] lg:grid-cols-[1fr_0.92fr]">
          {/* copy + region rail */}
          <div>
            <Reveal><Eyebrow className="text-sky-300 [&::before]:bg-sky-300">Global presence</Eyebrow></Reveal>
            <Reveal i={1}>
              <h1 className="italic-display mt-4 text-white leading-[0.94] text-[clamp(1.9rem,5vw,4rem)]">
                125 countries.<br />One standard.
              </h1>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-5 text-[clamp(0.9rem,1.25vw,1.1rem)] font-light leading-relaxed text-sky-100/80 lg:whitespace-nowrap">
                Designed in Milan, engineered in Madurai, ridden everywhere.
              </p>
              <p className="mt-1.5 text-[clamp(0.88rem,1.2vw,1.05rem)] font-light italic leading-relaxed text-sky-100/65 lg:whitespace-nowrap">
                Choose a region — or take hold of the globe yourself.
              </p>
            </Reveal>

            {/* region rail */}
            <Reveal i={3}>
              <div role="tablist" aria-label="Regions" className="mt-8 flex flex-wrap gap-2">
                {REGIONS.map((r, i) => (
                  <button
                    key={r.id}
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => setActive(i === active ? null : i)}
                    className={`rounded-full border px-4 py-2 font-display text-[0.76rem] font-extrabold uppercase italic tracking-[0.08em] transition-colors ${
                      i === active
                        ? "border-eurored bg-eurored text-white"
                        : "border-white/20 text-slate-300 hover:border-white/50 hover:text-white"
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* region panel */}
            <div className={active === null ? "" : "mt-9 min-h-[188px] lg:mt-7"}>
              <AnimatePresence mode="wait">
                {region && (
                <motion.div
                  key={region.id}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: ENTER }}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-[2px] w-8 bg-eurored" />
                    <span className="font-display text-[0.76rem] font-extrabold uppercase italic tracking-[0.12em] text-sky-300">
                      {region.note}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[52ch] text-[0.95rem] font-light leading-relaxed text-slate-300">
                    {region.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {region.markets.map((m) => (
                      <span
                        key={m}
                        className="rounded-[3px] border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[0.78rem] font-light text-slate-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* the globe */}
          <Reveal i={2}>
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[8%] rounded-full"
                style={{ boxShadow: "0 0 120px 30px rgba(10,110,216,.28)" }}
              />
              <GlobeInteractive
                markers={MARKETS}
                focus={region?.focus ?? null}
                theme={GLOBE_THEME}
                className="h-full w-full"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Crumb() {
  const { navigate } = useRouter()
  return (
    <>
      <a
        href="/"
        onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }}
        className="transition-colors hover:text-white"
      >
        Home
      </a>
      <span className="text-slate-500">›</span>
      <span className="text-white">Global presence</span>
    </>
  )
}

/* ------------------------------------------------------------- the numbers -- */
function Numbers() {
  return (
    <section className="bg-mist py-[clamp(48px,8vh,90px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} i={i} className="border-t-2 border-eurored pt-4">
              <Counter
                to={s.to}
                suffix={s.suffix}
                className="font-display text-[clamp(1.45rem,2.6vw,2.1rem)] font-black italic leading-none text-asphalt"
              />
              <div className="mt-1.5 text-[0.74rem] uppercase tracking-wide text-slate-500">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- events & fairs -- */
function EventsFairs() {
  return (
    <section className="bg-white py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHead
            light
            eyebrow="Events & fairs"
            title={<>Where the world<br />meets Eurogrip</>}
            lede="Trade fairs, motor shows and rider festivals across the globe — the stands, the launches and the people who stopped by."
          />
          <Reveal i={2}>
            <Btn href="/newsroom/events" variant="blue">All events <Arrow /></Btn>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((e, i) => (
            <Reveal key={e.id} i={i % 3}>
              <Link href={storyHref(e)} className="group block h-full">
                <article className="h-full overflow-hidden rounded-2xl border border-black/10 bg-mist shadow-[0_30px_70px_-45px_rgba(11,38,74,.5)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-racing/40">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={e.cover ?? undefined}
                      alt={e.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg, transparent 45%, rgba(13,26,48,.82) 100%)" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.14em] text-eurored">
                        {e.place} · {fmtDate(e.date)}
                      </span>
                      <h3 className="mt-1 font-display text-[1.15rem] font-black uppercase italic leading-none text-white">
                        {e.title}
                      </h3>
                    </div>
                  </div>
                  <p className="p-5 text-[0.9rem] font-light leading-relaxed text-slate-600">{e.summary}</p>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------- certified worldwide ----- */
function E4Mark() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="none" stroke="#11151b" strokeWidth="3" />
      <text x="32" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontSize="27" fill="#11151b">E4</text>
    </svg>
  )
}

function Certified() {
  return (
    <section className="bg-mist py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="Certified worldwide"
          title={<>Globally tested &amp;<br />certified products</>}
          lede="Every market has its own bar. Eurogrip tyres are homologated and certified to the standards of the regions they ride in."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CERTS.map((c, i) => (
            <Reveal key={c.name} i={i % 4}>
              <div className="group flex h-full flex-col items-center rounded-2xl border border-black/10 bg-white p-6 text-center shadow-[0_24px_55px_-40px_rgba(16,35,70,.45)] transition-all duration-300 hover:-translate-y-1 hover:border-racing/40">
                <span className="grid h-16 w-16 place-items-center">
                  {c.img ? <img src={c.img} alt={c.name} loading="lazy" className="max-h-14 w-auto" /> : <E4Mark />}
                </span>
                <h3 className="mt-3.5 font-display text-[0.9rem] font-extrabold uppercase italic leading-tight text-asphalt">{c.name}</h3>
                <p className="mt-1.5 text-[0.76rem] font-light leading-snug text-slate-500">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------- reviews & testimonials --- */
/**
 * The newest three from the reviews page, in the same card. Certification says
 * the tyres meet each market's bar; this says what the market made of them.
 */
function Verdicts({ onPlay }: { onPlay: (t: PlayTarget) => void }) {
  return (
    <section className="bg-white py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHead
            light
            eyebrow="Reviews & testimonials"
            title={<>Tested by the press,<br />proved in the field</>}
            lede="Motorcycle media test our tyres on road, off-road and on track — and riders, farmers and contractors give their own verdict."
          />
          <Reveal i={2}>
            <Btn href="/reviews" variant="blue">View all reviews <Arrow /></Btn>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LATEST_REVIEWS.map((r, i) => (
            <ReviewCard key={r.slug} r={r} i={i} onPlay={onPlay} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- proving ---- */
function Proving() {
  return (
    <section className="bg-gradient-to-b from-steel-2 to-steel py-[clamp(64px,10vh,130px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Proving ground"
          title={<>Tested where<br />it's hardest</>}
          lede="Every platform is measured against Indian, European and Japanese road conditions before it earns the Eurogrip name."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PROVING.map((p, i) => (
            <Reveal key={p.k} i={i}>
              <div className="group relative h-[clamp(240px,32vw,340px)] overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={p.img}
                  alt={p.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(13,26,48,.25) 0%, transparent 34%, rgba(13,26,48,.93) 100%)" }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.14em] text-eurored">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-display text-[clamp(1.1rem,1.9vw,1.5rem)] font-black uppercase italic leading-none text-white">
                    {p.k}
                  </h3>
                  <p className="mt-2.5 text-[0.88rem] font-light leading-relaxed text-slate-300">{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- distribute -- */
function Distribute() {
  return (
    <section className="bg-mist py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(28px,4vw,60px)] lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Reveal><Eyebrow>Partner with us</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-3 text-asphalt text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.04]">
                Looking for a<br />market to open?
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-4 max-w-[48ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-600">
                We work with distributors, importers and OEM partners across every region on this page — and we're still expanding. Tell us where you are and what you ride.
              </p>
            </Reveal>
            <Reveal i={3} className="mt-7 flex flex-wrap gap-3.5">
              <Btn href="/contact" variant="red">Become a distributor <Arrow /></Btn>
              <Btn href="/about" variant="line-dark">About Eurogrip</Btn>
            </Reveal>
          </div>
          <Reveal i={1}>
            <div className="overflow-hidden rounded-2xl border border-black/10 shadow-[0_36px_80px_-50px_rgba(6,18,38,.55)]">
              <img src={roadRide} alt="Riders at speed on a European back road" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* markets ticker */}
      <div className="mt-[clamp(40px,6vh,80px)] border-y border-black/10 py-3.5">
        <Marquee speed={34}>
          {MARKETS.map((m) => (
            <span
              key={m.id}
              className="flex items-center gap-4 whitespace-nowrap font-display text-[0.82rem] font-extrabold uppercase italic tracking-[0.1em] text-slate-500"
            >
              {m.name.replace(" — HQ", "")} <span className="h-1.5 w-1.5 rounded-full bg-eurored" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export function GlobalPresence() {
  const { path } = useRouter()
  const [video, setVideo] = useState<PlayTarget | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [path])

  useEffect(() => {
    if (!video) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [video])

  return (
    <main>
      <GlobeHero />
      <Cine>
        <Numbers />
        <EventsFairs />
      </Cine>
      <Proving />
      <Cine><Certified /></Cine>
      <Cine><Verdicts onPlay={setVideo} /></Cine>
      <Distribute />
      <SiteFooter />

      <AnimatePresence>
        {video && <VideoLightbox target={video} onClose={() => setVideo(null)} />}
      </AnimatePresence>
    </main>
  )
}
