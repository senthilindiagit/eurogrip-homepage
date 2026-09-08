import { RIDERS } from "./site-data"

/* ------------------------------------------------------------------ data ----
   Media reviews from the client's reviews folder (Eurogrip summaries of each
   test, ENG). Ordered by test/publication date. `sort` drives the ordering;
   `period` is what the reader sees. -------------------------------------- */
export type Review = {
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
  /** a film we host ourselves, rather than a YouTube id */
  film?: { src: string; label: string }
  /** the publication's own article / profile, linked from the PDF */
  links?: { label: string; href: string }[]
  pdfs?: { label: string; href: string }[]
}

export const REVIEWS: Review[] = [
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

export const TESTIMONIALS: Review[] = [
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

/* ------------------------------------------------------- owner testimonials --
   Off-highway customer films from the client's Testimonials folder. Product
   names, speaker names and countries are taken from each film's own title and
   name cards - note the folder is labelled "AR 800" but all four of those films
   announce themselves as Tigertrac AR600 R-1W.

   The AR600 films carry burned-in English subtitles, so those cards quote them
   directly. The FL909 films have no subtitles, so those cards describe what is
   shown instead of putting words in anyone's mouth. None of the films is dated,
   so they sit in their own section rather than in the date-ordered list. ---- */
export const OWNER_FILMS: Review[] = [
  {
    slug: "oht-ar600-austria",
    pub: "Dairy farmer",
    country: "Austria",
    product: "Tigertrac AR600",
    period: "",
    sort: "",
    vehicle: "John Deere 6R",
    blurb: "\u201cI am an Austrian dairy farmer and live in a mountainous area in Upper Austria. I used to have bias tyres and have now opted for the TVS Eurogrip Tigertrac radial tyre. It also runs very smoothly on the road, even at 50 km/h.\u201d",
    cover: "/reviews/testimonials/ar600-austria.webp",
    film: { src: "/reviews/testimonials/ar600-austria.mp4", label: "Watch testimonial" },
  },
  {
    slug: "oht-ar600-claas",
    pub: "Tigertrac AR600 owner",
    country: "",
    product: "Tigertrac AR600",
    period: "",
    sort: "",
    vehicle: "Claas Arion \u00b7 4,200 hours",
    blurb: "\u201cI have been using it for about 4,200 hours and it is only half worn out, so the price/performance ratio is of course good. I am pleasantly surprised at how little the turf is damaged in the tight bends of the meadow.\u201d",
    cover: "/reviews/testimonials/ar600-claas.webp",
    film: { src: "/reviews/testimonials/ar600-claas.mp4", label: "Watch testimonial" },
  },
  {
    slug: "oht-ar600-poland",
    pub: "Dariusz Bazyluk",
    country: "Poland",
    product: "Tigertrac AR600",
    period: "",
    sort: "",
    vehicle: "Farmer",
    blurb: "\u201cTVS Eurogrip tyres on my tractor perform very well. Advantages that I see: low noise, smooth driving on road, high traction and good self-cleaning \u2014 better than competitors.\u201d",
    cover: "/reviews/testimonials/ar600-poland.webp",
    film: { src: "/reviews/testimonials/ar600-poland.mp4", label: "Watch testimonial" },
  },
  {
    slug: "oht-ar600-steyr",
    pub: "Tigertrac AR600 owner",
    country: "",
    product: "Tigertrac AR600",
    period: "",
    sort: "",
    vehicle: "Steyr 4110 Profi \u00b7 4,800 hours",
    blurb: "\u201cIt is equipped with TVS Eurogrip Tigertrac tyres, which we have had since 2016, and has already completed 4,800 operating hours. The road grip is very good, and it is also very good in the field \u2014 we expect to drive another 2,000 hours.\u201d",
    cover: "/reviews/testimonials/ar600-steyr.webp",
    film: { src: "/reviews/testimonials/ar600-steyr.mp4", label: "Watch testimonial" },
  },
  {
    slug: "oht-fl909-austria",
    pub: "Rudolf Reiter",
    country: "Austria",
    product: "Tigertrac FL909",
    period: "",
    sort: "",
    vehicle: "Tandem trailer \u00b7 manure spreading",
    blurb: "A mixed farm in Austria running the FL909 steel-belted flotation radial on tandem trailer work, in the yard and out on the road.",
    cover: "/reviews/testimonials/fl909-austria.webp",
    film: { src: "/reviews/testimonials/fl909-austria.mp4", label: "Watch testimonial" },
  },
  {
    slug: "oht-fl909-germany",
    pub: "Gefken & Sohn GbR",
    country: "Germany",
    product: "Tigertrac FL909",
    period: "",
    sort: "",
    vehicle: "Dump trailer \u00b7 road and yard",
    blurb: "Heavy dump-trailer haulage on and off the road, on the FL909 flotation radial.",
    cover: "/reviews/testimonials/fl909-germany.webp",
    film: { src: "/reviews/testimonials/fl909-germany.mp4", label: "Watch testimonial" },
  },
  {
    slug: "oht-fl909-spain",
    pub: "Juan Luis",
    country: "Spain",
    product: "Tigertrac FL909",
    period: "",
    sort: "",
    vehicle: "Slurry tanker",
    blurb: "Slurry tanker work in Spain \u2014 the film shows the robust steel-belted construction the FL909 is built around.",
    cover: "/reviews/testimonials/fl909-spain.webp",
    film: { src: "/reviews/testimonials/fl909-spain.mp4", label: "Watch testimonial" },
  },
  {
    slug: "oht-fl909-uk",
    pub: "Tigertrac FL909 owner",
    country: "United Kingdom",
    product: "Tigertrac FL909",
    period: "",
    sort: "",
    vehicle: "Bailey grain trailer \u00b7 harvest",
    blurb: "Grain-trailer haulage through a UK harvest, showing the block-on-lug design for on and off-road transport and the footprint that keeps soil compaction low.",
    cover: "/reviews/testimonials/fl909-uk.webp",
    film: { src: "/reviews/testimonials/fl909-uk.mp4", label: "Watch testimonial" },
  },
]

/* one list, strictly date-ordered, newest first */
export const ITEMS: Review[] = [...REVIEWS, ...TESTIMONIALS].sort((a, b) => b.sort.localeCompare(a.sort))

/**
 * Teaser trio for other pages.
 *
 * One of each kind of verdict — a press test, a rider voice and an off-highway
 * owner — so a single row represents the whole page rather than three of the
 * same thing. Taking simply the newest three gave three social posts and no
 * press test at all.
 *
 * India is left out of the teaser at the client's direction, so the rider slot
 * skips the India posts and picks the newest voice from elsewhere.
 */
const byDate = (a: Review, b: Review) => b.sort.localeCompare(a.sort)
const notIndia = (r: Review) => r.country !== "India"

export const LATEST_REVIEWS: Review[] = [
  [...REVIEWS].filter(notIndia).sort(byDate)[0],
  [...TESTIMONIALS].filter(notIndia).sort(byDate)[0],
  /* named customer rather than one of the anonymous "owner" films, so the card
     carries a person the way the other two carry a publication */
  OWNER_FILMS.find((r) => r.slug === "oht-ar600-poland")!,
].filter(Boolean)
