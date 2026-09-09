import { useEffect, useRef, useState } from "react"
import { AnimatePresence, useReducedMotion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow } from "@/components/site/ui"
import { PageHero } from "@/components/site/PageHero"
import { SiteFooter } from "@/components/site/CtaFooter"
import { ReviewWall, VideoLightbox, type PlayTarget } from "@/components/site/ReviewCard"
import { WALL_REVIEWS } from "@/lib/reviews"
import {
  CATEGORIES, ROUTES, SKY_RGB, SKY_STOPS, HERO_STOPS, SCENE, FAR, TREES, APRON, HORIZON,
  FAR_SPAN_VW, FAR_LIFT_VW, STEPS, STEP_OF_CATEGORY, CATEGORY_OF_STEP,
  type Category, type Step,
} from "@/lib/products"
import { LOGOS } from "@/components/site/Racing"
import { useRouter } from "@/lib/router"
import certDot from "@/assets/certs/cert-dot.webp"
import certInmetro from "@/assets/certs/cert-inmetro.webp"
import certSni from "@/assets/certs/cert-sni.webp"
import certBis from "@/assets/certs/cert-bis.webp"
import certGso from "@/assets/certs/cert-gso.webp"
import certSabs from "@/assets/certs/cert-sabs.webp"
import certReach from "@/assets/certs/cert-reach.webp"
import { CategoryCarousel } from "@/components/site/CategoryCarousel"

const CERTS = [
  { img: null, name: "ECE" },
  { img: certDot, name: "DOT" },
  { img: certInmetro, name: "INMETRO" },
  { img: certSni, name: "SNI" },
  { img: certBis, name: "BIS" },
  { img: certGso, name: "GSO" },
  { img: certSabs, name: "SABS" },
  { img: certReach, name: "REACH" },
]

/* ---------------------------------------------------------------- icons ---- */
function RouteIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3.5 9h17M3.5 15h17M12 3c2.5 2.4 3.8 5.4 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3z",
    chat: "M21 12a8 8 0 01-8 8H8l-5 3 1.5-5A8 8 0 1121 12z",
    doc: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zm0 0v5h5M9 13h6M9 17h4",
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.doc} />
    </svg>
  )
}

function E4Mark() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="32" y="41" textAnchor="middle" className="fill-current font-display text-[22px] font-black italic">E4</text>
    </svg>
  )
}

/* -------------------------------------------------------------- journey --- */
/** the three marks used against each category's key points */
function PointIcon({ i }: { i: number }) {
  const paths = [
    "M12 3l7 3v5.5c0 4.3-2.9 7.6-7 9.5-4.1-1.9-7-5.2-7-9.5V6l7-3zM9.2 12.2l2.1 2.1 3.6-3.9",
    "M12 21a9 9 0 100-18 9 9 0 000 18zM12 17a5 5 0 100-10 5 5 0 000 10zM12 13.2a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z",
    "M12 20a8 8 0 110-16 8 8 0 010 16zM12 12l4-3",
  ]
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[i % paths.length]} />
    </svg>
  )
}

/**
 * The tyres, standing in the scene.
 *
 * The hero is upright and forward; any others sit back and slightly turned, so
 * the group reads as objects placed on the ground rather than cut-outs stacked
 * on a picture. Each gets a contact shadow on the floor beneath it.
 */
