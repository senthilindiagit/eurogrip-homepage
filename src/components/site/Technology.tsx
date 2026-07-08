import { motion, useReducedMotion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"
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

/* Technology illustration: rolls in on scroll, then floats; leans in on card hover. */
function TechIcon({ code }: { code: string }) {
  const reduce = useReducedMotion()
  return (
    <span className="relative block h-[74px] w-[74px] shrink-0">
      {/* pulse ring behind the badge */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-racing/35"
        initial={false}
        whileInView={reduce ? undefined : { scale: [1, 1.45, 1.45], opacity: [0.6, 0, 0] }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 1.2, delay: 0.45, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-0 overflow-hidden rounded-full border border-white/25 bg-white shadow-[0_10px_28px_-10px_rgba(0,0,0,.55)] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6"
        initial={reduce ? false : { rotate: -100, scale: 0.4, opacity: 0 }}
        whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ type: "spring", stiffness: 190, damping: 17 }}
      >
        <motion.img
          src={ICONS[code]}
          alt=""
          className="h-full w-full scale-[1.12] object-cover"
          animate={reduce ? undefined : { y: [0, -2.5, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.span>
    </span>
  )
}

function TechCard({ t, i }: { t: (typeof TECH)[number]; i: number }) {
  const reduce = useReducedMotion()
  return (
    <SpotlightCard spotlightColor="rgba(237,28,36,0.16)" className="group h-full !bg-[#22334d] p-6">
      <div className="flex items-start gap-4">
        <TechIcon code={t.code} />
        <div className="min-w-0">
          <div className="font-display text-[1rem] font-black italic leading-none text-eurored">{t.code}</div>
          <h4 className="mt-1 font-display text-[1.08rem] font-extrabold uppercase italic leading-tight text-white">{t.title}</h4>
          <p className="mt-2 text-[0.9rem] leading-snug text-slate-300">{t.body}</p>
          {/* benefit — slides in after the icon lands */}
          <motion.p
            className="mt-3 inline-flex items-start gap-2 border-l-2 border-eurored pl-2.5 text-[0.84rem] font-semibold leading-snug text-white/90"
            initial={reduce ? false : { opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.55, delay: 0.3 + (i % 3) * 0.08, ease: ENTER }}
          >
            {t.benefit}
          </motion.p>
        </div>
      </div>
    </SpotlightCard>
  )
}

export function Technology() {
  return (
    <section id="technology" className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Inside the tyre"
          title={<><span className="whitespace-nowrap">Seven signature technologies.</span><br />One promise on the road.</>}
          lede="From dual-compound treads to air-seal liners — the engineering platforms behind every Eurogrip tyre, proven in simulation, on test rigs and across a million real kilometres."
          className="mb-[clamp(40px,6vh,64px)]"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* tread visual — spans two rows on desktop */}
          <Reveal className="lg:row-span-2">
            <SpotlightCard spotlightColor="rgba(10,110,216,0.4)" className="flex h-full min-h-[360px] flex-col items-center justify-center !bg-[#1f2f47] p-8">
              <video
                src={techBanner}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-square w-full max-w-[380px] rounded-2xl border border-white/10 object-cover shadow-[0_24px_60px_-24px_rgba(0,40,90,.7)]"
              />
              <p className="mx-auto mt-7 max-w-[34ch] text-center text-sm text-slate-300">
                Every platform is validated in simulation and on the road before it earns the Eurogrip name.
              </p>
            </SpotlightCard>
          </Reveal>

          {TECH.map((t, i) => (
            <Reveal key={t.code} i={i % 2}>
              <TechCard t={t} i={i} />
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
