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
    <span className="relative block h-12 w-12 shrink-0">
      {/* pulse ring behind the badge */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-racing/35"
        initial={false}
        whileInView={reduce ? undefined : { scale: [1, 1.45, 1.45], opacity: [0.6, 0, 0] }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-0 overflow-hidden rounded-full border border-white/25 bg-white shadow-[0_8px_20px_-8px_rgba(0,0,0,.55)] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6"
        initial={reduce ? false : { rotate: -100, scale: 0.4, opacity: 0 }}
        whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ type: "spring", stiffness: 190, damping: 17 }}
      >
        <motion.img
          src={ICONS[code]}
          alt=""
          className="h-full w-full scale-[1.12] object-cover"
          animate={reduce ? undefined : { y: [0, -2, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.span>
    </span>
  )
}

function TechCard({ t, i }: { t: (typeof TECH)[number]; i: number }) {
  const reduce = useReducedMotion()
  return (
    <SpotlightCard spotlightColor="rgba(237,28,36,0.16)" className="group h-full !bg-[#22334d] p-4">
      <div className="flex items-start gap-3.5">
        <TechIcon code={t.code} />
        <div className="min-w-0">
          <h4 className="font-display text-[0.98rem] font-extrabold uppercase italic leading-tight text-white">
            <span className="mr-2 text-eurored">{t.code}</span>
            {t.title}
          </h4>
          <p className="mt-1 text-[0.84rem] leading-snug text-slate-300">{t.body}</p>
          {/* benefit — slides in after the icon lands */}
          <motion.p
            className="mt-2 inline-flex items-start gap-2 border-l-2 border-eurored pl-2 text-[0.8rem] font-semibold leading-snug text-white/90"
            initial={reduce ? false : { opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.55, delay: 0.25 + (i % 2) * 0.08, ease: ENTER }}
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
    <section id="technology" className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(60px,9vh,104px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Inside the tyre"
          title={
            <span className="block text-[clamp(1.8rem,4.2vw,3.3rem)] leading-[1.02]">
              Seven signature technologies.<br />
              <span className="whitespace-nowrap">One promise on the road.</span>
            </span>
          }
          lede="The engineering platforms behind every Eurogrip tyre — proven in simulation, on test rigs and across a million real kilometres."
          className="mb-8"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {TECH.map((t, i) => (
            <Reveal key={t.code} i={i % 2}>
              <TechCard t={t} i={i} />
            </Reveal>
          ))}
          {/* the spinning-tyre film fills the 8th cell */}
          <Reveal i={1}>
            <SpotlightCard spotlightColor="rgba(10,110,216,0.4)" className="h-full overflow-hidden !bg-[#1f2f47] !p-0">
              <div className="relative aspect-video w-full">
                <video src={techBanner} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d1014]/85 to-transparent p-3.5 text-[0.8rem] font-semibold text-slate-200">
                  Validated in simulation and on the road before it earns the Eurogrip name.
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        <Reveal className="mt-7 flex flex-wrap gap-3.5">
          <Btn href="#technology" variant="blue">Explore technology <Arrow /></Btn>
          <Btn href="#news" variant="line">Technology, explained →</Btn>
        </Reveal>
      </div>
    </section>
  )
}
