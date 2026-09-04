import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { createPortal } from "react-dom"
import { KIND_LABEL, type CoverageItem } from "@/lib/coverage-types"

/* Card and viewer for a single press-coverage article. Kept out of the
   coverage page so the newsroom landing can show real coverage cards without
   pulling the whole archive into the main bundle. */

/* ------------------------------------------------------------- lightbox ---- */
/**
 * Clipping viewer for print pieces. Separate from the newsroom MediaLightbox
 * because a clipping is a document to be read — it opens at full height with
 * the page scrolling, rather than being fitted to the viewport.
 */
export function ClippingLightbox({
  item, startIndex, onClose,
}: { item: CoverageItem; startIndex: number; onClose: () => void }) {
  const [i, setI] = useState(startIndex)
  const many = item.images.length > 1
  const go = (d: number) => setI((p) => (p + d + item.images.length) % item.images.length)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && many) go(1)
      if (e.key === "ArrowLeft" && many) go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey) }
  })

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#080e18]/96 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.publication} — ${item.headline}`}
      onClick={onClose}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[0.9rem] font-extrabold uppercase italic text-white">
            {item.publication}
          </p>
          <p className="mt-0.5 truncate text-[0.74rem] text-slate-400">
            {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            {item.edition ? ` · ${item.edition}` : ""}
            {item.pageNo ? ` · p. ${item.pageNo}` : ""}
            {many ? ` · ${i + 1} / ${item.images.length}` : ""}
          </p>
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 text-[0.78rem] font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
          >
            View online <ExternalIcon />
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

      <div className="relative flex min-h-0 flex-1 justify-center overflow-auto px-4 pb-6 sm:px-14">
        <img
          key={item.images[i]}
          src={item.images[i]}
          alt={`${item.publication} — ${item.headline}`}
          className="h-auto max-w-full self-start rounded-lg bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)]"
          onClick={(e) => e.stopPropagation()}
        />
        {many && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); go(-1) }}
              aria-label="Previous page"
              className="fixed left-2 top-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-white/15 sm:left-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1) }}
              aria-label="Next page"
              className="fixed right-2 top-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-white/15 sm:right-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      <path d="M7 17L17 7M17 7h-7m7 0v7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ----------------------------------------------------------------- card ---- */
function KindTag({ item }: { item: CoverageItem }) {
  const tone =
    item.kind === "print" ? "bg-asphalt/85" : item.kind === "social" ? "bg-racing/90" : "bg-eurored/90"
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${tone} px-2.5 py-1 font-display text-[0.64rem] font-extrabold uppercase italic tracking-[0.1em] text-white backdrop-blur-sm`}>
      {KIND_LABEL[item.kind]}
      {item.kind === "print" && item.pageNo ? ` · p.${item.pageNo}` : ""}
    </span>
  )
}

export function CoverageCard({
  item, i, onOpen,
}: { item: CoverageItem; i: number; onOpen: (item: CoverageItem, index: number) => void }) {
  const reduce = useReducedMotion()
  const online = Boolean(item.url)
  const many = item.images.length > 1

  /* online pieces go to the publisher; print clippings open in the viewer */
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img
          src={item.images[0]}
          alt=""
          loading="lazy"
          /* clippings are documents — anchor the top so the masthead shows */
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <KindTag item={item} />
          {many && (
            <span className="rounded-full bg-black/55 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              {item.images.length} pages
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[0.72rem] text-slate-500">
          <span className="truncate font-display text-[0.76rem] font-extrabold uppercase italic tracking-[0.05em] text-racing">
            {item.publication}
          </span>
          <span className="text-slate-300">·</span>
          <time dateTime={item.date}>
            {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </time>
        </div>
        <h3 className="mt-2 line-clamp-3 font-display text-[0.98rem] font-black uppercase italic leading-[1.16] text-asphalt">
          {item.headline}
        </h3>
        {item.group && (
          <p className="mt-2 line-clamp-1 text-[0.78rem] font-light text-slate-500">{item.group}</p>
        )}
        <span className="mt-auto flex items-center gap-1.5 pt-4 font-display text-[0.74rem] font-extrabold uppercase italic tracking-wide text-racing transition-colors group-hover:text-eurored">
          {online ? "View online" : many ? "View clipping" : "View clipping"}
          {online ? <ExternalIcon /> : <span className="transition-transform group-hover:translate-x-1">→</span>}
        </span>
      </div>
    </>
  )

  const shell =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-[0_26px_60px_-45px_rgba(11,38,74,.55)] transition-shadow hover:shadow-[0_34px_70px_-40px_rgba(11,38,74,.5)]"

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 0.84, 0.34, 1], delay: Math.min(i, 5) * 0.04 }}
      className="h-full"
    >
      {online ? (
        <a href={item.url} target="_blank" rel="noreferrer noopener" className={shell}>
          {body}
        </a>
      ) : (
        <button onClick={() => onOpen(item, 0)} className={shell}>
          {body}
        </button>
      )}
    </motion.article>
  )
}