function TyreStage({ c }: { c: Category }) {
  /* set back, smaller, and standing a little higher up the ground plane, which
     is what puts them behind the hero rather than beside it */
  const back = [
    { h: 46, x: -27, y: -3, rot: -8, blur: 1.2, dim: 0.72 },
    { h: 39, x: 26, y: -5, rot: 7, blur: 1.8, dim: 0.6 },
  ]
  /* Each tyre sits in a column that is full height (so the percentage heights
     below have something to resolve against — with an auto-height wrapper they
     silently fall back to the cutout's intrinsic 1000px) and auto width (so the
     contact shadow can be a percentage of the tyre, not of the panel). */
  const col = "flex h-full w-auto flex-col items-center justify-end"
  return (
    <div className="relative h-full w-full">
      {c.tyres.slice(1).map((t, n) => {
        const b = back[n % back.length]
        return (
          <div
            key={t}
            className="absolute inset-0 flex justify-center"
            style={{ transform: `translate(${b.x}%, ${b.y}%)`, zIndex: n }}
          >
            <div className={col}>
              <img
                src={t}
                alt=""
                aria-hidden
                style={{ height: `${b.h}%`, transform: `rotate(${b.rot}deg)`, filter: `saturate(.85) brightness(1.03) blur(${b.blur}px)`, opacity: b.dim }}
                className="w-auto max-w-none"
              />
              <span aria-hidden className="mt-[-5px] h-2.5 w-[80%] rounded-[50%]" style={{ background: "radial-gradient(closest-side, rgba(16,32,54,.28), transparent)" }} />
            </div>
          </div>
        )
      })}
      {/* hero */}
      <div className="absolute inset-0 z-10 flex justify-center">
        <div className={col}>
          <img
            src={c.tyres[0]}
            alt={`${c.name} tyre`}
            data-drift
            className="h-[62%] w-auto max-w-none drop-shadow-[0_26px_26px_rgba(12,26,48,.32)]"
          />
          <span aria-hidden className="mt-[-8px] h-4 w-[88%] rounded-[50%]" style={{ background: "radial-gradient(closest-side, rgba(16,32,54,.42), transparent)" }} />
        </div>
      </div>
    </div>
  )
}

/**
 * A supplied line-up shot, standing on the ground plane.
 *
 * Sized by width and pinned to the bottom of the stage, because the shadow is
 * baked into the bottom of the asset — that edge is the floor. Nothing is added
 * over it: it arrives lit and staged, and a CSS drop-shadow on top would only
 * cast a second shadow off the first one.
 */
function TyreLineup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-full w-full items-end justify-center">
      {/* The height cap is what keeps the tyres a consistent size from panel to
          panel: a five-tyre line-up is a wide composition and fits by width, a
          three-tyre one is nearly square and would otherwise fill the column
          and render half again as large. */}
      <img
        src={src}
        alt={alt}
        className="max-h-[94%] w-full object-contain object-bottom lg:max-h-[76%]"
      />
    </div>
  )
}
/* ------------------------------------------------------------- the steps --- */
/** the quiet line that keeps a continuation screen tied to its category */
function StepLabel({ c, of }: { c: Category; of: string }) {
  return (
    <span className="flex items-baseline gap-3">
      <span className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-black italic leading-none text-[#132b52]/15">
        {c.n}
      </span>
      <span className="font-display text-[0.7rem] font-extrabold uppercase italic tracking-[0.2em] text-racing">
        {c.name.replace(" Tyres", "")} — {of}
      </span>
    </span>
  )
}

/** what the category covers, as vehicles you can see */
function Fleet({ c }: { c: Category }) {
  if (!c.fleet) {
    return (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {c.covers.map((t) => (
          <span key={t} className="rounded-full bg-white/70 px-3.5 py-1.5 text-[0.76rem] font-medium text-slate-600 backdrop-blur-sm">
            {t}
          </span>
        ))}
      </div>
    )
  }
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {c.fleet.map((f) => (
        <div
          key={f.name}
          className="rounded-2xl border border-white/60 bg-white/55 px-3.5 pb-3 pt-2.5 shadow-[0_16px_38px_-28px_rgba(12,32,64,.5)] backdrop-blur-md"
        >
          {/* a fixed image box, so six vehicles of six different proportions
              still line their names up on one baseline */}
          <span className="flex h-[clamp(52px,8.5vh,96px)] items-end">
            <img src={f.img} alt={f.name} loading="lazy" className="max-h-full max-w-full w-auto object-contain object-bottom" />
          </span>
          <h3 className="mt-2 font-display text-[clamp(0.72rem,0.92vw,0.84rem)] font-extrabold uppercase italic leading-tight text-[#132b52]">
            {f.name}
          </h3>
          <p className="mt-1 text-[clamp(0.68rem,0.82vw,0.76rem)] font-light leading-snug text-slate-600">{f.note}</p>
        </div>
      ))}
    </div>
  )
}

