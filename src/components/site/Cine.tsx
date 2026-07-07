import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

/**
 * Cinematic 3D scroll panel. Each section enters tilted back in perspective —
 * like a billboard lying on the road ahead — then rises and stands up flat as
 * it reaches the viewport. One shared signature move for the whole page.
 */
export function Cine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.38"] })

  const rotateX = useTransform(scrollYProgress, [0, 1], [9, 0])
  const y = useTransform(scrollYProgress, [0, 1], [70, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0.4, 1])

  if (reduce) return <div ref={ref}>{children}</div>

  return (
    <div ref={ref}>
      <motion.div
        style={{
          rotateX,
          y,
          scale,
          opacity,
          transformPerspective: 1300,
          transformOrigin: "50% 85%",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
