import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Crossfades a set of photos in place, like a slow looping clip.
 *
 * Every frame runs the same keyframes with a staggered negative delay, so the
 * whole thing is pure CSS — no timers, no re-renders, and it keeps playing
 * while the rest of the page animates. The keyframes are generated from the
 * frame count so any number of images works.
 */
export function PhotoCycle({
  images,
  alt,
  cycle = 12,
  className,
}: {
  images: string[]
  /** describes the sequence — the frames after the first are decorative */
  alt: string
  /** seconds for one full pass through every frame */
  cycle?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const n = images.length
  const still = reduce || n < 2

  const slot = 100 / n
  const name = `photo-cycle-${n}`
  /* visible for most of its slot, then a short crossfade either side */
  const keyframes =
    `@keyframes ${name}{` +
    `0%,${(slot * 0.8).toFixed(2)}%{opacity:1}` +
    `${slot.toFixed(2)}%,${(100 - slot * 0.2).toFixed(2)}%{opacity:0}` +
    `100%{opacity:1}}`

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!still && <style>{keyframes}</style>}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          aria-hidden={i > 0}
          loading={i === 0 ? undefined : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
          style={
            still
              ? { opacity: i === 0 ? 1 : 0 }
              : {
                  animation: `${name} ${cycle}s ease-in-out infinite`,
                  animationDelay: `${-((i * cycle) / n).toFixed(2)}s`,
                }
          }
        />
      ))}
    </div>
  )
}
