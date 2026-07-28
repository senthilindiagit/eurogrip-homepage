import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * A tyre track laid across a light section — a brand design element that
 * doubles as a mark of the distance our people put in.
 *
 * The tread is two staggered rows of lugs stroked along the same curve
 * (offset vertically, which approximates a parallel offset well on a gentle
 * arc) plus a thin shoulder rib either side. A mask with an animated
 * stroke-dashoffset reveals it left to right, as though a wheel just rolled
 * through. `pathLength={1}` normalises the curve so the reveal is exact
 * regardless of the path's real length.
 *
 * The viewBox is a shallow band so the caller can anchor it to the bottom of
 * a section and have it stay put across viewport sizes.
 */

/* enters off-canvas left, dips, then climbs away to the right */
const CURVE = "M -70 196 C 250 132 520 188 790 124 C 1020 70 1210 52 1520 8"

export function TyreTrack({
  className,
  colour = "#0d1014",
  opacity = 0.16,
  delay = 0.55,
  id = "tyre-track",
}: {
  className?: string
  colour?: string
  opacity?: number
  delay?: number
  /** unique per instance — masks are referenced by id */
  id?: string
}) {
  const reduce = useReducedMotion()
  const revealId = `${id}-reveal`
  const fadeId = `${id}-fade`

  /* fine block tread — two rows, second offset by half a step */
  const lug = { fill: "none", stroke: colour, strokeWidth: 13, strokeDasharray: "7 9" } as const

  return (
    <svg
      aria-hidden
      /* aspect matches the viewBox, so the band never crops and the end
         fades stay on screen at every width */
      className={cn("pointer-events-none absolute aspect-[6/1]", className)}
      viewBox="0 0 1440 240"
      style={{ opacity }}
    >
      <defs>
        {/* soft ends, so the track emerges and dissolves instead of being cut off */}
        <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1="0" x2="1440">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.14" stopColor="#fff" />
          <stop offset="0.72" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
      </defs>

      <mask id={revealId}>
        <motion.path
          d={CURVE}
          fill="none"
          stroke={`url(#${fadeId})`}
          strokeWidth={70}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          initial={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.1, ease: [0.22, 0.7, 0.3, 1], delay }}
        />
      </mask>

      <g mask={`url(#${revealId})`}>
        {/* contact-patch smudge under the lugs */}
        <path d={CURVE} fill="none" stroke={colour} strokeWidth={30} opacity={0.14} />
        {/* two staggered rows of tread blocks */}
        <path {...lug} d={CURVE} transform="translate(0,-7.5)" />
        <path {...lug} d={CURVE} strokeDashoffset={8} transform="translate(0,7.5)" />
        {/* shoulder ribs */}
        <path d={CURVE} fill="none" stroke={colour} strokeWidth={1.6} opacity={0.5} transform="translate(0,-15)" />
        <path d={CURVE} fill="none" stroke={colour} strokeWidth={1.6} opacity={0.5} transform="translate(0,15)" />
      </g>
    </svg>
  )
}
