import { TECH_COUNT, TECH_FAMILIES } from "@/lib/technology"
import { Reveal, Eyebrow, Btn, Arrow } from "./ui"
import techBanner from "@/assets/tech-banner.mp4"

/**
 * The homepage technology teaser.
 *
 * It used to be the whole story: a rail of all twelve technologies and a
 * rotating detail panel carrying each one's feature and benefit — the same
 * content, in the same words, as the /technology page. The client's note was to
 * stop repeating it and just say what it is here, which is right: the homepage's
 * job is to make someone want the page, not to be it.
 *
 * So this is a paragraph, the four families named, and a way through. The counts
 * still come from lib/technology rather than being typed in, so nothing here can
 * drift out of step with the page it points at.
 */
export function Technology() {
  return (
    <section id="technology" className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(56px,9vh,104px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(28px,4.5vw,72px)] lg:grid-cols-[1fr_0.72fr]">
          <div>
            <Reveal><Eyebrow>Inside the tyre</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-3 text-[clamp(1.7rem,3.6vw,2.7rem)] leading-[1.02] text-white">
                {TECH_COUNT} technologies,<br />{TECH_FAMILIES.length} places they live
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-5 max-w-[58ch] text-[clamp(0.95rem,1.25vw,1.06rem)] font-light leading-relaxed text-slate-300">
                A tyre is the sum of decisions taken in four places — the tread that
                meets the road, the compound it is made of, the casing beneath it and
                the profile it holds through a corner. Ours are drawn in Italy
                alongside the R&amp;D centre in India, simulated before anything is
                built, then run well past the limits of ordinary use before the tyre
                is allowed a name.
              </p>
            </Reveal>
            <Reveal i={3}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {TECH_FAMILIES.map((f) => (
                  <li
                    key={f.k}
                    className="rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.08em] text-slate-200"
                  >
                    {f.k}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal i={4} className="mt-7 flex flex-wrap gap-3.5">
              <Btn href="/technology" variant="blue">Inside the technology <Arrow /></Btn>
              <Btn href="/products" variant="line">See the range <Arrow /></Btn>
            </Reveal>
          </div>

          {/* the tyre building itself, from the client's own render */}
          <Reveal i={2}>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d1014]">
              <video
                src={techBanner}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="A Eurogrip tyre assembling onto a wheel, layer by layer"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d1014]/90 to-transparent p-4 text-[0.78rem] font-semibold leading-snug text-slate-200">
                Validated in simulation and on the road before it earns the Eurogrip name.
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
