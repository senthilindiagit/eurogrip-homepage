import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { RIDERS } from "@/lib/site-data"
import { Reveal, SectionHead, Marquee } from "./ui"
import riderImg from "@/assets/race-bike.webp"
import logoTvs from "@/assets/logo-tvs.webp"
import logoBajaj from "@/assets/logo-bajaj.webp"
import logoSuzuki from "@/assets/logo-suzuki.webp"
import logoYamaha from "@/assets/logo-yamaha.webp"
import logoPiaggio from "@/assets/logo-piaggio.webp"
import logoAprilia from "@/assets/logo-aprilia.webp"
import logoHero from "@/assets/logo-hero.webp"

const LOGOS = [logoTvs, logoHero, logoBajaj, logoSuzuki, logoYamaha, logoPiaggio, logoAprilia]
const BRIGHTEN = "brightness(1.18) saturate(1.22) contrast(1.06)"

function PlayIcon() {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-full bg-eurored/95 shadow-[0_0_0_0_rgba(237,28,36,.5)] animate-pulse">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
    </span>
  )
}

// mud/sand flecks kicked up under the back (left) wheel
const FLECKS = [
  { l: "6%", t: "90%", s: 8 }, { l: "12%", t: "96%", s: 6 }, { l: "18%", t: "89%", s: 10 },
  { l: "24%", t: "95%", s: 6 }, { l: "9%", t: "98%", s: 7 }, { l: "21%", t: "98%", s: 5 },
  { l: "27%", t: "93%", s: 7 }, { l: "15%", t: "92%", s: 4 }, { l: "3%", t: "94%", s: 5 },
]

function RiderImage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [55, -55])
  const rotate = useTransform(scrollYProgress, [0, 1], [4, -2])
  const rotateY = useTransform(scrollYProgress, [0, 1], [11, -7])

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ perspective: 1100 }}>
      <motion.div style={{ y, rotate, rotateY }} className="relative">
        {/* mud / sand spray under the back wheel */}
        <div className="pointer-events-none absolute" style={{ left: "15%", top: "94%", width: "42%", height: "120px", transform: "translate(-50%,-50%)", background: "radial-gradient(closest-side, rgba(164,128,82,.6), rgba(120,92,58,.22) 55%, transparent 76%)", filter: "blur(10px)" }} />
        {FLECKS.map((f, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute z-20 rounded-full"
            style={{ left: f.l, top: f.t, width: f.s, height: f.s, background: i % 2 ? "#b08a55" : "#7a5e3c", filter: "blur(0.4px)" }}
            animate={{ opacity: [0.35, 0.9, 0.35], y: [0, -5, 0] }}
            transition={{ duration: 2.4 + (i % 4) * 0.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
        {/* the rider */}
        <img
          src={riderImg}
          alt="TVS Racing rider on a Eurogrip-shod motocross bike"
          className="relative z-10 w-full"
          style={{ filter: `${BRIGHTEN} drop-shadow(0 30px 40px rgba(0,0,0,.55))` }}
        />
      </motion.div>
    </div>
  )
}

type Rider = (typeof RIDERS)[number]

function RiderCard({ who, tag, quote, img, clip, url }: Rider) {
  const vref = useRef<HTMLVideoElement>(null)
  const onEnter = () => {
    const v = vref.current
    if (!v) return
    v.currentTime = 0
    v.play().catch(() => {})
  }
  const onLeave = () => {
    const v = vref.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative block aspect-[9/13] overflow-hidden rounded-md border border-white/10 transition-transform duration-500 hover:-translate-y-1.5"
    >
      {/* poster (always shown) + clip that plays on hover */}
      <img src={img} alt={`${who} — ${tag}`} className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={vref}
        src={clip}
        poster={img}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e] via-[#080a0e]/55 to-transparent" />
      {/* play affordance — fades out as the clip takes over */}
      <div className="absolute inset-0 grid place-items-center transition-opacity duration-300 group-hover:opacity-0">
        <PlayIcon />
      </div>
      {/* caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <p className="mb-3 text-[0.92rem] leading-snug text-slate-200">“{quote}”</p>
        <div className="font-display text-[0.95rem] font-bold italic text-white">{who}</div>
        <div className="text-[0.78rem] uppercase tracking-wide text-slate-400">{tag}</div>
      </div>
    </a>
  )
}

export function Racing() {
  return (
    <section id="racing" className="bg-carbon py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-[clamp(40px,6vh,56px)] grid items-center gap-8 lg:grid-cols-[1fr_clamp(340px,38%,460px)]">
          <SectionHead
            eyebrow="Racing & partnership"
            title={<>Proven by riders.<br />Not just by us.</>}
            lede="From championship grids to OEM fitments and the road-trip diaries of everyday riders — the proof of a Eurogrip tyre is in the people who trust it."
            ledeClassName="max-w-none lg:text-[1.04rem]"
          />
          <RiderImage />
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {RIDERS.map((r, i) => (
            <Reveal key={r.who} i={i % 4}>
              <RiderCard {...r} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="mb-6 text-center text-[0.78rem] uppercase tracking-[0.12em] text-slate-500">OEM partners &amp; trusted fitments</div>
          <Marquee speed={30}>
            {LOGOS.map((src, i) => (
              <img key={i} src={src} alt="" className="h-8 w-auto object-contain opacity-50 transition-opacity duration-300 hover:opacity-100" style={{ filter: "brightness(0) invert(1)" }} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
