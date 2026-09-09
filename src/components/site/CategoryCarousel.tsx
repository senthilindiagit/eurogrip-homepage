import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CATEGORIES } from "@/lib/products"

/** how long each category holds before the next one takes over */
const DWELL = 3600
/** the cross-over itself — long, because a slow hand-off is what reads as premium */
const TRAVEL = 1.15
/** how far a slide sits off-centre at each end of its journey, in its own widths */
const THROW = 38
/* A long deceleration: quick to leave the edge, almost stopped by the time it
   reaches centre. A symmetrical ease makes the same move look mechanical. */
const EASE = [0.22, 0.61, 0.36, 1] as const

const SLIDES = CATEGORIES.filter((c) => c.slide)

/**
 * The products hero carousel: the five category line-ups, one at a time.
 *
 * Each slide enters from the left at zero opacity, settles at centre at full
 * opacity, then carries on out to the right as it fades — and the next one
 * starts its entrance at the same moment, so the two cross rather than
 * alternate. That simultaneity is the whole effect, and it is why this uses
 * AnimatePresence in `sync` mode: the default `wait` would hold the incoming
 * slide until the outgoing one had finished and the hero would sit empty
 * between categories.
 *
 * The ticks are buttons, not decoration. Content that moves on its own for
 * longer than five seconds needs a way to stop it (WCAG 2.2.2), and picking a
 * category is the natural form of that here — it stops the rotation and stays
 * where the reader put it.
 */
export function CategoryCarousel() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [held, setHeld] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (held) return
    const tick = () => setI((n) => (n + 1) % SLIDES.length)
    // a background tab should not be running a carousel
    const start = () => {
      window.clearInterval(timer.current)
      if (!document.hidden) timer.current = window.setInterval(tick, DWELL)
    }
    start()
    document.addEventListener("visibilitychange", start)
    return () => {
      window.clearInterval(timer.current)
      document.removeEventListener("visibilitychange", start)
    }
  }, [held])

  const c = SLIDES[i]

  return (
    <div className="select-none">
      {/* the stage. overflow-hidden so a slide leaves the frame rather than
          drifting across the rest of the hero; the aspect is fixed so nothing
          below it moves as the images swap */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.img
            key={c.id}
            src={c.slide}
            alt={`The ${c.name.toLowerCase()} range`}
            width={1200}
            height={675}
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: `-${THROW}%`, scale: 0.965 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: "0%", scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: `${THROW}%`, scale: 0.965 }}
            transition={{ duration: reduce ? 0.5 : TRAVEL, ease: EASE }}
          />
        </AnimatePresence>
      </div>

      {/* which category is up, and the way to take control of it */}
      <div className="mt-4 flex items-center gap-4">
        {/* No AnimatePresence on the label, deliberately. In `wait` mode it holds
            the incoming name until the outgoing one has finished leaving, so if
            an exit animation never completes — a stalled ticker, a tab that was
            hidden at the wrong moment — the label sticks on the wrong category
            for good. Remounting on the key animates the new name in and needs no
            exit at all, so the worst case is a name that appears without a
            transition rather than one that never appears. */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <motion.span
            key={c.id}
            className="flex items-baseline gap-2.5"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <span className="font-display text-[0.72rem] font-black italic text-eurored">
              {c.n}
            </span>
            <span className="truncate font-display text-[0.86rem] font-extrabold uppercase italic tracking-[0.06em] text-white">
              {c.name}
            </span>
          </motion.span>
        </div>

        {/* The bar is 6px tall because that is what looks right; the button
            around it is padded out to a 24px target because that is what a
            thumb needs (WCAG 2.5.8). Padding rather than a bigger bar, so the
            two requirements do not have to fight. */}
        <div role="tablist" aria-label="Product categories" className="-mr-2 flex shrink-0">
          {SLIDES.map((s, n) => {
            const on = n === i
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={on}
                aria-label={s.name}
                onClick={() => { setHeld(true); setI(n) }}
                className="group grid place-items-center px-2 py-3"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    on ? "w-7 bg-eurored" : "w-3 bg-white/25 group-hover:bg-white/50"
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
