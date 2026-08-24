import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Counter, Eyebrow } from "@/components/site/ui"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import rangeUsa from "@/assets/about/range-usa.webp"
import worldDots from "@/assets/about/world-dots.webp"
const whatWeDoReel = "/whatwedo-reel.mp4"
import tvsMobilityLogo from "@/assets/about/tvs-mobility-logo.svg"
import initSustainability from "@/assets/about/init-sustainability.webp"
import initSafety from "@/assets/about/about-hero.webp"
import initRiders from "@/assets/race-bike.webp"
import initPeople from "@/assets/about/init-people.webp"
import j1982 from "@/assets/about/journey/j-1982.webp"
import j1991 from "@/assets/about/journey/j-1991.webp"
import j2005 from "@/assets/about/journey/j-2005.webp"
import j2008 from "@/assets/about/journey/j-2008.webp"
import j2015 from "@/assets/about/journey/j-2015.webp"
import j2019 from "@/assets/about/journey/j-2019.webp"
import j2022 from "@/assets/about/journey/j-2022.webp"
import j2024 from "@/assets/about/journey/j-2024.webp"
import j2026 from "@/assets/about/journey/j-2026.webp"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* ============================ Hero ============================ */
const HERO_STATS = [
  { to: 44, suffix: "+", label: "Years of expertise" },
  { to: 125, suffix: "+", label: "Countries served" },
  { to: 1000, suffix: "+", label: "Product range" }, // per Corp Info.pptx slide 4
]

function AboutHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { navigate } = useRouter()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 70])

  const line = (text: string, delay: number) => (
    <motion.span
      className="block"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: ENTER, delay }}
    >
      {text}
    </motion.span>
  )

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-[clamp(120px,18vh,200px)] pt-[clamp(120px,20vh,180px)]"
    >
      {/* soft top-right glow over the shared lighter-blue backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 55% at 82% 4%, rgba(255,255,255,.26), transparent 60%)" }} />
      {/* dotted world map watermark — right ~75% */}
      <img
        src={worldDots}
        aria-hidden
        alt=""
        className="pointer-events-none absolute right-0 top-1/2 hidden w-[92%] max-w-[1240px] -translate-y-1/2 opacity-[0.18] mix-blend-screen lg:block"
      />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-[clamp(32px,5vw,72px)] px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* left — text */}
        <div className="relative z-10">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[0.78rem] font-medium text-slate-300">
              <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }} className="transition-colors hover:text-white">Home</a>
              <span className="text-white/40">›</span>
              <span className="text-white">About</span>
            </nav>
          </Reveal>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-white">
              <span className="h-[2px] w-5 bg-eurored" /> Our Story
            </span>
          </Reveal>
          <h1 className="italic-display mt-5 text-white leading-[0.94] text-[clamp(2rem,5vw,4rem)]">
            {line("Born in India.", 0.05)}
            {line("Designed in Italy.", 0.14)}
            <span className="text-eurored">{line("Proven everywhere.", 0.23)}</span>
          </h1>
          <motion.p
            className="mt-5 max-w-[46ch] text-[clamp(0.95rem,1.3vw,1.1rem)] font-light leading-relaxed text-slate-200"
            initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.34 }}
          >
            The international two-wheeler, three-wheeler and off-highway tyre brand of TVS Srichakra — four decades of engineering, trusted by riders across 125+ countries.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.42 }}
          >
            <Btn href="/#products" variant="red">Explore the range <Arrow /></Btn>
          </motion.div>
        </div>

        {/* right — aerial factory pan video with stat + Italy overlays */}
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: ENTER, delay: 0.2 }}
        >
          <div className="relative aspect-[16/11] overflow-hidden rounded-lg border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,.8)]">
            <motion.video
              src="/about-factory-aerial.mp4" autoPlay muted loop playsInline preload="metadata"
              style={{ y: videoY }} className="absolute inset-0 h-[110%] w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,38,74,.2) 0%, transparent 40%)" }} />
            {/* India location tag — top-left */}
            <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-eurored" /> Madurai · India
            </span>
          </div>

          {/* stats — popout card overlapping the image */}
          <motion.div
            className="absolute -bottom-7 -left-5 flex gap-x-[clamp(16px,2vw,32px)] rounded-xl border border-white/10 bg-white px-6 py-4 shadow-[0_28px_60px_-24px_rgba(11,38,74,.55)] sm:-left-8"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.7 }}
          >
            {HERO_STATS.map((s) => (
              <div key={s.label} className="shrink-0">
                <Counter to={s.to} suffix={s.suffix} className="font-display italic font-black leading-none text-racing text-[clamp(1.4rem,2.6vw,2.15rem)]" />
                <div className="mt-1 text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ==================== "Our Parent" ribbon (overlaps hero) ==================== */
/* Client feedback 2026-08-06: the TVS Mobility affiliation is key information —
   it leads the page now, replacing the pillars ribbon. */
const GROUP_STATS = [
  { v: "USD 2 bn+", l: "Annual revenue" },
  { v: "25,000+", l: "Employees" },
  { v: "25+", l: "Countries" },
  { v: "6", l: "Continents" },
]

function ParentRibbon() {
  return (
    <div className="relative z-20 mx-auto -mt-[clamp(70px,10vh,120px)] max-w-[1200px] px-5 sm:px-8">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/15 shadow-[0_44px_100px_-44px_rgba(11,38,74,.65)]"
          style={{ background: "linear-gradient(118deg, #2e5695 0%, #24466f 55%, #1b3357 100%)" }}
        >
          {/* brand keyline */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-racing via-sky-400 to-eurored" />
          <div className="relative p-6 sm:p-8">
            {/* title — single line */}
            <Eyebrow>Our Parent</Eyebrow>
            <h2 className="italic-display mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-white text-[clamp(1.3rem,2.5vw,2rem)] leading-[1.06]">
              Part of the
              <img src={tvsMobilityLogo} alt="TVS Mobility" className="h-[0.95em] w-auto" />
              Group
            </h2>
            {/* content below the title, CTA on the right */}
            <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <p className="text-[0.92rem] font-light leading-relaxed text-slate-200">
                TVS Srichakra is part of the TVS Mobility group — an automotive conglomerate
                <br className="hidden sm:block" />
                rooted in the century-old legacy of TV Sundram Iyengar, spanning four business verticals.
              </p>
              <div className="shrink-0">
                <Btn href="https://www.tvsmobility.in" variant="line">Visit TVS Mobility <Arrow /></Btn>
              </div>
            </div>
            {/* group stats in one line */}
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4">
              {GROUP_STATS.map((s, i) => (
                <Reveal key={s.l} i={i}>
                  <div>
                    <div className="font-display text-[clamp(1.45rem,2.6vw,2.1rem)] font-black italic leading-none text-white">{s.v}</div>
                    <div className="mt-2 text-[0.72rem] uppercase tracking-wide text-slate-300">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}

/* ============================ Who we are ============================ */
const WHO_STATS = [
  { to: 44, suffix: "+", label: "Years of expertise" },
  { to: 125, suffix: "+", label: "Countries served" },
  { to: 2, suffix: "", label: "Global R&D centres" },
  { to: 25000, suffix: "+", label: "People across the group", compact: true },
]

function VmIcon({ mission }: { mission?: boolean }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-racing/10 text-racing">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {mission
          ? <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" fill="currentColor" /></>
          : <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>}
      </svg>
    </span>
  )
}

function VehicleCollage() {
  // Frameless montage — the cloud backdrop dissolves into the section via an
  // edge-feather mask, so the vehicles read as floating in the page, not in a box.
  const feather = "radial-gradient(125% 118% at 50% 50%, #000 74%, rgba(0,0,0,0.4) 90%, transparent 100%)"
  return (
    <Reveal>
      <img
        src={rangeUsa}
        alt="The Eurogrip tyre range — sport, touring, off-road, trail and scooter tyres lined up against an American skyline"
        className="w-full"
        style={{ WebkitMaskImage: feather, maskImage: feather }}
      />
    </Reveal>
  )
}

function WhoWeAre() {
  return (
    <section id="who-we-are" className="scroll-mt-24 bg-gradient-to-b from-[#f7fafd] to-mist py-[clamp(70px,11vh,140px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(32px,5vw,72px)] lg:grid-cols-2">
          {/* left — vehicle collage */}
          <div>
            <VehicleCollage />
            <Reveal className="mt-4 text-[0.8rem] font-light text-slate-500">
              Engineered for every road. Built for every rider.
            </Reveal>
          </div>

          {/* right — heading + mission + vision */}
          <div>
            <Reveal><Eyebrow>Who We Are</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-3 text-asphalt text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.02]">
                Four decades of<br />engineering excellence
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-4 max-w-[52ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-600">
                Eurogrip is the tyre brand of TVS Srichakra Limited — a leading manufacturer of two-wheeler, three-wheeler and off-highway tyres since 1982, headquartered in Madurai and trusted by riders across 125+ countries.
              </p>
            </Reveal>
            <Reveal i={3} className="mt-7 flex gap-4">
              <VmIcon mission />
              <div>
                <h4 className="font-display text-[0.95rem] font-extrabold uppercase italic tracking-wide text-asphalt">Our Mission</h4>
                <p className="mt-1.5 max-w-[46ch] text-[0.92rem] font-light leading-relaxed text-slate-600">
                  To engineer specialist tyres that outperform in every condition — and outlive every journey.
                </p>
              </div>
            </Reveal>
            <Reveal i={4} className="mt-5 flex gap-4">
              <VmIcon />
              <div>
                <h4 className="font-display text-[0.95rem] font-extrabold uppercase italic tracking-wide text-asphalt">Our Vision</h4>
                <p className="mt-1.5 max-w-[46ch] text-[0.92rem] font-light leading-relaxed text-slate-600">
                  To be the specialist tyre brand riders reach for first — in every market we enter.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* stat row */}
        <div className="mt-[clamp(48px,7vh,80px)] grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {WHO_STATS.map((s, i) => (
            <Reveal key={s.label} i={i} className="border-t-2 border-racing pt-4">
              {s.compact ? (
                <div className="font-display text-[clamp(1.55rem,2.9vw,2.3rem)] font-black italic leading-none text-racing">25,000+</div>
              ) : (
                <Counter to={s.to} suffix={s.suffix} className="font-display text-[clamp(1.55rem,2.9vw,2.3rem)] font-black italic leading-none text-racing" />
              )}
              <div className="mt-2 text-[0.74rem] uppercase tracking-wide text-slate-500">{s.label}</div>
            </Reveal>
          ))}
        </div>

        {/* Brands of TVS Srichakra — TVS Tyres → TVS Eurogrip → Eurogrip */}
        <div className="mt-[clamp(48px,7vh,80px)]">
          <Reveal>
            <Eyebrow>Our Brands</Eyebrow>
          </Reveal>
          <Reveal i={1}>
            <h3 className="italic-display mt-3 text-asphalt text-[clamp(1.35rem,2.8vw,2.1rem)]">Brands of TVS Srichakra</h3>
          </Reveal>
          <div className="relative mt-8 grid gap-5 md:grid-cols-3">
            {[
              { tag: "Until 2019", name: "TVS Tyres", body: "The replacement-market brand that built the company's reputation for quality." },
              { tag: "August 2019", name: "TVS Eurogrip", body: "Relaunched to be more youthful and vibrant, speaking to millennial and Gen Z riders." },
              { tag: "From 2024", name: "Eurogrip", body: "All two- & three-wheeler products aligned under one global brand, worldwide.", current: true },
            ].map((s, i) => (
              <Reveal key={s.name} i={i}>
                <div className={`relative h-full overflow-hidden rounded-xl border bg-white p-6 shadow-[0_24px_55px_-40px_rgba(16,35,70,.45)] ${s.current ? "border-racing/50" : "border-black/10"}`}>
                  <span className={`inline-block rounded-full px-3 py-1 font-display text-[0.66rem] font-extrabold uppercase tracking-[0.1em] ${s.current ? "bg-racing text-white" : "bg-racing/10 text-racing"}`}>{s.tag}</span>
                  <div className="mt-3 font-display text-[clamp(1.25rem,2vw,1.6rem)] font-black uppercase italic leading-tight text-asphalt">{s.name}</div>
                  <p className="mt-2.5 text-[0.88rem] font-light leading-relaxed text-slate-600">{s.body}</p>
                  {s.current && <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-racing to-eurored" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================ What we do ============================ */
const PROCESS = [
  { n: "01", t: "Specifications", d: "Performance targets and size portfolio, set from market needs." },
  { n: "02", t: "FEA & simulation", d: "Tread and structure modelled and simulated before a mould exists." },
  { n: "03", t: "Prototyping", d: "Built and indoor-tested at the Madurai plant." },
  { n: "04", t: "Track testing", d: "Independent testers push prototypes to the limit on proving grounds." },
  { n: "05", t: "Road testing", d: "Durability and versatility across real roads and conditions." },
  { n: "06", t: "Certification", d: "REACH and legal certifications obtained." },
  { n: "07", t: "Mass production & QC", d: "Every tyre visually and dynamically checked before it ships." },
]

function WhatWeDo() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(70px,11vh,140px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
          <div>
            <Reveal><Eyebrow>What We Do</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-3 text-white text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.02]">
                Engineered across<br />two continents
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-4 max-w-[52ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-300">
                Eurogrip tyres are developed by our design centre in Milan, Italy alongside the R&amp;D centre in Madurai, India — then built at our plants in Madurai (Tamil Nadu) and Pantnagar (Uttarakhand). Every platform is tested in Indian, European and Japanese road conditions before it earns the Eurogrip name.
              </p>
            </Reveal>
            {/* capability stats */}
            <Reveal i={3} className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
              {[
                { v: "3 mn+", l: "Tyres a month" },
                { v: "2", l: "Manufacturing plants" },
                { v: "3", l: "Road-test geographies" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-[clamp(1.2rem,2.2vw,1.7rem)] font-black italic leading-none text-white">{s.v}</div>
                  <div className="mt-1.5 text-[0.7rem] uppercase tracking-wide text-slate-400">{s.l}</div>
                </div>
              ))}
            </Reveal>
            <Reveal i={4} className="mt-7">
              <Btn href="/#technology" variant="red">Explore technology <Arrow /></Btn>
            </Reveal>
          </div>
          <Reveal i={1}>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 shadow-[0_30px_70px_-35px_rgba(0,0,0,.7)]">
              <video src={whatWeDoReel} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d1a30]/45 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* process step-flow */}
        <div className="mt-[clamp(40px,6vh,64px)]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} i={i % 4}>
                <div className="group relative h-full rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-eurored/40 hover:bg-white/[0.06]">
                  <div className="font-display text-[0.95rem] font-black italic text-eurored">{p.n}</div>
                  <h4 className="mt-1.5 font-display text-[0.9rem] font-extrabold uppercase italic leading-tight text-white">{p.t}</h4>
                  <p className="mt-1.5 text-[0.76rem] font-light leading-snug text-slate-400">{p.d}</p>
                  {i < PROCESS.length - 1 && (
                    <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-eurored/50 lg:block">→</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================ Journey timeline ============================ */
const JOURNEY_VIDEO_ID = "4uR5XYXVPT8"
const JOURNEY_VIDEO_START = 160

/* YouTube lightbox — portalled to body so no ancestor transform can trap it. */
function VideoLightbox({ open, onClose, videoId, start = 0 }: { open: boolean; onClose: () => void; videoId: string; start?: number }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ duration: 0.4, ease: ENTER }}
            className="relative w-full max-w-[1000px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close video"
              className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l12 12M13 1L1 13" /></svg>
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-md border border-white/15 bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&start=${start}`}
                title="The journey of Eurogrip"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

const MILESTONES = [
  { y: "1982", img: j1982, t: "TVS Srichakra incorporated in Madurai, Tamil Nadu — the first tyre rolls out." },
  { y: "1991", img: j1991, t: "Exports begin — the first Indian-made tyres head to international markets." },
  { y: "2005", img: j2005, t: "First OEM partnerships — Piaggio & Aprilia." },
  { y: "2008", img: j2008, t: "Second manufacturing plant opens at Pantnagar, Uttarakhand." },
  { y: "2015", img: j2015, t: "Motorcycle radials launched, opening the premium performance segment." },
  { y: "2019", img: j2019, t: "Brand relaunched as TVS Eurogrip in August; steel radials introduced. Design centre established in Milan, Italy." },
  { y: "2022", img: j2022, t: "Principal sponsor of Chennai Super Kings for three seasons (2022–24), front of jersey." },
  { y: "2024", img: j2024, t: "All two- & three-wheeler products aligned under EUROGRIP worldwide; M S Dhoni joins as Brand Ambassador in October." },
  { y: "2026", img: j2026, t: "eurogriptyres.com global platform launches." },
]

function Journey() {
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const [paused, setPaused] = useState(false)
  const [film, setFilm] = useState(false)
  const reduce = useReducedMotion()
  const m = MILESTONES[active]

  useEffect(() => {
    if (reduce || paused || manual) return
    const id = setInterval(() => setActive((i) => (i + 1) % MILESTONES.length), 3500)
    return () => clearInterval(id)
  }, [reduce, paused, manual])

  const progress = (active / (MILESTONES.length - 1)) * 100

  return (
    <section className="overflow-hidden bg-mist py-[clamp(70px,11vh,140px)] text-asphalt">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="mb-[clamp(28px,4vh,48px)] grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <SectionHead
            light
            eyebrow="Our Journey"
            title={<>The road so far</>}
            lede="Three decades from a single tyre to a global specialist brand — built on TV Sundram Iyengar's founding legacy of trust, value and service."
            className="max-w-none"
          />
          {/* play CTA — opens the journey film */}
          <Reveal i={2}>
            <button
              onClick={() => setFilm(true)}
              className="group flex items-center gap-4 rounded-full border border-black/10 bg-white py-2.5 pl-2.5 pr-6 text-left shadow-[0_20px_45px_-28px_rgba(16,35,70,.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-eurored/40"
            >
              <span className="relative grid h-12 w-12 shrink-0 place-items-center">
                <span className="absolute inset-0 rounded-full bg-eurored/35 opacity-0 transition-opacity group-hover:animate-ping group-hover:opacity-100" />
                <span className="relative grid h-12 w-12 place-items-center rounded-full bg-eurored shadow-[0_10px_26px_-8px_rgba(237,28,36,.75)] transition-transform duration-300 group-hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
              <span>
                <span className="block font-display text-[0.9rem] font-extrabold uppercase italic leading-tight text-asphalt">View our journey</span>
                <span className="mt-0.5 block text-[0.76rem] font-light text-slate-500">Watch the film</span>
              </span>
            </button>
          </Reveal>
        </div>

        {/* stage — cutout image + active milestone */}
        <div
          className="relative grid min-h-[300px] items-center gap-6 md:grid-cols-[1fr_1fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative flex min-h-[240px] items-center justify-center md:min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={m.y}
                src={m.img}
                alt={`Eurogrip ${m.y}`}
                className="max-h-[300px] w-auto max-w-full object-contain drop-shadow-[0_30px_40px_rgba(16,35,70,.25)]"
                initial={reduce ? false : { opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.5, ease: ENTER }}
              />
            </AnimatePresence>
            {/* oversized year watermark */}
            <span aria-hidden className="pointer-events-none absolute -z-0 select-none font-display text-[clamp(6rem,14vw,12rem)] font-black italic leading-none text-racing/[0.06]">
              {m.y}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={m.y}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: ENTER }}
            >
              <div className="font-display text-[clamp(2.6rem,6vw,4.5rem)] font-black italic leading-none text-racing">{m.y}</div>
              <p className="mt-4 max-w-[42ch] text-[clamp(1rem,1.5vw,1.2rem)] font-light leading-relaxed text-slate-700">{m.t}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* horizontal timeline track */}
        <div className="relative mt-[clamp(28px,4vh,48px)] pt-2">
          <div className="absolute left-0 right-0 top-[15px] h-[2px] bg-black/10" />
          <div className="absolute left-0 top-[15px] h-[2px] bg-gradient-to-r from-racing to-eurored transition-all duration-500" style={{ width: `${progress}%` }} />
          <div className="relative flex justify-between">
            {MILESTONES.map((mi, i) => {
              const on = i === active
              const done = i <= active
              return (
                <button
                  key={mi.y}
                  onClick={() => { setManual(true); setActive(i) }}
                  className="group flex flex-col items-center gap-2"
                  aria-label={`Jump to ${mi.y}`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-full border-2 bg-mist transition-all ${done ? "border-eurored" : "border-black/20"} ${on ? "scale-110" : ""}`}>
                    <span className={`rounded-full transition-all ${on ? "h-3 w-3 bg-eurored" : done ? "h-2 w-2 bg-eurored" : "h-2 w-2 bg-black/20"}`} />
                  </span>
                  <span className={`font-display text-[0.82rem] font-black italic transition-colors ${on ? "text-eurored" : "text-slate-400 group-hover:text-slate-600"}`}>{mi.y}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <VideoLightbox open={film} onClose={() => setFilm(false)} videoId={JOURNEY_VIDEO_ID} start={JOURNEY_VIDEO_START} />
    </section>
  )
}

/* ============================ Leadership ============================ */
/* Board list sourced from eurogriptyres.com/board-of-directors (2026-08).
   Photos to come from client; monogram cards until then.
   Flip SHOW_LEADERSHIP to false to deactivate the section. */
const SHOW_LEADERSHIP = true as boolean
/* Bios verbatim from eurogriptyres.com/board-of-directors (2026-08). */
const LEADERS: { honorific: string; name: string; role: string; din: string; bio: string[]; other?: string[]; img?: string }[] = [
  {
    honorific: "Mr.", name: "R Naresh", role: "Executive Vice Chairman", din: "00273609",
    bio: [
      "Mr. R. Naresh is an accomplished engineering graduate with nearly four decades of extensive experience in the automobile and rubber industries.",
      "As a co-founder of the company, he brings a unique blend of strategic vision, technical expertise and vast industry experience, which has been instrumental in driving the company's growth and expanding its commercial footprint.",
      "With an in-depth understanding of the dynamic trends in the automotive and tire sectors, Mr. Naresh is widely recognized for his inspiring leadership and is a respected figure in the corporate world.",
      "He was first appointed as a director on the company's board on 2nd June 1982.",
    ],
    other: [
      "M/s TVS Mobility Private Limited",
      "M/s Sundaram Industries Private Limited - Joint Managing Director",
      "M/s TVS Argomm Private Limited",
      "M/s SI Air Springs Private Limited",
      "M/s TVS Sensing Solutions Private Limited",
      "M/s TVS Srichakra Investments Limited",
    ],
  },
  {
    honorific: "Ms.", name: "Shobhana Ramachandhran", role: "Managing Director", din: "00273837",
    bio: [
      "Ms. Shobhana Ramachandhran is a distinguished Postgraduate in English Literature and has been a pivotal member of our organization since her appointment as Managing Director on March 28, 1986.",
      "Under her visionary leadership and strategic guidance, the company has witnessed notable growth and transformation, establishing itself as a leader in the tyre industry.",
      "With her extensive expertise and deep understanding of the industry, she has played a key role in shaping the company's success and fostering innovation and digitalisation across its operations.",
      "Beyond her professional achievements, Ms. Shobhana Ramachandhran is actively involved in many charitable trusts and institutions dedicated to education, healthcare and social welfare. Her commitment to community service reflects her passion for making a positive impact in society.",
    ],
    other: [
      "M/s. TVS Mobility Private Limited",
      "M/s. Sundaram Industries Private Limited",
      "M/s. TVS Argomm Private Limited",
      "M/s. SI Air Springs Private Limited",
      "M/s. TVS Srichakra Investments Limited",
      "M/s. TVS Supply Chain Solutions Limited",
      "M/s. TVS Automobile Solutions Private Limited",
      "M/s. Sundaram Finance Holdings Limited",
      "M/s. Sundaram Brake Linings Limited",
      "M/s. TASL Automobile Solutions Private Limited",
    ],
  },
  {
    honorific: "Mr.", name: "V Ramakrishnan", role: "Independent Director", din: "00002931",
    bio: [
      "Mr. V. Ramakrishnan is a seasoned professional with a Master of Technology (M. Tech) in Mechanical Engineering, a Post Graduate Diploma in Business Management (PGDBM) specializing in Finance and a Diploma in Public Speaking.",
      "He has also undergone extended professional training in Sweden and Germany, further enhancing his global perspective and technical expertise. He is an accredited Executive Coach and is trained in several profiling and assessment centres.",
      "With a distinguished career spanning senior and middle management roles, Mr. Ramakrishnan has extensive experience in engineering and design management, business unit and profit center management, strategic planning and diversification, business development, project implementation, marketing and manufacturing. He has managed manufacturing units in India, Indonesia and Singapore, covering multiple verticals like machine tools, cutting tools, tool and die making, high precision plastic injection moulding, textile machinery and auto component/sub systems manufacture and assembly.",
      "From 2004 to 2013, Mr. Ramakrishnan served as an Independent Director of PRICOL India, bringing strategic oversight and leadership to the organization. Additionally, he was the Commissioner of PRICOL Surya, Indonesia, and a member of the Board of Commissioners from 2010 to 2013, where he oversaw operations as Lead Director. As a CEO with regional and global responsibilities, he successfully established a Six Sigma manufacturing operation, delivering excellence in operational efficiency.",
      "Mr. Ramakrishnan founded and managed, as the Managing Director, M/s. Organisation Development Pte Ltd., Singapore, between 1999 and 2024; the advisory and consulting company was focused on Enterprise Performance Enhancement. The firm assisted client companies with developing strategic initiatives, aligning business processes to evolving market needs, and fostered strong relationships with stakeholders, including customers, suppliers, employees, and partners.",
      "Beyond his corporate endeavours, Mr. Ramakrishnan has been teaching public policy for over a decade at the prestigious Lee Kuan Yew School of Public Policy. His areas of focus include governance, strategy & risk management, cost management, project management, public private partnership and value-for-money performance and audits.",
      "He has been the lead involved in negotiating and concluding over 10 Joint and Technology Ventures with firms in Germany, UK, US, Australia and Japan, and has set up several greenfield and brownfield sites arising from the JVs.",
      "An accomplished author, he has contributed to four internationally published books on topics such as governance, board performance management, family business coaching and dashboard-driven enterprise performance management. He has a patent on a Solar Based Central Heating System and is a votary of renewable energy.",
      "Mr. Ramakrishnan's vast experience, academic excellence and strategic leadership continue to make a significant impact across industries and academia alike.",
    ],
  },
  {
    honorific: "Ms.", name: "S V Mathangi", role: "Independent Director", din: "02596421",
    bio: [
      "Ms. S. V. Mathangi is a distinguished finance professional and a graduate in Physics. She is a member of the Institute of Chartered Accountants of India, a Registered Valuer and a Certified Business Analyst from the Great Lakes Institute of Management.",
      "A recipient of the Shivayogam Award for being the Top Lady Candidate from Southern India in both CA Final and Intermediate Examinations, Ms. Mathangi also holds the distinction of securing All India 8th Rank in both stages.",
      "With extensive experience in Consulting and Assurance Services, Ms. Mathangi specializes in due diligence and valuations for mergers and acquisitions, particularly for listed companies and large business houses. Her expertise includes in-depth knowledge of accounting for financial instruments under Ind AS, as well as the implementation of Ind AS.",
      "She brings a diverse, multi-industry perspective, with significant exposure across sectors such as BFSI, Power, Manufacturing, Logistics, E-Commerce, FMCG, Software, Healthcare, Automotive and Realty.",
      "Ms. Mathangi is a Partner at M/s. M C Ranganathan & Co., where she continues to deliver excellence in financial consulting and assurance.",
    ],
  },
  {
    honorific: "Mr.", name: "Ashok Srinivasan", role: "Independent Director", din: "06539656",
    bio: [
      "Mr. Ashok Srinivasan has more than 25 years of experience as an investment/finance professional on a global scale. He has built and currently runs his family offices, based in Singapore and India.",
      "Ashok was a senior investment professional at Temasek Holdings, where he was responsible for evaluating direct investments across multiple industry sectors including industrials (specialty chemicals and construction materials), transportation (container ports and shipping), financial services and telecommunications — leading the execution of complex investments and divestments across sectors and geographies, managing a public equities portfolio, and instituting capital management, shareholder rights, governance and value creation frameworks for all actively managed investments across the portfolio.",
      "He engaged the boards and management of key portfolio investments on going-forward strategic and operational plans, worked closely with the Chief Investment Officer to formulate firm-wide investment and portfolio management plans, and contributed to formulating and drafting the Santiago Principles in conjunction with the International Working Group of Sovereign Wealth Funds.",
      "Ashok holds a Bachelor of Arts (Distinction) in Economics from the University of Michigan, where he was a James B. Angell and CIGNA Merit Scholar. He also holds a Masters in Business Administration from the Darden School of Business, University of Virginia, where he was a recipient of the Faculty Award for Academic Excellence, awarded to the Top 10% of each graduating class.",
    ],
    other: [
      "M/s. Leonne Hill Property Developments Private Limited",
      "M/s. Tripleone Developments Private Limited",
    ],
  },
  {
    honorific: "Mr.", name: "Piyush Jinendrakumar Munot", role: "Independent Director", din: "00119507",
    bio: [
      "Mr. Piyush Jinendrakumar Munot is a distinguished Mechanical Engineer, holding both bachelor's and master's degrees from the University of Applied Sciences Konstanz, Germany. With his technical expertise and leadership acumen, he has made significant contributions to the automotive and manufacturing sectors.",
      "Currently, Mr. Munot serves as the Managing Director of Varsha Forgings Private Limited and the CEO & Director of KCTR Varsha Automotive Private Limited, where he spearheads innovation, operational excellence and growth.",
      "A respected member of the Young Presidents' Organisation, Pune since 2015, he is recognized for his leadership and vision. Within the Automotive Component Manufacturers Association of India (ACMA), he has been an elected member of the Executive Committee from 2014 to 2023, during which he also served as the Co-Chairman of the Western Region, driving initiatives that have strengthened the industry.",
      "His blend of technical proficiency, global perspective and leadership has established him as a key figure in advancing India's auto component manufacturing industry.",
    ],
    other: ["M/s. Kinetic Watts and Volts Limited"],
  },
  {
    honorific: "Mr.", name: "S Ravichandran", role: "Non-Executive & Non-Independent Director", din: "01485845",
    bio: [
      "Mr. S. Ravichandran is an accomplished professional with over 43 years of diverse experience spanning the consumer durables, automotive and logistics industries. An Engineering Graduate, he also holds a prestigious management degree from the Indian Institute of Management, Ahmedabad.",
      "Mr. Ravichandran's extensive career includes leadership roles with some of the most respected names in the industry, such as Voltas, Mahindra and TVS Supply Chain Solutions. His expertise extends across Indian and international markets, equipping him with a well-rounded perspective and strategic acumen essential for driving growth and operational excellence.",
      "He serves as a Director on the boards of numerous Indian and overseas companies, contributing his deep industry knowledge and leadership experience to foster innovation and success.",
      "Mr. Ravichandran's rich professional background, combined with his strong academic foundation, positions him as a key leader in shaping the future of the industries he serves.",
    ],
    other: [
      "M/s. TVS Packaging Solutions Private Limited",
      "M/s. White Data Systems India Private Limited",
      "M/s. TVS Industrial & Logistics Parks Private Limited",
      "M/s. TVS Toyota Tsusho Supply Chain Solutions Limited",
      "M/s. FLEXOL Packaging (India) Limited",
      "M/s. TVS Infrastructure Investment Manager Private Limited",
      "M/s. Nyaybodha Technologies & Business Solutions Private Limited",
      "M/s. Super Grip Corporation, USA",
      "M/s. TVS SCS Siam Limited, Thailand (Formerly known as TVS Logistics Siam Limited)",
      "M/s. Multipart Limited, UK",
      "M/s. RICO Logistics Limited, UK",
      "M/s. MSYS Software Solutions Limited",
      "M/s. TVS SCS Singapore Pte. Ltd. (Formerly known as Pan Asia Logistics Singapore Pte Ltd.)",
      "M/s. Pan Asia Container Line Pte Ltd, Hong Kong",
      "M/s. TVS SCS Hong Kong Limited (Formerly known as Pan Asia Freight-Forwarding & Logistics Hong Kong Ltd)",
      "M/s. TVS SCS (Korea) Ltd. (Formerly known as Pan Asia International (Korea)",
      "M/s. TVS SCS Logistics (Thailand) Limited (Formerly known as Pan Asia Logistics (Thailand) Ltd)",
      "M/s. TVS Supply Chain Solutions (Thailand) Limited (Formerly known as TVS Asianics (Thailand) Limited)",
      "M/s. TVS SCS Logistics Management Co., Ltd. (Formerly known as TLM Logistics Management Co., Ltd., Thailand)",
      "M/s. TVS Supply Chain Solutions Australia Holdings Pty. Ltd (Formerly known as TVS Asianics Australia Holdings Ptv. Ltd.,)",
      "M/s. T.I.F Holdings Pty. Ltd, Australia",
      "M/s. TVS SCS (Aust) Pty. Ltd (Formerly known as Transtar International Freight (Aust.) Pry Ltd., Australia)",
      "M/s. TVS SCS New Zealand Limited (Formerly known as Transtar International Freight Limited, NZl)",
      "M/s. Kahn Nominees Pty. Ltd., Australia",
      "M/s. Transtar International Freight Limited, HK",
      "M/s. TVS SCS International Freight (Singapore) Pte. Ltd (Formerly known as Transtar International Freight (Singapore) Pte. Ltd)",
      "M/s. TVS Supply Chain Solutions Holdings Limited, Thailand (Formerly known as Transtar International Freight Holdings (Thailand) Ltd.,",
      "M/s. TVS SCS International Freight (Thailand) Ltd, Thailand (Formerly known as Transtar International Freight (Thailand) Ltd, Thailand)",
      "M/s. TVS SCS Forwarding SLU (formerly known as Nadal Forwarding SLU)",
    ],
  },
  {
    honorific: "Mr.", name: "P Srinivasavaradhan", role: "Non-Executive & Non-Independent Director", din: "08701214",
    bio: [
      "Mr. P. Srinivasavaradhan is an accomplished Engineering Graduate with over 30 years of extensive industrial experience spanning Research & Development, Operations, Projects and International Marketing.",
      "As the President of TVS Srichakra Limited, he has led the business with a vision for innovation and growth. His expertise and leadership have significantly contributed to the company's success in the automotive sector.",
      "His treasure of knowledge and strategic acumen continue to drive excellence and innovation across all his ventures.",
    ],
    other: [
      "M/s. SI Air Springs Private Limited",
      "M/s. TVS SIRIUS Controls Private Limited",
      "M/s. Sri Athreya Automotives Private Limited",
      "M/s. Sabo Hema Automotive Private Limited",
    ],
  },
]

function LeaderCard({ l, i, onOpen }: { l: (typeof LEADERS)[number]; i: number; onOpen: () => void }) {
  const initials = l.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
  return (
    <Reveal i={i % 4}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View profile: ${l.honorific} ${l.name}`}
        className="group relative flex min-h-[210px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1f3050] to-[#2c4a76] p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-eurored/40">
        {l.img ? (
          <>
            <img src={l.img} alt={`${l.honorific} ${l.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a30]/95 via-[#0d1a30]/30 to-transparent" />
          </>
        ) : (
          <>
            {/* oversized monogram watermark until client photos arrive */}
            <span aria-hidden className="pointer-events-none absolute -right-2 -top-7 select-none font-display text-[6rem] font-black italic leading-none text-white/[0.06]">
              {initials}
            </span>
            <span className="absolute left-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 font-display text-[1rem] font-black italic text-white">
              {initials}
            </span>
          </>
        )}
        <div className="relative">
          <div className="text-[0.72rem] uppercase tracking-[0.1em] text-slate-400">{l.honorific}</div>
          <div className="font-display text-[1.02rem] font-extrabold uppercase italic leading-tight text-white">{l.name}</div>
          <div className="mt-1.5 text-[0.74rem] uppercase tracking-[0.08em] text-slate-300">{l.role}</div>
          <span className="mt-3 inline-flex items-center gap-2 font-display text-[0.72rem] font-extrabold uppercase italic tracking-wide text-eurored">
            View profile <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </button>
    </Reveal>
  )
}

/* Profile lightbox — portalled to body (Leadership sits inside a Cine transform). */
function LeaderLightbox({ l, onClose }: { l: (typeof LEADERS)[number]; onClose: () => void }) {
  const initials = l.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-label={`Profile: ${l.honorific} ${l.name}`}
        className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-white/15 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #1f3050 0%, #2c4a76 100%)" }}
        initial={{ scale: 0.94, opacity: 0, y: 14 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 14 }}
        transition={{ duration: 0.3, ease: ENTER }}
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-racing via-sky-400 to-eurored" />
        <button
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white"
        >
          ✕
        </button>
        <div className="max-h-[82vh] overflow-y-auto p-7 sm:p-9">
          {l.img ? (
            <img src={l.img} alt={`${l.honorific} ${l.name}`} className="h-24 w-24 rounded-full border border-white/20 object-cover" />
          ) : (
            <span className="grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-white/10 font-display text-[1.4rem] font-black italic text-white">
              {initials}
            </span>
          )}
          <div className="mt-5 text-[0.74rem] uppercase tracking-[0.1em] text-slate-400">{l.honorific}</div>
          <h3 className="font-display text-[1.5rem] font-extrabold uppercase italic leading-tight text-white">{l.name}</h3>
          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <span className="inline-block rounded-full bg-eurored px-3.5 py-1 font-display text-[0.7rem] font-extrabold uppercase italic tracking-wide text-white">
              {l.role}
            </span>
            <span className="text-[0.72rem] uppercase tracking-[0.08em] text-slate-400">DIN {l.din}</span>
          </div>
          <div className="mt-5 space-y-3.5">
            {l.bio.map((p, i) => (
              <p key={i} className="text-[0.92rem] font-light leading-relaxed text-slate-200">{p}</p>
            ))}
          </div>
          {l.other && l.other.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-5">
              <h4 className="font-display text-[0.78rem] font-extrabold uppercase italic tracking-[0.12em] text-sky-300">Other Directorships</h4>
              <ul className={`mt-3 space-y-1.5 ${l.other.length > 6 ? "sm:columns-2 sm:gap-x-8 sm:space-y-0" : ""}`}>
                {l.other.map((o) => (
                  <li key={o} className="flex items-start gap-2 break-inside-avoid text-[0.82rem] font-light leading-snug text-slate-300 sm:pb-1.5">
                    <span aria-hidden className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-eurored" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

function Leadership() {
  const [sel, setSel] = useState<number | null>(null)
  useEffect(() => {
    if (sel === null) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSel(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sel])

  return (
    <section id="leadership" className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(70px,11vh,140px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Leadership"
          title={<>Board of Directors</>}
          lede="The board guiding TVS Srichakra and the Eurogrip brand — select a profile to know more."
        />
        <div className="mt-[clamp(32px,5vh,48px)] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERS.map((l, i) => <LeaderCard key={l.name} l={l} i={i} onOpen={() => setSel(i)} />)}
        </div>
      </div>
      <AnimatePresence>
        {sel !== null && <LeaderLightbox l={LEADERS[sel]} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </section>
  )
}

/* ============================ Culture & Initiatives ============================ */
const INITIATIVES = [
  {
    key: "Sustainability",
    title: "Sustainability & Environment",
    stat: "2000",
    statLabel: "ISO 14001 certified since",
    img: initSustainability,
    body: "Solar-powered manufacturing, REACH-compliant compounds and low-rolling-resistance tyres that save energy on every ride.",
    points: ["Solar-powered plant", "REACH-compliant compounds", "Low rolling resistance"],
  },
  {
    key: "Safety",
    title: "Safety & Quality",
    stat: "7-step",
    statLabel: "validation on every platform",
    img: initSafety,
    body: "Every tyre earns its name — multi-step indoor and outdoor testing and strict quality control, with a premium portfolio of radials and super-bike tyres leading the range.",
    points: ["Indian · European · Japanese road tests", "Premium radials & super-bike tyres", "ISO 9001 · IATF 16949"],
  },
  {
    key: "Riders",
    title: "Riders & Fans",
    stat: "M S Dhoni",
    statLabel: "Brand Ambassador since 2024",
    img: initRiders,
    body: "Principal sponsor of Chennai Super Kings across 2022–24, and since October 2024 M S Dhoni carries the brand as Brand Ambassador — alongside Tread Talks and rider road-trip diaries.",
    points: ["CSK principal sponsor 2022–24", "M S Dhoni · Brand Ambassador", "Tread Talks & rider diaries"],
  },
  {
    key: "People",
    title: "People & Education",
    stat: "50,000",
    statLabel: "learners reached",
    img: initPeople,
    body: "Investing in people — 25,000+ across the group, with the TVS legacy's institutions reaching around 50,000 learners.",
    points: ["25,000+ group employees", "Nine institutions", "Skilling & scholarships"],
  },
]

function InitiativeCard({ it }: { it: (typeof INITIATIVES)[number] }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_70px_-45px_rgba(16,35,70,.5)] transition-transform duration-500 hover:-translate-y-1.5">
      <div className="relative h-52 overflow-hidden">
        <img src={it.img} alt={it.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,26,48,.15) 0%, transparent 35%, rgba(13,26,48,.85))" }} />
        <div className="absolute left-5 top-5 rounded-lg bg-eurored px-3.5 py-2 shadow-[0_12px_30px_-12px_rgba(237,28,36,.7)]">
          <div className="font-display text-[1.5rem] font-black italic leading-none text-white">{it.stat}</div>
          <div className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-white/85">{it.statLabel}</div>
        </div>
        <h3 className="absolute inset-x-0 bottom-0 p-5 font-display text-[1.3rem] font-extrabold uppercase italic leading-tight text-white">{it.title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.95rem] font-light leading-relaxed text-slate-600">{it.body}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {it.points.map((pt) => (
            <li key={pt} className="flex items-center gap-1.5 rounded-full border border-black/10 bg-mist px-2.5 py-1 text-[0.76rem] font-medium text-slate-700">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-racing text-white">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function CultureInitiatives() {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollByCard = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-card]")
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.5
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }
  const Arrow2 = ({ dir, label }: { dir: number; label: string }) => (
    <button
      onClick={() => scrollByCard(dir)}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-black/15 text-asphalt transition-colors hover:border-eurored hover:bg-eurored hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={dir < 0 ? "rotate-180" : ""}><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  )

  return (
    <section className="overflow-hidden bg-mist py-[clamp(70px,11vh,140px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-[clamp(28px,4vh,48px)] flex items-end justify-between gap-6">
          <SectionHead
            light
            eyebrow="Culture & Initiatives"
            title={<>More than tyres</>}
            lede="How we work, and what we give back — across sustainability, quality, riders and people."
            className="max-w-none"
          />
          <div className="hidden shrink-0 gap-2.5 pb-1 sm:flex">
            <Arrow2 dir={-1} label="Previous initiatives" />
            <Arrow2 dir={1} label="Next initiatives" />
          </div>
        </div>
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {INITIATIVES.map((it) => (
            <div key={it.key} data-card className="w-full shrink-0 snap-start sm:w-[calc(50%-10px)]">
              <InitiativeCard it={it} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================ Page ============================ */
export function About() {
  const { path } = useRouter()

  // ensure top on entry
  // land at the top, unless the URL targets a section (e.g. /about#who-we-are)
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }))
      return
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [path])

  return (
    <main>
      <div className="relative overflow-x-clip pb-[clamp(36px,6vh,80px)]" style={{ background: "linear-gradient(180deg, #4a83cf 0%, #3a6cb0 44%, #e7eef7 100%)" }}>
        <AboutHero />
        <ParentRibbon />
      </div>
      <WhoWeAre />
      <WhatWeDo />
      <Journey />
      {SHOW_LEADERSHIP && <Cine><Leadership /></Cine>}
      <CultureInitiatives />
      {/* client feedback 2026-08-06: no "Partner with us" band on About — footer only */}
      <SiteFooter />
    </main>
  )
}
