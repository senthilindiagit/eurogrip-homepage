import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Reveal } from "@/components/site/ui"
import { PageHero } from "@/components/site/PageHero"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { RiderImage } from "@/components/site/Racing"
import { RIDERS } from "@/lib/site-data"
import { useRouter } from "@/lib/router"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* ------------------------------------------------------------------ data ----
   Media reviews from the client's reviews folder (Eurogrip summaries of each
   test, ENG). Ordered by test/publication date. `sort` drives the ordering;
   `period` is what the reader sees. -------------------------------------- */
type Review = {
  slug: string
  pub: string
  product: string
  period: string
  sort: string
  /** market / country the review belongs to */
  country: string
  vehicle?: string
  blurb: string
  /** null → branded Instagram-gradient cover */
  cover: string | null
  /** youtube videos linked from the review PDF */
  videos?: { id: string; label: string }[]
  /** the publication's own article / profile, linked from the PDF */
  links?: { label: string; href: string }[]
  pdfs?: { label: string; href: string }[]
}

const REVIEWS: Review[] = [
  {
    slug: "inmoto-2026",
    pub: "InMoto",
    country: "Italy",
    product: "Trailhound STR & Wild",
    period: "May 2026",
    sort: "2026-05-20",
    vehicle: "Honda Africa Twin 1100 Adventure Sports",
    blurb: "A test day at the Vallelunga proving ground and surrounding roads — the STR judged as a 90/10 road adventure tyre, the Wild at 70/30 with light off-road sections.",
    cover: "/reviews/covers/video-inmoto.webp",
    videos: [{ id: "PIRnltHjamU", label: "Watch review" }],
    links: [{ label: "Read on inmoto.it", href: "https://www.inmoto.it/news/test/primo-contatto/2026/05/22-8820894/prova_eurogrip_trailhound_wild_e_str_arriva_un_nuovo_player_fra_le_gomme_adventure_" }],
    pdfs: [
      { label: "Trailhound STR", href: "/reviews/pdf/inmoto-trailhound-str.pdf" },
      { label: "Trailhound Wild", href: "/reviews/pdf/inmoto-trailhound-wild.pdf" },
    ],
  },
  {
    slug: "motoit-2026",
    pub: "Moto.it",
    country: "Italy",
    product: "Trailhound Wild & Bee Wild",
    period: "May 2026",
    sort: "2026-05-19",
    vehicle: "Honda Africa Twin · Honda ADV350",
    blurb: "Around 500 km each across Sicily — city, motorway, the roads around Mount Etna and compact dirt — testing the Wild on an adventure bike and the Bee Wild on a crossover scooter.",
    cover: "/reviews/covers/video-motoit.webp",
    videos: [{ id: "zdstCVN7MNs", label: "Watch review" }],
    links: [{ label: "Read on moto.it", href: "https://www.moto.it/news/100-eurogrip-la-nostra-prova-degli-trailhound-wild-e-bee-wild.html" }],
    pdfs: [
      { label: "Trailhound Wild", href: "/reviews/pdf/motoit-trailhound-wild.pdf" },
      { label: "Bee Wild", href: "/reviews/pdf/motoit-bee-wild.pdf" },
    ],
  },
  {
    slug: "1000ps-2026",
    pub: "1000PS",
    country: "Austria",
    product: "Trailhound STR",
    period: "Winter 2026",
    sort: "2026-02-01",
    vehicle: "Suzuki V-Strom 800",
    blurb: "A 350 km 'Winter Escape' from Barcelona to the 2,106 m Coll de Pal — warm coastal curves, patched asphalt, light gravel and icy passes with meltwater and snow residue.",
    cover: "/reviews/covers/1000ps-trailhound-str.webp",
    videos: [
      { id: "mwLz7Q6OtxE", label: "Watch review" },
      { id: "aA-B0hKANBE", label: "Watch the ride" },
    ],
    links: [{ label: "Read on 1000ps.de", href: "https://www.1000ps.de/testbericht-id-3014040-eurogrip-trailhound-str-test-auf-suzuki-v-strom-800" }],
    pdfs: [{ label: "Trailhound STR", href: "/reviews/pdf/1000ps-trailhound-str.pdf" }],
  },
  {
    slug: "tourenfahrer-2025",
    pub: "Tourenfahrer",
    country: "Germany",
    product: "Trailhound STR",
    period: "Summer 2025",
    sort: "2025-08-01",
    vehicle: "BMW R1300 GS",
    blurb: "Over 10,000 km through Germany and the Alps — the long-distance verdict from Germany's touring authority.",
    cover: "/reviews/covers/tourenfahrer-trailhound-str.webp",
    pdfs: [{ label: "Trailhound STR", href: "/reviews/pdf/tourenfahrer-trailhound-str.pdf" }],
  },
  {
    slug: "goggia-2025",
    pub: "Sonny Goggia",
    country: "Italy",
    product: "Climber XC-R Supersoft",
    period: "June 2025",
    sort: "2025-06-15",
    vehicle: "KTM 300 2-Stroke",
    blurb: "The former European Superenduro champion puts the Supersoft rear through Emilia-Romagna's hard-enduro terrain.",
    cover: "/reviews/covers/goggia-climber-xcr.webp",
    pdfs: [{ label: "Climber XC-R Supersoft", href: "/reviews/pdf/goggia-climber-xcr.pdf" }],
  },
  {
    slug: "aboutbmw-2025",
    pub: "AboutBMW",
    country: "Italy",
    product: "Trailhound STR",
    period: "May 2025",
    sort: "2025-05-01",
    vehicle: "BMW R1300 GS",
    blurb: "Over 1,000 km on the varied roads of central-northern Italy, from the GS specialists.",
    cover: "/reviews/covers/aboutbmw-trailhound-str.webp",
    pdfs: [{ label: "Trailhound STR", href: "/reviews/pdf/aboutbmw-trailhound-str.pdf" }],
  },
  {
    slug: "mototaller-2025",
    pub: "MotoTaller",
    country: "Spain",
    product: "Trailhound STR",
    period: "April – May 2025",
    sort: "2025-04-20",
    vehicle: "BMW R1250 GS",
    blurb: "3,000 km through Catalonia — wet city streets, mountain roads and light off-road terrain.",
    cover: "/reviews/covers/mototaller-trailhound-str.webp",
    videos: [{ id: "lKec8ymf0rA", label: "Watch review" }],
    links: [{ label: "Read on mototaller.info", href: "https://mototaller.info/eurogrip-trailhound-str-compra-recomendada/" }],
    pdfs: [{ label: "Trailhound STR", href: "/reviews/pdf/mototaller-trailhound-str.pdf" }],
  },
  {
    slug: "roadbook-2025",
    pub: "RoadBook",
    country: "Italy",
    product: "Trailhound STR",
    period: "April 2025",
    sort: "2025-04-10",
    vehicle: "BMW R1300 GS",
    blurb: "500 km on the roads of north-west Italy across every surface the region offers.",
    cover: "/reviews/covers/roadbook-trailhound-str.webp",
    videos: [{ id: "EwKE7haCYeg", label: "Watch review" }],
    links: [{ label: "Read on roadbookmag.it", href: "https://www.roadbookmag.it/in-prova-eurogrip-trailhound-str/" }],
    pdfs: [{ label: "Trailhound STR", href: "/reviews/pdf/roadbook-trailhound-str.pdf" }],
  },
  {
    slug: "cervone-2025",
    pub: "A. Cervone",
    country: "Italy",
    product: "Trailhound SCR",
    period: "April 2025",
    sort: "2025-04-01",
    vehicle: "Royal Enfield Interceptor 650",
    blurb: "1,000 km across Puglia — paved roads, white gravel tracks and light off-road on the scrambler fitment.",
    cover: "/reviews/covers/cervone-trailhound-scr.webp",
    videos: [{ id: "d_oTojm8Hx4", label: "Watch review" }],
    pdfs: [{ label: "Trailhound SCR", href: "/reviews/pdf/cervone-trailhound-scr.pdf" }],
  },
].sort((a, b) => b.sort.localeCompare(a.sort))

