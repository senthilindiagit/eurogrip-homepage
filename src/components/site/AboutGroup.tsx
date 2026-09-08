import { Reveal, Counter, Btn, Arrow } from "./ui"

const STATS = [
  { n: "1982", label: "Founded", count: false },
  { n: "125", suffix: "+", label: "Worldwide markets today", count: true },
  { n: "TVS MOBILITY", label: "Group company", count: false },
]

export function AboutGroup() {
  return (
    <section id="group" className="overflow-hidden bg-[#f5f6f8] py-[clamp(84px,13vh,150px)] text-asphalt">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-[clamp(34px,5vw,80px)] px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="font-display text-[0.8rem] font-extrabold uppercase italic tracking-[0.1em] text-racing">
              A TVS MOBILITY Group company
            </span>
          </Reveal>
          <Reveal i={1}>
            <h2 className="italic-display mt-2 text-asphalt text-[clamp(1.7rem,3.8vw,2.8rem)]">Built by TVS Srichakra</h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 max-w-[54ch] text-[0.95rem] font-light leading-relaxed text-slate-600">
              Eurogrip is a brand of TVS Srichakra Limited, part of the TVS MOBILITY Group — a two-wheeler tyre specialist going global on many fronts. Driven by relentless R&amp;D with the highest standards in technology.
            </p>
          </Reveal>
          <Reveal i={3} className="mt-8">
            <Btn href="/about#who-we-are" variant="blue">Discover Eurogrip <Arrow /></Btn>
          </Reveal>
        </div>

        <Reveal i={2}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white p-7">
                <div className="font-display text-[clamp(1.55rem,2.9vw,2.3rem)] font-black italic leading-none text-racing">
                  {s.count ? <Counter to={Number(s.n)} suffix={s.suffix} /> : s.n}
                </div>
                <div className="mt-2 text-[0.74rem] uppercase tracking-wide text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
