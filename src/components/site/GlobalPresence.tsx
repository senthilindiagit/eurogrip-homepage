import { GlobeInteractive } from "@/components/ui/cobe-globe-interactive"
import { MARKETS } from "@/lib/site-data"
import { Reveal, SectionHead, Counter } from "./ui"

const STATS = [
  { to: 85, suffix: "+", label: "Countries served" },
  { to: 5, suffix: "", label: "Continents reached" },
  { to: 1000, suffix: "+", label: "Distribution partners" },
  { to: 6, suffix: "", label: "Tyre categories exported" },
]

export function GlobalPresence() {
  return (
    <section id="global" className="bg-gradient-to-b from-steel-2 to-steel py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-[clamp(30px,5vw,64px)] lg:grid-cols-2">
          <SectionHead
            eyebrow="Global presence"
            title={<>One brand.<br />Eighty-five shades of road.</>}
            lede="Wherever the surface changes — monsoon highway, alpine pass, desert trail or factory floor — Eurogrip is engineered to meet it. Drag the globe to explore our markets."
          />
          <Reveal i={1}>
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              <GlobeInteractive markers={MARKETS} className="h-full w-full" />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} i={i} className="border-t-2 border-eurored pt-4">
              <Counter to={s.to} suffix={s.suffix} className="font-display text-[clamp(1.7rem,3vw,2.6rem)] font-black italic leading-none text-white" />
              <div className="mt-1.5 text-[0.8rem] uppercase tracking-wide text-slate-400">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
