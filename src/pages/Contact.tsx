import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow } from "@/components/site/ui"
import { PageHero } from "@/components/site/PageHero"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* ---------------------------------------------------------------- data ---- */
/* Content lives in plain arrays so a CMS can drive this page later. */

export const QUERY_TYPES = [
  { key: "general", title: "General Enquiry", body: "Questions, feedback or information", icon: "chat" },
  { key: "dealer", title: "Dealer / Distributor", body: "B2B partnership requests", icon: "handshake" },
  { key: "franchisee", title: "Franchisee Partner", body: "Exclusive Eurogrip store enquiries", icon: "store" },
  { key: "oem", title: "OEM Enquiries", body: "Original-equipment fitments", icon: "cog" },
  { key: "media", title: "Media & Press", body: "Journalists, PR, spokespeople", icon: "news" },
  { key: "support", title: "Technical Support", body: "Product or fitment queries", icon: "tools" },
  { key: "careers", title: "Careers", body: "Jobs and internships", icon: "user" },
] as const

/* Grouping per client feedback 2026-08-06. Full postal addresses (registered
   office, Chennai corporate, 4–5 regional offices) are coming from the client —
   city-level entries hold the slots until then. */
const OFFICES = [
  {
    group: "Registered & Corporate Offices",
    tag: "Registered Office",
    city: "Madurai, India",
    lines: ["TVS Srichakra Limited", "TVS Building, 7-B West Veli Street", "Madurai 625 001, Tamil Nadu, India"],
    note: "Registered office",
    map: "TVS+Srichakra+Limited+West+Veli+Street+Madurai",
  },
  {
    group: "Registered & Corporate Offices",
    tag: "Corporate Office",
    city: "Chennai, India",
    lines: ["TVS Srichakra Limited", "Chennai, Tamil Nadu, India"],
    note: "Full address to follow",
    map: "Chennai+Tamil+Nadu+India",
  },
  {
    group: "Manufacturing Plants",
    tag: "Manufacturing",
    city: "Madurai, India",
    lines: ["TVS Srichakra Limited", "Vellaripatti, Madurai", "Tamil Nadu, India"],
    note: "Plant 1 · alongside the R&D centre",
    map: "TVS+Srichakra+Limited+Vellaripatti+Madurai+Tamil+Nadu+India",
  },
  {
    group: "Manufacturing Plants",
    tag: "Manufacturing",
    city: "Pantnagar, India",
    lines: ["TVS Srichakra Manufacturing Plant", "Pantnagar, Uttarakhand", "India"],
    note: "Plant 2",
    map: "TVS+Srichakra+Pantnagar+Rudrapur+Uttarakhand+India",
  },
  {
    group: "Design Centre",
    tag: "Design Centre",
    city: "Milan, Italy",
    lines: ["Eurogrip Design Centre", "Milan", "Italy"],
    note: "International product development",
    map: "Milano+Lombardia+Italy",
  },
]
const OFFICE_GROUPS = [...new Set(OFFICES.map((o) => o.group))]
/* shown under the corporate group until the client sends the list */
const REGIONAL_NOTE = "4–5 regional offices across India will be listed here."

const CHANNELS = [
  { label: "General", value: "info@eurogriptyres.com", href: "mailto:info@eurogriptyres.com", icon: "chat" },
  { label: "Dealers & distributors", value: "sales@eurogriptyres.com", href: "mailto:sales@eurogriptyres.com", icon: "handshake" },
  { label: "Media & press", value: "media@eurogriptyres.com", href: "mailto:media@eurogriptyres.com", icon: "news" },
]

const REGIONS = ["India & SAARC", "Europe", "Americas", "Asia Pacific", "Middle East & Africa", "Other"]

