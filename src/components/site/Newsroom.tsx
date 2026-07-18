import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NEWS } from "@/lib/site-data"
import { Reveal, Eyebrow, Btn, Arrow } from "./ui"

function PlayBadge() {
  return (
    <span className="grid h-16 w-16 place-items-center rounded-full bg-eurored/95 shadow-[0_8px_30px_rgba(237,28,36,.5)] transition-transform duration-300 group-hover:scale-110">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
    </span>
  )
}

export function Newsroom() {
  const [video, setVideo] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <section id="news" className="bg-mist py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-[clamp(40px,6vh,56px)] flex flex-wrap items-end justify-between gap-5">
          <div>
            <Reveal><Eyebrow>Newsroom</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-2 text-asphalt text-[clamp(1.7rem,3.8vw,2.9rem)]">The latest from Eurogrip</h2>
            </Reveal>
          </div>
          <Reveal i={2}>
            <Btn href="https://www.youtube.com/@eurogriptyres/videos" variant="blue">All stories <Arrow /></Btn>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS.map((n, i) => {
            const isVideo = n.type === "video"
            const inner = (
              <>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={n.img} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f141b] via-transparent to-transparent" />
                  <span className="absolute left-3.5 top-3.5 rounded-[2px] bg-eurored px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white">{n.tag}</span>
                  {isVideo && (
                    <span className="absolute inset-0 grid place-items-center"><PlayBadge /></span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className="text-[0.72rem] uppercase tracking-[0.08em] text-slate-500">{n.date}{isVideo ? " · Video" : ""}</span>
                  <h3 className="font-display text-[1.02rem] font-extrabold uppercase italic leading-tight text-[#11151b]">{n.title}</h3>
                  <p className="text-[0.85rem] font-light text-slate-600">{n.excerpt}</p>
                  <span className="mt-auto pt-2 font-display text-[0.8rem] font-extrabold uppercase italic tracking-wide text-eurored">
                    {isVideo ? "Watch now ▸" : "Read story →"}
                  </span>
                </div>
              </>
            )
            const cls = "group flex h-full flex-col overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_12px_30px_-18px_rgba(16,35,70,.25)] text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-racing/40"
            return (
              <Reveal key={n.title} i={i % 3}>
                {isVideo ? (
                  <button type="button" onClick={() => setVideo(n.videoId!)} className={cls + " w-full"}>{inner}</button>
                ) : (
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* video popup */}
      <AnimatePresence>
        {video && (
          <motion.div
            className="fixed inset-0 z-[200] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-[960px]"
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 0.84, 0.34, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVideo(null)}
                aria-label="Close video"
                className="absolute -top-11 right-0 flex items-center gap-1.5 font-display text-sm font-extrabold uppercase italic text-white/80 transition-colors hover:text-white"
              >
                Close ✕
              </button>
              <div className="aspect-video overflow-hidden rounded-lg border border-white/15 bg-black shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${video}?autoplay=1&rel=0`}
                  title="Eurogrip video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
