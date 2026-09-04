import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { PRODUCTS } from "@/lib/site-data"
import { Reveal, SectionHead } from "./ui"
import tyreImg from "@/assets/tyre.webp"
import tyreBadshah from "@/assets/tyre-badshah.webp"
import tyreToofan from "@/assets/tyre-toofan.webp"
import tyreHs1000 from "@/assets/tyre-hs1000.webp"
import tyreMt63l from "@/assets/tyre-mt63l.webp"
import motorbikeSvg from "@/assets/products/motorbike.svg?raw"
import tuktukSvg from "@/assets/products/tuktuk.svg?raw"
import truckSvg from "@/assets/products/truck.svg?raw"
import tractorSvg from "@/assets/products/tractor.svg?raw"
import forkliftSvg from "@/assets/products/forklift.svg?raw"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* client-supplied vehicle icons — used large and faint behind each tyre */
const ICONS = [motorbikeSvg, tuktukSvg, truckSvg, tractorSvg, forkliftSvg]

/* the real Eurogrip product shot for each category */
const SHOTS = [tyreImg, tyreBadshah, tyreToofan, tyreHs1000, tyreMt63l]
/* the two-wheeler shot is near-square while the rest are tall, so it needs more
   height to read at the same visual weight — sizing rather than a transform,
   which would fight the hover scale */
/* Sizing AND vertical seat per shot. The two-wheeler is an angled 3/4 view, so
   it stays a touch larger than the side-on tyres to carry the same weight, and
   its own offset puts all five tyres on the same baseline (~36px off the plate
   floor) rather than each being centred in a box of a different height. */
const SHOT_FIT = [
  "max-h-[80%] max-w-[92%] -translate-y-[52%]",
  "max-h-[76%] max-w-[74%] -translate-y-1/2",
]

/* Each icon carries a different amount of empty space under its artwork inside
   its own viewBox (1.4%–22.6%), so a single offset can't sit them all on the
   plate floor. These push each one down by roughly its own padding. */
const ICON_DROP = ["-bottom-[21%]", "-bottom-[15%]", "-bottom-[13%]", "-bottom-[8%]", "-bottom-[1%]"]

/* ============================== card ============================== */
function RangeCard({
  item, i,
}: { item: (typeof PRODUCTS)[number]; i: number }) {
  const href = item.href ?? "#"
  const external = /^https?:\/\//i.test(href)

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group relative flex w-[76vw] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-black/[0.07] bg-white shadow-[0_28px_60px_-40px_rgba(11,38,74,.45)] transition-all duration-500 hover:-translate-y-1.5 hover:border-racing/25 hover:shadow-[0_40px_80px_-40px_rgba(11,38,74,.55)] sm:w-[44vw] lg:w-[302px]"
    >
      {/* keyline that draws in on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-racing to-eurored transition-transform duration-500 group-hover:scale-x-100"
      />

      {/* tyre plate */}
      <div
        className="relative aspect-[302/300] overflow-hidden"
        style={{ background: "radial-gradient(115% 95% at 50% 12%, #2b5896 0%, #1a3157 52%, #13223c 100%)" }}
      >
        {/* the category's vehicle, oversized and faint */}
        <span
          aria-hidden
          className={`pointer-events-none absolute left-1/2 h-[74%] w-[88%] -translate-x-1/2 text-white/[0.09] transition-transform duration-700 group-hover:scale-105 [&_svg]:h-full [&_svg]:w-full ${ICON_DROP[i]}`}
          dangerouslySetInnerHTML={{ __html: ICONS[i] }}
        />
        {/* index */}
        <span className="absolute left-5 top-5 font-display text-[0.8rem] font-black italic tracking-wide text-white/45">
          {String(i + 1).padStart(2, "0")}
        </span>
        {/* the tyre */}
        <img
          src={SHOTS[i]}
          alt={item.title}
          loading="lazy"
          className={`absolute left-1/2 top-1/2 w-auto -translate-x-1/2 object-contain drop-shadow-[0_26px_34px_rgba(0,0,0,.55)] transition-transform duration-700 ease-out group-hover:scale-[1.07] ${SHOT_FIT[i === 0 ? 0 : 1]}`}
        />
      </div>

      {/* copy */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[1.02rem] font-black uppercase italic leading-[1.1] text-asphalt">
          {item.title}
        </h3>
        <p className="mt-2 text-[0.85rem] font-light leading-relaxed text-slate-600">{item.description}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-4 font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.06em] text-racing transition-colors group-hover:text-eurored">
          Know more
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          {external && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="ml-0.5 opacity-60" aria-hidden="true">
              <path d="M7 17L17 7M17 7h-7m7 0v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
    </a>
  )
}

/* ============================== rail ============================== */
export function ProductRange() {
  const rail = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  /* driven straight off the scroll event — no frame loop needed */
  const sync = useCallback(() => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(max > 0 && el.scrollLeft >= max - 2)
  }, [])

  useEffect(() => {
    const el = rail.current
    if (!el) return
    sync()
    el.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      el.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [sync])

  const nudge = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector("a")
    const step = card ? card.getBoundingClientRect().width + 18 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" })
  }

  const arrow = (dir: 1 | -1) => {
    const disabled = dir === -1 ? atStart : atEnd
    return (
      <button
        onClick={() => nudge(dir)}
        disabled={disabled}
        aria-label={dir === -1 ? "Previous categories" : "Next categories"}
        className="grid h-10 w-10 place-items-center rounded-full border border-black/15 text-asphalt transition-all hover:border-asphalt hover:bg-white disabled:pointer-events-none disabled:opacity-30"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d={dir === -1 ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
        </svg>
      </button>
    )
  }

  return (
    <section id="products" className="overflow-hidden bg-[#f5f6f8] py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-[clamp(28px,4vh,44px)] flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            light
            eyebrow="The range"
            /* single line only where it fits — it was being clipped on phones */
            title={<span className="text-[clamp(1.5rem,3.6vw,2.9rem)] lg:whitespace-nowrap">One specialist. A worldclass range.</span>}
            lede="Every tyre, engineered for the way each machine works."
            className="mb-0 max-w-none"
          />
          <Reveal i={2} className="hidden shrink-0 gap-2.5 lg:flex">
            {arrow(-1)}
            {arrow(1)}
          </Reveal>
        </div>
      </div>

      {/* the rail bleeds to the right edge so the next card always peeks */}
      <div className="mx-auto max-w-[1280px] pl-5 sm:pl-8">
        <motion.div
          ref={rail}
          className="flex items-stretch gap-[18px] overflow-x-auto px-2 pb-10 pt-3 pr-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:pr-8 [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: ENTER }}
        >
          {PRODUCTS.map((p, i) => (
            <RangeCard key={p.title} item={p} i={i} />
          ))}
        </motion.div>
      </div>

      {/* scroll progress */}
      <div className="mx-auto mt-7 max-w-[1280px] px-5 sm:px-8">
        <div className="relative mx-auto h-[2px] w-full max-w-[220px] overflow-hidden rounded-full bg-black/10">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-racing to-eurored transition-[width] duration-200"
            style={{ width: `${Math.max(18, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  )
}
