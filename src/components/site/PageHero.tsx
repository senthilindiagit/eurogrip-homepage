import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import { Reveal } from "./ui"
import { useRouter } from "@/lib/router"
import worldDots from "@/assets/about/world-dots.webp"

const ENTER = [0.16, 0.84, 0.34, 1] as const

export type Crumb = { label: string; href?: string }

/**
 * Shared inner-page hero — breadcrumb, eyebrow pill, headline, lede and an
 * optional right-hand slot. Data-driven so any page (and later a CMS) can
 * feed it: <PageHero crumbs={...} eyebrow="…" title={…} lede="…" />
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  aside,
  asideAlign = "center",
  below,
  dots = true,
  className,
}: {
  crumbs: Crumb[]
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  aside?: ReactNode
  /** vertical alignment of the aside against the text column */
  asideAlign?: "center" | "start"
  /** extra content under the text column, inside the same grid row */
  below?: ReactNode
  dots?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const { navigate } = useRouter()

  return (
    <section className={`relative overflow-hidden pb-[clamp(70px,11vh,120px)] pt-[clamp(120px,19vh,170px)] ${className ?? ""}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 55% at 82% 4%, rgba(255,255,255,.26), transparent 60%)" }} />
      {dots && (
        <img
          src={worldDots}
          aria-hidden
          alt=""
          className="pointer-events-none absolute right-0 top-1/2 hidden w-[92%] max-w-[1240px] -translate-y-1/2 opacity-[0.15] mix-blend-screen lg:block"
        />
      )}
      <div className={`relative mx-auto grid max-w-[1280px] gap-[clamp(32px,5vw,72px)] px-5 sm:px-8 ${asideAlign === "start" ? "items-stretch" : "items-center"} ${aside ? "lg:grid-cols-[1.05fr_1fr]" : ""}`}>
        <div className="relative z-10">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[0.78rem] font-medium text-slate-300">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <a
                      href={c.href}
                      onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate(c.href!) } }}
                      className="transition-colors hover:text-white"
                    >
                      {c.label}
                    </a>
                  ) : (
                    <span className="text-white">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span className="text-white/40">›</span>}
                </span>
              ))}
            </nav>
          </Reveal>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-white">
              <span className="h-[2px] w-5 bg-eurored" /> {eyebrow}
            </span>
          </Reveal>
          <motion.h1
            className="italic-display mt-5 text-white leading-[0.96] text-[clamp(2rem,4.6vw,3.6rem)]"
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ENTER, delay: 0.08 }}
          >
            {title}
          </motion.h1>
          {lede && (
            <motion.p
              className="mt-5 max-w-[52ch] text-[clamp(0.95rem,1.3vw,1.1rem)] font-light leading-relaxed text-slate-200"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: ENTER, delay: 0.2 }}
            >
              {lede}
            </motion.p>
          )}
          {below && <div className="mt-[clamp(32px,5vh,56px)]">{below}</div>}
        </div>
        {aside && (
          <motion.div
            className="relative z-10"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: ENTER, delay: 0.25 }}
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  )
}