/* --------------------------------------------------------------- icons ---- */
function QueryIcon({ name }: { name: string }) {
  const paths: Record<string, ReturnType<typeof String>> = {
    chat: "M21 12a8 8 0 01-8 8H8l-5 3 1.5-5A8 8 0 1121 12z",
    handshake: "M6 12l3-3 3 3 3-3 3 3M4 12l4 4a2 2 0 003 0l1-1 1 1a2 2 0 003 0l4-4",
    store: "M4 9l1-4h14l1 4M4 9v11h16V9M4 9h16M9 20v-6h6v6",
    cog: "M12 15a3 3 0 100-6 3 3 0 000 6zM12 3v2m0 14v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2m14 0h2M5 19l1.5-1.5M17.5 6.5L19 5",
    news: "M4 5h13v14H4zM17 9h3v8a2 2 0 01-2 2M7 9h7M7 13h7",
    tools: "M14 6l4 4-8 8H6v-4l8-8zM13 7l4 4",
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0",
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.chat} />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

/* ------------------------------------------------------ direct channels ---- */
function DirectChannels() {
  return (
    <div>
      <Reveal>
        <h3 className="font-display text-[0.74rem] font-extrabold uppercase italic tracking-[0.14em] text-white">Direct channels</h3>
      </Reveal>
      <div className="mt-5 flex flex-col gap-4">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.label} i={i}>
            <a href={c.href} className="group inline-flex items-center gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-racing shadow-[0_12px_28px_-14px_rgba(6,18,38,.7)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-eurored group-hover:text-white">
                <QueryIcon name={c.icon} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.7rem] uppercase tracking-[0.1em] text-slate-300">{c.label}</span>
                <span className="block truncate text-[0.92rem] font-medium text-white underline-offset-4 transition-colors group-hover:underline">{c.value}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  )
}


/* ----------------------------------------------------------------- form ---- */
const field =
  "w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-[0.92rem] text-asphalt placeholder:text-slate-400 focus:border-racing focus:outline-none focus:ring-2 focus:ring-racing/20"
const label = "mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-slate-500"

