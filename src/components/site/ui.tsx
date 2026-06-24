import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, animate, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

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
  variant?: "red" | "blue" | "line"
  className?: string
}) {
  const styles = {
    red: "bg-eurored text-white shadow-[0_10px_30px_-10px_rgba(237,28,36,.6)] hover:-translate-y-0.5",
    blue: "bg-racing text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(0,84,166,.7)]",
    line: "border border-white/40 text-white hover:border-white hover:bg-white/5",
  }[variant]
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-[3px] px-7 py-3.5 font-display italic font-extrabold uppercase tracking-[0.04em] text-[0.95rem] transition-all duration-300",
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
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal i={1}>
        <h2
          className={cn(
            "italic-display leading-[0.94] mt-3 text-[clamp(2.1rem,5.4vw,4.4rem)]",
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
              "mt-4 text-[clamp(1.02rem,1.6vw,1.25rem)] max-w-[60ch]",
              light ? "text-slate-600" : "text-slate-300"
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
  className,
}: {
  children: ReactNode
  speed?: number
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={cn("group flex overflow-hidden [--gap:3rem]", className)} style={{ gap: "var(--gap)" }}>
      {[0, 1].map((k) => (
        <div
          key={k}
          className="flex shrink-0 items-center justify-around [gap:var(--gap)] animate-marquee group-hover:[animation-play-state:paused]"
          style={{
            ["--duration" as any]: `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
            paddingRight: "var(--gap)",
          }}
          aria-hidden={k === 1}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
