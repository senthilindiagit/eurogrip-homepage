import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow, Marquee } from "@/components/site/ui"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { LOGOS } from "@/components/site/Racing"
import { useRouter } from "@/lib/router"
import oeRs457 from "@/assets/partners/oe-rs457.webp"
import oeTuono457 from "@/assets/partners/oe-tuono457.webp"
import oeG310r from "@/assets/partners/oe-g310r.webp"
import oeBeverly from "@/assets/partners/oe-beverly310.webp"
import oeAskoll from "@/assets/partners/oe-askoll.webp"
import oeSxr50 from "@/assets/partners/oe-sxr50.webp"
import raceBike from "@/assets/race-bike.webp"
import suzukiVstrom from "@/assets/partners/suzuki-vstrom.webp"
import logoAprilia from "@/assets/logo-aprilia.webp"
import logoSuzuki from "@/assets/logo-suzuki.webp"
import logoPiaggio from "@/assets/logo-piaggio-knockout.webp"
import logoBmw from "@/assets/logo-bmw.webp"
import goggiaHardDragon from "@/assets/partners/goggia-harddragon.webp"
import cskPhoto from "@/assets/partners/csk.webp"
import logoCsk from "@/assets/partners/logo-csk.webp"
import logoTvs from "@/assets/logo-tvs.webp"
import dhoniPhoto from "@/assets/yt-dhoni.webp"
import dhoniKv from "@/assets/partners/dhoni-ambassador.webp"
import tvcRideon1 from "@/assets/partners/tvc-rideon-1.webp"
import tvcRideon2 from "@/assets/partners/tvc-rideon-2.webp"

/* ------------------------------------------------------------------ data ----
   OE fitments from the client's "OE — Eurogrip Original Equipment" deck;
   partnership stories from the Exports Sales Pitch Deck & press releases. */
const FITMENTS = [
  { img: oeRs457, tyre: "Protorq Extreme", brand: "Aprilia", model: "RS 457", sizes: ["Front · 110/70 ZR 17 54W TL", "Rear · 150/60 ZR 17 66W TL"], note: "Global OE on Aprilia's sports twin — a landmark fitment for the brand." },
  { img: oeTuono457, tyre: "Protorq Extreme", brand: "Aprilia", model: "Tuono 457", sizes: ["Front · 110/70 ZR 17 54W TL", "Rear · 150/60 ZR 17 66W TL"], note: "The naked 457 rides out of the factory on the same steel-belted radials." },
  { img: oeG310r, tyre: "Protorq Extreme", brand: "BMW Motorrad", model: "G310R", sizes: ["Front · 110/70 ZR 17 54W TL", "Rear · 150/60 ZR 17 66W TL"], note: "Selected as Original Equipment for the BMW G310R globally." },
  { img: oeBeverly, tyre: "Bee Connect", brand: "Piaggio", model: "Beverly 310", sizes: ["Front · 110/70 - 16 52S TL", "Rear · 140/70 - 14 68S TL REINF"], note: "Piaggio Italy's choice for the Beverly urban crossover — and Vespa scooters." },
  { img: oeAskoll, tyre: "Bee Connect", brand: "Askoll", model: "XKP · NGS · EVOlution", sizes: ["Front · 90/80 - 16 · 80/80 - 16 REINF", "Rear · 110/70 - 16 52S TL"], note: "OE supplier for Askoll's entire electric two-wheeler range." },
  { img: oeSxr50, tyre: "Conta 545", brand: "Aprilia", model: "SXR50", sizes: ["Front · 120/70 - 12 58P REINF TL", "Rear · 120/70 - 12 58P REINF TL"], note: "City rubber for Aprilia's compact crossover scooter." },
]

/* hero collage — the newest & most important partnership moments; one light
   video tile (marquee renders children twice, so keep media lean) */