function ContactForm({ queryType, onQueryType }: { queryType: string; onQueryType: (k: string) => void }) {
  const [sent, setSent] = useState(false)
  const reduce = useReducedMotion()
  const isBusiness = queryType === "dealer" || queryType === "oem" || queryType === "franchisee"

  return (
    <div id="contact-form" className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(16,35,70,.5)] sm:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-10 text-center"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-racing text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h3 className="mt-5 font-display text-[1.3rem] font-extrabold uppercase italic text-asphalt">Message sent</h3>
            <p className="mx-auto mt-2 max-w-[42ch] text-[0.95rem] font-light text-slate-600">
              Thanks for reaching out. Our team will get back to you shortly.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 font-display text-[0.82rem] font-extrabold uppercase italic tracking-wide text-racing transition-colors hover:text-eurored"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={(e) => { e.preventDefault(); setSent(true) }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Eyebrow>Send us a message</Eyebrow>
            </div>

            {/* type of query — client-requested field */}
            <div className="sm:col-span-2">
              <label htmlFor="qtype" className={label}>Type of query *</label>
              <select
                id="qtype"
                required
                value={queryType}
                onChange={(e) => onQueryType(e.target.value)}
                className={field}
              >
                {QUERY_TYPES.map((q) => (
                  <option key={q.key} value={q.key}>{q.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fname" className={label}>First name *</label>
              <input id="fname" required className={field} placeholder="First name" />
            </div>
            <div>
              <label htmlFor="lname" className={label}>Last name *</label>
              <input id="lname" required className={field} placeholder="Last name" />
            </div>
            <div>
              <label htmlFor="email" className={label}>Email address *</label>
              <input id="email" type="email" required className={field} placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="phone" className={label}>Phone</label>
              <input id="phone" type="tel" className={field} placeholder="+91 00000 00000" />
            </div>
            {isBusiness && (
              <div className="sm:col-span-2">
                <label htmlFor="company" className={label}>Company / business name *</label>
                <input id="company" required className={field} placeholder="Company name" />
              </div>
            )}
            <div className="sm:col-span-2">
              <label htmlFor="region" className={label}>Country / region *</label>
              <select id="region" required defaultValue="" className={field}>
                <option value="" disabled>Select your region…</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className={label}>Message *</label>
              <textarea id="message" required rows={2} className={field} placeholder="How can we help?" />
            </div>
            <label className="flex items-start gap-2.5 text-[0.82rem] font-light text-slate-600 sm:col-span-2">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#0a6ed8]" />
              I agree that Eurogrip may use my details to respond to this enquiry.
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-[3px] bg-eurored px-6 py-3 font-display text-[0.86rem] font-extrabold uppercase italic tracking-[0.04em] text-white shadow-[0_10px_30px_-10px_rgba(237,28,36,.6)] transition-transform hover:-translate-y-0.5"
              >
                Send message <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/* -------------------------------------------------------------- offices ---- */
const TAB_LABELS: Record<string, string> = {
  "Registered & Corporate Offices": "Registered & Corporate",
  "Manufacturing Plants": "Manufacturing",
  "Design Centre": "Design Centre",
}

function Offices() {
  const [group, setGroup] = useState(OFFICE_GROUPS[0])
  const [sel, setSel] = useState(0)
  const reduce = useReducedMotion()
  const groupOffices = OFFICES.filter((of) => of.group === group)
  const o = groupOffices[Math.min(sel, groupOffices.length - 1)]
  const pickGroup = (g: string) => { setGroup(g); setSel(0) }

  return (
    <section className="bg-mist pb-[clamp(60px,9vh,120px)] pt-[clamp(40px,6vh,72px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="Where to find us"
          title={<>Our offices &amp; plants</>}
          lede="From the Madurai headquarters to the Milan design centre — pick a location to view it on the map."
          className="mb-[clamp(24px,3.5vh,40px)] max-w-none"
        />

        {/* group tabs — sliding pill */}
        <Reveal>
          <div className="flex w-fit max-w-full flex-wrap gap-1 rounded-full border border-black/10 bg-white p-1.5 shadow-[0_18px_40px_-30px_rgba(16,35,70,.5)]">
            {OFFICE_GROUPS.map((g) => {
              const on = g === group
              return (
                <button
                  key={g}
                  onClick={() => pickGroup(g)}
                  aria-pressed={on}
                  className={`relative rounded-full px-5 py-2.5 font-display text-[0.78rem] font-extrabold uppercase italic tracking-[0.06em] transition-colors duration-300 ${on ? "text-white" : "text-slate-500 hover:text-asphalt"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="office-tab-pill"
                      className="absolute inset-0 rounded-full bg-racing shadow-[0_10px_24px_-10px_rgba(10,110,216,.8)]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{TAB_LABELS[g] ?? g}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* detail panel — dark rail + map in one premium card */}
        <Reveal i={1}>
          <div className="relative mt-5 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_40px_90px_-50px_rgba(11,38,74,.55)]">
            <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-racing via-sky-400 to-eurored" />
            <div className="grid lg:grid-cols-[minmax(320px,420px)_1fr]">
              {/* left — office rail on steel gradient */}
              <div className="relative p-6 sm:p-7" style={{ background: "linear-gradient(150deg, #1f3050 0%, #2c4a76 100%)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={group}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: ENTER }}
                  >
                    <span className="font-display text-[0.7rem] font-extrabold uppercase italic tracking-[0.14em] text-sky-300">{group}</span>
                    <div className="mt-4 space-y-3">
                      {groupOffices.map((of, i) => {
                        const on = i === Math.min(sel, groupOffices.length - 1)
                        return (
                          <button
                            key={of.tag + of.city}
                            onClick={() => setSel(i)}
                            aria-pressed={on}
                            className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                              on
                                ? "border-eurored/70 bg-white/10 shadow-[0_18px_40px_-24px_rgba(0,0,0,.6)]"
                                : "border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.07]"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${on ? "bg-eurored text-white" : "bg-white/10 text-sky-300"}`}>
                                <PinIcon />
                              </span>
                              <div>
                                <span className="font-display text-[0.64rem] font-extrabold uppercase tracking-[0.1em] text-sky-300">{of.tag}</span>
                                <div className="font-display text-[1rem] font-extrabold uppercase italic leading-tight text-white">{of.city}</div>
                                <p className="mt-1 text-[0.82rem] font-light leading-relaxed text-slate-300">
                                  {of.lines.map((l) => <span key={l} className="block">{l}</span>)}
                                </p>
                                <span className="mt-1.5 inline-block text-[0.72rem] font-medium text-slate-400">{of.note}</span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                      {group === "Registered & Corporate Offices" && (
                        <p className="px-1 pt-1 text-[0.78rem] font-light italic text-slate-400">{REGIONAL_NOTE}</p>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* right — map fills the panel */}
              <div className="relative min-h-[320px] lg:min-h-[420px]">
                <iframe
                  key={o.map}
                  title={`Map — ${o.city}`}
                  src={`https://www.google.com/maps?q=${o.map}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                />
                <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 font-display text-[0.72rem] font-extrabold uppercase italic tracking-wide text-asphalt shadow-md">
                  {o.city}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${o.map}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 font-display text-[0.72rem] font-extrabold uppercase italic tracking-wide text-racing shadow-md transition-colors hover:bg-white hover:text-eurored"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------ global showcase ---- */
function GlobalShowcase() {
  const { navigate } = useRouter()
  return (
    <section className="relative overflow-hidden py-[clamp(90px,14vh,170px)]">
      {/* road footage from the brand film */}
      <video
        src="/road-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* brand-blue scrim for legibility */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,30,60,.58) 0%, rgba(11,30,60,.38) 45%, rgba(11,30,60,.62) 100%)" }} />

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 text-center sm:px-8">
        <Reveal>
          <Eyebrow className="justify-center">Beyond this page</Eyebrow>
        </Reveal>
        <Reveal i={1}>
          <h2 className="italic-display mx-auto mt-3 text-white text-[clamp(1.8rem,4vw,3.1rem)] leading-[1.04] drop-shadow-[0_2px_18px_rgba(6,18,38,.55)]">
            <span className="block">Wherever the road goes,</span>
            <span className="block">we're already there</span>
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mx-auto mt-4 max-w-[56ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-200">
            Eurogrip tyres reach riders and fleets across 125+ countries through a distribution network built over four decades.
          </p>
        </Reveal>
        <Reveal i={3} className="mt-[clamp(30px,5vh,48px)] flex justify-center">
          <a
            href="/global-presence"
            onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/global-presence") } }}
            className="group inline-flex items-center gap-2 rounded-[3px] bg-eurored px-7 py-3.5 font-display text-[0.88rem] font-extrabold uppercase italic tracking-[0.04em] text-white shadow-[0_14px_36px_-12px_rgba(237,28,36,.7)] transition-transform hover:-translate-y-0.5"
          >
            Explore our global presence <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- page ---- */
export function Contact() {
  const { path } = useRouter()
  const [queryType, setQueryType] = useState<string>("general")

  // land at the top, unless the URL targets a section
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }))
      return
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [path])

  return (
    <main>
      {/* hero — intro + direct channels left, form top-right */}
      <div className="relative overflow-x-clip" style={{ background: "linear-gradient(180deg, #4a83cf 0%, #3a6cb0 58%, #e7eef7 100%)" }}>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          eyebrow="How can we help?"
          title={<>What brings you here?</>}
          lede="Tell us what you need and we'll route your message straight to the right team."
          aside={<ContactForm queryType={queryType} onQueryType={setQueryType} />}
          asideAlign="start"
          below={<DirectChannels />}
          pad="pb-[clamp(36px,6vh,64px)] pt-[clamp(104px,15vh,140px)]"
        />
      </div>

      <Offices />
      <Cine><GlobalShowcase /></Cine>
      <SiteFooter />
    </main>
  )
}
