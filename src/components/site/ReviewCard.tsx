import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { Reveal } from "@/components/site/ui"
import type { Review } from "@/lib/reviews"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* --------------------------------------------------------------- lightbox -- */
/** what the player was handed: a YouTube id, or a file we host */
export type PlayTarget = { kind: "yt" | "file"; src: string }

export function VideoLightbox({ target, onClose }: { target: PlayTarget; onClose: () => void }) {
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-[960px]"
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.3, ease: ENTER }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-11 right-0 flex items-center gap-1.5 font-display text-sm font-extrabold uppercase italic text-white/80 transition-colors hover:text-white"
        >
          Close ✕
        </button>
        <div className="aspect-video overflow-hidden rounded-lg border border-white/15 bg-black shadow-2xl">
          {target.kind === "file" ? (
            <video
              src={target.src}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="h-full w-full bg-black"
            />
          ) : (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${target.src}?autoplay=1&rel=0`}
              title="Eurogrip review video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

/* ------------------------------------------------------------------- card -- */
export function ReviewCard({ r, i, onPlay }: { r: Review; i: number; onPlay: (t: PlayTarget) => void }) {
  const play: PlayTarget | null = r.film
    ? { kind: "file", src: r.film.src }
    : r.videos?.length
      ? { kind: "yt", src: r.videos[0].id }
      : null
  return (
    <Reveal i={i % 3}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_70px_-45px_rgba(11,38,74,.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-racing/40">
        <div className="relative aspect-[16/10] overflow-hidden bg-mist">
          {r.cover ? (
            <img
              src={r.cover}
              alt={`${r.pub} — ${r.product} review`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            /* branded cover for the Instagram community card */
            <div className="grid h-full w-full place-items-center bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]">
              <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/40 bg-white/10 text-white">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" /></svg>
              </span>
            </div>
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(13,26,48,.8) 100%)" }} />
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {r.period && (
              <span className="rounded-[2px] bg-eurored px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white">
                {r.period}
              </span>
            )}
            {r.country && (
              <span className="rounded-[2px] bg-midnight/85 px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white backdrop-blur-sm">
                {r.country}
              </span>
            )}
          </div>
          {play && (
            <button
              type="button"
              onClick={() => onPlay(play)}
              aria-label={`Play ${r.pub} video review`}
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-eurored/95 shadow-[0_8px_30px_rgba(237,28,36,.5)] transition-transform duration-300 group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
            <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.14em] text-sky-300">{r.pub}</span>
            <h3 className="mt-0.5 font-display text-[1.1rem] font-black uppercase italic leading-none text-white">{r.product}</h3>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          {r.vehicle && <span className="text-[0.74rem] uppercase tracking-[0.06em] text-slate-500">{r.vehicle}</span>}
          <p className="text-[0.88rem] font-light leading-relaxed text-slate-600">{r.blurb}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
            {r.film && (
              <button
                type="button"
                onClick={() => onPlay({ kind: "file", src: r.film!.src })}
                className="font-display text-[0.78rem] font-extrabold uppercase italic tracking-wide text-eurored transition-colors hover:text-racing"
              >
                {r.film.label} ▸
              </button>
            )}
            {r.videos?.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onPlay({ kind: "yt", src: v.id })}
                className="font-display text-[0.78rem] font-extrabold uppercase italic tracking-wide text-eurored transition-colors hover:text-racing"
              >
                {v.label} ▸
              </button>
            ))}
            {/* PDF summaries only where there's no video review to watch */}
            {!play && r.pdfs?.map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-[0.76rem] font-medium text-slate-600 transition-colors hover:border-racing hover:text-racing"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" /></svg>
                {p.label}
              </a>
            ))}
            {r.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.78rem] font-medium text-racing underline-offset-4 transition-colors hover:text-eurored hover:underline"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  )
}
