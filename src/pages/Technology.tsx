import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow } from "@/components/site/ui"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter, Link } from "@/lib/router"
import {
  TECHNOLOGIES, TECH_COUNT, CENTRES, CAPABILITIES, PIPELINE, CASINGS,
  COMPOUND_ZONES, VENUES, TEST_SHOTS,
} from "@/lib/technology"
import treadCrown from "@/assets/technology/tread-crown.webp"
import sidewall from "@/assets/technology/sidewall.webp"
import factoryAerial from "@/assets/technology/factory-aerial.webp"
import factoryHall from "@/assets/technology/factory-hall.webp"
import factoryGreens from "@/assets/technology/factory-greens.webp"
import rdTrack from "@/assets/technology/rd-track.webp"
import provingRide from "@/assets/technology/proving-ride.webp"
import rideRoad from "@/assets/technology/ride-road.webp"

gsap.registerPlugin(ScrollTrigger)

/* The embedded review pane runs with document.visibilityState permanently
   "hidden", which means requestAnimationFrame never fires and GSAP's ticker —
   and so every ScrollTrigger — never updates. Exposing the plugin in dev lets a
   scroll position be driven and then settled by hand (`ScrollTrigger.update()`)
   so this page's scroll work can actually be verified there. Stripped from
   production builds. */
if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/* ---------------------------------------------------------------- hero ---- */
/**
 * The client's "Tyre closeup" film, full-bleed. It replaced a still — first a
 * dusty tread macro, which went grey under a scrim, then a press riding shot —
 * and being the client's own footage it settles the licensing question on the
 * page's most prominent asset at the same time.
 */
