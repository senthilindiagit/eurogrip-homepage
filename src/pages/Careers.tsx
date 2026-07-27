import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow, Counter } from "@/components/site/ui"
import { PageHero } from "@/components/site/PageHero"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import teamEngineer from "@/assets/careers/team-engineer.webp"
import teamLab from "@/assets/careers/team-lab.webp"
import teamStudio from "@/assets/careers/team-studio.webp"
import realTechnician from "@/assets/careers/real-technician.webp"
import realEicma from "@/assets/careers/real-eicma.webp"
import factoryFloor from "@/assets/about/about-hero.webp"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* ---------------------------------------------------------------- data ---- */
/* Plain arrays so a CMS can drive this page later. */

const PILLARS = [
  {
    k: "Engineer globally",
    body: "Work across our Madurai R&D centre and Milan design studio — one team, two continents, products that ship to 85+ countries.",
    icon: "globe",
  },
  {
    k: "Own real scale",
    body: "Three million tyres a month across two plants. What you build is measured in millions of kilometres ridden.",
    icon: "gauge",
  },
  {
    k: "Learn relentlessly",
    body: "Backed by the TVS legacy's institutions and a culture of skilling — from the shop floor to the test track.",
    icon: "spark",
  },
  {
    k: "Build for riders",
    body: "We make something people genuinely love. Every compound and contour ends up under someone's journey.",
    icon: "heart",
  },
]

const OFFERS = [
  { t: "Global career paths", d: "Cross-border projects across India, Europe and our export markets." },
  { t: "Learning & skilling", d: "Structured training, certifications and mentoring from veteran engineers." },
  { t: "Safety first, always", d: "ISO 45001 practices and a genuine zero-compromise safety culture." },
  { t: "Health & wellbeing", d: "Medical cover for you and your family, plus wellbeing support." },
  { t: "Recognition", d: "Awards, TPM excellence programmes and visible ownership of outcomes." },
  { t: "A 25,000-strong family", d: "Part of the TVS Mobility group — stability with a startup's ambition." },
]

const GALLERY = [
  { src: factoryFloor, alt: "The Madurai plant floor", tall: true, label: "Madurai · Plant" },
  { src: teamEngineer, alt: "Process engineer on the tyre-building line", tall: false, label: "Manufacturing" },
  { src: teamLab, alt: "Engineer testing a motorcycle tyre in the lab", tall: false, label: "R&D & testing" },
  { src: realTechnician, alt: "Eurogrip technician preparing a test bike", tall: false, label: "On the road" },
  { src: teamStudio, alt: "Design team reviewing a tread pattern", tall: true, label: "Design studio" },
  { src: realEicma, alt: "The Eurogrip stand at EICMA", tall: false, label: "EICMA · Milan" },
]

const STATS = [
  { to: 25000, suffix: "+", label: "People across the group", compact: "25,000+" },
  { to: 25, suffix: "+", label: "Countries we operate in" },
  { to: 2, suffix: "", label: "Manufacturing plants" },
  { to: 44, suffix: "+", label: "Years of engineering" },
]

const DEPARTMENTS = [
  "Engineering / R&D", "Manufacturing & Quality", "Sales & Distribution",
  "Marketing & Brand", "Supply Chain", "Finance & HR", "Internship / Graduate", "Other",
]

/* --------------------------------------------------------------- icons ---- */
function PillarIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18",
    gauge: "M12 14a2 2 0 100-4 2 2 0 000 4zM12 12l4.5-4.5M4 19a9 9 0 1116 0",
    spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z",
    heart: "M12 20s-7-4.3-7-9.3A4.7 4.7 0 0112 8a4.7 4.7 0 017 2.7C19 15.7 12 20 12 20z",
  }
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.spark} />
    </svg>
  )
}