const COLLAGE: { src: string; alt: string; video?: string; logo?: string; logoTall?: boolean }[] = [
  { src: "/newsroom/poster/abr-festival-2026.webp", video: "/newsroom/video/abr-festival-2026.mp4", alt: "ABR Festival — the Trailhound range in the field" },
  { src: oeRs457, alt: "Aprilia RS 457 on Protorq Extreme", logo: logoAprilia },
  { src: goggiaHardDragon, alt: "Sonny Goggia at Hard Dragon" },
  { src: "/newsroom/events/eicma-2025/cover.webp", alt: "The Eurogrip stand at EICMA 2025" },
  { src: oeG310r, alt: "BMW G310R on Protorq Extreme", logo: logoBmw },
  { src: suzukiVstrom, alt: "Suzuki V-Strom 800 on Trailhound STR in the Pyrenees", logo: logoSuzuki },
  { src: cskPhoto, alt: "Chennai Super Kings and Eurogrip", logo: logoCsk, logoTall: true },
  { src: "/newsroom/poster/motorrader-dortmund-2026.webp", alt: "Motorräder Dortmund" },
  { src: oeBeverly, alt: "Piaggio Beverly 310 on Bee Connect", logo: logoPiaggio },
  { src: dhoniPhoto, alt: "M S Dhoni — TVS Eurogrip Brand Ambassador", logo: logoTvs },
  { src: "/newsroom/poster/the-tire-cologne-2024.webp", alt: "The Tire Cologne" },
]
const TILE_Y = [0, 26, 10, 32, 4, 20, 14, 30, 6, 24]
const TILE_R = [-2.5, 1.8, -1.2, 2.6, -1.6, 1.2, -2.2, 2.2, -1, 1.6]

const ENTER = [0.16, 0.84, 0.34, 1] as const

function CollageHero() {
  const reduce = useReducedMotion()
  return (
    <div className="relative overflow-x-clip" style={{ background: "linear-gradient(180deg, #4a83cf 0%, #3a6cb0 62%, #e7eef7 100%)" }}>
      <section className="relative overflow-hidden pb-[clamp(36px,5vh,56px)] pt-[clamp(104px,15vh,140px)]">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 55% at 50% 0%, rgba(255,255,255,.22), transparent 60%)" }} />
        {/* centred content */}
        <div className="relative mx-auto max-w-[1280px] px-5 text-center sm:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-[0.16em] text-white">
              <span className="h-[2px] w-5 bg-eurored" /> Racing &amp; Partnerships
            </span>
          </Reveal>
          <motion.h1
            className="italic-display mx-auto mt-5 text-white leading-[0.96] text-[clamp(2rem,4.6vw,3.6rem)]"
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ENTER, delay: 0.08 }}
          >
            Built with the best.<br />Proven in competition.
          </motion.h1>
          <motion.p
            className="mx-auto mt-5 max-w-[86ch] text-[clamp(0.95rem,1.3vw,1.1rem)] font-light leading-relaxed text-slate-200"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ENTER, delay: 0.2 }}
          >
            OEM fitments engineered alongside the world's two-wheeler makers, racing programmes
            <br className="hidden sm:block" />
            that punish every compound, and the partners who carry the badge.
          </motion.p>
          <motion.div
            className="mt-7 flex flex-wrap justify-center gap-3.5"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ENTER, delay: 0.3 }}
          >
            <Btn href="#oe" variant="red">Explore OE fitments <Arrow /></Btn>
            <Btn href="/contact" variant="line">Partner with us</Btn>
          </motion.div>
        </div>

        {/* flowing partnership collage */}
        <motion.div
          className="relative mt-[clamp(34px,6vh,54px)]"
          initial={reduce ? false : { opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ENTER, delay: 0.32 }}
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
          }}
        >
          <Marquee speed={52} pauseOnHover={false} className="[--gap:1.4rem] pb-9 pt-2">
            {COLLAGE.map((c, i) => (
              <div
                key={c.alt}
                className="relative w-[clamp(140px,15vw,205px)] shrink-0 overflow-hidden rounded-xl border border-white/25 shadow-[0_10px_24px_-14px_rgba(6,18,38,.4)] transition-transform duration-500 hover:scale-[1.04]"
                style={{ transform: `translateY(${TILE_Y[i % TILE_Y.length]}px) rotate(${TILE_R[i % TILE_R.length]}deg)` }}
              >
                {c.video ? (
                  <video src={c.video} poster={c.src} muted loop autoPlay playsInline preload="metadata" className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <img src={c.src} alt={c.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                )}
                {c.logo && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/25 to-transparent p-3 pt-9">
                    <img src={c.logo} alt="" aria-hidden className={`${c.logoTall ? "h-14" : "h-8"} w-auto max-w-[78%] object-contain`} style={{ filter: "brightness(0) invert(1)" }} />
                  </div>
                )}
              </div>
            ))}
          </Marquee>
        </motion.div>
      </section>
    </div>
  )
}

