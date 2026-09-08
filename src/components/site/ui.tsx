import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, animate, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "@/lib/router"

/* ---------- Scroll reveal ---------- */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 0.84, 0.34, 1], delay: i * 0.08 },
  }),
}

export function Reveal({
  children,
  i = 0,
  className,
  as = "div",
}: {
  children: ReactNode
  i?: number
  className?: string
  as?: "div" | "span" | "li"
}) {
  const MotionTag = (motion as any)[as]
  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      custom={i}
    >
      {children}
    </MotionTag>
  )
}

/* ---------- Count-up number ---------- */
export function Counter({
  to,
  suffix = "",
  className,
}: {
  to: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 0.84, 0.34, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  )
}

/* ---------- Eyebrow label ---------- */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display italic font-extrabold uppercase tracking-[0.16em] text-[0.78rem] text-eurored",
        className
      )}
    >
      <span className="h-[2px] w-6 bg-eurored" />
      {children}
    </span>
  )
}

/* ---------- Branded buttons ---------- */
export function Btn({
  children,
  href = "#",
  variant = "red",
  className,
}: {
  children: ReactNode
  href?: string
  variant?: "red" | "blue" | "line" | "line-dark"
  className?: string
}) {
  const styles = {
    red: "bg-eurored text-white shadow-[0_10px_30px_-10px_rgba(237,28,36,.6)] hover:-translate-y-0.5",
    blue: "bg-racing text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(10,110,216,.7)]",
    line: "border border-white/40 text-white hover:border-white hover:bg-white/5",
    "line-dark": "border border-asphalt/40 text-asphalt hover:border-asphalt hover:bg-black/5",
  }[variant]
  const { navigate } = useRouter()
  // route internal links through the SPA router; external URLs open in a new window
  const isRoute = href.startsWith("/")
  const isExternal = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (isRoute && !e.metaKey && !e.ctrlKey) {
          e.preventDefault()
          navigate(href)
        }
      }}
      className={cn(
        "group inline-flex items-center gap-2 rounded-[3px] px-6 py-3 font-display italic font-extrabold uppercase tracking-[0.04em] text-[0.86rem] transition-all duration-300",
        styles,
        className
      )}
    >
      {children}
    </a>
  )
}

export function Arrow() {
  return (
    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
  )
}

/* ---------- Section heading block ---------- */
export function SectionHead({
  eyebrow,
  title,
  lede,
  light = false,
  className,
  ledeClassName,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  light?: boolean
  className?: string
  ledeClassName?: string
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal i={1}>
        <h2
          className={cn(
            "italic-display leading-[0.98] mt-3 text-[clamp(1.7rem,3.8vw,2.9rem)]",
            light ? "text-asphalt" : "text-white"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal i={2}>
          <p
            className={cn(
              "mt-4 max-w-[58ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed",
              light ? "text-slate-600" : "text-slate-300",
              ledeClassName
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* ---------- Marquee (CSS-driven, brand-built) ---------- */
export function Marquee({
  children,
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  vertical = false,
  className,
}: {
  children: ReactNode
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
  /** drift up the column instead of along the row */
  vertical?: boolean
  className?: string
}) {
  /* Two identical passes, and the keyframe moves one by its own height (or
     width) plus the gap — which is what makes the loop seamless. The second
     pass is aria-hidden so a screen reader hears the list once. */
  return (
    <div
      className={cn(
        "group flex overflow-hidden",
        vertical ? "flex-col [--gap:1rem]" : "[--gap:3rem]",
        className
      )}
    >
      {[0, 1].map((k) => (
        <div
          key={k}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "flex-col animate-marquee-vertical" : "items-center animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            /* a wall of cards drifting past is exactly what reduced motion is
               asking us not to do; it still reads as a wall standing still */
            "motion-reduce:animate-none"
          )}
          style={{
            ["--duration" as any]: `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
            [vertical ? "paddingBottom" : "paddingRight"]: "var(--gap)",
          }}
          aria-hidden={k === 1}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
