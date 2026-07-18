import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { TECH } from "@/lib/site-data"
import { Reveal, SectionHead, Btn, Arrow } from "./ui"
import techBanner from "@/assets/tech-banner.mp4"
import icDuct from "@/assets/tech/tech-duct.webp"
import icTrip from "@/assets/tech/tech-trip.webp"
import icD2t from "@/assets/tech/tech-d2t.webp"
import icDrbond from "@/assets/tech/tech-drbond.webp"
import icOptpad from "@/assets/tech/tech-optpad.webp"
import icAset from "@/assets/tech/tech-aset.webp"
import icRobust from "@/assets/tech/tech-robust.webp"

const ICONS: Record<string, string> = {
  DuCT: icDuct,
  TriP: icTrip,
  D2T: icD2t,
  DrBond: icDrbond,
  "OpT-Pad": icOptpad,
  "A-SeT": icAset,
  RoBusT: icRobust,
}

const ENTER = [0.16, 0.84, 0.34, 1] as const
const DWELL = 5000 // ms each technology stays up before auto-advancing

export function Technology() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [manual, setManual] = useState(false)
  const t = TECH[active]

  // showroom auto-rotate; pauses on hover and stops once the visitor drives
  useEffect(() => {
    if (reduce || paused || manual) return
    const id = setInterval(() => setActive((i) => (i + 1) % TECH.length), DWELL)
    return () => clearInterval(id)
  }, [reduce, paused, manual])

  const select = (i: number) => {
    setManual(true)
    setActive(i)
  }

  return (
    <section id="technology" className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(60px,9vh,104px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Inside the tyre"
          title={
            <span className="block text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.04]">
              <span className="whitespace-nowrap">Seven signature technologies.</span><br />
              <span className="whitespace-nowrap">One promise on the road.</span>
            </span>
          }
          lede="The engineering platforms behind every Eurogrip tyre — proven in simulation and on the road."
          className="mb-8"
        />

        <Reveal>
          <div className="grid items-stretch gap-4 sm:gap-5 lg:grid-cols-[1fr_minmax(240px,320px)]">
          <div
            className="grid overflow-hidden rounded-lg border border-white/10 bg-[#1f2f47]/70 lg:grid-cols-[minmax(240px,300px)_1fr]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* rail — the seven technologies */}
            <div
              role="tablist"
              aria-label="Eurogrip signature technologies"
              aria-orientation="vertical"
              className="flex overflow-x-auto border-b border-white/10 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
            >
              {TECH.map((item, i) => {
                const on = i === active
                return (
                  <button
                    key={item.code}
                    role="tab"
                    aria-selected={on}
                    onClick={() => select(i)}
                    className={`group relative flex shrink-0 items-center gap-3 px-4 py-3 text-left transition-colors lg:flex-1 lg:px-5 ${
                      on ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* active accent bar */}
                    <span className={`absolute bottom-0 left-0 h-[3px] w-full bg-eurored transition-opacity lg:h-full lg:w-[3px] ${on ? "opacity-100" : "opacity-0"}`} />
                    <span className={`font-display text-[0.72rem] font-black italic ${on ? "text-eurored" : "text-slate-500"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className={`block font-display text-[0.88rem] font-extrabold italic leading-none ${on ? "text-white" : "text-slate-300"}`}>
                        {item.code}
                      </span>
                      <span className={`mt-0.5 hidden whitespace-nowrap text-[0.72rem] uppercase tracking-[0.06em] lg:block ${on ? "text-slate-300" : "text-slate-500"}`}>
                        {item.title}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            {/* detail panel */}
            <div role="tabpanel" className="relative min-h-[300px] p-6 sm:p-9">
              {/* faint oversized code as backdrop texture */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.code}
                  initial={reduce ? false : { opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -18 }}
                  transition={{ duration: 0.45, ease: ENTER }}
                  className="relative flex h-full flex-col justify-center"
                >
                  <span aria-hidden className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[clamp(4rem,9vw,7rem)] font-black italic leading-none text-white/[0.05]">
                    {t.code}
                  </span>
                  <div className="flex items-start gap-5">
                    <motion.span
                      className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/25 bg-white shadow-[0_14px_34px_-12px_rgba(0,0,0,.6)] sm:h-24 sm:w-24"
                      initial={reduce ? false : { rotate: -90, scale: 0.6 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 16 }}
                    >
                      <img src={ICONS[t.code]} alt="" className="h-full w-full scale-[1.12] object-cover" />
                    </motion.span>
                    <div className="min-w-0">
                      <div className="font-display text-[1rem] font-black italic leading-none text-eurored">{t.code}</div>
                      <h4 className="mt-1 font-display text-[clamp(1.05rem,1.8vw,1.3rem)] font-extrabold uppercase italic leading-tight text-white">
                        {t.title}
                      </h4>
                      <p className="mt-2.5 max-w-[52ch] text-[0.88rem] font-light leading-relaxed text-slate-300">{t.body}</p>
                      <motion.p
                        className="mt-3.5 inline-flex items-start gap-2 border-l-2 border-eurored pl-2.5 text-[0.88rem] font-semibold leading-snug text-white/90"
                        initial={reduce ? false : { opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.18, ease: ENTER }}
                      >
                        {t.benefit}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* auto-advance progress line */}
              {!reduce && !manual && (
                <motion.span
                  key={`progress-${active}-${paused}`}
                  className="absolute bottom-0 left-0 h-[2px] origin-left bg-eurored/70"
                  initial={{ scaleX: 0 }}
                  animate={paused ? {} : { scaleX: 1 }}
                  transition={{ duration: DWELL / 1000, ease: "linear" }}
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </div>

          {/* the tyre film — its own card beside the showcase */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 lg:aspect-auto lg:h-full">
            <video src={techBanner} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d1014]/85 to-transparent p-3.5 text-[0.78rem] font-semibold leading-snug text-slate-200">
              Validated in simulation and on the road before it earns the Eurogrip name.
            </span>
          </div>
          </div>
        </Reveal>

        <Reveal className="mt-7 flex flex-wrap gap-3.5">
          <Btn href="#technology" variant="blue">Explore technology <Arrow /></Btn>
          <Btn href="#news" variant="line">Technology, explained →</Btn>
        </Reveal>
      </div>
    </section>
  )
}
