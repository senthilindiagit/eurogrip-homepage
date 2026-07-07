import { SpotlightCard } from "@/components/ui/spotlight-card"
import { TECH } from "@/lib/site-data"
import { Reveal, SectionHead, Btn, Arrow } from "./ui"
import techBanner from "@/assets/tech-banner.mp4"

export function Technology() {
  return (
    <section id="technology" className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(84px,13vh,150px)]">
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
            <Reveal key={t.n} i={i % 2}>
              <SpotlightCard spotlightColor="rgba(237,28,36,0.18)" className="h-full !bg-[#22334d] p-6">
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
                    <p className="mt-1.5 text-[0.92rem] text-slate-300">{t.body}</p>
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
