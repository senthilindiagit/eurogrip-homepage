import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Counter, Btn, Arrow } from "./ui"

const WORDS = ["every road", "the long haul", "85 countries", "the racetrack", "the worst weather"]
const ENTER = [0.16, 0.84, 0.34, 1] as const
const D = 0.15 // small settle delay before the hero text arrives

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.16])

  const [wi, setWi] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWi((i) => (i + 1) % WORDS.length), 2600)
    return () => clearInterval(t)
  }, [])

  const stats = [
    { to: 42, suffix: "+", label: "Years of expertise" },
    { to: 85, suffix: "+", label: "Countries served" },
    { to: 6, suffix: "", label: "Product categories" },
    { to: 3, suffix: "", label: "Global R&D centres" },
  ]

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28"
      style={{ background: "radial-gradient(120% 90% at 80% 10%, #2a5da8 0%, #13223c 60%)" }}
    >
      {/* brand video banner — slow cinematic push-in on scroll */}
      <motion.video
        style={{ scale: videoScale }}
        className="absolute inset-0 h-full w-full object-cover"
        src="/eurogrip-brand-video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* legibility scrim over the video — brand-blue tint, not black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(11,38,74,.74) 0%, rgba(11,38,74,.42) 48%, rgba(11,38,74,.08) 100%)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
        style={{ background: "linear-gradient(180deg, transparent, rgba(47,68,100,.95))" }}
      />
      {/* blue glow */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[46%] mix-blend-screen"
        style={{ background: "linear-gradient(115deg, rgba(10,110,216,.38), transparent 70%)" }} />

      <motion.div style={{ y: contentY }} className="relative z-20 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ENTER, delay: D }}>
          <span className="inline-flex items-center gap-2 font-display italic font-extrabold uppercase tracking-[0.16em] text-[0.78rem] text-eurored">
            <span className="h-[2px] w-6 bg-eurored" /> Specialist Tyre Technology · Est. 1982
          </span>
        </motion.div>

        <h1 className="italic-display mt-4 mb-4 text-white leading-[0.92] text-[clamp(1.9rem,5vw,4rem)]">
          <motion.span className="block whitespace-nowrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: D + 0.08 }}>
            Engineered
          </motion.span>
          <motion.span className="block whitespace-nowrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: D + 0.16 }}>
            to outperform
          </motion.span>
          <motion.span
            className="inline-block h-[1.02em] overflow-hidden whitespace-nowrap align-top text-eurored"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: ENTER, delay: D + 0.24 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={wi}
                className="block whitespace-nowrap"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: ENTER }}
              >
                {WORDS[wi]}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </h1>

        <motion.p
          className="max-w-[44ch] text-[clamp(0.95rem,1.3vw,1.1rem)] font-light leading-relaxed text-slate-200"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: D + 0.24 }}
        >
          European engineering and a racer’s instinct — built into every tyre, in over 85 countries.
        </motion.p>

        <motion.div className="mt-7 flex flex-wrap gap-3.5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: D + 0.32 }}>
          <Btn href="#products" variant="red">Explore the range <Arrow /></Btn>
          <Btn href="#technology" variant="line">Inside the technology</Btn>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-nowrap gap-x-[clamp(20px,3vw,46px)] gap-y-6 border-t border-white/10 pt-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: D + 0.4 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="shrink-0">
              <Counter to={s.to} suffix={s.suffix} className="font-display italic font-black text-white leading-none text-[clamp(1.5rem,2.7vw,2.15rem)]" />
              <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.08em] text-slate-300/80">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
