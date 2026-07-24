import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Counter, Eyebrow } from "@/components/site/ui"
import { Cine } from "@/components/site/Cine"
import { CtaFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import aboutHero from "@/assets/about/about-hero.webp"
import rdMilano from "@/assets/about/rd-milano.webp"
import factory from "@/assets/about/factory.webp"

const ENTER = [0.16, 0.84, 0.34, 1] as const
const FILM = "/brand-film.mp4"
const POSTER = "/brand-film-poster.webp"

/* ============================ Film lightbox ============================ */
function FilmLightbox({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            initial={{ scale: 0.92, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ duration: 0.45, ease: ENTER }}
            className="relative w-full max-w-[1000px]" onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} aria-label="Close video" className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l12 12M13 1L1 13" /></svg>
            </button>
            <video src={FILM} autoPlay controls playsInline className="aspect-video w-full rounded-md border border-white/15 bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

/* ============================ Hero ============================ */
const HERO_STATS = [
  { to: 42, suffix: "+", label: "Years of expertise" },
  { to: 85, suffix: "+", label: "Countries served" },
  { to: 3, suffix: "", label: "R&D centres" },
]

function AboutHero({ onPlay }: { onPlay: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

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
      style={{ background: "radial-gradient(120% 90% at 82% 8%, #2a5da8 0%, #13223c 60%)" }}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-[clamp(32px,5vw,72px)] px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* left — text */}
        <div className="relative z-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">
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
            The international two- &amp; three-wheeler tyre brand of TVS Srichakra — three decades of engineering, trusted by riders across 85+ countries.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.42 }}
          >
            <Btn href="/#products" variant="red">Explore the range <Arrow /></Btn>
            <button
              onClick={onPlay}
              className="group inline-flex items-center gap-3 text-[0.86rem] font-semibold text-slate-200 transition-colors hover:text-white"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-all group-hover:border-eurored group-hover:bg-eurored">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
              </span>
              Watch the brand film
            </button>
          </motion.div>
          {/* social proof */}
          <motion.div
            className="mt-10 flex flex-nowrap gap-x-[clamp(20px,3vw,44px)] border-t border-white/10 pt-6"
            initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.5 }}
          >
            {HERO_STATS.map((s) => (
              <div key={s.label} className="shrink-0">
                <Counter to={s.to} suffix={s.suffix} className="font-display italic font-black leading-none text-white text-[clamp(1.5rem,2.7vw,2.15rem)]" />
                <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.08em] text-slate-300/80">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right — hero visual + floating badge */}
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: ENTER, delay: 0.2 }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,.8)]">
            <motion.img src={aboutHero} alt="Eurogrip's tyre plant in Madurai, India" style={{ y: imgY, scale: imgScale }} className="absolute inset-0 h-[112%] w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(11,38,74,.5))" }} />
          </div>
          <motion.div
            className="absolute -bottom-6 -left-6 rounded-lg border border-white/10 bg-eurored px-6 py-4 shadow-[0_24px_50px_-20px_rgba(237,28,36,.6)]"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.7 }}
          >
            <div className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-black italic leading-none text-white">42+</div>
            <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/80">Years of expertise</div>
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

