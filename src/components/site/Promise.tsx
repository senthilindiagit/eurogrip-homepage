import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Reveal, Eyebrow } from "./ui"

const ITEMS = [
  { o: "Out", b: "live", p: "The road might end — but with high performance, long life and durability, a Eurogrip tyre will outlive the journey." },
  { o: "Out", b: "perform", p: "Crafted with engineering precision and designed by global research centres, Eurogrip outperforms in any road condition." },
  { o: "Out", b: "do", p: "Always ready for the next trip, the next turn and the next challenge — designed to deliver, then better itself." },
]

const VIDEO = "/eurogrip-brand-video.mp4"

/* Rendered via portal so the fixed overlay escapes the Cine 3D transform. */
function FilmLightbox({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 0.84, 0.34, 1] }}
            className="relative w-full max-w-[1000px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close video"
              className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l12 12M13 1L1 13" /></svg>
            </button>
            <video
              src={VIDEO}
              autoPlay
              controls
              playsInline
              className="aspect-video w-full rounded-md border border-white/15 bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

function FilmThumb({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Play the Eurogrip brand film"
      className="group relative block aspect-video w-full overflow-hidden rounded-md border border-white/15 shadow-[0_30px_70px_-30px_rgba(0,0,0,.7)] transition-transform duration-500 hover:-translate-y-1"
    >
      {/* silent looping preview as the thumbnail (same file as the hero — already cached) */}
      <video src={VIDEO} muted loop autoPlay playsInline className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1014]/75 via-transparent to-transparent" />

      {/* play button — lifts, glows and rings on hover */}
      <span className="absolute inset-0 grid place-items-center">
        <span className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 rounded-full bg-eurored/50 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-eurored shadow-[0_10px_35px_-8px_rgba(237,28,36,.8)] transition-transform duration-300 ease-out group-hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" className="ml-1 transition-transform duration-300 group-hover:scale-110"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-left">
        <span className="font-display text-[0.85rem] font-extrabold uppercase italic tracking-[0.08em] text-white">Watch the brand film</span>
        <span className="text-[0.78rem] tracking-[0.08em] text-slate-300">0:46</span>
      </span>
    </button>
  )
}

export function Promise() {
  const [open, setOpen] = useState(false)
  return (
    <section className="border-t border-white/10 bg-gradient-to-b from-steel-2 to-steel py-[clamp(80px,12vh,150px)]">
      <div className="relative z-20 mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 grid items-center gap-10 lg:grid-cols-[1fr_clamp(300px,34vw,440px)]">
          <div className="max-w-[780px]">
            <Reveal><Eyebrow>The brand promise</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-2 text-white text-[clamp(2rem,5vw,4rem)]">Hold a higher standard</h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-4 max-w-[60ch] text-lg text-slate-300">
                Every journey we embark on pushes us further than we have gone before. That promise lives in three words.
              </p>
            </Reveal>
          </div>
          <Reveal i={2}>
            <FilmThumb onOpen={() => setOpen(true)} />
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {ITEMS.map((it, i) => (
            <Reveal key={it.b} i={i} className="border-t border-white/10 px-0 py-7 md:border-l md:border-t-0 md:px-8 md:py-0 [&:first-child]:md:pl-0 [&:first-child]:md:border-l-0">
              <div className="font-display font-black italic uppercase leading-none text-white text-[clamp(2rem,4.4vw,3.4rem)]">
                {it.o}<span className="text-eurored">{it.b}</span>
              </div>
              <p className="mt-3.5 text-[0.98rem] text-slate-400">{it.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
      <FilmLightbox open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
