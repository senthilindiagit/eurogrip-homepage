import { useEffect, useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow, Counter, Marquee } from "@/components/site/ui"
import { Cine } from "@/components/site/Cine"
import { TyreTrack } from "@/components/site/TyreTrack"
import { PhotoCycle } from "@/components/site/PhotoCycle"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import { OPENINGS } from "./CareersOpenings"
import teamEngineer from "@/assets/careers/team-engineer.webp"
import teamLab from "@/assets/careers/team-lab.webp"
import teamStudio from "@/assets/careers/team-studio.webp"
import realTechnician from "@/assets/careers/real-technician.webp"
import realTech1 from "@/assets/careers/real-tech-1.webp"
import realTech2 from "@/assets/careers/real-tech-2.webp"
import realTech3 from "@/assets/careers/real-tech-3.webp"
import realTech4 from "@/assets/careers/real-tech-4.webp"
import realEicma from "@/assets/careers/real-eicma.webp"
import life1 from "@/assets/careers/life-1.webp"
import life2 from "@/assets/careers/life-2.webp"
import life3 from "@/assets/careers/life-3.webp"
import factoryFloor from "@/assets/about/about-hero.webp"

const ENTER = [0.16, 0.84, 0.34, 1] as const
const APPLY = "/careers/apply"

/* ---------------------------------------------------------------- data ---- */
const DISCIPLINES = [
  "Compound chemistry", "Tread design", "Process engineering", "Quality assurance",
  "Test & validation", "Supply chain", "Brand & marketing", "Export sales",
]

const PILLARS = [
  { k: "Engineer globally", body: "Work across our Madurai R&D centre and Milan design studio — one team, two continents, products that ship to 125+ countries.", icon: "globe" },
  { k: "Own real scale", body: "Thirty-four million tyres of installed capacity across two plants. What you build is measured in millions of kilometres ridden.", icon: "gauge" },
  { k: "Learn relentlessly", body: "Backed by the TVS legacy's institutions and a culture of skilling — from the shop floor to the test track.", icon: "spark" },
  { k: "Build for riders", body: "We make something people genuinely love. Every compound and contour ends up under someone's journey.", icon: "heart" },
]

const OFFERS = [
  { t: "Global career paths", d: "Cross-border projects across India, Europe and our export markets." },
  { t: "Learning & skilling", d: "Structured training, certifications and mentoring from veteran engineers." },
  { t: "Safety first, always", d: "ISO 45001 practices and a genuine zero-compromise safety culture." },
  { t: "Health & wellbeing", d: "Medical cover for you and your family, plus wellbeing support." },
  { t: "Recognition", d: "Awards, TPM excellence programmes and visible ownership of outcomes." },
  { t: "A 50,000-strong family", d: "Part of the TVS Mobility group — stability with a startup's ambition." },
]

/* Large scroll-driven gallery — the "Life here" story. */
const LIFE = [
  { src: life1, label: "The floor", place: "Madurai, India", copy: "Thirty-four million tyres of capacity, and every one starts as a conversation on the line." },
  { src: life2, label: "The proving ground", place: "Test track", copy: "Every platform earns its name outdoors, in the hands of testers." },
  { src: life3, label: "The craft", place: "Workshop", copy: "Four decades of know-how, handed over one tyre at a time." },
  { src: teamStudio, label: "The studio", place: "Design", copy: "Tread patterns modelled and argued over before a mould exists." },
  { src: realEicma, label: "The open road", place: "Europe", copy: "Where the work meets the riders who'll ride it." },
]

/* popout card over the hero imagery */
const HERO_STATS: { compact?: string; to?: number; suffix?: string; label: string }[] = [
  { compact: "50,000+", label: "People across the group" },
  { to: 125, suffix: "+", label: "Countries we operate in" },
]

/* one test day, in sequence — read the data, fit it, check it, ride it */
const TEST_DAY = [realTechnician, realTech2, realTech3, realTech1, realTech4]

