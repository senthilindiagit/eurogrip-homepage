import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "@/lib/router"
import { TYPE_LABEL, TYPE_SLUG, type NewsItem } from "@/lib/newsroom"
import logoWhite from "@/assets/logo-white.png"

/**
 * Masthead used in place of a cover photo for every newsletter.
 *
 * A newsletter's first page is a dense multi-column layout, so a thumbnail of
 * it crops to unreadable fragments — and every issue crops differently. A
 * nameplate carrying the logo, the issue and the year identifies the issue at a
 * glance and gives the whole set one consistent look.
 */
export function NewsletterMasthead({ item }: { item: NewsItem }) {
  /* ids are newsletter-<year>-<issue>; fall back to the title, then the date */
  const m = /^newsletter-(\d{4})-(\d+)/.exec(item.id)
  const fromTitle = /Issue\s+(\d+),\s*(\d{4})/i.exec(item.title)
  const year = m?.[1] ?? fromTitle?.[2] ?? item.date.slice(0, 4)
  const issue = m?.[2] ?? fromTitle?.[1] ?? ""

  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-5"
      style={{
        background: "radial-gradient(125% 100% at 24% 0%, #2b5896 0%, #14315e 55%, #0b1e3c 100%)",
        /* the lockup is sized in container units below, so it stays on one line
           at every card width — the wordmark alone is 9.7:1 */
        containerType: "inline-size",
      }}
    >
      {/* soft diagonal light, kept clear of the media badge in the top corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(118deg, rgba(255,255,255,.10) 0%, transparent 42%)" }}
      />

      <div className="relative">
        <span aria-hidden className="block h-[3px] w-14 bg-gradient-to-r from-racing to-eurored" />
        {/* EUROGRIP NEWS as one lockup, on one line */}
        <div className="mt-3.5 flex flex-nowrap items-center" style={{ gap: "2.2cqw" }}>
          <img
            src={logoWhite}
            alt="Eurogrip"
            className="h-auto shrink-0"
            style={{ width: "62cqw", maxWidth: "300px" }}
          />
          <span
            className="shrink-0 font-display font-black uppercase italic leading-none tracking-[0.05em] text-white"
            style={{ fontSize: "7.6cqw" }}
          >
            News
          </span>
        </div>
      </div>

      <div className="relative">
        <span aria-hidden className="block h-px w-full bg-white/20" />
        <div className="mt-2.5 flex items-end justify-between">
          <span className="font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-sky-300">
            {issue ? `Issue ${issue}` : "Newsletter"}
          </span>
          <span className="font-display text-[1.1rem] font-black italic leading-none text-white/90">{year}</span>
        </div>
      </div>
    </div>
  )
}

/** how an item wants to be opened — a page of its own, or the overlay */
export function opensAsPage(item: NewsItem) {
  return Boolean(item.body?.length)
}

export function storyHref(item: NewsItem) {
  return `/newsroom/${TYPE_SLUG[item.type]}/${item.id.replace(/^(event|coverage|newsletter)-/, "")}`
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

function MediaBadge({ item }: { item: NewsItem }) {
  const kind = item.video
    ? { label: "Video", icon: "play" }
    : item.images?.length
      ? { label: `${item.images.length} photos`, icon: "gallery" }
      : item.pdf
        ? { label: "PDF", icon: "doc" }
        : opensAsPage(item)
          ? { label: "Read", icon: "read" }
          : null
  if (!kind) return null

  const paths: Record<string, string> = {
    play: "M8 5l11 7-11 7V5z",
    gallery: "M3 7h13v10H3zM8 4h13v10",
    doc: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zm0 0v5h5",
    read: "M4 5h16M4 12h16M4 19h10",
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={paths[kind.icon]} />
      </svg>
      {kind.label}
    </span>
  )
}

export function NewsCard({
  item,
  i = 0,
  onOpen,
  size = "default",
  showType = true,
  shortCover = false,
}: {
  item: NewsItem
  i?: number
  onOpen: (item: NewsItem) => void
  size?: "default" | "wide"
  showType?: boolean
  /** shallow cover plate — for masthead covers that carry no photograph */
  shortCover?: boolean
}) {
  const reduce = useReducedMotion()
  const { navigate } = useRouter()
  const page = opensAsPage(item)
  const href = page ? storyHref(item) : undefined

  const activate = () => (page ? navigate(storyHref(item)) : onOpen(item))

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.16, 0.84, 0.34, 1], delay: Math.min(i, 6) * 0.05 }}
      className="group h-full"
    >
      <a
        href={href ?? "#"}
        onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); activate() } }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-[0_26px_60px_-45px_rgba(11,38,74,.55)] transition-shadow hover:shadow-[0_34px_70px_-40px_rgba(11,38,74,.5)]"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-mist",
            /* a masthead needs no photo space, so the newsletter list asks for a
               shallow plate — everywhere else the card keeps its usual ratio */
            shortCover ? "h-[160px]" : size === "wide" ? "aspect-[16/9]" : "aspect-[16/10]"
          )}
        >
          {item.type === "newsletter" ? (
            <NewsletterMasthead item={item} />
          ) : item.cover ? (
            <img
              src={item.cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            /* No photo of its own — some press reprints share one stock shot on
               the source site, and a wrong or repeated picture reads worse than
               none. Name the source instead, on the brand plate. */
            <div
              className="grid h-full place-items-center px-5 text-center"
              style={{ background: "radial-gradient(120% 100% at 30% 0%, #2b5896 0%, #1a3157 55%, #13223c 100%)" }}
            >
              <div>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-sky-300/70" aria-hidden="true">
                  <path d="M4 5h13v14H4zM17 9h3v8a2 2 0 01-2 2M7 9h7M7 13h7M7 16h4" />
                </svg>
                <span className="mt-2.5 block font-display text-[0.95rem] font-black uppercase italic leading-tight text-white">
                  {item.place ?? "Eurogrip"}
                </span>
                <span className="mt-1 block text-[0.66rem] uppercase tracking-[0.14em] text-sky-300">
                  {item.type === "coverage" ? "As reported" : "Newsroom"}
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            {showType ? (
              <span className="rounded-full bg-eurored px-2.5 py-1 font-display text-[0.66rem] font-extrabold uppercase italic tracking-[0.1em] text-white">
                {TYPE_LABEL[item.type].replace(" & coverage", "").replace(" & fairs", "")}
              </span>
            ) : <span />}
            <MediaBadge item={item} />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-[0.72rem] text-slate-500">
            <time dateTime={item.date}>{fmtDate(item.date)}</time>
            {item.place && <><span className="text-slate-300">·</span><span className="truncate">{item.place}</span></>}
          </div>
          <h3 className="mt-2 font-display text-[clamp(1rem,1.4vw,1.16rem)] font-black uppercase italic leading-[1.12] text-asphalt">
            {item.title}
          </h3>
          <p className="mt-2.5 line-clamp-3 text-[0.88rem] font-light leading-relaxed text-slate-600">{item.summary}</p>

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
            {item.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-[3px] bg-mist px-2 py-0.5 text-[0.7rem] font-medium text-slate-500">{t}</span>
            ))}
            <span className="ml-auto font-display text-[0.74rem] font-extrabold uppercase italic tracking-wide text-racing transition-colors group-hover:text-eurored">
              {page ? "Read" : item.video ? "Watch" : item.images?.length ? "View" : "Open"} →
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  )
}
