import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { useEffect, useRef, type ReactNode } from "react"
import { Reveal } from "@/components/site/ui"
import { useRouter } from "@/lib/router"
import { cn } from "@/lib/utils"
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

/* ------------------------------------------------------------ review wall -- */
/**
 * The reviews on the inside of a sphere, with the copy standing still at its
 * centre. The "Made with Squarespace" pattern the client referenced, then
 * corrected: it is not a scattered grid, it is real geometry.
 *
 * Every tile sits at a longitude and a latitude and is turned to face the
 * middle — `rotateY(lon) rotateX(-lat) translateZ(R)`. That single transform is
 * where the skew in the reference comes from: a tile out at 70 degrees is not
 * randomly rotated, it is simply pointing at you from the side of the sphere.
 * An earlier pass gave each tile an arbitrary angle instead, which looked
 * scattered but could never read as one continuous surface you turn.
 *
 * **No row sits on the equator.** The latitudes are ±17 and ±41, which leaves a
 * clear band across the middle for the copy — the reference does the same, and
 * it is why the words need no panel behind them.
 *
 * Drag to turn it: horizontally all the way round, vertically only a little
 * (clamped to ±14°, since past that you are looking at the poles and the
 * illusion goes). No autoplay — measured off the client's recording, the field
 * is completely still until the pointer moves.
 */
/* The eye sits AT the centre of the sphere, so you are inside it looking out at
   the inner wall — which is why PERSPECTIVE and RADIUS are equal. Every visible
   tile is then exactly RADIUS away and renders at scale P/R = 1, uniformly:
   that even sizing is the giveaway in the reference, and it is impossible from
   outside the ball, where near tiles are large and far ones small.

   The cost of putting the eye on the surface's centre is that tiles swinging
   past ±90° cross the eye plane, where the projection blows up. They are culled
   in `paint()` instead — which also means only the front arc is ever painted. */
const PERSPECTIVE = 900
const RADIUS = 900
const TILE_W = 180
const TILE_H = 113
/* 20 gives an 18° pitch against a 12.8° tile, so 29% of the pitch is gap. At 24
   the pitch was 15° against a 14° tile and the cards very nearly touched. */
const PER_RING = 20
/**
 * Four rings, no more: two above the copy and two below.
 *
 * Latitudes are solved against the projection rather than picked by eye, since
 * a ring lands at P·tan(lat) on screen. ±11 spans 117–232px from centre and ±22
 * spans 303–425, which gives a 70px gap between the rows and a clear ±117px
 * band through the middle for the copy. The scene is 860px at its tallest so
 * the outer pair is fully in frame rather than sliced by the edge — earlier
 * passes carried a ±40 pair that never appeared at any sensible height, and a
 * ±24 pair that was always half cut off.
 */
const RINGS = [-22, -11, 11, 22]
const TILT_MAX = 14
/** Extra arc kept beyond the screen edge, so a tile is culled only once it is
    fully outside. It cannot be a fixed angle: CSS projects on z alone, so a
    tile at angle a scales by 1/cos(a) and lands at P·tan(a) — by 78° that is a
    6000px-wide element parked off-screen, and by 90° it is on the eye plane and
    infinite. The visible arc is derived from the viewport instead. */
const ARC_MARGIN = 12

function WallTile({ r, onPlay, dragging }: { r: Review; onPlay: (t: PlayTarget) => void; dragging: () => boolean }) {
  const { navigate } = useRouter()
  const play: PlayTarget | null = r.film
    ? { kind: "file", src: r.film.src }
    : r.videos?.[0]
      ? { kind: "yt", src: r.videos[0].id }
      : null
  /* four of the nineteen carry no film. Rather than leave those cards inert —
     which reads as a broken control, not as a card without a video — they go
     to the reviews page, where the write-up is. */
  const open = () => {
    if (dragging()) return
    if (play) onPlay(play)
    else navigate("/reviews")
  }
  const label = `${r.pub} — ${r.product}`

  return (
    <div className="group/tile relative h-full w-full">
      <button
        type="button"
        /* a drag that ends on a card must not also open it */
        onClick={open}
        aria-label={play ? `Play ${label}` : `${label} — see the reviews`}
        className={cn(
          "relative block h-full w-full overflow-hidden rounded-[10px] bg-[#12161f]",
          "shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] transition-[filter,box-shadow] duration-500",
          "brightness-[.62] saturate-[.9] group-hover/tile:brightness-105 group-hover/tile:saturate-100",
          "cursor-pointer"
        )}
      >
        {r.cover && <img src={r.cover} alt="" loading="lazy" className="h-full w-full object-cover" />}
      </button>
      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 font-display text-[0.66rem] font-extrabold uppercase italic tracking-[0.06em] text-asphalt opacity-0 shadow-[0_10px_26px_-12px_rgba(0,0,0,.85)] transition-opacity duration-300 group-hover/tile:opacity-100">
        {r.pub}
      </span>
    </div>
  )
}

