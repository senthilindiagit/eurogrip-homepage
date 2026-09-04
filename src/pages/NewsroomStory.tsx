import { useEffect, useState } from "react"
import { Reveal, Btn, Arrow, Eyebrow } from "@/components/site/ui"
import { SiteFooter } from "@/components/site/CtaFooter"
import { MediaLightbox } from "@/components/site/MediaLightbox"
import { NewsCard, fmtDate } from "@/components/site/NewsCard"
import { useRouter } from "@/lib/router"
import {
  NEWS_SORTED, REGION_LABEL, TYPE_LABEL, TYPE_SLUG, type NewsItem,
} from "@/lib/newsroom"

function ShareRow({ item }: { item: NewsItem }) {
  const [state, setState] = useState<null | "copied" | "shared">(null)
  const url = typeof window === "undefined" ? "" : window.location.href

  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: item.title, text: item.summary, url }); setState("shared") }
      else { await navigator.clipboard.writeText(url); setState("copied") }
    } catch { return }
    window.setTimeout(() => setState(null), 2200)
  }

  const links = [
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`],
    ["X", `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(item.title)}`],
    ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(item.title + " " + url)}`],
  ]

  return (
    <div className="flex flex-wrap items-center gap-2.5 border-t border-black/10 pt-6">
      <button
        onClick={share}
        className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-[0.8rem] font-medium text-asphalt transition-colors hover:border-asphalt hover:bg-mist"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        {state === "copied" ? "Link copied" : state === "shared" ? "Shared" : "Share"}
      </button>
      {links.map(([label, href]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/15 px-3.5 py-2 text-[0.8rem] font-medium text-slate-600 transition-colors hover:border-asphalt hover:text-asphalt"
        >
          {label}
        </a>
      ))}
    </div>
  )
}

/**
 * Photo gallery for a story that carries images.
 *
 * A story page wins over the lightbox when an item has body copy, so without
 * this the photos on an event write-up would never be seen. Clicking a tile
 * opens the same carousel the cards use, at that photo.
 */