const INSTAGRAM_POST = "https://www.instagram.com/p/Da8icgvM-S0/"

/* rider testimonials from the homepage, in the same card shape; YouTube shorts
   play in the lightbox, Instagram reels link out. Dates decoded from each
   post's ID (verified against the live posts). */
const RIDER_DATES: Record<string, { period: string; sort: string; country: string }> = {
  "Saggar": { period: "Nov 2025", sort: "2025-11-04", country: "India" },
  "Gracias": { period: "Jun 2026", sort: "2026-06-03", country: "India" },
  "Leo Beretta": { period: "May 2026", sort: "2026-05-20", country: "Italy" },
  "Yasir": { period: "Jun 2026", sort: "2026-06-05", country: "India" },
}

const TESTIMONIALS: Review[] = [
  ...RIDERS.map((r): Review => {
    const short = r.url.match(/youtube\.com\/shorts\/([\w-]+)/)?.[1]
    return {
      slug: `rider-${r.who.toLowerCase().replace(/\s+/g, "-")}`,
      pub: r.who,
      product: "Rider testimonial",
      period: RIDER_DATES[r.who]?.period ?? "",
      sort: RIDER_DATES[r.who]?.sort ?? "",
      country: RIDER_DATES[r.who]?.country ?? "",
      vehicle: r.tag,
      blurb: `“${r.quote}”`,
      cover: r.img,
      videos: short ? [{ id: short, label: "Watch" }] : undefined,
      links: short ? undefined : [{ label: "Watch on Instagram", href: r.url }],
    }
  }),
  {
    slug: "offroadtrips-climber-xc",
    pub: "Off Road Trips",
    product: "Climber XC",
    period: "Jul 2026",
    sort: "2026-07-18",
    country: "France",
    vehicle: "Kove 800X Rally · Yamaha Ténéré 700",
    blurb: "“Test des Climber XC de chez @eurogripmoto — c'est validé à 1000%.” The French off-road community puts the Climber XC through its paces, and approves.",
    cover: "/reviews/covers/offroadtrips-climber-xc.webp",
    links: [{ label: "Watch on Instagram", href: INSTAGRAM_POST }],
  },
]