/* --------------------------------------------------------------- icons ---- */
function PillarIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18",
    gauge: "M12 14a2 2 0 100-4 2 2 0 000 4zM12 12l4.5-4.5M4 19a9 9 0 1116 0",
    spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z",
    heart: "M12 20s-7-4.3-7-9.3A4.7 4.7 0 0112 8a4.7 4.7 0 017 2.7C19 15.7 12 20 12 20z",
  }
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.spark} />
    </svg>
  )
}

/* ============================== HERO ==============================
   Light editorial hero — deliberately different from the blue-gradient
   heroes on About/Contact: off-white canvas, oversized type, three
   offset photos that drift at different speeds, red rule, and a
   discipline marquee along the bottom edge.
================================================================== */
function CareersHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { navigate } = useRouter()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const yA = useTransform(scrollYProgress, [0, 1], [0, -90])
  const yB = useTransform(scrollYProgress, [0, 1], [0, 60])
  const yC = useTransform(scrollYProgress, [0, 1], [0, -40])

  const line = (text: string, delay: number, accent?: boolean) => (
    <motion.span
      className={`block ${accent ? "text-eurored" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: ENTER, delay }}
    >
      {text}
    </motion.span>
  )

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#f4f7fb] pb-0 pt-[clamp(110px,17vh,160px)] text-asphalt">
      {/* faint diagonal brand wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(10,110,216,.07) 0%, transparent 42%, rgba(237,28,36,.05) 100%)" }} />
      {/* the mark our people leave — rolls in from the bottom-left corner */}
      <TyreTrack opacity={0.11} className="-left-[38%] bottom-[-6%] w-[128%] sm:-left-[26%] sm:w-[92%] lg:-left-[18%] lg:bottom-[-30%] lg:w-[64%]" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[0.78rem] font-medium text-slate-500">
            <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }} className="transition-colors hover:text-asphalt">Home</a>
            <span className="text-slate-400">›</span>
            <span className="text-asphalt">Careers</span>
          </nav>
        </Reveal>

        <div className="grid items-end gap-[clamp(28px,4vw,56px)] lg:grid-cols-[1.15fr_1fr]">
          {/* headline column */}
          <div className="relative z-10 pb-[clamp(24px,5vh,64px)]">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.18em] text-eurored">
                <span className="h-[2px] w-7 bg-eurored" /> Join the team
              </span>
            </Reveal>
            <h1 className="italic-display mt-5 text-asphalt leading-[0.92] text-[clamp(1.9rem,5vw,4rem)]">
              {line("Build what", 0.05)}
              {line("the world", 0.13)}
              {line("rides on.", 0.21, true)}
            </h1>
            <motion.p
              className="mt-6 max-w-[46ch] text-[clamp(0.95rem,1.35vw,1.15rem)] font-light leading-relaxed text-slate-600"
              initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.32 }}
            >
              Engineering, manufacturing, commercial and brand roles across India, Italy and our export markets — for people who want their work measured in kilometres.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.4 }}
            >
              <Btn href={APPLY} variant="red">Send your application <Arrow /></Btn>
              <a
                href="#life"
                onClick={(e) => { e.preventDefault(); document.getElementById("life")?.scrollIntoView({ behavior: "smooth" }) }}
                className="group inline-flex items-center gap-2 text-[0.86rem] font-semibold text-slate-600 transition-colors hover:text-asphalt"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-black/20 transition-colors group-hover:border-asphalt">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                See life here
              </a>
            </motion.div>
          </div>

          {/* offset photo cluster */}
          <div className="relative h-[clamp(300px,46vw,480px)]">
            <motion.div
              style={reduce ? undefined : { y: yA }}
              className="absolute right-0 top-0 w-[58%] overflow-hidden rounded-2xl border border-white shadow-[0_30px_70px_-30px_rgba(16,35,70,.45)]"
              initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: ENTER, delay: 0.2 }}
            >
              <img src={teamEngineer} alt="Process engineer on the tyre-building line" className="aspect-[4/5] w-full object-cover" />
            </motion.div>
            {/* lab photo, with the group-scale figures popping out above it —
                anchored to the photo itself so they stay put at any size */}
            <motion.div
              style={reduce ? undefined : { y: yB }}
              className="absolute bottom-[6%] left-0 w-[52%]"
              initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: ENTER, delay: 0.34 }}
            >
              <div className="overflow-hidden rounded-2xl border border-white shadow-[0_30px_70px_-30px_rgba(16,35,70,.45)]">
                <img src={teamLab} alt="Engineer testing a motorcycle tyre in the lab" className="aspect-square w-full object-cover" />
              </div>
              <motion.div
                className="absolute -top-8 left-0 z-20 flex w-max gap-x-[clamp(14px,1.8vw,26px)] rounded-xl border border-white/10 bg-white px-4 py-3 shadow-[0_28px_60px_-24px_rgba(11,38,74,.55)]"
                initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.62 }}
              >
                {HERO_STATS.map((s) => (
                  <div key={s.label}>
                    {s.compact ? (
                      <div className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-black italic leading-none text-asphalt">{s.compact}</div>
                    ) : (
                      <Counter to={s.to!} suffix={s.suffix} className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-black italic leading-none text-asphalt" />
                    )}
                    {/* labels wrap on narrow screens so the card can't outgrow the viewport */}
                    <div className="mt-1.5 max-w-[8rem] text-[0.68rem] uppercase leading-tight tracking-wide text-slate-500 sm:max-w-none">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              style={reduce ? undefined : { y: yC }}
              className="absolute bottom-0 right-[8%] hidden w-[34%] overflow-hidden rounded-xl border border-white shadow-[0_24px_60px_-28px_rgba(16,35,70,.5)] sm:block"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: ENTER, delay: 0.48 }}
            >
              <PhotoCycle
                images={TEST_DAY}
                alt="A Eurogrip test day: reading data, fitting and checking the tyre, then out on the wet track"
                className="aspect-[4/3] w-full"
              />
            </motion.div>
          </div>
        </div>

        {/* discipline marquee */}
        <motion.div
          className="mt-[clamp(28px,4vh,52px)] border-y border-black/10 py-3.5"
          initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Marquee speed={38}>
            {DISCIPLINES.map((d) => (
              <span key={d} className="flex items-center gap-4 whitespace-nowrap font-display text-[0.82rem] font-extrabold uppercase italic tracking-[0.1em] text-slate-500">
                {d} <span className="h-1.5 w-1.5 rounded-full bg-eurored" />
              </span>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  )
}

/* ===================== LIFE HERE — pinned horizontal scroll =====================
   The section pins while vertical scroll drives a horizontal track of large
   photos. Each panel gets its own counter-parallax + scale so the imagery
   feels alive rather than a static strip. Falls back to a native swipe
   carousel on small screens and for reduced-motion users.
============================================================================ */
function LifePanel({ item, i }: { item: (typeof LIFE)[number]; i: number }) {
  return (
    <div className="relative h-full w-[min(78vw,900px)] shrink-0 overflow-hidden rounded-2xl border border-white/10">
      <img data-drift src={item.src} alt={item.label} className="absolute inset-0 h-full w-full scale-[1.16] object-cover will-change-transform" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,26,48,.34) 0%, transparent 30%, rgba(13,26,48,.58) 62%, rgba(13,26,48,.95) 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
        <span className="font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">
          {String(i + 1).padStart(2, "0")} · {item.place}
        </span>
        <h3 className="mt-2 font-display text-[clamp(1.4rem,3vw,2.4rem)] font-black uppercase italic leading-none text-white">{item.label}</h3>
        <p className="mt-2.5 max-w-[46ch] text-[0.92rem] font-light leading-relaxed text-slate-200">{item.copy}</p>
      </div>
    </div>
  )
}

function LifeHere() {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  /**
   * Pinned horizontal scroll, measured in pixels: while the tall wrapper is
   * pinned, translate the track by exactly the distance it overflows the
   * viewport. Written straight to the DOM from the scroll handler so it tracks
   * the wheel 1:1 — no spring lag and no dependence on the rAF frame loop.
   */

  useEffect(() => {
    if (reduce) return
    const wrap = ref.current
    const track = trackRef.current
    if (!wrap || !track) return

    const update = () => {
      const rect = wrap.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return
      const p = Math.min(1, Math.max(0, -rect.top / scrollable))
      // exactly the distance the track overflows the viewport, plus the lead-in gutter
      const travel = Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.09)
      track.style.transform = `translate3d(${-travel * p}px,0,0)`
      if (barRef.current) barRef.current.style.width = `${p * 100}%`
      // each photo drifts inside its frame as the panel crosses the viewport
      for (const img of track.querySelectorAll<HTMLElement>("[data-drift]")) {
        const r = img.getBoundingClientRect()
        const centred = (r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth
        img.style.transform = `translate3d(${(-centred * 7).toFixed(2)}%,0,0) scale(1.16)`
      }
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [reduce])

  return (
    <section id="life" className="scroll-mt-0 bg-gradient-to-b from-steel-2 to-steel">
      {/* heading */}
      <div className="mx-auto max-w-[1280px] px-5 pt-[clamp(64px,10vh,130px)] sm:px-8">
        <SectionHead
          eyebrow="Life here"
          title={<>From the shop floor<br />to the test track</>}
          lede="Madurai, Pantnagar, Milan and every road in between — scroll through a day in the company."
          className="max-w-none"
          ledeClassName="max-w-none lg:whitespace-nowrap"
        />
      </div>

      {/* desktop: pinned horizontal scroll — pulled up so the cards sit tight under the lede */}
      <div ref={ref} className="relative -mt-[clamp(24px,8vh,110px)] hidden h-[420vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div ref={trackRef} className="flex h-[62vh] w-max gap-6 pl-[7vw] will-change-transform">
            {LIFE.map((item, i) => <LifePanel key={item.label} item={item} i={i} />)}
            {/* closing card */}
            <div className="flex h-full w-[min(52vw,620px)] shrink-0 flex-col justify-center rounded-2xl border border-white/15 bg-white/[0.06] p-10 backdrop-blur-sm">
              <span className="font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">Your turn</span>
              <h3 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase italic leading-[1.02] text-white">
                See yourself<br />in the picture?
              </h3>
              <p className="mt-4 max-w-[38ch] text-[0.95rem] font-light leading-relaxed text-slate-300">
                We hire for curiosity and craft. Send us your CV and tell us where you'd fit.
              </p>
              <div className="mt-7 flex flex-wrap gap-3.5">
                <Btn href={APPLY} variant="red">Send your application <Arrow /></Btn>
                <Btn href="/careers/openings" variant="line">View job listings</Btn>
              </div>
            </div>
          </div>

          {/* scroll progress */}
          <div className="mx-auto mt-10 flex w-[min(560px,80vw)] items-center gap-4">
            <span className="font-display text-[0.7rem] font-extrabold uppercase italic tracking-[0.14em] text-slate-400">Scroll</span>
            <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
              <span ref={barRef} className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-racing to-eurored" />
            </span>
          </div>
        </div>
      </div>

      {/* mobile / reduced-motion: native swipe */}
      <div className="lg:hidden">
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
          {LIFE.map((item, i) => (
            <div key={item.label} className="h-[62vh] max-h-[520px] snap-start">
              <LifePanel item={item} i={i} />
            </div>
          ))}
        </div>
        <div className="px-5 pb-4 sm:px-8"><Btn href={APPLY} variant="red">Send your application <Arrow /></Btn></div>
      </div>

      <div className="pb-[clamp(48px,8vh,100px)]" />
    </section>
  )
}

/* -------------------------------------------------------------- pillars ---- */
function WhyEurogrip() {
  return (
    <section className="bg-mist py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="Why Eurogrip"
          title={<>Work that ends up<br />under someone's journey</>}
          lede="We are a specialist. That focus shows up in how we hire, how we build and how far you can go here."
          className="mb-[clamp(32px,5vh,52px)] max-w-none"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.k} i={i % 4}>
              <div className="group h-full rounded-2xl border border-black/10 bg-white p-6 shadow-[0_24px_55px_-40px_rgba(16,35,70,.5)] transition-transform duration-500 hover:-translate-y-1.5">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-racing/10 text-racing transition-colors group-hover:bg-racing group-hover:text-white">
                  <PillarIcon name={p.icon} />
                </span>
                <h3 className="mt-4 font-display text-[1.05rem] font-extrabold uppercase italic leading-tight text-asphalt">{p.k}</h3>
                <p className="mt-2 text-[0.88rem] font-light leading-relaxed text-slate-600">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- offers ---- */
function WhatWeOffer() {
  return (
    <section className="bg-gradient-to-b from-[#f7fafd] to-mist py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <SectionHead light eyebrow="What we offer" title={<>More than a role</>} className="max-w-none" />
          <Reveal i={2}><Btn href={APPLY} variant="red">Apply now <Arrow /></Btn></Reveal>
        </div>
        <div className="mt-[clamp(28px,4vh,44px)] grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((o, i) => (
            <Reveal key={o.t} i={i % 3}>
              <div className="flex gap-4 border-t border-black/10 pt-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-racing text-white">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div>
                  <h3 className="font-display text-[0.98rem] font-extrabold uppercase italic leading-tight text-asphalt">{o.t}</h3>
                  <p className="mt-1.5 text-[0.88rem] font-light leading-relaxed text-slate-600">{o.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ closing cta ---- */
/* ============================ Open positions teaser ========================
   The full listing lives on /careers/openings. */
function OpeningsTeaser() {
  return (
    <section id="openings" className="scroll-mt-24 bg-white py-[clamp(40px,6vh,72px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-black/10 bg-mist p-6 sm:p-7">
            <div>
              <span className="font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">Open positions</span>
              <h3 className="mt-1.5 font-display text-[1.15rem] font-extrabold uppercase italic leading-tight text-asphalt">
                {OPENINGS.length} roles open right now
              </h3>
              <p className="mt-1 text-[0.88rem] font-light text-slate-600">Filter by region and department, and apply in minutes.</p>
            </div>
            <Btn href="/careers/openings" variant="red">View open positions <Arrow /></Btn>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="relative overflow-hidden py-[clamp(76px,12vh,150px)]">
      <img src={factoryFloor} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,30,60,.72) 0%, rgba(11,30,60,.55) 45%, rgba(11,30,60,.8) 100%)" }} />
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 text-center sm:px-8">
        <Reveal><Eyebrow className="justify-center">Open applications</Eyebrow></Reveal>
        <Reveal i={1}>
          <h2 className="italic-display mx-auto mt-3 text-white text-[clamp(1.8rem,4vw,3.1rem)] leading-[1.04] drop-shadow-[0_2px_18px_rgba(6,18,38,.55)]">
            <span className="block">There's a place here</span>
            <span className="block">for people who build.</span>
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mx-auto mt-4 max-w-[52ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-200">
            No opening that fits today? Send your CV anyway — we keep an open list and review every application.
          </p>
        </Reveal>
        <Reveal i={3} className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Btn href={APPLY} variant="red">Send your application <Arrow /></Btn>
          <Btn href="/careers/openings" variant="line">View current openings</Btn>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- page ---- */
export function Careers() {
  const { path } = useRouter()

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
      <CareersHero />
      <LifeHere />
      <Cine><WhyEurogrip /></Cine>
      <WhatWeOffer />
      <OpeningsTeaser />
      <ClosingCta />
      <SiteFooter />
    </main>
  )
}