/** screen one: the tyres, the name, and what it covers */
function StepHero({ c }: { c: Category }) {
  const accent = c.accent === "blue" ? "text-racing" : "text-eurored"
  const words = c.name.split(" ")
  const lead = words.slice(0, -1).join(" ")
  const tail = words[words.length - 1]
  return (
    <>
      <span className="flex items-baseline gap-3">
        <span className="font-display text-[clamp(2rem,3.6vw,3.2rem)] font-black italic leading-none text-[#132b52]/15">
          {c.n}
        </span>
        <span className="font-display text-[0.7rem] font-extrabold uppercase italic tracking-[0.2em] text-racing">
          {c.claim}
        </span>
      </span>
      {c.wordmark ? (
        /* the brand's own mark stands in for the typeset heading, sized off the
           same clamp so it carries the weight of one */
        <h2 className="mt-2.5">
          <img
            src={c.wordmark}
            alt={c.name}
            className="h-[clamp(1.7rem,3.9vw,3.2rem)] w-auto"
          />
        </h2>
      ) : (
        <h2 className="mt-1.5 font-display text-[clamp(1.9rem,4.4vw,3.7rem)] font-black uppercase italic leading-[0.92] text-[#132b52]">
          {lead} <span className={accent}>{tail}</span>
        </h2>
      )}
      <p className="mt-4 max-w-[46ch] text-[clamp(0.9rem,1.15vw,1.08rem)] font-light leading-relaxed text-slate-700">
        {c.short}
      </p>
      <span className="mt-5 flex items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#1c3a66]/70">
        What it covers <span className="h-px w-10 bg-[#1c3a66]/25" />
      </span>
      <Fleet c={c} />
    </>
  )
}

/**
 * Screen two: why it holds, and who fits it — one screen, not two.
 *
 * The three points sit on cards. Over a photographic scene, plain text on a
 * treeline is unreadable and text over sky is fine, which leaves the copy
 * hostage to whatever the parallax happens to have parked behind it; a card
 * carries its own contrast, so it reads wherever the journey puts it.
 */
