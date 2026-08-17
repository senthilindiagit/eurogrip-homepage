import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { NewsItem } from "@/lib/newsroom"

/**
 * One overlay for every kind of newsroom media.
 *
 * Images open as a carousel; a PDF opens as its rendered page with a language
 * switcher and a download link; a video opens in a player. Everything gets a
 * share control — the native share sheet where it exists, clipboard otherwise.
 */

type Slide = { src: string; kind: "image" | "page"; label?: string }

function shareUrlFor(item: NewsItem) {
  const u = new URL(window.location.href)
  u.searchParams.set("story", item.id)
  return u.toString()
}

function ShareButton({ item }: { item: NewsItem }) {
  const [done, setDone] = useState<null | "shared" | "copied">(null)

  const share = async () => {
    const url = shareUrlFor(item)
    const data = { title: item.title, text: item.summary, url }
    try {
      if (navigator.share) {
        await navigator.share(data)
        setDone("shared")
      } else {
        await navigator.clipboard.writeText(url)
        setDone("copied")
      }
    } catch {
      /* dismissed, or blocked — leave the button as it was */
      return
    }
    window.setTimeout(() => setDone(null), 2200)
  }

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 text-[0.78rem] font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
      aria-label={`Share: ${item.title}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      {done === "copied" ? "Link copied" : done === "shared" ? "Shared" : "Share"}
    </button>
  )
}

export function MediaLightbox({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const reduce = useReducedMotion()
  const langs = useMemo(() => Object.keys(item.pages ?? item.pdf ?? {}), [item])
  const [lang, setLang] = useState(() => (langs.includes("EN") ? "EN" : langs[0]))

  const slides: Slide[] = useMemo(() => {
    if (item.images?.length) return item.images.map((src) => ({ src, kind: "image" as const }))
    const page = item.pages?.[lang]
    if (page) return [{ src: page, kind: "page" as const, label: lang }]
    // press releases carry no page set — fall back to the document render
    return item.document ? [{ src: item.document, kind: "page" as const }] : []
  }, [item, lang])

  const [i, setI] = useState(0)
  const many = slides.length > 1
  const go = useCallback(
    (d: number) => setI((p) => (p + d + slides.length) % slides.length),
    [slides.length]
  )

  /* lock the page behind the overlay and wire the keyboard */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && many) go(1)
      if (e.key === "ArrowLeft" && many) go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose, go, many])

  const pdfHref = item.pdf?.[lang] ?? item.pdf?.EN ?? Object.values(item.pdf ?? {})[0]

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col bg-[#080e18]/95 backdrop-blur-md"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        {/* bar */}
        <div
          className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[0.9rem] font-extrabold uppercase italic text-white">{item.title}</p>
            <p className="mt-0.5 text-[0.74rem] text-slate-400">
              {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              {item.place ? ` · ${item.place}` : ""}
              {many ? ` · ${i + 1} / ${slides.length}` : ""}
            </p>
          </div>

          {/* language switcher for documents */}
          {langs.length > 1 && (
            <div className="flex gap-1">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setI(0) }}
                  aria-pressed={l === lang}
                  className={`rounded-[3px] px-2.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-wide transition-colors ${
                    l === lang ? "bg-eurored text-white" : "border border-white/20 text-slate-300 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          <ShareButton item={item} />

          {pdfHref && (
            <a
              href={pdfHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 text-[0.78rem] font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" />
              </svg>
              PDF
            </a>
          )}

          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-14">
          {item.video ? (
            <video
              src={item.video}
              poster={item.poster}
              controls
              preload="metadata"
              playsInline
              className="max-h-full max-w-full rounded-lg shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : pdfHref && !item.images?.length ? (
            /* multi-page documents: embed the PDF itself so every page is
               readable, not just the page-1 render */
            <iframe
              key={pdfHref}
              src={`${pdfHref}#view=FitH`}
              title={item.title}
              className="h-full w-full rounded-lg border border-white/10 bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : slides.length ? (
            <>
              {/* keyed but with no exit, so the next frame mounts immediately
                  rather than waiting on an exit animation to finish */}
              <motion.img
                key={slides[i].src}
                src={slides[i].src}
                alt={`${item.title} — ${i + 1} of ${slides.length}`}
                initial={reduce ? false : { opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
                className="max-h-full max-w-full rounded-lg object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)]"
                onClick={(e) => e.stopPropagation()}
              />

              {many && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); go(-1) }}
                    aria-label="Previous"
                    className="absolute left-1 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-white/15 sm:left-3"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); go(1) }}
                    aria-label="Next"
                    className="absolute right-1 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-white/15 sm:right-3"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </>
              )}
            </>
          ) : (
            <p className="text-slate-400">Nothing to preview.</p>
          )}
        </div>

        {/* filmstrip */}
        {many && (
          <div
            className="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {slides.map((s, n) => (
              <button
                key={s.src}
                onClick={() => setI(n)}
                aria-label={`Go to image ${n + 1}`}
                aria-current={n === i}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded transition-all ${
                  n === i ? "ring-2 ring-eurored" : "opacity-45 hover:opacity-80"
                }`}
              >
                <img src={s.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
