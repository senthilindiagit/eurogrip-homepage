import { RIDERS, PARTNERS } from "@/lib/site-data"
import { Reveal, SectionHead, Marquee } from "./ui"

function PlayIcon() {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-full bg-eurored/95 shadow-[0_0_0_0_rgba(237,28,36,.5)] animate-pulse">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
    </span>
  )
}

export function Racing() {
  return (
    <section id="racing" className="bg-[#0a0c10] py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Racing & partnership"
          title={<>Proven by riders.<br />Not just by us.</>}
          lede="From championship grids to OEM fitments and the road-trip diaries of everyday riders — the proof of a Eurogrip tyre is in the people who trust it."
          className="mb-[clamp(40px,6vh,56px)] max-w-[1000px]"
          ledeClassName="max-w-[68ch]"
        />

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {RIDERS.map((r, i) => (
            <Reveal key={r.who} i={i % 4}>
              <div
                className="group relative flex aspect-[9/13] flex-col justify-end overflow-hidden rounded-md border border-white/10 p-5 transition-transform duration-500 hover:-translate-y-1.5"
                style={{ background: `linear-gradient(160deg, hsl(${r.hue} 45% 26%), #0b0f15)` }}
              >
                <div className="absolute inset-0 grid place-items-center opacity-90 transition group-hover:opacity-100">
                  <PlayIcon />
                </div>
                <div className="relative z-10">
                  <p className="mb-3 text-[0.92rem] leading-snug text-slate-200">“{r.quote}”</p>
                  <div className="font-display text-[0.95rem] font-bold italic text-white">{r.who}</div>
                  <div className="text-[0.78rem] uppercase tracking-wide text-slate-400">{r.tag}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>


        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="mb-5 text-center text-[0.78rem] uppercase tracking-[0.12em] text-slate-500">Trusted on the grid &amp; the line</div>
          <Marquee speed={26}>
            {PARTNERS.map((p) => (
              <span key={p} className="font-display text-2xl font-black uppercase italic text-slate-700 transition-colors hover:text-slate-300">
                {p}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