function PillarsRibbon({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="relative z-20 mx-auto -mt-[clamp(70px,10vh,120px)] max-w-[1200px] px-5 sm:px-8">
      <Reveal>
        <div className="grid overflow-hidden rounded-xl border border-white/10 bg-[#1a2c49] shadow-[0_40px_90px_-40px_rgba(0,0,0,.7)] lg:grid-cols-[minmax(200px,300px)_1fr]">
          {/* film cell */}
          <button onClick={onPlay} className="group relative min-h-[180px] overflow-hidden text-left">
            <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a30]/90 via-[#0d1a30]/30 to-transparent" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-eurored shadow-[0_10px_30px_-8px_rgba(237,28,36,.8)] transition-transform duration-300 group-hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </div>
            <span className="absolute inset-x-0 bottom-0 p-4 font-display text-[0.82rem] font-extrabold uppercase italic tracking-wide text-white">Watch our story</span>
          </button>
          {/* three pillars */}
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.k} className="bg-[#1a2c49] p-6">
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
  { to: 42, suffix: "+", label: "Years of expertise" },
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

function WhoWeAre() {
  return (
    <section className="bg-gradient-to-b from-[#f7fafd] to-mist py-[clamp(70px,11vh,140px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(32px,5vw,72px)] lg:grid-cols-2">
          {/* left — image + vision */}
          <div>
            <Reveal>
              <div className="relative aspect-[5/4] overflow-hidden rounded-lg shadow-[0_30px_70px_-35px_rgba(16,35,70,.5)]">
                <img src={factory} alt="Inside the Eurogrip manufacturing facility" className="h-full w-full object-cover" />
              </div>
            </Reveal>
            <Reveal i={1} className="mt-7 flex gap-4">
              <VmIcon />
              <div>
                <h4 className="font-display text-[0.95rem] font-extrabold uppercase italic tracking-wide text-asphalt">Our Vision</h4>
                <p className="mt-1.5 max-w-[42ch] text-[0.92rem] font-light leading-relaxed text-slate-600">
                  To be the specialist tyre brand riders reach for first — in every market we enter.
                </p>
              </div>
            </Reveal>
          </div>

          {/* right — heading + mission + callout */}
          <div>
            <Reveal><Eyebrow>Who We Are</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-3 text-asphalt text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.02]">
                Three decades of<br />engineering excellence
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-4 max-w-[52ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-600">
                Eurogrip is the two- &amp; three-wheeler tyre brand of TVS Srichakra Limited — trusted by riders across 85+ countries for sport, touring, adventure and everyday riding. With manufacturing in India, design inspired by Italian precision, and a distribution network built over three decades, Eurogrip sits where performance engineering meets rider experience.
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
            <Reveal i={4}>
              <div className="mt-7 flex flex-col gap-3 rounded-xl bg-asphalt p-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-3 text-[0.92rem] font-light text-slate-200">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-racing text-white">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  Engineered across two continents, proven on the world's roads.
                </span>
                <Btn href="/#products" variant="blue">See the range <Arrow /></Btn>
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
                Eurogrip tyres are developed jointly by our R&amp;D centre in Italy — established in 2019, behind the Bee family of scooter tyres — and our headquarter R&amp;D and state-of-the-art factory in Madurai, India. Every platform earns the Eurogrip name only after a rigorous, multi-step process.
              </p>
            </Reveal>
          </div>
          <Reveal i={1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 shadow-[0_30px_70px_-35px_rgba(0,0,0,.6)]">
              <img src={rdMilano} alt="Eurogrip R&D testing on an Italian proving ground" className="h-full w-full object-cover" />
              <span className="absolute bottom-0 left-0 m-3 rounded-[3px] bg-black/50 px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white backdrop-blur-sm">R&amp;D · Milano, Italy</span>
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
const MILESTONES = [
  { y: "1991", t: "Founded — TVS Srichakra launches two-wheeler tyre operations." },
  { y: "1999", t: "Eurogrip brand established, with an Italian design partnership." },
  { y: "2005", t: "First OEM partnerships — Piaggio & Aprilia." },
  { y: "2010", t: "R&D Centre 2 inaugurated; exports reach 40+ countries." },
  { y: "2015", t: "ISO 14001:2015 certification; CSK sponsorship launch." },
  { y: "2020", t: "50-million-tyre milestone; expansion into the Americas." },
  { y: "2026", t: "eurogriptyres.com global platform launches." },
]

function Journey() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] })
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="bg-mist py-[clamp(70px,11vh,140px)] text-asphalt">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="Our Journey"
          title={<>The road so far</>}
          lede="Three decades from a single tyre to a global specialist brand — built on TV Sundram Iyengar's founding legacy of trust, value and service."
          className="mb-[clamp(40px,6vh,64px)] max-w-none"
        />
        <div ref={ref} className="relative">
          {/* spine */}
          <div className="absolute bottom-0 left-[19px] top-0 w-[2px] bg-black/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            className="absolute left-[19px] top-0 w-[2px] origin-top bg-gradient-to-b from-racing to-eurored md:left-1/2 md:-translate-x-1/2"
            style={{ height: "100%", scaleY: reduce ? 1 : spineScale }}
          />
          <div className="space-y-[clamp(28px,4vh,48px)]">
            {MILESTONES.map((m, i) => {
              const left = i % 2 === 0
              return (
                <div key={m.y} className={`relative flex items-center gap-6 pl-12 md:pl-0 ${left ? "md:justify-start" : "md:justify-end"}`}>
                  {/* node */}
                  <span className="absolute left-[11px] z-10 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-eurored bg-mist md:left-1/2 md:-translate-x-1/2">
                    <span className="h-1.5 w-1.5 rounded-full bg-eurored" />
                  </span>
                  <Reveal className={`w-full md:w-[calc(50%-2.5rem)] ${left ? "md:text-right" : ""}`}>
                    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_16px_40px_-24px_rgba(16,35,70,.3)]">
                      <div className="font-display text-[1.5rem] font-black italic leading-none text-racing">{m.y}</div>
                      <p className="mt-2 text-[0.9rem] font-light leading-relaxed text-slate-600">{m.t}</p>
                    </div>
                  </Reveal>
                </div>
              )
            })}
          </div>
        </div>
      </div>
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
              <h2 className="italic-display mt-3 text-white text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.02]">
                Part of the<br />TVS Mobility Group
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
    stat: "ISO 14001 · since 2000",
    body: "Environmental management certified since 2000, REACH-compliant compounds, a sustainable-materials roadmap and low-rolling-resistance tyres that save energy.",
    points: ["ISO 14001 operations", "REACH-compliant compounds", "Low rolling resistance"],
  },
  {
    key: "Safety & Quality",
    title: "Safety & Quality",
    stat: "7-step validation",
    body: "Every tyre earns its name. Multi-step indoor and outdoor testing, strict quality control and international certifications before a single tyre ships.",
    points: ["Simulation to road testing", "Per-tyre QC stamp", "ISO 9001 · IATF 16949"],
  },
  {
    key: "Riders & Community",
    title: "Riders & Community",
    stat: "85+ countries of riders",
    body: "Closer to the people who ride — the Tread Talks knowledge series, rider road-trip diaries and hands-on dealer and mechanic engagement.",
    points: ["Tread Talks series", "Rider road-trip diaries", "Dealer & mechanic training"],
  },
  {
    key: "People & Education",
    title: "People & Education",
    stat: "~50,000 learners reached",
    body: "Investing in people — 25,000+ across the group, with the TVS legacy's educational institutions reaching around 50,000 learners.",
    points: ["25,000+ group employees", "Nine institutions", "~50,000 learners"],
  },
]

