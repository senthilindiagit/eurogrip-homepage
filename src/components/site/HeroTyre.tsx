import { useEffect, useState } from "react"
import { motion, useMotionValue, animate, useReducedMotion } from "framer-motion"
import f0 from "@/assets/tyre-frame-0.webp" // edge-on (side)
import f1 from "@/assets/tyre-frame-1.webp"
import f2 from "@/assets/tyre-frame-2.webp"
import f3 from "@/assets/tyre-frame-3.webp"
import f4 from "@/assets/tyre-frame-4.webp" // face-on

const FRAMES = [f0, f1, f2, f3, f4]
const EASE = [0.16, 0.84, 0.34, 1] as const

/**
 * Sticky tyre. On load it acts as a loader — the side-angle tyre rotates in the
 * centre alone, then settles to the right (after which the nav/text appear).
 * It then sticks down the right edge through the hero + "Hold a higher standard"
 * promise section, spinning on scroll, and scrolls away normally afterwards.
 */
export function HeroTyre() {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const scale = useMotionValue(0.66)
  const opacity = useMotionValue(0)
  const rotate = useMotionValue(0)
  const [frame, setFrame] = useState(0)

  const rightX = () => Math.min(window.innerWidth * 0.3, 540)

  // intro: spin in centre (loader) → settle right
  useEffect(() => {
    if (reduce) { opacity.set(1); scale.set(1); x.set(rightX()); setFrame(4); return }
    const ctrls = [
      animate(opacity, 1, { duration: 0.4, ease: EASE }),
      animate(scale, 1, { duration: 0.5, ease: EASE }),
      // loader: rotate the tyre (turntable edge → face) in the centre
      animate(0, 1, { duration: 1.1, delay: 0.35, ease: "easeInOut", onUpdate: (v) => setFrame(Math.min(4, Math.round(v * 4))) }),
      // then settle to the right
      animate(x, rightX(), { duration: 0.9, delay: 1.45, ease: EASE }),
    ]
    return () => ctrls.forEach((c) => c.stop())
  }, [reduce])

  // scroll: spin downward through the hero, then freeze once parked above OUTDO
  useEffect(() => {
    if (reduce) return
    const onScroll = () => {
      const cap = window.innerHeight * 0.85 // stop spinning once it settles into the promise
      rotate.set(Math.min(window.scrollY, cap) * 0.11)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [reduce])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[15] hidden md:block">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.div
          style={{ x, scale, rotate, opacity, width: "min(46vw,500px)", filter: "drop-shadow(0 40px 70px rgba(0,0,0,.6))" }}
          className="relative aspect-square"
        >
          {FRAMES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full"
              style={{ opacity: i === frame ? 1 : 0, transition: "opacity .1s linear" }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