/* one list, strictly date-ordered, newest first */
const ITEMS: Review[] = [...REVIEWS, ...TESTIMONIALS].sort((a, b) => b.sort.localeCompare(a.sort))

/* --------------------------------------------------------------- lightbox -- */
function VideoLightbox({ videoId, onClose }: { videoId: string; onClose: () => void }) {
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
            title="Eurogrip review video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

/* ------------------------------------------------------------------- card -- */
function ReviewCard({ r, i, onPlay }: { r: Review; i: number; onPlay: (id: string) => void }) {
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
            <span className="rounded-[2px] bg-eurored px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white">
              {r.period}
            </span>
            {r.country && (
              <span className="rounded-[2px] bg-midnight/85 px-2.5 py-1 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white backdrop-blur-sm">
                {r.country}
              </span>
            )}
          </div>
          {r.videos && r.videos.length > 0 && (
            <button
              type="button"
              onClick={() => onPlay(r.videos![0].id)}
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
            {r.videos?.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onPlay(v.id)}
                className="font-display text-[0.78rem] font-extrabold uppercase italic tracking-wide text-eurored transition-colors hover:text-racing"
              >
                {v.label} ▸
              </button>
            ))}
            {/* PDF summaries only where there's no video review to watch */}
            {!r.videos?.length && r.pdfs?.map((p) => (
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

/* ------------------------------------------------------------------- page -- */
export function Reviews() {
  const { path } = useRouter()
  const [video, setVideo] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [path])

  useEffect(() => {
    if (!video) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [video])

  return (
    <main>
      <div className="relative overflow-x-clip" style={{ background: "linear-gradient(180deg, #e0393f 0%, #a80f16 58%, #eef3f9 100%)" }}>
        {/* racing texture — speed streaks behind the bike */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -top-24 right-[6%] h-[130%] w-[3px] rotate-[24deg] bg-white/15" />
          <span className="absolute -top-24 right-[12%] h-[110%] w-[6px] rotate-[24deg] bg-white/25" />
          <span className="absolute -top-24 right-[18%] h-[120%] w-[2px] rotate-[24deg] bg-white/20" />
          <span className="absolute -top-24 right-[30%] h-[100%] w-[2px] rotate-[24deg] bg-white/10" />
        </div>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
          eyebrow="Media reviews"
          title={<>Reviews &amp;<br />testimonials</>}
          lede="Leading European motorcycle media put our tyres through their paces — on road, off-road and on track. The tests, the verdicts and the full write-ups."
          aside={<RiderImage />}
          pad="pb-[clamp(44px,7vh,80px)] pt-[clamp(104px,15vh,140px)]"
        />
      </div>

      <section className="bg-mist py-[clamp(48px,8vh,100px)] text-asphalt">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((r, i) => <ReviewCard key={r.slug} r={r} i={i} onPlay={setVideo} />)}
          </div>

        </div>
      </section>

      <Cine><SiteFooter /></Cine>

      <AnimatePresence>
        {video && <VideoLightbox videoId={video} onClose={() => setVideo(null)} />}
      </AnimatePresence>
    </main>
  )
}
