import { NEWS } from "@/lib/site-data"
import { Reveal, Eyebrow, Btn, Arrow } from "./ui"
import { cn } from "@/lib/utils"

export function Newsroom() {
  return (
    <section id="news" className="bg-carbon py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-[clamp(40px,6vh,56px)] flex flex-wrap items-end justify-between gap-5">
          <div>
            <Reveal><Eyebrow>Newsroom</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-2 text-white text-[clamp(2rem,5vw,4rem)]">The latest from Eurogrip</h2>
            </Reveal>
          </div>
          <Reveal i={2}><Btn href="#news" variant="line">All stories <Arrow /></Btn></Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {NEWS.map((a, i) => (
            <Reveal key={a.title} i={i % 3} className={cn(a.big && "md:col-span-2 lg:col-span-1 lg:row-span-1")}>
              <a href="#news" className="group flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-[#0f141b] transition-all duration-500 hover:-translate-y-1.5 hover:border-eurored/50">
                <div className={cn("relative overflow-hidden", a.big ? "aspect-[16/10]" : "aspect-[16/9]")}
                  style={{ background: "linear-gradient(135deg,#003a73,#0c1119)" }}>
                  <span className="absolute left-3.5 top-3.5 rounded-[2px] bg-eurored px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white">{a.tag}</span>
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: "repeating-conic-gradient(#fff 0 25%,transparent 0 50%) 0 0/26px 26px" }} />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5.5 p-6">
                  <span className="text-[0.74rem] uppercase tracking-[0.08em] text-slate-500">{a.date}</span>
                  <h3 className={cn("font-display font-extrabold uppercase italic leading-tight text-white", a.big ? "text-[1.45rem]" : "text-[1.12rem]")}>{a.title}</h3>
                  <p className="text-[0.9rem] text-slate-400">{a.excerpt}</p>
                  <span className="mt-auto pt-2 font-display text-[0.8rem] font-extrabold uppercase italic tracking-wide text-eurored">Read story →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
