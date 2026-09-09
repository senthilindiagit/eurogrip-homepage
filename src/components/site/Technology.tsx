import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { TECHNOLOGIES, TECH_COUNT, TECH_FAMILIES } from "@/lib/technology"
import { Reveal, SectionHead, Btn, Arrow } from "./ui"
import techBanner from "@/assets/tech-banner.mp4"

const ENTER = [0.16, 0.84, 0.34, 1] as const
const DWELL = 5000 // ms each technology stays up before auto-advancing

/**
 * The homepage technology showcase.
 *
 * Rebuilt to drop the seven acronyms — DuCT, TriP, D2T and the rest. The client
 * was explicit on the 2026-08-06 call that short forms are not allowed, and
 * that included the oversized code sitting behind the panel as a watermark. It
 * now runs on the twelve plain-English technologies in lib/technology, the same
 * data the /technology page uses.
 *
 * The client also asked us to come back on what should fill the space the
 * watermark left. The answer here is their own artwork: the cutaway diagram for
 * whichever technology is up, blown up large and faint behind the copy. It fills
 * the space with the thing being described rather than with a label for it, and
 * it costs nothing extra to load because the same file is already the icon.
 */
export function Technology() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [manual, setManual] = useState(false)
  const t = TECHNOLOGIES[active]

  // showroom auto-rotate; pauses on hover and stops once the visitor drives
  useEffect(() => {
    if (reduce || paused || manual) return
    const id = setInterval(() => setActive((i) => (i + 1) % TECHNOLOGIES.length), DWELL)
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
              <span className="whitespace-nowrap">{TECH_COUNT} technologies, {TECH_FAMILIES.length} families.</span><br />
              <span className="whitespace-nowrap">For the promise of performance.</span>
            </span>
          }
          lede="The engineering behind every Eurogrip tyre — simulated before it is built, then proven on track and on the road."
          ledeClassName="max-w-none lg:whitespace-nowrap lg:text-[0.92rem]"
          className="mb-8 max-w-none"
        />

        <Reveal>
          <div className="grid items-stretch gap-4 sm:gap-5 lg:grid-cols-[1fr_minmax(240px,320px)]">
          <div
            className="grid overflow-hidden rounded-lg border border-white/10 bg-[#1f2f47]/70 lg:grid-cols-[minmax(240px,286px)_1fr]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* rail — the twelve technologies */}
            <div
              role="tablist"
              aria-label="Eurogrip technologies"
              aria-orientation="vertical"
              className="flex overflow-x-auto border-b border-white/10 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
            >
              {TECHNOLOGIES.map((item, i) => {
                const on = i === active
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => select(i)}
                    className={`group relative flex shrink-0 items-center gap-3 px-4 py-2.5 text-left transition-colors lg:flex-1 lg:px-5 ${
                      on ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* active accent bar */}
                    <span className={`absolute bottom-0 left-0 h-[3px] w-full bg-eurored transition-opacity lg:h-full lg:w-[3px] ${on ? "opacity-100" : "opacity-0"}`} />
                    <span className={`font-display text-[0.72rem] font-black italic ${on ? "text-eurored" : "text-slate-500"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`min-w-0 font-display text-[0.8rem] font-extrabold uppercase italic leading-tight lg:whitespace-normal ${
                        on ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* detail panel */}
            <div role="tabpanel" className="relative min-h-[300px] p-6 sm:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  /* keyed on the id, not the index, so a rename cannot desync it */
                  key={t.id}
                  initial={reduce ? false : { opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -18 }}
                  transition={{ duration: 0.45, ease: ENTER }}
                  className="relative flex h-full flex-col justify-center"
                >
                  {/* the client's own cutaway, large and faint, where the
                      acronym watermark used to sit */}
                  <img
                    src={t.img}
                    aria-hidden
                    alt=""
                    className="pointer-events-none absolute -right-6 top-1/2 w-[min(58%,290px)] -translate-y-1/2 select-none opacity-[0.13] mix-blend-screen"
                  />
                  <div className="relative flex items-start gap-5">
                    <motion.span
                      className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-white/25 bg-white shadow-[0_14px_34px_-12px_rgba(0,0,0,.6)] sm:h-24 sm:w-24"
                      initial={reduce ? false : { rotate: -90, scale: 0.6 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 16 }}
                    >
                      <img src={t.img} alt="" className="h-[78%] w-[78%] object-contain" />
                    </motion.span>
                    <div className="min-w-0">
                      <div className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.14em] text-eurored">
                        {t.family}
                      </div>
                      <h4 className="mt-1 font-display text-[clamp(1.05rem,1.8vw,1.3rem)] font-extrabold uppercase italic leading-tight text-white">
                        {t.name}
                      </h4>
                      <p className="mt-2.5 max-w-[52ch] text-[0.88rem] font-light leading-relaxed text-slate-300">{t.feature}</p>
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
          <Btn href="/technology" variant="blue">Explore technology <Arrow /></Btn>
          <Btn href="/products" variant="line">See the range <Arrow /></Btn>
        </Reveal>
      </div>
    </section>
  )
}