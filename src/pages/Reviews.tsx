import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { SectionHead } from "@/components/site/ui"
import { PageHero } from "@/components/site/PageHero"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { RiderImage } from "@/components/site/Racing"
import { ReviewCard, VideoLightbox, type PlayTarget } from "@/components/site/ReviewCard"
import { ITEMS, OWNER_FILMS } from "@/lib/reviews"
import { useRouter } from "@/lib/router"

/* ------------------------------------------------------------------- page -- */
export function Reviews() {
  const { path } = useRouter()
  const [video, setVideo] = useState<PlayTarget | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [path])

  useEffect(() => {
    if (!video) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [video])

  return (
    <main>
      <div className="relative overflow-x-clip" style={{ background: "linear-gradient(180deg, #e0393f 0%, #a80f16 58%, #eef3f9 100%)" }}>
        {/* racing texture — speed streaks behind the bike */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -top-24 right-[6%] h-[130%] w-[3px] rotate-[24deg] bg-white/15" />
          <span className="absolute -top-24 right-[12%] h-[110%] w-[6px] rotate-[24deg] bg-white/25" />
          <span className="absolute -top-24 right-[18%] h-[120%] w-[2px] rotate-[24deg] bg-white/20" />
          <span className="absolute -top-24 right-[30%] h-[100%] w-[2px] rotate-[24deg] bg-white/10" />
        </div>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
          eyebrow="Tests & verdicts"
          title={<>Reviews &amp;<br />testimonials</>}
          /* the page now carries owner films as well as press tests, so the
             lede has to speak for both */
          lede="Leading motorcycle media test our tyres on road, off-road and on track — and riders, farmers and contractors give their own verdict. The tests, the films, the write-ups."
          aside={<RiderImage />}
          pad="pb-[clamp(44px,7vh,80px)] pt-[clamp(104px,15vh,140px)]"
        />
      </div>

      <section className="bg-mist py-[clamp(48px,8vh,100px)] text-asphalt">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((r, i) => <ReviewCard key={r.slug} r={r} i={i} onPlay={setVideo} />)}
          </div>

        </div>
      </section>

      {/* Owner films sit apart: they are off-highway customers rather than
          motorcycle press, and none of them carries a date to sort by. */}
      <section className="border-t border-black/10 bg-white py-[clamp(48px,8vh,100px)] text-asphalt">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <SectionHead
            light
            eyebrow="In their own words"
            title={<>Owners on<br />off-highway tyres</>}
            lede="Farmers and contractors across Europe on the Tigertrac AR600 and FL909 radials — hours run, wear and road manners."
            className="mb-[clamp(28px,4.5vh,48px)] max-w-none"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OWNER_FILMS.map((r, i) => <ReviewCard key={r.slug} r={r} i={i} onPlay={setVideo} />)}
          </div>
        </div>
      </section>

      <Cine><SiteFooter /></Cine>

      <AnimatePresence>
        {video && <VideoLightbox target={video} onClose={() => setVideo(null)} />}
      </AnimatePresence>
    </main>
  )
}
