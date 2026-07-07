import { Reveal, Eyebrow } from "./ui"

const ITEMS = [
  { o: "Out", b: "live", p: "The road might end — but with high performance, long life and durability, a Eurogrip tyre will outlive the journey." },
  { o: "Out", b: "perform", p: "Crafted with engineering precision and designed by global research centres, Eurogrip outperforms in any road condition." },
  { o: "Out", b: "do", p: "Always ready for the next trip, the next turn and the next challenge — designed to deliver, then better itself." },
]

export function Promise() {
  return (
    <section className="border-t border-white/10 bg-asphalt py-[clamp(80px,12vh,150px)]">
      <div className="relative z-20 mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-[780px]">
          <Reveal><Eyebrow>The brand promise</Eyebrow></Reveal>
          <Reveal i={1}>
            <h2 className="italic-display mt-2 text-white text-[clamp(2rem,5vw,4rem)]">Hold a higher standard</h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 max-w-[60ch] text-lg text-slate-300">
              Every journey we embark on pushes us further than we have gone before. That promise lives in three words.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {ITEMS.map((it, i) => (
            <Reveal key={it.b} i={i} className="border-t border-white/10 px-0 py-7 md:border-l md:border-t-0 md:px-8 md:py-0 [&:first-child]:md:pl-0 [&:first-child]:md:border-l-0">
              <div className="font-display font-black italic uppercase leading-none text-white text-[clamp(2rem,4.4vw,3.4rem)]">
                {it.o}<span className="text-eurored">{it.b}</span>
              </div>
              <p className="mt-3.5 text-[0.98rem] text-slate-400">{it.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
