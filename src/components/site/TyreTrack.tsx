import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import trackMask from "@/assets/brand/tyre-track.webp"

/**
 * A tyre track laid across a light section — a brand design element that
 * doubles as a mark of the distance our people put in.
 *
 * Artwork: Magnific/Freepik item 171914983 by starline, Pro licence —
 * see licenses/tyre-track-171914983.pdf.
 *
 * The artwork ships as a greyscale matte used as a CSS mask rather than a
 * flat image, so the ink colour is a prop (any section can tint it) and the
 * asset stays half the size of an RGBA export. It wipes on bottom to top as
 * the section loads — from the near end away towards the vanishing point, as
 * though a wheel just rolled off into the distance.
 */
export function TyreTrack({
  className,
  colour = "#13223c",
  opacity = 0.12,
  delay = 0.5,
}: {
  className?: string
  colour?: string
  opacity?: number
  delay?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute aspect-[1400/1351]", className)}
      style={{
        backgroundColor: colour,
        /* two mask layers intersected: the artwork, and a gradient that fades
           both ends so the track dissolves instead of being cut off */
        WebkitMaskImage: `url(${trackMask}), linear-gradient(to top right, transparent 3%, #000 30%, #000 70%, transparent 96%)`,
        maskImage: `url(${trackMask}), linear-gradient(to top right, transparent 3%, #000 30%, #000 70%, transparent 96%)`,
        WebkitMaskSize: "100% 100%, 100% 100%",
        maskSize: "100% 100%, 100% 100%",
        WebkitMaskRepeat: "no-repeat, no-repeat",
        maskRepeat: "no-repeat, no-repeat",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
      initial={reduce ? { opacity } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
      animate={{ opacity, clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: 1.9, ease: [0.22, 0.7, 0.3, 1], delay }}
    />
  )
}