function StoryGallery({ item, onOpen }: { item: NewsItem; onOpen: (i: number) => void }) {
  const imgs = item.images ?? []
  const [all, setAll] = useState(false)
  const CAP = 12
  const shown = all ? imgs : imgs.slice(0, CAP)
  const hidden = imgs.length - shown.length

  return (
    <section className="mt-10 border-t border-black/10 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-[1.05rem] font-black uppercase italic leading-tight text-asphalt">
          Photo gallery
        </h2>
        <span className="text-[0.8rem] font-light text-slate-500">{imgs.length} photos</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {shown.map((src, i) => (
          <button
            key={src}
            onClick={() => onOpen(i)}
            aria-label={`Open photo ${i + 1} of ${imgs.length}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-mist ring-1 ring-black/10 transition-all hover:ring-2 hover:ring-racing/50"
          >
            <img
              src={src}
              alt={item.captions?.[i] ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-asphalt/0 transition-colors group-hover:bg-asphalt/15" />
            {item.captions?.[i] && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-asphalt/85 to-transparent px-3 pb-2 pt-6 text-left font-display text-[0.68rem] font-extrabold uppercase italic leading-tight tracking-[0.04em] text-white">
                {item.captions[i]}
              </span>
            )}
          </button>
        ))}
      </div>

      {hidden > 0 && (
        <button
          onClick={() => setAll(true)}
          className="mt-4 font-display text-[0.8rem] font-extrabold uppercase italic tracking-[0.06em] text-racing transition-colors hover:text-eurored"
        >
          Show all {imgs.length} photos →
        </button>
      )}
    </section>
  )
}

export function NewsroomStory({ item }: { item: NewsItem }) {
  const { path, navigate } = useRouter()
  const [open, setOpen] = useState<NewsItem | null>(null)
  const [from, setFrom] = useState(0)

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [path])

  const listHref = `/newsroom/${TYPE_SLUG[item.type]}`
  const related = NEWS_SORTED.filter((n) => n.id !== item.id && n.tags.some((t) => item.tags.includes(t))).slice(0, 3)
  const langs = Object.keys(item.pdf ?? {})

  return (
    <main className="bg-white">
      <article>
        <header className="relative overflow-hidden bg-[#f4f7fb] pb-[clamp(28px,5vh,56px)] pt-[clamp(110px,17vh,158px)] text-asphalt">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(10,110,216,.07) 0%, transparent 48%, rgba(237,28,36,.04) 100%)" }} />
          <div className="relative mx-auto max-w-[820px] px-5 sm:px-8">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[0.78rem] font-medium text-slate-500">
                <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }} className="transition-colors hover:text-asphalt">Home</a>
                <span className="text-slate-400">›</span>
                <a href="/newsroom" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/newsroom") } }} className="transition-colors hover:text-asphalt">Newsroom</a>
                <span className="text-slate-400">›</span>
                <a href={listHref} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate(listHref) } }} className="transition-colors hover:text-asphalt">{TYPE_LABEL[item.type]}</a>
              </nav>
            </Reveal>
            <Reveal><Eyebrow>{TYPE_LABEL[item.type].replace(" & coverage", "")}</Eyebrow></Reveal>
            <Reveal i={1}>
              <h1 className="italic-display mt-3 text-asphalt leading-[1.04] text-[clamp(1.6rem,3.6vw,2.7rem)]">
                {item.title}
              </h1>
            </Reveal>
            <Reveal i={2}>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.82rem] text-slate-500">
                <time dateTime={item.date}>{fmtDate(item.date)}</time>
                {item.place && <><span className="text-slate-300">·</span><span>{item.place}</span></>}
                <span className="text-slate-300">·</span>
                <span>{item.regions.map((r) => REGION_LABEL[r]).join(" · ")}</span>
              </div>
            </Reveal>
          </div>
        </header>

        {item.cover && item.cover !== item.document && (
          <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
            <Reveal>
              <div className="-mt-2 overflow-hidden rounded-2xl border border-black/10 bg-mist shadow-[0_40px_90px_-60px_rgba(11,38,74,.6)]">
                <img src={item.cover} alt="" className="max-h-[70vh] w-full object-cover" />
              </div>
            </Reveal>
          </div>
        )}

        <div className="mx-auto max-w-[820px] px-5 py-[clamp(36px,6vh,72px)] sm:px-8">
          <p className="text-[clamp(1rem,1.35vw,1.2rem)] font-light leading-relaxed text-asphalt">{item.summary}</p>

          <div className="mt-7 space-y-4">
            {item.body?.map((p, i) =>
              /^[-•]/.test(p) ? (
                <p key={i} className="flex gap-3 pl-1 text-[0.95rem] font-light leading-relaxed text-slate-700">
                  <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-eurored" />
                  <span>{p.replace(/^[-•]\s*/, "")}</span>
                </p>
              ) : p === p.toUpperCase() && p.length < 90 ? (
                <h2 key={i} className="pt-3 font-display text-[1.05rem] font-black uppercase italic leading-tight text-asphalt">
                  {p}
                </h2>
              ) : (
                <p key={i} className="text-[0.95rem] font-light leading-relaxed text-slate-700">{p}</p>
              )
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="rounded-[3px] bg-mist px-2.5 py-1 text-[0.75rem] font-medium text-slate-500">{t}</span>
            ))}
          </div>

          {langs.length > 0 && (
            <div className="mt-8 rounded-xl border border-black/10 bg-mist p-5">
              {item.document && (
                <button
                  onClick={() => setOpen(item)}
                  className="group mb-5 flex w-full items-center gap-4 text-left"
                  aria-label="Open the release as published"
                >
                  <img
                    src={item.document}
                    alt=""
                    className="h-24 w-[68px] shrink-0 rounded border border-black/10 object-cover object-top shadow-sm transition-transform group-hover:-translate-y-0.5"
                  />
                  <span>
                    <span className="block font-display text-[0.8rem] font-extrabold uppercase italic text-asphalt">
                      As published
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] font-light text-slate-500">
                      Open the release page
                    </span>
                  </span>
                </button>
              )}
              <p className="font-display text-[0.76rem] font-extrabold uppercase italic tracking-[0.1em] text-asphalt">
                Download the release
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {langs.map((l) => (
                  <a
                    key={l}
                    href={item.pdf![l]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[3px] border border-black/15 bg-white px-3.5 py-2 text-[0.8rem] font-medium text-asphalt transition-colors hover:border-racing hover:text-racing"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" /></svg>
                    PDF · {l}
                  </a>
                ))}
              </div>
            </div>
          )}

          {item.images && item.images.length > 0 && (
            <StoryGallery item={item} onOpen={(i) => { setFrom(i); setOpen(item) }} />
          )}

          <div className="mt-9"><ShareRow item={item} /></div>

          <div className="mt-8">
            <Btn href={listHref} variant="line-dark">All {TYPE_LABEL[item.type].toLowerCase()} <Arrow /></Btn>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-black/10 py-[clamp(48px,8vh,90px)]">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <h2 className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-black uppercase italic leading-none text-asphalt">
              Related
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n, i) => <NewsCard key={n.id} item={n} i={i} onOpen={setOpen} />)}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
      {open && (
        <MediaLightbox
          item={open}
          startIndex={open.id === item.id ? from : 0}
          onClose={() => { setOpen(null); setFrom(0) }}
        />
      )}
    </main>
  )
}