function Hero() {
  const reduce = useReducedMotion()
  return (
    <section data-tech-hero className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-midnight">
      {/* The client's own "Tyre closeup" film — tread macros and the Eurogrip
          sidewall moulding. It replaced a press photograph, which also takes the
          licensing question off the most prominent image on the page.
          The poster is the film's own first frame, so there is no jump when
          playback starts, and it is what stands in when motion is turned off. */}
      <video
        data-hero-img
        src="/tech-hero.mp4"
        poster="/tech-hero-poster.webp"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Close detail of Eurogrip tread patterns and sidewall moulding"
        className="absolute inset-0 h-full w-full scale-[1.12] object-cover will-change-transform"
      />
      {/* Two scrims, doing two jobs. The vertical one keeps the fixed navbar
          legible at the top and beds the section into the next one at the
          bottom. The horizontal one gives the copy column its own dark ground —
          which matters more with a film than a still, because every frame is a
          different picture and the type has to hold on all of them. Both are
          lighter than they were for the still they replaced: this film runs dark
          on its own, and the values that suited a sunlit riding shot turned the
          whole banner to near-black. Checked against the film's brightest
          frame, not just its darkest. */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,18,34,.62)_0%,rgba(9,18,34,.1)_30%,rgba(9,18,34,.42)_66%,rgba(9,18,34,.94)_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,18,34,.8)_0%,rgba(9,18,34,.5)_32%,rgba(9,18,34,.08)_64%,rgba(9,18,34,0)_100%)]" />
      <div data-hero-copy className="relative mx-auto w-full max-w-[1280px] px-5 pb-[clamp(56px,10vh,120px)] pt-[clamp(120px,20vh,200px)] sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[0.78rem] font-medium text-slate-300">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <span className="text-white/40">›</span>
          <span className="text-white">Technology</span>
        </nav>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-white backdrop-blur-sm">
          <span className="h-[2px] w-5 bg-eurored" /> Technology
        </span>
        <h1 className="italic-display mt-5 max-w-[13ch] text-[clamp(2.3rem,6vw,4.8rem)] leading-[0.92] text-white">
          Everything a rider never has to think about
        </h1>
        <p className="mt-6 max-w-[46ch] text-[clamp(0.95rem,1.25vw,1.08rem)] font-light leading-relaxed text-slate-200">
          Tread, compound, casing, profile. {TECH_COUNT} engineering decisions taken in
          Italy and India, simulated before anything is built, then run well past
          the limits of ordinary use before the tyre is allowed a name.
        </p>
        <ul className="mt-7 flex flex-wrap gap-2">
          {CAPABILITIES.slice(0, 4).map((c) => (
            <li key={c} className="rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[0.78rem] font-medium text-slate-200 backdrop-blur-sm">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- centres ---- */
/**
 * Milan and Madurai as two photographs, not two cards.
 *
 * The caption block needs its own floor. On the first pass the scrim only
 * reached 50% opacity behind the red role line, and over a rider's jersey and a
 * solar roof it was unreadable — it looked like text dropped on top of a photo
 * rather than set into it. It now sits on a near-solid base that starts above
 * the type, so the words own their space whatever the picture is doing.
 */
function Centres() {
  const shots = [rdTrack, factoryAerial]
  return (
    <section className="bg-midnight pt-[clamp(44px,7vh,88px)]">
      <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(22px,3.5vh,44px)] sm:px-8">
        <SectionHead
          eyebrow="Where it is designed"
          title={<>Two centres,<br />one tyre</>}
          lede="The international range is developed jointly — a product development centre in Italy alongside the headquarters R&D centre in India. One reads the market and draws the tyre; the other builds it and puts it on the ground."
          className="max-w-none"
        />
      </div>
      <div className="mx-auto max-w-[1600px] px-0">
        <div className="grid gap-px bg-white/10 lg:grid-cols-2">
          {CENTRES.map((c, i) => (
            <article
              key={c.k}
              data-tech-panel
              className="group relative isolate flex min-h-[clamp(400px,58vh,580px)] items-end overflow-hidden"
            >
              <img
                src={shots[i]}
                alt={i === 0
                  ? "A Eurogrip engineer with a clipboard briefing two motocross riders beside a dirt test track in Italy"
                  : "The Madurai plant from the air, its roof covered in solar panels"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              {/* a light vignette for depth only — the caption carries its own
                  floor below, so this does not have to be dark enough to read
                  type through */}
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,18,34,0)_0%,rgba(9,18,34,.1)_45%,rgba(9,18,34,.4)_100%)]" />
              {/* The caption's own bed. Tuning the panel-wide scrim was the wrong
                  tool: the block's top edge lands at a different fraction of the
                  panel at every viewport height, so the red role line kept
                  surfacing over a rider's jersey and a solar roof. Anchoring the
                  gradient to the text block instead makes it deterministic —
                  whatever the picture is doing, the words sit on near-solid navy. */}
              <div className="relative w-full bg-[linear-gradient(180deg,rgba(9,18,34,0)_0%,rgba(9,18,34,.94)_26%,rgba(9,18,34,.99)_100%)] px-[clamp(22px,3.4vw,52px)] pb-[clamp(22px,3.4vw,52px)] pt-[clamp(56px,9vh,104px)]">
                <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">
                  {c.role}
                </span>
                <h3 className="mt-1.5 font-display text-[clamp(1.5rem,3vw,2.4rem)] font-black uppercase italic leading-none text-white">
                  {c.k}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[0.9rem] font-light leading-relaxed text-slate-200">{c.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------- the twelve, as a scroll -- */
/**
 * The signature section, and the reason the twelve technologies are no longer a
 * grid of twelve identical cards.
 *
 * The diagram column is `position: sticky` and the copy scrolls past it; a
 * ScrollTrigger per step swaps which diagram is showing. Sticky rather than
 * ScrollTrigger's `pin` on purpose — pinning rewrites the document height and
 * has to be refreshed by hand on a code-split route, which is exactly the trap
 * the products page fell into. Sticky needs no measurement and cannot desync.
 *
 * Below `lg` the sticky column is dropped and each step carries its own
 * diagram inline, because a sticky stage in a 375px-wide column leaves no room
 * for either the picture or the words.
 */
function Anatomy() {
  const wrap = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          // the middle band of the viewport: a step takes over when it is the
          // one a reader would actually be looking at
          start: "top 62%",
          end: "bottom 38%",
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    }, wrap)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  const t = TECHNOLOGIES[active]

  return (
    <section ref={wrap} id="technologies" className="relative bg-white py-[clamp(48px,8vh,96px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="Technology behind the performance"
          title={<>What is actually<br />inside the tyre</>}
          lede="Twelve decisions, in four places: the tread that meets the road, the compound it is made of, the casing beneath it and the profile it holds through a corner."
          className="max-w-none"
        />

        <div className="mt-[clamp(28px,5vh,64px)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-[clamp(32px,5vw,88px)]">
          {/* sticky stage — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col justify-center">
              <div className="relative">
                {/* The index used to sit behind the diagram and read as a
                    rendering fault. It now has its own row above it, so the two
                    never touch. */}
                <span
                  aria-hidden
                  className="block select-none font-display text-[clamp(3.4rem,6vw,5.2rem)] font-black italic leading-[0.8] text-[#132b52]/[0.12]"
                >
                  {String(active + 1).padStart(2, "0")}
                </span>
                <div className="relative mt-2 aspect-[5/4] w-full">
                  {TECHNOLOGIES.map((item, i) => (
                    <img
                      key={item.id}
                      src={item.img}
                      alt=""
                      aria-hidden={i !== active}
                      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">
                    {t.family}
                  </span>
                  {/* progress rail: twelve ticks, the live one filled */}
                  <span className="flex flex-1 gap-1" aria-hidden>
                    {TECHNOLOGIES.map((item, i) => (
                      <span
                        key={item.id}
                        className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                          i <= active ? "bg-racing" : "bg-black/10"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="font-display text-[0.72rem] font-black italic tabular-nums text-[#132b52]/50">
                    {String(active + 1).padStart(2, "0")}/{TECH_COUNT}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* the steps */}
          <div>
            {TECHNOLOGIES.map((item, i) => (
              <article
                key={item.id}
                data-step
                className="border-t border-black/[0.09] py-[clamp(26px,5vh,52px)] first:border-t-0 lg:flex lg:min-h-[68vh] lg:flex-col lg:justify-center lg:border-t-0"
              >
                {/* on a phone the diagram travels with its own words */}
                <img
                  src={item.img}
                  alt=""
                  loading="lazy"
                  className="mb-3 h-[104px] w-full object-contain object-left lg:hidden"
                />
                <span className="flex items-baseline gap-3">
                  <span className={`font-display text-[0.78rem] font-black italic leading-none transition-colors ${i === active ? "text-eurored" : "text-[#132b52]/35"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[0.66rem] font-extrabold uppercase italic tracking-[0.16em] text-[#132b52]/45 lg:hidden">
                    {item.family}
                  </span>
                </span>
                <h3 className="mt-1.5 font-display text-[clamp(1.15rem,2.4vw,1.85rem)] font-black uppercase italic leading-[1.02] text-[#132b52]">
                  {item.name}
                </h3>
                <p className="mt-3 max-w-[48ch] text-[clamp(0.86rem,1.1vw,1rem)] font-light leading-relaxed text-slate-600">
                  {item.feature}
                </p>
                <p className="mt-4 flex max-w-[44ch] gap-2.5 border-l-2 border-eurored pl-3 text-[clamp(0.86rem,1.05vw,0.98rem)] font-semibold leading-snug text-racing-deep">
                  {item.benefit}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------ tread inspector --- */
/**
 * The four compound zones, put on an actual tyre rather than in four boxes.
 * Hotspots are buttons, so this works from the keyboard and reads correctly to
 * a screen reader; hover is a shortcut, not the mechanism.
 */
/* Where each zone sits on the tread-crown photograph, as a percentage of the
   frame. The crown runs diagonally through it, so these follow the tyre rather
   than a neat grid: centre of the crown, the outer edge of the pattern, the
   flank beyond it, and the leading face of a tread block for the layer beneath.

   In this frame the crown's centre line runs from about (60%, 8%) down to
   (42%, 100%) and its outer edge from (68%, 10%) to (52%, 100%), so x has to
   shift with y or a marker slides straight off the rubber. */
const ZONE_AT = [
  { x: 52, y: 45 },  // centre ribbon — on the crown's centre line
  { x: 58, y: 65 },  // shoulders — the outer edge of the pattern
  { x: 67, y: 28 },  // wings — the flank, just outboard of the shoulder
  { x: 40, y: 82 },  // middle layer — the leading face of a tread block
]

function Tread() {
  const [open, setOpen] = useState(0)
  const zone = COMPOUND_ZONES[open]

  return (
    <section className="relative isolate overflow-hidden bg-midnight py-[clamp(40px,6vh,80px)]">
      <img
        src={sidewall}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
      />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_40%,rgba(9,18,34,.55),rgba(9,18,34,.96))]" />

      {/* The heading sits beside the picture rather than stacked above it. Above
          it, this section ran well over a screen tall for four short facts. */}
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-[clamp(22px,3.5vw,56px)] lg:grid-cols-[1.02fr_1fr] lg:items-center">
          {/* the tyre, with the zones marked on it */}
          <div className="relative">
            <img
              src={treadCrown}
              alt="Close detail of a Trailhound tread, the crown running from centre out to the shoulder"
              loading="lazy"
              className="aspect-[3/2] w-full rounded-2xl border border-white/10 object-cover"
            />
            {COMPOUND_ZONES.map((z, i) => (
              <button
                key={z.k}
                onClick={() => setOpen(i)}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                aria-pressed={i === open}
                className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-[0.78rem] font-black italic transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  left: `${ZONE_AT[i].x}%`,
                  top: `${ZONE_AT[i].y}%`,
                  background: i === open ? "#ed1c24" : "rgba(255,255,255,.92)",
                  color: i === open ? "#fff" : "#132b52",
                  boxShadow: i === open
                    ? "0 0 0 8px rgba(237,28,36,.22)"
                    : "0 6px 18px -6px rgba(0,0,0,.7)",
                }}
              >
                {z.n}
                <span className="sr-only"> — {z.k}</span>
              </button>
            ))}
          </div>

          {/* the heading, and the zone that is open */}
          <div>
            <Eyebrow>Across one tread</Eyebrow>
            <h2 className="italic-display mt-3 text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.02] text-white">
              Four zones,<br />four different jobs
            </h2>
            <p className="mt-3 max-w-[46ch] text-[0.9rem] font-light leading-relaxed text-slate-300">
              A tread is not one rubber. It changes as it goes outward, because the
              middle of a tyre and the edge of a tyre are asked for opposite things.
            </p>
            <ul className="mt-5 grid gap-1">
              {COMPOUND_ZONES.map((z, i) => {
                const on = i === open
                return (
                  <li key={z.k}>
                    <button
                      onClick={() => setOpen(i)}
                      onMouseEnter={() => setOpen(i)}
                      aria-expanded={on}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-300 ${
                        on ? "border-white/25 bg-white/[0.08]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className={`font-display text-[0.74rem] font-black italic ${on ? "text-eurored" : "text-slate-500"}`}>
                          {String(z.n).padStart(2, "0")}
                        </span>
                        <span className={`font-display text-[0.9rem] font-extrabold uppercase italic leading-none ${on ? "text-white" : "text-slate-300"}`}>
                          {z.k}
                        </span>
                      </span>
                      {on && (
                        <p className="mt-1.5 text-[0.84rem] font-light leading-snug text-slate-300">{z.d}</p>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3.5 max-w-[52ch] text-[0.76rem] font-light leading-snug text-slate-400">
              Silica-rich fillers in a varying ratio from the centre ribbon out to
              the shoulders, coupled with high-structure carbon — which is what
              holds grip across cold and hot, wet and dry.
            </p>
            <span className="sr-only" aria-live="polite">{zone.k}. {zone.d}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- the casings -- */
function Casings() {
  return (
    <section className="bg-mist py-[clamp(48px,8vh,104px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-[clamp(20px,3vw,44px)] lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <SectionHead
            light
            eyebrow="Under the rubber"
            title={<>Two ways to<br />build a casing</>}
            className="max-w-none"
          />
          <p className="max-w-[58ch] text-[0.92rem] font-light leading-relaxed text-slate-600">
            Which one a tyre gets is not a grade, it is a choice about what the tyre
            has to do. One holds its shape against speed; the other carries load and
            shrugs off what the road throws at it.
          </p>
        </div>

        <div className="mt-[clamp(24px,4vh,52px)] grid gap-4 lg:grid-cols-2">
          {CASINGS.map((c, i) => (
            <Reveal key={c.k} i={i}>
              <div className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-[clamp(22px,2.8vw,38px)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-display text-[0.66rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">
                      Casing {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 font-display text-[clamp(1.5rem,2.8vw,2.2rem)] font-black uppercase italic leading-none text-[#132b52]">
                      {c.k}
                    </h3>
                  </div>
                  <img
                    src={i === 0 ? TECHNOLOGIES.find((t) => t.id === "steel-belt")!.img : TECHNOLOGIES.find((t) => t.id === "synthetic-fibres-x-ply")!.img}
                    alt=""
                    loading="lazy"
                    className="h-[clamp(72px,8vw,104px)] w-auto shrink-0 object-contain"
                  />
                </div>
                <p className="mt-3 text-[0.9rem] font-light leading-relaxed text-slate-600">{c.d}</p>
                <ul className="mt-5 grid gap-2.5 border-t border-black/[0.08] pt-4">
                  {c.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[0.86rem] font-medium leading-snug text-slate-700">
                      <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-racing" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- the pipeline -- */
/**
 * Eight steps with the line between them drawn by the scroll, and the client's
 * own factory and test photographs dropped in where they belong in the
 * sequence rather than decorating the top of the section.
 */
const STEP_SHOT: Record<number, { img: string; alt: string }> = {
  2: { img: factoryGreens, alt: "Racks of uncured green tyres inside the Madurai plant" },
  3: { img: factoryHall, alt: "The production hall at Madurai, machinery down both sides" },
  5: { img: TEST_SHOTS[1].img, alt: "A Roadhound under test on a wet track with controlled watering" },
  6: { img: rideRoad, alt: "An adventure motorcycle on an open road during a long road test" },
}

function Pipeline() {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      const line = wrap.current?.querySelector("[data-line]")
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          }
        )
      }
      gsap.utils.toArray<HTMLElement>("[data-pstep]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 34,
          duration: 0.7,
          ease: "power2.out",
          // without this, from() writes opacity:0 the moment it is created and
          // the step only becomes visible once the ticker runs. Any stall —
          // a backgrounded tab on first paint, a dead rAF — leaves the whole
          // sequence blank. immediateRender:false keeps each step in its natural
          // state until its own trigger actually fires.
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 88%" },
        })
      })
    }, wrap)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrap} className="bg-white py-[clamp(48px,8vh,104px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="How a tyre earns the name"
          title={<>Eight steps, and a<br />checkpoint at each</>}
          lede="No prototype reaches production by passing one test. It passes all of them, in order — and the last check happens on the individual tyre, after it is built."
          className="max-w-none"
        />

        <div className="relative mt-[clamp(28px,5vh,60px)] pl-[clamp(30px,5vw,58px)]">
          {/* the rail, and the part of it the scroll has drawn */}
          <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-[2px] bg-black/[0.08] sm:left-[9px]" />
          <span
            data-line
            aria-hidden
            className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-[2px] origin-top bg-gradient-to-b from-racing to-eurored sm:left-[9px]"
          />

          <ol>
            {PIPELINE.map((s, i) => {
              const shot = STEP_SHOT[i]
              return (
                <li key={s.k} data-pstep className="relative pb-[clamp(26px,4.5vh,52px)] last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[clamp(30px,5vw,58px)] top-[5px] grid h-4 w-4 place-items-center rounded-full border-2 border-racing bg-white sm:h-5 sm:w-5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-racing" />
                  </span>
                  <div className={shot ? "grid gap-4 lg:grid-cols-[1fr_0.62fr] lg:items-start" : ""}>
                    <div>
                      <span className="font-display text-[0.7rem] font-black italic text-eurored">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-0.5 font-display text-[clamp(1.05rem,1.9vw,1.45rem)] font-black uppercase italic leading-none text-[#132b52]">
                        {s.k}
                      </h3>
                      <p className="mt-2 max-w-[62ch] text-[clamp(0.86rem,1.05vw,0.98rem)] font-light leading-relaxed text-slate-600">
                        {s.d}
                      </p>
                    </div>
                    {shot && (
                      <img
                        src={shot.img}
                        alt={shot.alt}
                        loading="lazy"
                        className="aspect-[3/2] w-full rounded-xl border border-black/[0.07] object-cover"
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- proving ground --- */
function Proving() {
  return (
    <section id="proving" className="relative isolate overflow-hidden bg-midnight py-[clamp(52px,9vh,116px)]">
      <img
        src={provingRide}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,18,34,.9),rgba(9,18,34,.82)_45%,rgba(9,18,34,.97))]" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-[clamp(24px,4vw,64px)] lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <SectionHead
            eyebrow="Proving ground"
            title={<>Tested where<br />it is hardest</>}
            lede="Testing for the global range happens in Europe as well as India. An independent team benchmarks every tyre against the competition that matters — on track and on open road, in real conditions and extreme ones."
            className="max-w-none"
          />
          <Reveal i={1}>
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {VENUES.map((v) => (
                <li key={v.k} className="border-t border-white/15 pt-3">
                  <h3 className="font-display text-[0.9rem] font-extrabold uppercase italic leading-tight text-white">
                    {v.k}
                  </h3>
                  <p className="mt-1 text-[0.78rem] font-light text-slate-300">
                    <span className="text-eurored">{v.where}</span> — {v.d}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-[clamp(26px,4.5vh,56px)] grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {TEST_SHOTS.map((s, i) => (
            <Reveal key={s.k} i={i}>
              <figure className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                <img
                  src={s.img}
                  alt={`${s.k} under test — ${s.d.toLowerCase()}`}
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover"
                />
                <figcaption className="px-3.5 py-3">
                  <span className="block font-display text-[0.84rem] font-extrabold uppercase italic leading-none text-white">
                    {s.k}
                  </span>
                  <span className="mt-1 block text-[0.76rem] font-light text-slate-300">{s.d}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-[clamp(24px,4vh,48px)] flex flex-wrap items-center gap-3.5">
          <Btn href="/global-presence" variant="blue">Certifications & homologations <Arrow /></Btn>
          <Btn href="/products" variant="line">See the range <Arrow /></Btn>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- page ---- */
export function Technology() {
  const { path } = useRouter()
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [path])

  /* page-level scroll work: the hero frame, and the wipe every panel enters on */
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-img]", {
        scale: 1,
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: "[data-tech-hero]", start: "top top", end: "bottom top", scrub: true },
      })
      gsap.to("[data-hero-copy]", {
        yPercent: -14,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: "[data-tech-hero]", start: "top top", end: "bottom top", scrub: true },
      })
      gsap.utils.toArray<HTMLElement>("[data-tech-panel]").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(14% 0% 14% 0%)",
          duration: 1.1,
          ease: "power3.out",
          immediateRender: false,   // see the note on the pipeline steps
          scrollTrigger: { trigger: el, start: "top 85%" },
        })
      })
    }, root)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return (
    <main ref={root}>
      <Hero />
      <Centres />
      <Anatomy />
      <Tread />
      <Casings />
      <Pipeline />
      <Proving />
      <SiteFooter />
    </main>
  )
}
