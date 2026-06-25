import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { TreadRing } from "./TreadRing"
import { TECH } from "@/lib/site-data"
import { Reveal, SectionHead, Btn, Arrow } from "./ui"

export function Technology() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 200])

  return (
    <section ref={ref} id="technology" className="overflow-hidden bg-gradient-to-b from-asphalt to-[#10161f] py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Inside the tyre"
          title={<><span className="whitespace-nowrap">Technology you can feel</span><br />before you can see</>}
          lede="Italian-influenced design heritage meets compounds, casings and tread architectures developed for the world’s most demanding conditions."
          className="mb-[clamp(40px,6vh,64px)]"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* tread visual — spans two rows on desktop */}
          <Reveal className="lg:row-span-2">
            <SpotlightCard spotlightColor="rgba(0,84,166,0.35)" className="flex h-full min-h-[360px] flex-col items-center justify-center !bg-[#0c121b] p-8">
              <div className="relative grid place-items-center">
                <motion.div style={{ rotate }} className="w-[min(360px,72vw)]">
                  <TreadRing accent="#ed1c24" block="rgba(255,255,255,.42)" stroke="rgba(255,255,255,.22)" />
                </motion.div>
                <div className="absolute grid h-[38%] w-[38%] place-items-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,#1d242e,#0d1014)] text-center">
                  <div>
                    <div className="font-display text-3xl font-black italic text-white">100%</div>
                    <div className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-slate-400">Contact confidence</div>
                  </div>
                </div>
              </div>
              <p className="mx-auto mt-7 max-w-[34ch] text-center text-sm text-slate-400">
                Every platform is validated in simulation and on the road before it earns the Eurogrip name.
              </p>
            </SpotlightCard>
          </Reveal>

          {TECH.map((t, i) => (
            <Reveal key={t.n} i={i % 2}>
              <SpotlightCard spotlightColor="rgba(237,28,36,0.18)" className="h-full !bg-[#0f141b] p-6">
                <div className="flex items-start gap-4">
                  <span className="font-display text-lg font-black italic text-eurored">{t.n}</span>
                  <div>
                    <h4 className="font-display text-[1.18rem] font-extrabold uppercase italic text-white">
                      {t.title}
                      {t.tbc && (
                        <span className="ml-2 rounded-[3px] border border-dashed border-slate-600 px-1.5 py-0.5 align-middle text-[0.6rem] uppercase tracking-wide text-slate-500">
                          name TBC
                        </span>
                      )}
                    </h4>
                    <p className="mt-1.5 text-[0.92rem] text-slate-400">{t.body}</p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-wrap gap-3.5">
          <Btn href="#technology" variant="blue">Explore technology <Arrow /></Btn>
          <Btn href="#news" variant="line">Technology, explained →</Btn>
        </Reveal>
      </div>
    </section>
  )
}
