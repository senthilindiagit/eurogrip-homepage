import { GlobeInteractive } from "@/components/ui/cobe-globe-interactive"
import { MARKETS } from "@/lib/site-data"
import { Reveal, SectionHead, Counter, Btn, Arrow } from "./ui"
import worldDots from "@/assets/about/world-dots-fine.webp"

const STATS = [
  { to: 125, suffix: "+", label: "Countries" },
  { to: 1000, suffix: "+", label: "Distribution partners" },
  { to: 6, suffix: "", label: "Tyre categories" },
]

export function GlobalPresence() {
  return (
    <section id="global" className="relative overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(84px,13vh,150px)]">
      {/* dotted world map (fine-dot variant) — oversized and centre-masked so it
          reads as texture, not as a second map competing with the globe */}
      <img
        src={worldDots}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-[132%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] mix-blend-screen"
        style={{
          WebkitMaskImage: "radial-gradient(68% 62% at 46% 50%, #000 40%, transparent 100%)",
          maskImage: "radial-gradient(68% 62% at 46% 50%, #000 40%, transparent 100%)",
        }}
      />
      {/* brand-blue bloom behind the globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(42% 52% at 76% 42%, rgba(10,110,216,.28), transparent 68%)" }}
      />
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-[clamp(30px,5vw,64px)] lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="Going global"
              title={<>One brand.<br />125 shades of road.</>}
              lede="Drag the globe to explore our markets."
            />
            <Reveal i={2} className="mt-7">
              <Btn href="/global-presence" variant="red">Explore our global presence <Arrow /></Btn>
            </Reveal>
          </div>
          <Reveal i={1}>
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              <GlobeInteractive markers={MARKETS} className="h-full w-full" />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} i={i} className="border-t-2 border-eurored pt-4">
              <Counter to={s.to} suffix={s.suffix} className="font-display text-[clamp(1.45rem,2.5vw,2.1rem)] font-black italic leading-none text-white" />
              <div className="mt-1.5 text-[0.74rem] uppercase tracking-wide text-slate-400">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
