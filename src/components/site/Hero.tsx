import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Counter, Btn, Arrow } from "./ui"
import tyreImg from "@/assets/tyre.webp"

const WORDS = ["every road", "the long haul", "85 countries", "the racetrack", "the worst weather"]
const ENTER = [0.16, 0.84, 0.34, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const treadY = useTransform(scrollYProgress, [0, 1], [0, 220])
  const treadRotate = useTransform(scrollYProgress, [0, 1], [0, 48])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])

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
      style={{ background: "radial-gradient(120% 90% at 80% 10%, #16315a 0%, #0d1014 55%)" }}
    >
      {/* grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "4px 4px" }}
      />
      {/* speed lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-[3px] rounded"
            style={{
              top: `${10 + i * 14}%`,
              width: `${80 + (i % 3) * 90}px`,
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)",
            }}
            initial={{ x: "-40vw", opacity: 0 }}
            animate={{ x: "140vw", opacity: [0, 0.6, 0] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.7, ease: "linear" }}
          />
        ))}
      </div>
      {/* parallax product tyre */}
      <div className="pointer-events-none absolute right-[-6vw] top-1/2 hidden -translate-y-1/2 md:block w-[54vw] max-w-[620px]">
        <motion.img
          src={tyreImg}
          alt="Eurogrip Roadhound motorcycle tyre"
          style={{ y: treadY, rotate: treadRotate }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 0.84, 0.34, 1] }}
          className="w-full drop-shadow-[0_40px_70px_rgba(0,0,0,.6)]"
        />
      </div>
      {/* blue glow */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[46%] mix-blend-screen"
        style={{ background: "linear-gradient(115deg, rgba(0,84,166,.32), transparent 70%)" }} />

      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ENTER }}>
          <span className="inline-flex items-center gap-2 font-display italic font-extrabold uppercase tracking-[0.16em] text-[0.78rem] text-eurored">
            <span className="h-[2px] w-6 bg-eurored" /> Specialist Tyre Technology · Est. 1982
          </span>
        </motion.div>

        <h1 className="italic-display mt-4 mb-4 text-white leading-[0.9] text-[clamp(2.7rem,7.6vw,6.4rem)]">
          <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.08 }}>
            Engineered
          </motion.span>
          <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.16 }}>
            to outperform
          </motion.span>
          <span className="block h-[1.02em] overflow-hidden text-eurored">
            <AnimatePresence mode="wait">
              <motion.span
                key={wi}
                className="block"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: ENTER }}
              >
                {WORDS[wi]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p
          className="max-w-[60ch] text-[clamp(1.05rem,1.7vw,1.3rem)] text-slate-300"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.24 }}
        >
          Three decades of obsessive R&amp;D, European engineering standards and a racer’s instinct — built into every tyre, for riders and machines in over 85 countries.
        </motion.p>

        <motion.div className="mt-7 flex flex-wrap gap-3.5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.32 }}>
          <Btn href="#products" variant="red">Explore the range <Arrow /></Btn>
          <Btn href="#technology" variant="line">Inside the technology</Btn>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap gap-x-[clamp(24px,3vw,46px)] gap-y-6 border-t border-white/10 pt-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ENTER, delay: 0.4 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <Counter to={s.to} suffix={s.suffix} className="font-display italic font-black text-white leading-none text-[clamp(1.8rem,3.4vw,2.7rem)]" />
              <div className="mt-1.5 text-[0.78rem] uppercase tracking-[0.08em] text-slate-400">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