function CultureInitiatives() {
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const it = INITIATIVES[active]

  useEffect(() => {
    if (reduce || paused || manual) return
    const id = setInterval(() => setActive((i) => (i + 1) % INITIATIVES.length), 5000)
    return () => clearInterval(id)
  }, [reduce, paused, manual])

  return (
    <section className="bg-mist py-[clamp(70px,11vh,140px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="Culture & Initiatives"
          title={<>More than tyres</>}
          lede="How we work, and what we give back — across sustainability, quality, riders and people."
          className="mb-8 max-w-none"
        />
        <Reveal>
          <div
            className="grid overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_30px_70px_-40px_rgba(16,35,70,.35)] lg:grid-cols-[minmax(240px,320px)_1fr]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* rail */}
            <div role="tablist" aria-label="Initiatives" className="flex overflow-x-auto border-b border-black/10 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
              {INITIATIVES.map((item, i) => {
                const on = i === active
                return (
                  <button
                    key={item.key}
                    role="tab"
                    aria-selected={on}
                    onClick={() => { setManual(true); setActive(i) }}
                    className={`group relative flex shrink-0 items-center gap-3 px-4 py-3.5 text-left transition-colors lg:flex-1 lg:px-5 ${on ? "bg-racing/[0.06]" : "hover:bg-black/[0.03]"}`}
                  >
                    <span className={`absolute bottom-0 left-0 h-[3px] w-full bg-eurored transition-opacity lg:h-full lg:w-[3px] ${on ? "opacity-100" : "opacity-0"}`} />
                    <span className={`font-display text-[0.72rem] font-black italic ${on ? "text-eurored" : "text-slate-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-display text-[0.88rem] font-extrabold uppercase italic leading-tight ${on ? "text-asphalt" : "text-slate-500"}`}>{item.title}</span>
                  </button>
                )
              })}
            </div>
            {/* panel */}
            <div role="tabpanel" className="relative min-h-[260px] p-6 sm:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={it.key}
                  initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.45, ease: ENTER }}
                >
                  <div className="font-display text-[0.85rem] font-black italic text-eurored">{it.stat}</div>
                  <h3 className="mt-1.5 font-display text-[clamp(1.2rem,2.2vw,1.7rem)] font-extrabold uppercase italic leading-tight text-asphalt">{it.title}</h3>
                  <p className="mt-3 max-w-[54ch] text-[0.95rem] font-light leading-relaxed text-slate-600">{it.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {it.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 rounded-full border border-black/10 bg-mist px-3 py-1.5 text-[0.8rem] font-medium text-slate-700">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-racing text-white">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* certifications strip */}
        <div className="mt-[clamp(40px,6vh,64px)] border-t border-black/10 pt-8">
          <div className="mb-6 text-center text-[0.74rem] uppercase tracking-[0.12em] text-slate-500">Certifications</div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {[["ISO", "9001"], ["IATF", "16949"], ["ISO", "14001"], ["ISO", "45001"]].map(([fam, num]) => (
              <Reveal key={fam + num}>
                <div className="grid h-[86px] w-[86px] place-items-center rounded-full border border-racing/40 bg-white shadow-[inset_0_0_0_4px_rgba(10,110,216,.05)]">
                  <div className="text-center leading-none">
                    <div className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-racing">{fam}</div>
                    <div className="font-display text-[1rem] font-black italic text-asphalt">{num}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================ Page ============================ */
export function About() {
  const [film, setFilm] = useState(false)
  const { path } = useRouter()

  // ensure top on entry
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [path])

  return (
    <main>
      <div className="relative overflow-x-clip">
        <AboutHero onPlay={() => setFilm(true)} />
        <PillarsRibbon onPlay={() => setFilm(true)} />
      </div>
      <Cine><WhoWeAre /></Cine>
      <WhatWeDo />
      <Journey />
      <Cine><TVSMobility /></Cine>
      <CultureInitiatives />
      <Cine><CtaFooter /></Cine>
      <FilmLightbox open={film} onClose={() => setFilm(false)} />
    </main>
  )
}
