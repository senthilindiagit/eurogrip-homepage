import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Counter, Eyebrow } from "@/components/site/ui"
import { Cine } from "@/components/site/Cine"
import { CtaFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import rangeWorld from "@/assets/about/range-world.webp"
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
  { to: 85, suffix: "+", label: "Countries served" },
  { to: 3, suffix: "", label: "R&D centres" },
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
            The international two-wheeler, three-wheeler and off-highway tyre brand of TVS Srichakra — four decades of engineering, trusted by riders across 85+ countries.
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

/* ==================== Brand pillars ribbon (overlaps) ==================== */
const PILLARS = [
  { k: "Outlive", body: "High-performance, long-lasting tyres designed to outlive every journey." },
  { k: "Outperform", body: "Engineering precision and technological acumen from global research centres — to outperform in any road condition." },
  { k: "Outdo", body: "Always ready for the next journey — empowering the rider to outdo what was done yesterday." },
]

function PillarIcon({ i }: { i: number }) {
  const paths = [
    // outlive — shield
    "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z",
    // outperform — chevrons
    "M5 14l7-7 7 7M5 19l7-7 7 7",
    // outdo — arrow-up circle
    "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16V9m0 0l-3 3m3-3l3 3",
  ]
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[i]} />
    </svg>
  )
}

function PillarsRibbon() {
  return (
    <div className="relative z-20 mx-auto -mt-[clamp(70px,10vh,120px)] max-w-[1200px] px-5 sm:px-8">
      <Reveal>
        <div className="grid overflow-hidden rounded-xl border border-white/15 bg-[#2e5695] shadow-[0_40px_90px_-40px_rgba(11,38,74,.55)] lg:grid-cols-[minmax(220px,320px)_1fr]">
          {/* intro cell */}
          <div className="flex flex-col justify-center border-b border-white/12 bg-black/10 p-7 lg:border-b-0 lg:border-r">
            <span className="font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">What we stand for</span>
            <h2 className="mt-2 font-display text-[clamp(1.3rem,2.2vw,1.8rem)] font-black uppercase italic leading-[1.02] text-white">
              Three words we<br />hold ourselves to
            </h2>
            <p className="mt-3 text-[0.86rem] font-light leading-relaxed text-slate-300">
              Every Eurogrip tyre is built to a promise — one that lives in three words.
            </p>
          </div>
          {/* three pillars */}
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.k} className="bg-[#2e5695] p-6">
                <span className="text-eurored"><PillarIcon i={i} /></span>
                <h3 className="mt-3 font-display text-[1.15rem] font-black uppercase italic text-white">
                  Out<span className="text-eurored">{p.k.slice(3)}</span>
                </h3>
                <p className="mt-2 text-[0.86rem] font-light leading-relaxed text-slate-300">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

/* ============================ Who we are ============================ */
const WHO_STATS = [
  { to: 44, suffix: "+", label: "Years of expertise" },
  { to: 85, suffix: "+", label: "Countries served" },
  { to: 3, suffix: "", label: "Global R&D centres" },
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
        src={rangeWorld}
        alt="The Eurogrip range across the world — motorcycles, three-wheelers, light trucks, tractors, forklifts and off-the-road machines before the Taj Mahal, Colosseum, Statue of Liberty, Big Ben, Christ the Redeemer and Eiffel Tower"
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
              One engineering philosophy — across every machine that rides.
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
                Eurogrip is the tyre brand of TVS Srichakra Limited — incorporated in 1982 and headquartered in Madurai, one of India's leading manufacturers and exporters of two-wheeler, three-wheeler and off-highway tyres. Trusted by riders across 85+ countries, with a significant share of both OEM and replacement markets in India and a distribution network built over four decades.
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

        {/* brand evolution — TVS Tyres → TVS Eurogrip → Eurogrip */}
        <div className="mt-[clamp(48px,7vh,80px)] rounded-2xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(16,35,70,.4)] sm:p-8">
          <Reveal>
            <h3 className="font-display text-[0.78rem] font-extrabold uppercase italic tracking-[0.14em] text-eurored">The brand, evolving</h3>
          </Reveal>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              { tag: "Until 2019", name: "TVS Tyres", body: "The replacement-market brand that built the company's reputation for quality." },
              { tag: "August 2019", name: "TVS Eurogrip", body: "Relaunched to be more youthful and vibrant, speaking to millennial and Gen Z riders." },
              { tag: "From 2024", name: "Eurogrip", body: "All two- & three-wheeler products aligned under one global brand, worldwide." },
            ].map((s, i) => (
              <Reveal key={s.name} i={i}>
                <div className="relative h-full rounded-xl border border-black/10 bg-mist p-5">
                  <span className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-racing">{s.tag}</span>
                  <div className="mt-1.5 font-display text-[1.1rem] font-extrabold uppercase italic leading-tight text-asphalt">{s.name}</div>
                  <p className="mt-2 text-[0.86rem] font-light leading-relaxed text-slate-600">{s.body}</p>
                  {i < 2 && <span aria-hidden className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 text-eurored/50 md:block">→</span>}
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

/* ============================ TVS Mobility Group ============================ */
const VERTICALS = ["Manufacturing", "Global Supply Chain", "Aftermarket Distribution & Service", "Automobile Distribution"]
const GROUP_STATS = [
  { v: "USD 2 bn+", l: "Annual revenue" },
  { v: "25,000+", l: "Employees" },
  { v: "25+", l: "Countries" },
  { v: "6", l: "Continents" },
]

function TVSMobility() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-steel to-steel-2 py-[clamp(70px,11vh,140px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(32px,5vw,64px)] lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal><Eyebrow>Our Parent</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-3 text-white text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.05]">
                Part of the
                <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <img src={tvsMobilityLogo} alt="TVS Mobility" className="h-6 w-auto sm:h-8" />
                  Group
                </span>
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-4 max-w-[52ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-300">
                TVS Srichakra is part of the TVS Mobility group — an automotive conglomerate rooted in the century-old legacy of TV Sundram Iyengar, spanning four business verticals with a network across 25+ countries and six continents.
              </p>
            </Reveal>
            <Reveal i={3} className="mt-6 flex flex-wrap gap-2.5">
              {VERTICALS.map((v) => (
                <span key={v} className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[0.8rem] font-light text-slate-200">{v}</span>
              ))}
            </Reveal>
            <Reveal i={4} className="mt-7">
              <Btn href="https://www.tvsmobility.com" variant="line">Visit TVS Mobility <Arrow /></Btn>
            </Reveal>
          </div>

          {/* stat grid */}
          <Reveal i={1}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
              {GROUP_STATS.map((s) => (
                <div key={s.l} className="bg-[#223650] p-7">
                  <div className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-black italic leading-none text-white">{s.v}</div>
                  <div className="mt-2 text-[0.76rem] uppercase tracking-wide text-slate-400">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
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
        <img src={it.img} alt={it.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
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
        <PillarsRibbon />
      </div>
      <WhoWeAre />
      <WhatWeDo />
      <Journey />
      <Cine><TVSMobility /></Cine>
      <CultureInitiatives />
      <Cine><CtaFooter /></Cine>
    </main>
  )
}