/* --------------------------------------------------------- hero collage ---- */
function HeroCollage() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const yA = useTransform(scrollYProgress, [0, 1], [0, -34])
  const yB = useTransform(scrollYProgress, [0, 1], [0, 26])

  return (
    <div ref={ref} className="relative grid grid-cols-2 gap-3">
      <motion.div style={reduce ? undefined : { y: yA }} className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-white/15 shadow-[0_24px_60px_-30px_rgba(0,0,0,.6)]">
          <img src={teamEngineer} alt="Process engineer on the tyre-building line" className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="overflow-hidden rounded-xl border border-white/15 shadow-[0_24px_60px_-30px_rgba(0,0,0,.6)]">
          <img src={realTechnician} alt="Eurogrip technician preparing a test bike" className="aspect-square w-full object-cover" />
        </div>
      </motion.div>
      <motion.div style={reduce ? undefined : { y: yB }} className="space-y-3 pt-8">
        <div className="overflow-hidden rounded-xl border border-white/15 shadow-[0_24px_60px_-30px_rgba(0,0,0,.6)]">
          <img src={teamLab} alt="Engineer testing a motorcycle tyre in the lab" className="aspect-square w-full object-cover" />
        </div>
        <div className="overflow-hidden rounded-xl border border-white/15 shadow-[0_24px_60px_-30px_rgba(0,0,0,.6)]">
          <img src={teamStudio} alt="Design team reviewing a tread pattern" className="aspect-[4/5] w-full object-cover" />
        </div>
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------- pillars ---- */
function WhyEurogrip() {
  return (
    <section className="bg-gradient-to-b from-[#f7fafd] to-mist py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="Why Eurogrip"
          title={<>Work that ends up<br />under someone's journey</>}
          lede="We are a specialist. That focus shows up in how we hire, how we build and how far you can go here."
          className="mb-[clamp(32px,5vh,52px)] max-w-none"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.k} i={i % 4}>
              <div className="group h-full rounded-2xl border border-black/10 bg-white p-6 shadow-[0_24px_55px_-40px_rgba(16,35,70,.5)] transition-transform duration-500 hover:-translate-y-1.5">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-racing/10 text-racing transition-colors group-hover:bg-racing group-hover:text-white">
                  <PillarIcon name={p.icon} />
                </span>
                <h3 className="mt-4 font-display text-[1.05rem] font-extrabold uppercase italic leading-tight text-asphalt">{p.k}</h3>
                <p className="mt-2 text-[0.88rem] font-light leading-relaxed text-slate-600">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- gallery ---- */
function LifeHere() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-steel-2 to-steel py-[clamp(64px,10vh,130px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          eyebrow="Life here"
          title={<>From the shop floor<br />to the test track</>}
          lede="Madurai, Pantnagar, Milan and every road in between."
          className="mb-[clamp(28px,4vh,44px)] max-w-none"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {GALLERY.map((g, i) => (
            <Reveal key={g.alt} i={i % 3} className={g.tall ? "row-span-2" : ""}>
              <div className={`group relative h-full overflow-hidden rounded-xl border border-white/10 ${g.tall ? "min-h-[260px]" : "aspect-[4/3]"}`}>
                <img src={g.src} alt={g.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a30]/85 via-transparent to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 font-display text-[0.68rem] font-extrabold uppercase italic tracking-wide text-white">{g.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* group scale */}
        <div className="mt-[clamp(36px,5vh,60px)] grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} i={i} className="border-t-2 border-eurored pt-4">
              {s.compact ? (
                <div className="font-display text-[clamp(1.5rem,2.9vw,2.3rem)] font-black italic leading-none text-white">{s.compact}</div>
              ) : (
                <Counter to={s.to} suffix={s.suffix} className="font-display text-[clamp(1.5rem,2.9vw,2.3rem)] font-black italic leading-none text-white" />
              )}
              <div className="mt-2 text-[0.74rem] uppercase tracking-wide text-slate-400">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- offers ---- */
function WhatWeOffer() {
  return (
    <section className="bg-mist py-[clamp(64px,10vh,130px)] text-asphalt">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="What we offer"
          title={<>More than a role</>}
          className="mb-[clamp(28px,4vh,44px)] max-w-none"
        />
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((o, i) => (
            <Reveal key={o.t} i={i % 3}>
              <div className="flex gap-4 border-t border-black/10 pt-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-racing text-white">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div>
                  <h3 className="font-display text-[0.98rem] font-extrabold uppercase italic leading-tight text-asphalt">{o.t}</h3>
                  <p className="mt-1.5 text-[0.88rem] font-light leading-relaxed text-slate-600">{o.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- form ---- */
const field =
  "w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-[0.92rem] text-asphalt placeholder:text-slate-400 focus:border-racing focus:outline-none focus:ring-2 focus:ring-racing/20"
const label = "mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-slate-500"
const MAX_MB = 5

function ApplyForm() {
  const [sent, setSent] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  const pick = (f: File | null) => {
    if (!f) { setFile(null); setFileError(null); return }
    const ok = /\.(pdf|doc|docx)$/i.test(f.name)
    if (!ok) { setFile(null); setFileError("Please upload a PDF or Word document."); return }
    if (f.size > MAX_MB * 1024 * 1024) { setFile(null); setFileError(`Keep the file under ${MAX_MB} MB.`); return }
    setFileError(null)
    setFile(f)
  }

  return (
    <section id="apply" className="scroll-mt-24 overflow-hidden bg-gradient-to-b from-steel to-steel-2 py-[clamp(64px,10vh,130px)]">
      <div className="mx-auto grid max-w-[1280px] items-start gap-[clamp(32px,5vw,64px)] px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
        {/* intro */}
        <div>
          <Reveal><Eyebrow>Apply</Eyebrow></Reveal>
          <Reveal i={1}>
            <h2 className="italic-display mt-3 text-white text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.04]">
              Tell us where<br />you fit
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 max-w-[46ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-300">
              We keep an open application list. Send your details and CV — if there's a fit now or later, our talent team will reach out.
            </p>
          </Reveal>
          <Reveal i={3}>
            <ul className="mt-7 space-y-3">
              {["Every application is read by a person", "We respond within two weeks", "Graduates and interns welcome"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[0.9rem] font-light text-slate-200">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eurored text-white">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* form card */}
        <Reveal i={1}>
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_36px_80px_-45px_rgba(6,18,38,.7)] sm:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-racing text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <h3 className="mt-5 font-display text-[1.3rem] font-extrabold uppercase italic text-asphalt">Application received</h3>
                  <p className="mx-auto mt-2 max-w-[40ch] text-[0.95rem] font-light text-slate-600">
                    Thanks for your interest in Eurogrip. Our talent team reviews every application and will be in touch within two weeks.
                  </p>
                  <button
                    onClick={() => { setSent(false); setFile(null) }}
                    className="mt-6 font-display text-[0.82rem] font-extrabold uppercase italic tracking-wide text-racing transition-colors hover:text-eurored"
                  >
                    Submit another application
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={(e) => { e.preventDefault(); if (!file) { setFileError("Please attach your CV."); return } setSent(true) }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2"><Eyebrow>Open application</Eyebrow></div>

                  <div>
                    <label htmlFor="c-fname" className={label}>First name *</label>
                    <input id="c-fname" required className={field} placeholder="First name" />
                  </div>
                  <div>
                    <label htmlFor="c-lname" className={label}>Last name *</label>
                    <input id="c-lname" required className={field} placeholder="Last name" />
                  </div>
                  <div>
                    <label htmlFor="c-email" className={label}>Email address *</label>
                    <input id="c-email" type="email" required className={field} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className={label}>Phone</label>
                    <input id="c-phone" type="tel" className={field} placeholder="+91 00000 00000" />
                  </div>
                  <div>
                    <label htmlFor="c-dept" className={label}>Area of interest *</label>
                    <select id="c-dept" required defaultValue="" className={field}>
                      <option value="" disabled>Select an area…</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="c-exp" className={label}>Years of experience</label>
                    <select id="c-exp" defaultValue="" className={field}>
                      <option value="">Select…</option>
                      {["Student / fresher", "0–2 years", "3–5 years", "6–10 years", "10+ years"].map((x) => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="c-loc" className={label}>Preferred location</label>
                    <input id="c-loc" className={field} placeholder="Madurai, Pantnagar, Milan, remote…" />
                  </div>

                  {/* resume upload */}
                  <div className="sm:col-span-2">
                    <span className={label}>Attach your CV * <span className="font-normal normal-case tracking-normal text-slate-400">(PDF or Word, max {MAX_MB} MB)</span></span>
                    <input
                      ref={inputRef}
                      id="c-cv"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="sr-only"
                      onChange={(e) => pick(e.target.files?.[0] ?? null)}
                    />
                    <div
                      onClick={() => inputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0] ?? null) }}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border border-dashed p-4 transition-colors ${
                        fileError ? "border-eurored bg-eurored/[0.04]" : file ? "border-racing bg-racing/[0.04]" : "border-black/20 bg-mist hover:border-racing/60"
                      }`}
                    >
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${file ? "bg-racing text-white" : "bg-white text-racing"}`}>
                        {file ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-[0.86rem] font-extrabold uppercase italic text-asphalt">
                          {file ? file.name : "Choose a file or drag it here"}
                        </span>
                        <span className="mt-0.5 block text-[0.78rem] font-light text-slate-500">
                          {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB · click to replace` : "We only use it to assess your application"}
                        </span>
                      </span>
                    </div>
                    {fileError && <p className="mt-2 text-[0.8rem] font-medium text-eurored">{fileError}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="c-note" className={label}>Anything you'd like us to know</label>
                    <textarea id="c-note" rows={4} className={field} placeholder="A short note about what you're looking for" />
                  </div>

                  <label className="flex items-start gap-2.5 text-[0.82rem] font-light text-slate-600 sm:col-span-2">
                    <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#0a6ed8]" />
                    I consent to Eurogrip storing my details and CV for recruitment purposes.
                  </label>

                  <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 rounded-[3px] bg-eurored px-6 py-3 font-display text-[0.86rem] font-extrabold uppercase italic tracking-[0.04em] text-white shadow-[0_10px_30px_-10px_rgba(237,28,36,.6)] transition-transform hover:-translate-y-0.5"
                    >
                      Submit application <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                    <span className="text-[0.8rem] font-light text-slate-500">We respond within two weeks.</span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- page ---- */
export function Careers() {
  const { path, navigate } = useRouter()

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
      <div className="relative overflow-x-clip" style={{ background: "linear-gradient(180deg, #4a83cf 0%, #3a6cb0 58%, #e7eef7 100%)" }}>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
          eyebrow="Join the team"
          title={<><span className="block">Build the future</span><span className="block">of riding</span></>}
          lede="Engineering, manufacturing, commercial and brand roles across India, Italy and our export markets — for people who want their work measured in kilometres."
          aside={<HeroCollage />}
          asideAlign="start"
          below={
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a
                href="/careers#apply"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" }) } }}
                className="group inline-flex items-center gap-2 rounded-[3px] bg-eurored px-6 py-3 font-display text-[0.86rem] font-extrabold uppercase italic tracking-[0.04em] text-white shadow-[0_10px_30px_-10px_rgba(237,28,36,.6)] transition-transform hover:-translate-y-0.5"
              >
                Send your application <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <Btn href="/about" variant="line">About Eurogrip</Btn>
            </div>
          }
        />
      </div>

      <WhyEurogrip />
      <Cine><LifeHere /></Cine>
      <WhatWeOffer />
      <ApplyForm />
      <SiteFooter />
    </main>
  )
}