export function ReviewWall({
  items,
  onPlay,
  children,
}: {
  items: Review[]
  onPlay: (t: PlayTarget) => void
  /** the copy that stands still at the centre */
  children: ReactNode
}) {
  const scene = useRef<HTMLDivElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const moved = useRef(false)

  /* Written straight to the element on pointermove rather than through a ticker:
     the sphere should track the finger exactly, and nothing should be running
     when nobody is dragging. The release glide is the only part that needs a
     frame loop. */
  useEffect(() => {
    const box = scene.current
    const el = world.current
    if (!box || !el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lon = 0
    let lat = 0
    let vel = 0
    let last: { x: number; y: number; t: number } | null = null
    let frame = 0

    const cells = Array.from(el.children) as HTMLElement[]
    const shown = cells.map(() => true)
    /* half the horizontal field of view, in degrees, from the scene's width */
    let arc = 50
    const measure = () => {
      const half = box.getBoundingClientRect().width / 2
      arc = (Math.atan(half / PERSPECTIVE) * 180) / Math.PI + ARC_MARGIN
    }
    measure()

    const paint = () => {
      /* translateZ first, so the sphere's centre lands on the eye */
      el.style.transform = `translateZ(${PERSPECTIVE}px) rotateX(${lat.toFixed(2)}deg) rotateY(${lon.toFixed(2)}deg)`
      for (let i = 0; i < cells.length; i++) {
        const own = Number(cells[i].dataset.lon)
        /* where this tile has ended up, folded into -180..180 */
        let a = ((own + lon + 180) % 360 + 360) % 360 - 180
        const vis = Math.abs(a) < arc
        if (vis !== shown[i]) {
          shown[i] = vis
          cells[i].style.visibility = vis ? "visible" : "hidden"
        }
      }
    }
    const glide = () => {
      vel *= 0.94
      lon += vel
      paint()
      frame = Math.abs(vel) > 0.02 ? requestAnimationFrame(glide) : 0
    }

    const down = (e: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame), (frame = 0)
      moved.current = false
      vel = 0
      last = { x: e.clientX, y: e.clientY, t: performance.now() }
      box.dataset.dragging = "1"
      /* Listening on the window rather than capturing the pointer. Capture
         retargets the eventual `click` to the capturing element, so the card's
         own button never received it and nothing happened when you clicked a
         card. This keeps the drag alive outside the section and leaves the
         click on the button where it belongs. */
      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)
      window.addEventListener("pointercancel", up)
    }
    const move = (e: PointerEvent) => {
      if (!last) return
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      if (Math.abs(dx) + Math.abs(dy) > 4) moved.current = true
      lon += dx * 0.22
      lat = Math.max(-TILT_MAX, Math.min(TILT_MAX, lat - dy * 0.07))
      const dt = Math.max(1, performance.now() - last.t)
      vel = (dx * 0.22 * 16) / dt
      last = { x: e.clientX, y: e.clientY, t: performance.now() }
      paint()
    }
    const up = () => {
      if (!last) return
      last = null
      delete box.dataset.dragging
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
      if (Math.abs(vel) > 0.05) frame = requestAnimationFrame(glide)
      /* let a click through only if this was a tap, not a drag */
      window.setTimeout(() => { moved.current = false }, 0)
    }

    const onResize = () => { measure(); paint() }
    window.addEventListener("resize", onResize)
    box.addEventListener("pointerdown", down)
    paint()
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
      box.removeEventListener("pointerdown", down)
    }
  }, [])

  const slots = RINGS.length * PER_RING

  return (
    <div className="relative isolate overflow-hidden bg-[#07080c]">
      <div
        ref={scene}
        /* the hand cursor everywhere except on a card, which is what says the
           whole thing can be turned */
        /* pan-y, not none: this section is most of a phone screen, so a
           vertical swipe has to keep scrolling the page past it. Horizontal
           swipes still reach the handler and turn the sphere. */
        /* Shorter on a phone. The number of cards across the frame is just
           viewport width over card width, so 375px only ever shows two of them
           — 90vh of screen for two cards is a lot of height for very little,
           and at this height the outer ring sits off-frame, leaving two clean
           rows. */
        className="relative h-[clamp(420px,64vh,540px)] cursor-grab touch-pan-y select-none lg:h-[clamp(560px,90vh,860px)] [&[data-dragging]]:cursor-grabbing"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        <div
          ref={world}
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: `translateZ(${PERSPECTIVE}px)` }}
        >
          {RINGS.flatMap((lat, ring) =>
            Array.from({ length: PER_RING }, (_, k) => {
              const i = ring * PER_RING + k
              /* every other ring offset by half a step, so the tiles stagger
                 instead of forming columns */
              const lon = (360 / PER_RING) * k + (ring % 2 ? 180 / PER_RING : 0)
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  data-lon={lon}
                  style={{
                    width: TILE_W,
                    height: TILE_H,
                    marginLeft: -TILE_W / 2,
                    marginTop: -TILE_H / 2,
                    /* negative Z: the tile sits on the wall away from the eye,
                       turned to face back at it */
                    transform: `rotateY(${lon}deg) rotateX(${-lat}deg) translateZ(${-RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <WallTile r={items[i % items.length]} onPlay={onPlay} dragging={() => moved.current} />
                </div>
              )
            })
          )}
        </div>

        {/* the sphere fades off toward the edges, which is most of why the
            centre copy needs nothing behind it */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "radial-gradient(118% 84% at 50% 50%, rgba(7,8,12,0) 34%, rgba(7,8,12,.4) 64%, rgba(7,8,12,.9) 92%, rgba(7,8,12,.98) 100%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "radial-gradient(33% 24% at 50% 50%, rgba(7,8,12,.92) 0%, rgba(7,8,12,.66) 52%, rgba(7,8,12,0) 100%)" }}
        />

        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-5">
          <div className="w-[min(600px,84vw)] text-center [&_a]:pointer-events-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
