import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow } from "@/components/site/ui"
import { SiteFooter } from "@/components/site/CtaFooter"
import { MediaLightbox } from "@/components/site/MediaLightbox"
import { NewsCard, fmtDate, opensAsPage, storyHref } from "@/components/site/NewsCard"
import { TyreTrack } from "@/components/site/TyreTrack"
import { useRouter } from "@/lib/router"
import {
  NEWS_SORTED, byType, TYPE_LABEL, TYPE_SLUG, YOUTUBE,
  type NewsItem, type NewsType,
} from "@/lib/newsroom"

const ENTER = [0.16, 0.84, 0.34, 1] as const
const ORDER: NewsType[] = ["press-release", "event", "newsletter", "coverage"]

const RAIL_BLURB: Record<NewsType, string> = {
  "press-release": "Official announcements — product launches, OEM partnerships and show news.",
  event: "Trade fairs, festivals and race weekends, with the photos and films from each.",
  newsletter: "Eurogrip News, issue by issue, in five languages.",
  coverage: "Campaigns and press coverage compiled month by month.",
}

/* ============================== hero ============================== */
function NewsroomHero({ lead, onOpen }: { lead: NewsItem; onOpen: (i: NewsItem) => void }) {
  const reduce = useReducedMotion()
  const { navigate } = useRouter()
  const page = opensAsPage(lead)

  return (
    <section className="relative overflow-hidden bg-[#f4f7fb] pt-[clamp(110px,17vh,160px)] text-asphalt">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(10,110,216,.07) 0%, transparent 46%, rgba(237,28,36,.05) 100%)" }} />
      <TyreTrack opacity={0.07} delay={0.7} className="-left-[30%] bottom-[-34%] w-[86%] lg:-left-[16%] lg:w-[52%]" />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[0.78rem] font-medium text-slate-500">
            <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }} className="transition-colors hover:text-asphalt">Home</a>
            <span className="text-slate-400">›</span>
            <span className="text-asphalt">Newsroom</span>
          </nav>
        </Reveal>

        <div className="grid items-center gap-[clamp(28px,4vw,60px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal><Eyebrow>Newsroom</Eyebrow></Reveal>
            <Reveal i={1}>
              <h1 className="italic-display mt-4 text-asphalt leading-[0.94] text-[clamp(1.9rem,5vw,4rem)]">
                Everything<br />we're up to
              </h1>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-5 text-[clamp(0.9rem,1.25vw,1.1rem)] font-light leading-relaxed text-slate-600 lg:whitespace-nowrap">
                Launches, shows, race weekends and newsletters.
              </p>
              <p className="mt-1.5 text-[clamp(0.88rem,1.2vw,1.05rem)] font-light italic leading-relaxed text-slate-500">
                Pick a story, or browse by year and region.
              </p>
            </Reveal>
            <Reveal i={3} className="mt-8 flex flex-wrap gap-2">
              {ORDER.map((t) => (
                <a
                  key={t}
                  href={`/newsroom/${TYPE_SLUG[t]}`}
                  onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate(`/newsroom/${TYPE_SLUG[t]}`) } }}
                  className="rounded-full border border-black/15 px-4 py-2 font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.08em] text-slate-600 transition-colors hover:border-asphalt hover:text-asphalt"
                >
                  {TYPE_LABEL[t]}
                </a>
              ))}
            </Reveal>
          </div>

          {/* lead story */}
          <Reveal i={1}>
            <a
              href={page ? storyHref(lead) : "#"}
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); page ? navigate(storyHref(lead)) : onOpen(lead) } }}
              className="group block overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_40px_90px_-55px_rgba(11,38,74,.6)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                {lead.cover && (
                  <img src={lead.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(13,26,48,.9) 100%)" }} />
                <span className="absolute left-4 top-4 rounded-full bg-eurored px-3 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.1em] text-white">
                  Latest
                </span>
                <motion.div
                  className="absolute inset-x-0 bottom-0 p-5 sm:p-7"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: ENTER, delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-[0.74rem] text-slate-300">
                    <time dateTime={lead.date}>{fmtDate(lead.date)}</time>
                    {lead.place && <><span>·</span><span>{lead.place}</span></>}
                  </div>
                  <h2 className="mt-1.5 font-display text-[clamp(1.15rem,2.1vw,1.7rem)] font-black uppercase italic leading-[1.08] text-white">
                    {lead.title}
                  </h2>
                  <p className="mt-2 hidden max-w-[52ch] text-[0.9rem] font-light leading-relaxed text-slate-300 sm:block">
                    {lead.summary}
                  </p>
                </motion.div>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============================== rails ============================== */
function Rail({
  type, items, onOpen,
}: { type: NewsType; items: NewsItem[]; onOpen: (i: NewsItem) => void }) {
  const { navigate } = useRouter()
  const href = `/newsroom/${TYPE_SLUG[type]}`
  return (
    <section className="border-t border-black/10 py-[clamp(48px,8vh,90px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[clamp(1.2rem,2.2vw,1.75rem)] font-black uppercase italic leading-none text-asphalt">
              {TYPE_LABEL[type]}
            </h2>
            <p className="mt-2 max-w-[54ch] text-[0.9rem] font-light text-slate-600">{RAIL_BLURB[type]}</p>
          </div>
          <a
            href={href}
            onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate(href) } }}
            className="font-display text-[0.78rem] font-extrabold uppercase italic tracking-wide text-racing transition-colors hover:text-eurored"
          >
            All {items.length} →
          </a>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((n, i) => (
            <NewsCard key={n.id} item={n} i={i} onOpen={onOpen} showType={false} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================== video ============================== */
function VideoStrip() {
  return (
    <section className="bg-gradient-to-b from-steel-2 to-steel py-[clamp(56px,9vh,110px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(24px,4vw,56px)] lg:grid-cols-[1fr_auto]">
          <SectionHead
            eyebrow="On film"
            title={<>Watch the<br />brand in motion</>}
            lede="Launch films, event recaps, Tread Talks and rider diaries — the full library lives on our YouTube channel."
            className="max-w-none"
          />
          <Reveal i={2}>
            <Btn href={YOUTUBE} variant="red">Open YouTube channel <Arrow /></Btn>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Newsroom() {
  const { path } = useRouter()
  const [open, setOpen] = useState<NewsItem | null>(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [path])

  /* a shared ?story= link opens straight into the overlay */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("story")
    if (id) {
      const hit = NEWS_SORTED.find((n) => n.id === id)
      if (hit && !opensAsPage(hit)) setOpen(hit)
    }
  }, [])

  const lead = NEWS_SORTED.find((n) => n.cover) ?? NEWS_SORTED[0]
  const latest = NEWS_SORTED.filter((n) => n.id !== lead.id).slice(0, 6)

  return (
    <main className="bg-white">
      <NewsroomHero lead={lead} onOpen={setOpen} />

      <section className="py-[clamp(52px,8vh,100px)]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <h2 className="font-display text-[clamp(1.2rem,2.2vw,1.75rem)] font-black uppercase italic leading-none text-asphalt">
            Latest
          </h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((n, i) => (
              <NewsCard key={n.id} item={n} i={i} onOpen={setOpen} />
            ))}
          </div>
        </div>
      </section>

      {ORDER.map((t) => {
        const items = byType(t)
        return items.length ? <Rail key={t} type={t} items={items} onOpen={setOpen} /> : null
      })}

      <VideoStrip />
      <SiteFooter />

      {open && <MediaLightbox item={open} onClose={() => setOpen(null)} />}
    </main>
  )
}