const RACING = [
  {
    img: "/newsroom/events/campa-mack-2025/cover.webp",
    tag: "Enduro World Championship",
    title: "Enrico Rinaldi rides EnduroGP",
    body: "Young Italian talent Enrico Rinaldi debuts in the Paulo Duarte FIM EnduroGP World Championship — eight rounds across Europe on FIM-homologated Climber XC and XC-R rubber, feeding race data straight back into the range.",
  },
  {
    img: raceBike,
    tag: "One Make Racing",
    title: "Petronas TVS One Make Championship",
    body: "Technical Partner to the Petronas TVS India One Make Championship in 2024 and 2025 — India's grassroots-to-grid racing ladder, run on Eurogrip rubber.",
  },
  {
    img: goggiaHardDragon,
    tag: "Hard Enduro",
    title: "Hard Dragon, with Sonny Goggia",
    body: "Eurogrip backs Hard Dragon, one of Italy's toughest hard-enduro events, run in the Apennines by former European Superenduro champion Sonny Goggia — the proving stage for the Climber XC-R Supersoft.",
  },
  {
    img: "/newsroom/events/transborgaro-2024/cover.webp",
    tag: "Event Sponsorships",
    title: "Italy's off-road calendar",
    body: "Sponsor of the events where off-road Italy gathers — TransBorgaro, Motovigna, Campa Mack, Rat Race, Volterra–Piombino, Malpensa MX Track and the World Legends X-Country series.",
  },
  {
    img: "/newsroom/events/mototrip-2026/cover.webp",
    tag: "Riders & Creators",
    title: "Riders who carry the badge",
    body: "Collaborations with riders and creators across Italy, Latin America, Sri Lanka, Nepal and Bangladesh — including Argentine adventurer Gastón Gatto Suárez, WNRC 2023 podium finisher and Moto Enduro Championship 2024 runner-up.",
  },
  {
    img: cskPhoto,
    tag: "Cricket Sponsorship",
    title: "Chennai Super Kings",
    body: "Principal sponsor of Chennai Super Kings for three seasons (2022–24) — the Eurogrip mark carried front-of-jersey on one of the biggest stages in world sport.",
  },
]

/* ===================== Brand Ambassador — M S Dhoni =====================
   Announced 4 Dec 2024; facts & quotes via tyre-trends.com. TVCs from the
   official "Ride On, And On" campaign. */
const TVCS = [
  { id: "95nBigi4zYU", img: tvcRideon1, label: "Ride On, And On — Film 1" },
  { id: "5JhDVidJAWA", img: tvcRideon2, label: "Ride On, And On — Film 2" },
]