function StepDetail({ c }: { c: Category }) {
  const marques = LOGOS.filter((l) => c.oem?.includes(l.name))
  return (
    <>
      <StepLabel c={c} of="Why it holds" />
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {c.points.map((p, n) => (
          <div
            key={p.k}
            className="rounded-2xl border border-white/60 bg-white/55 p-5 shadow-[0_18px_44px_-30px_rgba(12,32,64,.5)] backdrop-blur-md"
          >
            <span className="inline-flex text-racing"><PointIcon i={n} /></span>
            <h3 className="mt-2.5 font-display text-[clamp(0.86rem,1.25vw,1.08rem)] font-extrabold uppercase italic leading-tight text-[#132b52]">
              {p.k}
            </h3>
            <p className="mt-1.5 text-[clamp(0.78rem,0.95vw,0.9rem)] font-light leading-relaxed text-slate-700">
              {p.d}
            </p>
          </div>
        ))}
      </div>

      {marques.length > 0 && (
        <div className="mt-6">
          <span className="flex items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#1c3a66]/70">
            Original fitment partners <span className="h-px w-10 bg-[#1c3a66]/25" />
          </span>
          <div className="mt-3.5 flex flex-wrap items-center gap-x-[clamp(20px,3vw,44px)] gap-y-4">
            {marques.map((l) => (
              <span key={l.name} className="flex h-[clamp(22px,2.8vh,32px)] items-center">
                <img
                  src={l.src}
                  alt={l.name}
                  loading="lazy"
                  /* On the wall rather than the landscape, so this can come
                     back down from the 0.75 the mountains needed: 4.0:1 against
                     the darkest tenth of the wall, and even across the row. */
                  className="max-h-full w-auto object-contain opacity-[0.68]"
                  style={{ filter: "brightness(0)" }}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/**
 * One screen of the journey.
 *
 * The `hero` screen keeps the tyres on the left and the story on the right. The
 * continuation screens go full width instead: the tyres have already made their
 * point, and re-animating the same line-up on every screen of a category would
 * read as a stutter rather than a journey. A quiet numbered label keeps them
 * tied to the category they belong to.
 */
function StepPanel({
  step, tyreRef, copyRef,
}: {
  step: Step
  tyreRef: (el: HTMLDivElement | null) => void
  copyRef: (el: HTMLDivElement | null) => void
}) {
  const { c, kind } = step
  const id = kind === "hero" ? c.id : `${c.id}-${kind}`

  if (kind === "hero") {
    return (
      <article id={id} className="flex h-full w-screen shrink-0 items-center px-5 sm:px-10 lg:px-[5vw]">
        {/* a line-up is a wide composition and needs the room; an assembled
            group of one to three cutouts does not */}
        <div
          className={`grid w-full max-w-[1340px] items-center gap-[clamp(16px,3vw,56px)] lg:mx-auto ${
            c.lineup ? "lg:grid-cols-[1.2fr_1fr]" : "lg:grid-cols-[0.95fr_1fr]"
          }`}
        >
          <div ref={tyreRef} className="h-[32vh] will-change-transform lg:h-[66vh]">
            {c.lineup ? <TyreLineup src={c.lineup} alt={`The ${c.name.toLowerCase()} range`} /> : <TyreStage c={c} />}
          </div>
          <div ref={copyRef} className="will-change-transform">
            <StepHero c={c} />
          </div>
        </div>
      </article>
    )
  }

  /* Continuation screens sit high rather than centred. Centred puts the body
     copy straight across the mountain range and the treeline — the one band of
     the scene with any tonal detail in it, and the part the client asked to make
     visible — where navy text on blue-grey hills is hard to read. Up here it
     reads against clean pale sky, and the landscape below is left to be looked
     at. */
  return (
    <article
      id={id}
      /* Nudged down so the fitment row lands on the parapet wall (client
         direction). The wall is the one clean, uniform surface in the scene —
         luminance 155 to 193 against the mountains' 61 to 251 — so unpanelled
         logos read consistently across the whole row there, which they never
         did over the treeline. `pt` rather than `pb` because with items-center
         a top inset moves the block down by half of it: 5vh puts the row's
         centre within 2px of the wall's centre at both 1440x900 and 1920x1000. */
      className="flex h-full w-screen shrink-0 items-center px-5 sm:px-10 lg:px-[5vw] lg:pt-[5vh]"
    >
      <div ref={copyRef} className="mx-auto w-full max-w-[1340px] will-change-transform">
        <StepDetail c={c} />
      </div>
    </article>
  )
}
/* How fast each layer travels, as a fraction of the foreground's travel. The
   spread between them IS the depth: at 0.10 the sky barely drifts while the
   terrace under the tyres runs away beneath them.

   The journey is measured in STEPS, not categories — two-wheeler alone is three
   screens — so the travel grows every time a category gains one, and each layer
   has to stay wide enough to cover the viewport plus its own share of it. */
const N = STEPS.length
const TRAVEL_VW = (N - 1) * 100

const RATE = {
  /* The far band is a single unrepeated photograph FAR_SPAN_VW wide, so how
     fast it can travel is capped by how much of it is spare. 0.10 is the target
     from the brief and holds to six screens; past that it eases off rather than
     running out mid-journey and showing bare sky. Widening the source plate is
     what would restore it. */
  far: Math.min(0.1, (FAR_SPAN_VW - 100) / TRAVEL_VW),
  trees: 0.22,
  apron: 0.65,
  stage: 1,
}

/**
 * The five categories as one continuous cinematic journey.
 *
 * Vertical scroll drives a pinned stage sideways through four layers moving at
 * four rates, over one unbroken landscape: the sky and distant city drift at
 * 10%, a ridgeline at 22%, the concrete platform at 65%, and the tyres and
 * their copy travel at full rate on top. The camera also pushes very slowly
 * into the scene across the whole journey.
 *
 * Each category runs its own three stages off its distance from centre: the
 * tyres arrive from the right and settle, the copy slides up beside them, then
 * both leave to the left as the next category arrives.
 *
 * GSAP owns every transform here. `scrub: 1` is what supplies the inertia —
 * the stage takes about a second to catch the scrollbar, so a flicked trackpad
 * glides instead of snapping — while scrolling itself stays native. There is no
 * smooth-scroll library: feedback from an earlier build was that hijacked
 * scrolling failed on a Mac trackpad.
 *
 * Below 1024px, or under `prefers-reduced-motion`, nothing is pinned and no
 * ScrollTrigger is created at all — the panels simply stack.
 */
function ProductJourney() {
  const wrap = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const far = useRef<HTMLDivElement>(null)
  const trees = useRef<HTMLDivElement>(null)
  const apron = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLSpanElement>(null)
  const tyres = useRef<(HTMLDivElement | null)[]>([])
  const copies = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [horizontal, setHorizontal] = useState(false)
  const reduce = useReducedMotion()
  const n = N

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const sync = () => setHorizontal(mq.matches && !reduce)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [reduce])

  useEffect(() => {
    if (!horizontal) return
    gsap.registerPlugin(ScrollTrigger)

    /* everything built inside the context is reverted in one call on unmount:
       tweens killed, ScrollTriggers destroyed, the pin spacer removed, and the
       inline transforms cleared off the layers */
    const ctx = gsap.context(() => {
      /* read at refresh rather than at build, so a resize recomputes it */
      const travel = () => (n - 1) * window.innerWidth
      let at = -1

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => "+=" + (n - 1) * window.innerHeight,
          pin: stage.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) {
              progress.current.style.transform = `scaleX(${self.progress})`
            }
            /* only re-render when the category actually changes */
            /* the tab follows the category the current step belongs to */
            const i = CATEGORY_OF_STEP[Math.round(self.progress * (n - 1))]
            if (i !== at) {
              at = i
              setActive(i)
            }
          },
        },
      })

      /* one unit of timeline per category step, so category i sits at time i */
      const span = n - 1

      tl.to(far.current, { x: () => -travel() * RATE.far, duration: span }, 0)
        .to(far.current, { scale: 1.05, duration: span }, 0)   // the camera push
        .to(trees.current, { x: () => -travel() * RATE.trees, duration: span }, 0)
        .to(apron.current, { x: () => -travel() * RATE.apron, duration: span }, 0)
        .to(track.current, { x: () => -travel() * RATE.stage, duration: span }, 0)

      STEPS.forEach((step, i) => {
        const tyre = tyres.current[i]      // only the hero screens carry tyres
        const copy = copies.current[i]
        if (!copy) return

        /* A fade belongs at a category boundary, not between the screens of one
           category. Two-wheeler's second screen continues the first: it should
           simply travel into view, because fading one screen of a category out
           while the next fades in reads as two separate things — which is
           exactly what it looked like. Within a category the horizontal travel
           IS the transition. */
        const cat = CATEGORY_OF_STEP[i]
        const enters = i > 0 && CATEGORY_OF_STEP[i - 1] !== cat
        const leaves = i < n - 1 && CATEGORY_OF_STEP[i + 1] !== cat

        /* a line-up is several tyres lit as one composition with their shadows
           baked in — tilting it would tilt five shadows off their contact
           patches, so only single cutouts get the rotation */
        const tilt = step.c.lineup ? 0 : 1

        if (enters) {
          if (tyre) {
            tl.fromTo(
              tyre,
              { xPercent: 34, rotate: 5 * tilt, scale: 0.94, opacity: 0 },
              { xPercent: 0, rotate: 0, scale: 1, opacity: 1, duration: 0.55, ease: "power2.out" },
              i - 0.58
            )
          }
          tl.fromTo(
            copy,
            { x: 74, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            i - 0.5
          )
        }
        if (leaves) {
          if (tyre) {
            tl.to(
              tyre,
              { xPercent: -26, rotate: -4 * tilt, scale: 0.96, opacity: 0, duration: 0.55, ease: "power2.in" },
              i + 0.08
            )
          }
          tl.to(
            copy,
            { x: -62, opacity: 0, duration: 0.48, ease: "power2.in" },
            i + 0.1
          )
        }
      })

      /* the ambient drift the brief asks for, on the single cutouts only and on
         the image rather than the wrapper, so it never fights the scrubbed
         transform above */
      gsap.to("[data-drift]", {
        rotate: 1.4,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 88%",
      })

      /* Measure the pin now, synchronously. ScrollTrigger would otherwise do it
         on its next tick, which leaves the section pinned with no scroll
         distance at all until a frame has been painted — and this route is
         code-split, so it mounts well after the page did. Then measure again on
         load: the panels are full of images that settle late (the landscape
         plate, the platform tile, the tyre line-ups) and each one moves the
         document under the trigger. */
      ScrollTrigger.refresh()
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener("load", refresh)
      return () => window.removeEventListener("load", refresh)
    }, stage)

    return () => ctx.revert()
  }, [horizontal, n])

  const goTo = (i: number) => {
    if (!horizontal) {
      document.getElementById(CATEGORIES[i].id)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      })
      return
    }
    const el = wrap.current
    if (!el) return
    const span = (n - 1) * window.innerHeight
    const top =
      window.scrollY + el.getBoundingClientRect().top +
      (STEP_OF_CATEGORY[i] / (n - 1)) * span
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
  }

  /* ---------------------------------------------------------------- nav --- */
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const underline = useRef<HTMLSpanElement>(null)
  const nav = useRef<HTMLDivElement>(null)

  /* the underline is one bar that slides between labels rather than a border
     per label, so the movement itself shows which way the journey went */
  useEffect(() => {
    const el = tabRefs.current[active]
    const bar = underline.current
    if (!el || !bar) return
    gsap.to(bar, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    })
  }, [active, horizontal])

  const tabs = (
    <div
      ref={nav}
      className="pointer-events-auto mx-auto w-fit max-w-full rounded-full bg-white/70 px-2 pb-1.5 pt-2 backdrop-blur-md"
    >
      <div className="relative flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => { tabRefs.current[i] = el }}
            onClick={() => goTo(i)}
            aria-current={i === active}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.06em] transition-colors ${
              i === active ? "text-eurored" : "text-slate-500 hover:text-asphalt"
            }`}
          >
            {c.name.replace(" Tyres", "")}
          </button>
        ))}
        <span
          ref={underline}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-eurored"
        />
      </div>
      {/* how far through the whole journey we are */}
      <span aria-hidden className="mt-1.5 block h-px w-full overflow-hidden bg-asphalt/10">
        <span
          ref={progress}
          className="block h-full origin-left scale-x-0 bg-racing/70"
        />
      </span>
    </div>
  )

  /* ------------------------------------------------------- stacked, small -- */
  if (!horizontal) {
    return (
      <section className="relative" style={{ background: `linear-gradient(180deg, ${SKY_STOPS})` }}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28"
          style={{ background: `linear-gradient(180deg, rgb(${SKY_RGB}) 0%, rgba(${SKY_RGB},.55) 42%, rgba(${SKY_RGB},0) 100%)` }}
        />
        <div className="sticky top-[58px] z-30 px-4 py-3">{tabs}</div>
        {STEPS.map((step) => (
          <div key={`${step.c.id}-${step.kind}`} className="relative overflow-hidden py-12">
            <img src={SCENE} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-white/78" />
            <div className="relative">
              <StepPanel step={step} tyreRef={() => {}} copyRef={() => {}} />
            </div>
          </div>
        ))}
      </section>
    )
  }

  /* ------------------------------------------------------------- pinned --- */
  /* viewport + own travel, rounded up, so no layer ever runs short */
  /* Each band is rendered at the same scale — the far band spans 150vw, and the
     mirrored bands are twice the asset width so they span 300vw at that same
     scale — which is what keeps the one photograph's proportions intact across
     three layers moving at three speeds. All three comfortably clear the width
     they need (viewport + own travel): 140, 188 and 360vw. */
  /* The treeline band is the SAME photograph as the far band, mirrored, so it
     has to render at the same scale or the plate's proportions break between
     layers — sizing it to its own travel instead made it 27% small, which put a
     second, undersized treeline below the one already in the far band. Its
     width is therefore fixed at twice the far band's span, which is the
     mirrored asset at that scale; the assertion is that this still covers its
     travel (needs 100 + 0.22 x travel).

     The apron is a repeating background sized by height, so its scale is set by
     the layer's height and its width really can follow the travel. */
  const LAYER_W = {
    far: FAR_SPAN_VW,
    trees: FAR_SPAN_VW * 2,
    apron: Math.ceil(100 + RATE.apron * TRAVEL_VW) + 10,
  }

  return (
    <section ref={wrap} className="relative">
      <div
        ref={stage}
        className="relative h-screen overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${SKY_STOPS})` }}
      >
        {/* layer 1 — sky, mountains, distant city. 10%, and very slightly
            softened: the plate is already hazy back there, so this is the last
            touch of depth of field rather than the whole of it. Its top is
            feathered in the asset, so it dissolves into the sky gradient behind
            instead of ending on a line. */}
        <div
          ref={far}
          aria-hidden
          className="pointer-events-none absolute left-0 will-change-transform"
          style={{
            width: `${LAYER_W.far}vw`,
            /* lifted off the horizon by the gap between where this band ends and
               where the treeline band ends, or the mountains sit behind the
               parapet — see FAR_LIFT_VW */
            bottom: `calc(${100 - HORIZON}% + ${FAR_LIFT_VW}vw)`,
          }}
        >
          <img src={FAR} alt="" className="block w-full" />
        </div>

        {/* layer 2 — the treeline and the parapet, 22%. This is the band the
            brief asks to move at a fifth: it sits between the mountains and the
            ground, and it is the layer whose relative drift you actually read
            as distance. */}
        <div
          ref={trees}
          aria-hidden
          className="pointer-events-none absolute left-0 will-change-transform"
          style={{ width: `${LAYER_W.trees}vw`, bottom: `${100 - HORIZON}%` }}
        >
          <img src={TREES} alt="" className="block w-full" />
        </div>

        {/* layer 3 — the terrace, 65%. It runs away under the tyres, and that
            gap against the 10% sky is what reads as travel. Repeated rather
            than stretched: the asset is mirrored, so it ends on the column it
            starts on and tiles without a seam. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
          style={{ top: `${HORIZON}%` }}
        >
          <div
            ref={apron}
            className="absolute inset-y-0 left-0 will-change-transform"
            style={{
              width: `${LAYER_W.apron}vw`,
              backgroundImage: `url(${APRON})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
            }}
          />
        </div>

        {/* One faint vignette, and nothing else. The plate is high key and the
            sky ramps into warm haze at the horizon, so the navy copy already
            has the contrast it needs — an earlier pass carried a white bloom to
            lift it off a much darker blue, and over this plate that bloom just
            bleached the mountains and the terrace out of the picture. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(124% 82% at 50% 36%, transparent 52%, rgba(17,36,66,.10) 100%)" }}
        />

        {/* layer 4 — the panels and their tyres, full rate */}
        <div ref={track} className="relative flex h-full will-change-transform">
          {STEPS.map((step, i) => (
            <StepPanel
              key={`${step.c.id}-${step.kind}`}
              step={step}
              tyreRef={(el) => { tyres.current[i] = el }}
              copyRef={(el) => { copies.current[i] = el }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[74px] z-20 px-4">{tabs}</div>
      </div>
    </section>
  )
}
/* ------------------------------------------------------------------ page --- */
export function Products() {
  const { path, navigate } = useRouter()
  const [video, setVideo] = useState<PlayTarget | null>(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [path])

  useEffect(() => {
    if (!video) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [video])

  return (
    <main>
      {/* hero */}
      <div className="relative overflow-x-clip" style={{ background: `linear-gradient(180deg, ${HERO_STOPS})` }}>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
          eyebrow="The range"
          title={<>One specialist.<br />Five categories.</>}
          lede="Two-wheeler, three-wheeler, ultra-light truck, off-highway and Supergrip — engineered in Madurai, designed in Milan, sold in over 125 countries. What is on the shelf is set market by market, so this is what each category covers and who it is for."
          /* the dotted map sits right behind this lede and swallows it — the
             copy here is longer than on the other page heroes */
          dots={false}
          /* top of the column, not its middle, so the line-up sits high in the
             banner and the copy stays the thing you read first */
          asideAlign="start"
          aside={<CategoryCarousel />}
          pad="pb-[clamp(44px,7vh,80px)] pt-[clamp(104px,15vh,144px)]"
        />
      </div>

      {/* the five categories, as one horizontal journey */}
      <ProductJourney />

      {/* what to do next, in place of a catalogue */}
      <section className="border-t border-black/[0.07] bg-white py-[clamp(56px,9vh,116px)] text-asphalt">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <SectionHead
            light
            eyebrow="Availability"
            title={<>The range differs<br />market by market</>}
            lede="Sizes, homologations and what is actually in stock are set regionally. Three ways to get to the right answer for yours."
            className="mb-[clamp(28px,4.5vh,48px)] max-w-none"
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {ROUTES.map((r, i) => (
              <Reveal key={r.k} i={i}>
                <div className="flex h-full flex-col rounded-2xl border border-black/10 bg-mist p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-racing shadow-[0_10px_26px_-14px_rgba(6,18,38,.5)]">
                    <RouteIcon name={r.icon} />
                  </span>
                  <h3 className="mt-4 font-display text-[1.02rem] font-black uppercase italic leading-tight text-asphalt">{r.k}</h3>
                  <p className="mt-2 text-[0.86rem] font-light leading-relaxed text-slate-600">{r.d}</p>
                  <a
                    href={r.cta.href}
                    onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate(r.cta.href) } }}
                    className="mt-auto pt-5 font-display text-[0.78rem] font-extrabold uppercase italic tracking-wide text-racing transition-colors hover:text-eurored"
                  >
                    {r.cta.label} →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* proof instead of a product list */}
      <section className="bg-mist py-[clamp(48px,8vh,96px)] text-asphalt">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <SectionHead
            light
            eyebrow="Certified worldwide"
            title={<>Homologated for the<br />markets they ride in</>}
            lede="Every market sets its own bar. Our tyres are certified to the standards of the regions they are sold in."
            className="mb-[clamp(24px,4vh,40px)] max-w-none"
          />
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {CERTS.map((c, i) => (
              <Reveal key={c.name} i={i % 4}>
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-5 text-center">
                  <span className="grid h-12 place-items-center text-asphalt">
                    {c.img ? <img src={c.img} alt={c.name} loading="lazy" className="max-h-11 w-auto" /> : <E4Mark />}
                  </span>
                  <span className="mt-2 font-display text-[0.7rem] font-extrabold uppercase italic tracking-wide text-slate-500">{c.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* what the market made of them — a field of tiles in 3D with the copy
          standing still in the middle, from the client's screen recording of
          the "Made with Squarespace" section. Dark, which is the reference's
          own answer to putting white copy over imagery, and it hands straight
          over to the footer below. */}
      <section className="text-white">
        <ReviewWall items={WALL_REVIEWS} onPlay={setVideo}>
          <Reveal>
            <span className="inline-flex items-center gap-2 font-display text-[0.78rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">
              <span className="h-[2px] w-6 bg-eurored" />
              Reviews &amp; testimonials
            </span>
          </Reveal>
          <Reveal i={1}>
            <h2 className="italic-display mt-3 text-[clamp(1.55rem,3.4vw,2.6rem)] leading-[1.02] text-white">
              Tested by the press,<br />proved in the field
            </h2>
          </Reveal>
          <Reveal i={2}>
            <div className="mt-7 flex justify-center">
              <Btn href="/reviews" variant="line">View all reviews <Arrow /></Btn>
            </div>
          </Reveal>
        </ReviewWall>
      </section>

      <SiteFooter />

      <AnimatePresence>
        {video && <VideoLightbox target={video} onClose={() => setVideo(null)} />}
      </AnimatePresence>
    </main>
  )
}
