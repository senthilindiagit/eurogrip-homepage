import { useState } from "react"
import { Reveal, Eyebrow, Btn, Arrow } from "./ui"
import { NewsCard } from "./NewsCard"
import { MediaLightbox } from "./MediaLightbox"
import { NEWS_SORTED, type NewsItem } from "@/lib/newsroom"

/**
 * Homepage teaser for the newsroom.
 *
 * Reads the same content the /newsroom pages do, so the three cards here are
 * always the three most recent items — press release, event, newsletter or
 * coverage — rather than a separately maintained list that goes stale.
 */
export function Newsroom() {
  const [open, setOpen] = useState<NewsItem | null>(null)
  const latest = NEWS_SORTED.slice(0, 3)

  return (
    <section id="news" className="bg-mist py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-[clamp(32px,5vh,48px)] flex flex-wrap items-end justify-between gap-5">
          <div>
            <Reveal><Eyebrow>Newsroom</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-2 text-asphalt text-[clamp(1.7rem,3.8vw,2.9rem)]">The latest from Eurogrip</h2>
            </Reveal>
          </div>
          <Reveal i={2}>
            <Btn href="/newsroom" variant="blue">All stories <Arrow /></Btn>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((n, i) => (
            <NewsCard key={n.id} item={n} i={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      {open && <MediaLightbox item={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