function TvcLightbox({ videoId, onClose }: { videoId: string; onClose: () => void }) {
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
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Eurogrip TVC"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

function DhoniAmbassador() {
  const [video, setVideo] = useState<string | null>(null)
  useEffect(() => {
    if (!video) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [video])

  return (
    <section
      id="brand-ambassador"
      className="relative overflow-hidden py-[clamp(56px,9vh,110px)]"
      style={{ background: "linear-gradient(118deg, #1b46b8 0%, #0e2a7a 55%, #0a1d55 100%)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 70% at 18% 40%, rgba(90,160,255,.35), transparent 65%)" }} />
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-[0.85fr_1.15fr]">
          {/* the campaign key visual */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/15 shadow-[0_44px_100px_-44px_rgba(0,10,40,.8)]">
              <img src={dhoniKv} alt="M S Dhoni with a stack of Eurogrip tyres" className="w-full" />
            </div>
          </Reveal>

          <div>
            <Reveal><Eyebrow className="text-sky-300 [&::before]:bg-sky-300">Brand Ambassador</Eyebrow></Reveal>
            <Reveal i={1}>
              <h2 className="italic-display mt-3 text-white text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.04]">
                M S Dhoni rides<br />with Eurogrip
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-4 max-w-[56ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-200">
                In December 2024, TVS Srichakra signed M S Dhoni as Brand Ambassador for Eurogrip Tyres and its complete product range — a rider long before he was a cricketer.
              </p>
            </Reveal>
            <Reveal i={3}>
              <blockquote className="mt-5 max-w-[56ch] border-l-2 border-eurored pl-4 text-[0.95rem] font-light italic leading-relaxed text-sky-100">
                "My love for motorcycles and riding began long before my cricketing journey — I have had the chance to ride everything from timeless classics to top-of-the-line superbikes. Choosing the right tyres is essential for a safe and enjoyable ride, and Eurogrip Tyres' expertise in this domain stands out."
                <footer className="mt-2 font-display text-[0.72rem] font-extrabold uppercase italic not-italic tracking-[0.12em] text-slate-300">— M S Dhoni</footer>
              </blockquote>
            </Reveal>

            {/* the TVCs */}
            <Reveal i={4} className="mt-8">
              <h3 className="font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.16em] text-sky-300">TVCs</h3>
              <div className="mt-3.5 grid grid-cols-2 gap-4">
                {TVCS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setVideo(t.id)}
                    className="group relative overflow-hidden rounded-xl border border-white/15 text-left transition-transform duration-500 hover:-translate-y-1"
                  >
                    <img src={t.img} alt={t.label} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#050f2e]/85 via-transparent to-transparent" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-eurored/95 shadow-[0_8px_30px_rgba(237,28,36,.5)] transition-transform duration-300 group-hover:scale-110">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-3 font-display text-[0.74rem] font-extrabold uppercase italic tracking-wide text-white">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {video && <TvcLightbox videoId={video} onClose={() => setVideo(null)} />}
      </AnimatePresence>
    </section>
  )
}

export function Partnerships() {
  const { path } = useRouter()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [path])

  return (
    <main>
      {/* hero — flowing partnership collage with centred content */}
      <CollageHero />

      {/* OE fitments */}
      <section id="oe" className="bg-mist py-[clamp(56px,9vh,110px)] text-asphalt">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <SectionHead
            light
            eyebrow="Original Equipment"
            title={<>Chosen by leading<br />two-wheeler manufacturers</>}
            lede="Our tyres are engineered in close collaboration with OEMs to meet exacting performance, safety and durability standards — these machines leave the factory on Eurogrip."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FITMENTS.map((f, i) => (
              <Reveal key={f.brand + f.model} i={i % 3}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_70px_-45px_rgba(11,38,74,.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-racing/40">
                  <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                    <img src={f.img} alt={`${f.brand} ${f.model} on Eurogrip ${f.tyre}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(13,26,48,.8) 100%)" }} />
                    <span className="absolute left-4 top-4 rounded-[2px] bg-eurored px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white">
                      {f.tyre}
                    </span>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                      <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.14em] text-sky-300">{f.brand}</span>
                      <h3 className="mt-0.5 font-display text-[1.15rem] font-black uppercase italic leading-none text-white">{f.model}</h3>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <p className="text-[0.88rem] font-light leading-relaxed text-slate-600">{f.note}</p>
                    <div className="mt-auto space-y-1 border-t border-black/10 pt-3">
                      {f.sizes.map((s) => (
                        <div key={s} className="text-[0.74rem] uppercase tracking-[0.05em] text-slate-500">{s}</div>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* OEM logo marquee */}
          <div className="mt-12 border-t border-black/10 pt-8">
            <div className="mb-6 text-center text-[0.74rem] uppercase tracking-[0.12em] text-slate-500">OEM partners &amp; trusted fitments — and many more</div>
            <Marquee speed={30}>
              {LOGOS.map((src, i) => (
                <img key={i} src={src} alt="" className="h-8 w-auto object-contain opacity-40 transition-opacity duration-300 hover:opacity-80" style={{ filter: "brightness(0)" }} />
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Honda Taiwan network partnership */}
      <Cine>
        <section className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(56px,9vh,110px)]">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="grid items-center gap-[clamp(28px,4vw,60px)] lg:grid-cols-[1fr_0.9fr]">
              <div>
                <Reveal><Eyebrow>Network Partnership</Eyebrow></Reveal>
                <Reveal i={1}>
                  <h2 className="italic-display mt-3 text-white text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.04]">
                    Riding with<br />Honda Taiwan
                  </h2>
                </Reveal>
                <Reveal i={2}>
                  <p className="mt-4 max-w-[54ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-300">
                    Eurogrip has been officially integrated into the after-sales service network of Honda Taiwan Co., Ltd. — with the Protorq Extreme and Roadhound ranges available across all authorised Honda service centres, strengthening our presence in Asia's fast-evolving mobility market.
                  </p>
                </Reveal>
                <Reveal i={3} className="mt-7">
                  <Btn href="/global-presence" variant="line">Explore our global presence <Arrow /></Btn>
                </Reveal>
              </div>
              <Reveal i={1}>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                  {[
                    { v: "All", l: "Authorised Honda service centres" },
                    { v: "2", l: "Ranges carried — Protorq Extreme & Roadhound" },
                  ].map((s) => (
                    <div key={s.l} className="bg-[#223650] p-7">
                      <div className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-black italic leading-none text-white">{s.v}</div>
                      <div className="mt-2 text-[0.76rem] uppercase tracking-wide text-slate-400">{s.l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </Cine>

      {/* racing & sponsorships */}
      <section className="bg-white py-[clamp(56px,9vh,110px)] text-asphalt">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <SectionHead
            light
            eyebrow="Racing & Sponsorships"
            title={<>Punished in competition,<br />carried with pride</>}
            lede="From hard-enduro mountainsides to the biggest stages in sport — the partnerships that prove the rubber."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {RACING.map((r, i) => (
              <Reveal key={r.title} i={i}>
                <article className="group h-full overflow-hidden rounded-2xl border border-black/10 bg-mist shadow-[0_30px_70px_-45px_rgba(11,38,74,.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-racing/40">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={r.img} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 45%, rgba(13,26,48,.82) 100%)" }} />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.14em] text-eurored">{r.tag}</span>
                      <h3 className="mt-1 font-display text-[1.15rem] font-black uppercase italic leading-tight text-white">{r.title}</h3>
                    </div>
                  </div>
                  <p className="p-5 text-[0.9rem] font-light leading-relaxed text-slate-600">{r.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* onwards to the proof */}
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-black/10 bg-mist p-6 sm:p-7">
              <div>
                <h3 className="font-display text-[1.05rem] font-extrabold uppercase italic leading-tight text-asphalt">Proven by riders, reviewed by the press</h3>
                <p className="mt-1 text-[0.88rem] font-light text-slate-600">See what European motorcycle media and everyday riders say about the rubber our partners chose.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Btn href="/reviews" variant="red">Reviews &amp; testimonials <Arrow /></Btn>
                <Btn href="/contact" variant="line-dark">Partner with us</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <DhoniAmbassador />
      <SiteFooter />
    </main>
  )
}
