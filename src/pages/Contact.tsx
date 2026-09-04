import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Reveal, SectionHead, Btn, Arrow, Eyebrow } from "@/components/site/ui"
import { PageHero } from "@/components/site/PageHero"
import { Cine } from "@/components/site/Cine"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import {
  VEHICLE_MODELS,
  REAR_TYRE_SIZES,
  FRONT_TYRE_SIZES,
  PURCHASE_SOURCES,
  ISSUE_TYPES,
  TYRE_IMAGE_LIMIT,
  RESUME_LIMIT,
} from "@/lib/enquiry-options"

const ENTER = [0.16, 0.84, 0.34, 1] as const

/* ---------------------------------------------------------------- data ---- */
/* Content lives in plain arrays so a CMS can drive this page later. */

const REGIONS = ["India & SAARC", "Europe", "Americas", "Asia Pacific", "Middle East & Africa", "Other"]

/* Each query type carries its own field list, so choosing a type swaps the form
   rather than showing one form that fits nobody. Product Enquiry, Product
   Support and Join our team mirror the live corporate forms field-for-field —
   see src/lib/enquiry-options.ts for where the dropdown data came from. */
type Upload = { accept: string; maxBytes: number; exts: string[] }
type Field =
  | { kind: "text" | "email" | "tel" | "date"; name: string; label: string; placeholder?: string; required?: boolean; wide?: boolean }
  | { kind: "select"; name: string; label: string; options: readonly string[]; placeholder: string; required?: boolean; wide?: boolean }
  | { kind: "textarea"; name: string; label: string; placeholder?: string; required?: boolean; rows?: number }
  | { kind: "file"; name: string; label: string; hint: string; limit: Upload; required?: boolean }

/* the identity block the live forms open with */
const WHO: Field[] = [
  { kind: "text", name: "name", label: "Full name", placeholder: "Full name", required: true },
  { kind: "tel", name: "mobile", label: "Mobile", placeholder: "+91 00000 00000", required: true },
  { kind: "text", name: "city", label: "City", placeholder: "City", required: true },
  { kind: "email", name: "email", label: "Email", placeholder: "you@example.com", required: true },
]

/* vehicle + sizes. The live forms do not filter sizes by vehicle, so neither do we. */
const VEHICLE: Field[] = [
  { kind: "select", name: "vehicle", label: "Vehicle model", options: VEHICLE_MODELS, placeholder: "Select your vehicle…", required: true, wide: true },
  { kind: "select", name: "rear", label: "Rear tyre size", options: REAR_TYRE_SIZES, placeholder: "Select size…" },
  { kind: "select", name: "front", label: "Front tyre size", options: FRONT_TYRE_SIZES, placeholder: "Select size…" },
]

const MESSAGE: Field = { kind: "textarea", name: "message", label: "Message", placeholder: "How can we help?", rows: 3 }
const REGION: Field = { kind: "select", name: "region", label: "Country / region", options: REGIONS, placeholder: "Select your region…", required: true, wide: true }

/* the general / B2B / press forms keep the enquiry fields they had */
const ENQUIRY: Field[] = [
  { kind: "text", name: "fname", label: "First name", placeholder: "First name", required: true },
  { kind: "text", name: "lname", label: "Last name", placeholder: "Last name", required: true },
  { kind: "email", name: "email", label: "Email address", placeholder: "you@company.com", required: true },
  { kind: "tel", name: "phone", label: "Phone", placeholder: "+91 00000 00000" },
  REGION,
  { ...MESSAGE, required: true },
]
const COMPANY: Field = { kind: "text", name: "company", label: "Company / business name", placeholder: "Company name", required: true, wide: true }
const BUSINESS: Field[] = [ENQUIRY[0], ENQUIRY[1], ENQUIRY[2], ENQUIRY[3], COMPANY, REGION, { ...MESSAGE, required: true }]

export const QUERY_TYPES: { key: string; title: string; body: string; icon: string; fields: Field[] }[] = [
  { key: "general", title: "General Enquiry", body: "Questions, feedback or information", icon: "chat", fields: ENQUIRY },
  {
    key: "product",
    title: "Product Enquiry",
    body: "Tyre recommendations for your vehicle",
    icon: "tyre",
    fields: [...WHO, ...VEHICLE, MESSAGE],
  },
  {
    key: "support",
    title: "Product Support",
    body: "Warranty, fitment or product issues",
    icon: "tools",
    fields: [
      ...WHO,
      ...VEHICLE,
      { kind: "select", name: "purchase", label: "Where did you purchase?", options: PURCHASE_SOURCES, placeholder: "Select an option…", required: true, wide: true },
      { kind: "date", name: "purchaseDate", label: "Date of purchase" },
      { kind: "select", name: "issue", label: "What is the issue?", options: ISSUE_TYPES, placeholder: "Select the issue…", required: true },
      MESSAGE,
      {
        kind: "file",
        name: "tyreImages",
        label: "Upload tyre images",
        hint: "JPG only, less than 1 MB",
        limit: TYRE_IMAGE_LIMIT,
      },
    ],
  },
  { key: "dealer", title: "Dealer / Distributor", body: "B2B partnership requests", icon: "handshake", fields: BUSINESS },
  { key: "franchisee", title: "Franchisee Partner", body: "Exclusive Eurogrip store enquiries", icon: "store", fields: BUSINESS },
  { key: "oem", title: "OEM Enquiries", body: "Original-equipment fitments", icon: "cog", fields: BUSINESS },
  { key: "media", title: "Media & Press", body: "Journalists, PR, spokespeople", icon: "news", fields: ENQUIRY },
  {
    key: "careers",
    title: "Join our team",
    body: "Jobs, internships and applications",
    icon: "user",
    fields: [
      ...WHO,
      {
        kind: "file",
        name: "resume",
        label: "Upload your updated resume",
        hint: "PDF only, less than 2 MB",
        limit: RESUME_LIMIT,
        required: true,
      },
    ],
  },
]

/* Addresses transcribed from eurogriptyres.com/contact-us (client feedback
   2026-09-04): Corporate & Marketing Office, the six Regional Offices and the
   two Manufacturing Unit addresses. Place-name spellings normalised where the
   source page has an obvious typo — see docs/CONTACT-ADDRESSES.md. */
type Office = {
  group: string
  tag: string
  city: string
  lines: string[]
  tel?: string[]
  note?: string
  map: string
}

const OFFICES: Office[] = [
  {
    group: "Corporate & Marketing Office",
    tag: "Corporate Office",
    city: "Chennai",
    lines: ["TVS Srichakra Limited", "2/5, Maharani Chinnamma Road,", "Venus Colony, Teynampet,", "Chennai – 600018"],
    map: "2%2F5+Maharani+Chinnamma+Road+Venus+Colony+Teynampet+Chennai+600018",
  },
  {
    group: "Corporate & Marketing Office",
    tag: "Marketing Office",
    city: "Chennai",
    lines: ["TVS Srichakra Limited", "Sudarsan Building, 5th Floor,", "14 Whites Road,", "Chennai – 600014"],
    tel: ["044-28526007", "044-28526008", "044-28526009"],
    map: "Sudarsan+Building+14+Whites+Road+Royapettah+Chennai+600014",
  },

  {
    group: "Regional Offices",
    tag: "West",
    city: "Mumbai",
    lines: [
      "TVS Srichakra Limited",
      "810, 8th Floor, Ecostar,",
      "Vishweshwar Nagar Cross Road,",
      "Off Aarey Road, Goregaon East,",
      "Mumbai – 400063",
    ],
    tel: ["022-62368626"],
    map: "Ecostar+Vishweshwar+Nagar+Cross+Road+Off+Aarey+Road+Goregaon+East+Mumbai+400063",
  },
  {
    group: "Regional Offices",
    tag: "West",
    city: "Ahmedabad",
    lines: [
      "TVS Srichakra Limited",
      "B-307, Premium House, 3rd Floor,",
      "Opp. Gandhigram Railway Station,",
      "Ahmedabad – 380009",
    ],
    tel: ["079-26580181", "079-26585571"],
    map: "Premium+House+Opp+Gandhigram+Railway+Station+Ashram+Road+Ahmedabad+380009",
  },
  {
    group: "Regional Offices",
    tag: "South",
    city: "Bengaluru",
    lines: [
      "TVS Srichakra Limited",
      "4, 9th Main, 1st Floor,",
      "Banashankari 2nd Stage,",
      "Beside Indian Oil Petrol Bunk,",
      "Bengaluru – 560070",
    ],
    tel: ["080-26716764"],
    map: "4+9th+Main+Banashankari+2nd+Stage+Bengaluru+560070",
  },
  {
    group: "Regional Offices",
    tag: "South",
    city: "Hyderabad",
    lines: [
      "TVS Srichakra Limited",
      "City Centre Building,",
      "Door No. 3-6-140/A/201, 2nd Floor,",
      "Himayath Nagar,",
      "Hyderabad – 500029",
    ],
    tel: ["040-23222388"],
    map: "City+Centre+Building+3-6-140+Himayat+Nagar+Hyderabad+500029",
  },
  {
    group: "Regional Offices",
    tag: "North",
    city: "New Delhi",
    lines: [
      "TVS Srichakra Limited",
      "Flat No. 268, 2nd Floor,",
      "Deepak Building, Plot No. 13,",
      "Near Nehru Enclave Metro Station,",
      "Nehru Place, New Delhi – 110019",
    ],
    tel: ["011-41422064", "011-41422065"],
    map: "Deepak+Building+Plot+No+13+Nehru+Place+New+Delhi+110019",
  },
  {
    group: "Regional Offices",
    tag: "East",
    city: "Kolkata",
    lines: [
      "TVS Srichakra Limited",
      "Room No. 204, PS-IXL Building,",
      "Near Hotel Holiday Inn, Chinar Park,",
      "Rajarhat, North 24 Parganas,",
      "Kolkata – 700136",
    ],
    tel: ["040-23222388"],
    map: "PS+IXL+Building+Chinar+Park+Rajarhat+Kolkata+700136",
  },

  {
    group: "Manufacturing Unit",
    tag: "Manufacturing Unit",
    city: "Madurai",
    lines: ["TVS Srichakra Limited", "Vellaripatti, Melur Taluk,", "Madurai – 625122"],
    note: "Alongside the R&D centre",
    map: "TVS+Srichakra+Limited+Vellaripatti+Melur+Taluk+Madurai+625122",
  },
  {
    group: "Manufacturing Unit",
    tag: "Manufacturing Unit",
    city: "Uttarakhand",
    lines: [
      "TVS Srichakra Limited",
      "Plot No. 7, Sector 1,",
      "Integrated Industrial Estate, SIDCUL,",
      "Pantnagar, Rudrapur Tehsil, Kichha Dist.,",
      "Uttarakhand – 263153",
    ],
    tel: ["05944-250374"],
    map: "TVS+Srichakra+Plot+7+Sector+1+Integrated+Industrial+Estate+SIDCUL+Pantnagar+Rudrapur+Uttarakhand+263153",
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

const CHANNELS = [
  { label: "General", value: "info@eurogriptyres.com", href: "mailto:info@eurogriptyres.com", icon: "chat" },
  { label: "Dealers & distributors", value: "sales@eurogriptyres.com", href: "mailto:sales@eurogriptyres.com", icon: "handshake" },
  { label: "Media & press", value: "media@eurogriptyres.com", href: "mailto:media@eurogriptyres.com", icon: "news" },
]

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
    tyre: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 3v5m0 8v5M3 12h5m8 0h5",
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

const fileBtn =
  "block w-full cursor-pointer rounded-md border border-dashed border-black/25 bg-mist px-3.5 py-2.5 text-[0.86rem] text-slate-500 file:mr-3 file:cursor-pointer file:rounded-[3px] file:border-0 file:bg-racing file:px-3 file:py-1.5 file:font-display file:text-[0.7rem] file:font-extrabold file:uppercase file:italic file:tracking-[0.06em] file:text-white hover:border-racing/40 hover:file:bg-eurored"

/** One field from the active query type's schema. */
function FormField({ f, err, onFile }: { f: Field; err?: string; onFile: (f: Field, file: File | null) => void }) {
  const span = "wide" in f && f.wide ? "sm:col-span-2" : ""

  if (f.kind === "select") {
    return (
      <div className={span}>
        <label htmlFor={f.name} className={label}>{f.label}{f.required && " *"}</label>
        <select id={f.name} name={f.name} required={f.required} defaultValue="" className={field}>
          <option value="" disabled>{f.placeholder}</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }

  if (f.kind === "textarea") {
    return (
      <div className="sm:col-span-2">
        <label htmlFor={f.name} className={label}>{f.label}{f.required && " *"}</label>
        <textarea id={f.name} name={f.name} required={f.required} rows={f.rows ?? 2} className={field} placeholder={f.placeholder} />
      </div>
    )
  }

  if (f.kind === "file") {
    return (
      <div className="sm:col-span-2">
        <label htmlFor={f.name} className={label}>{f.label}{f.required && " *"}</label>
        <input
          id={f.name}
          name={f.name}
          type="file"
          accept={f.limit.accept}
          required={f.required}
          onChange={(e) => onFile(f, e.target.files?.[0] ?? null)}
          className={fileBtn}
        />
        <p className={`mt-1.5 text-[0.75rem] font-light ${err ? "font-medium text-eurored" : "text-slate-500"}`}>
          {err ?? f.hint}
        </p>
      </div>
    )
  }

  return (
    <div className={span}>
      <label htmlFor={f.name} className={label}>{f.label}{f.required && " *"}</label>
      <input id={f.name} name={f.name} type={f.kind} required={f.required} className={field} placeholder={f.placeholder} />
    </div>
  )
}

function ContactForm({ queryType, onQueryType }: { queryType: string; onQueryType: (k: string) => void }) {
  const [sent, setSent] = useState(false)
  const [fileErrs, setFileErrs] = useState<Record<string, string>>({})
  const reduce = useReducedMotion()
  const active = QUERY_TYPES.find((q) => q.key === queryType) ?? QUERY_TYPES[0]

  /* no backend yet, so the type/size rules on the live forms are enforced here */
  const checkFile = (f: Field, file: File | null) => {
    if (f.kind !== "file") return
    let msg = ""
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
      if (!f.limit.exts.includes(ext)) msg = `${f.limit.exts.join(" / ").toUpperCase()} files only.`
      else if (file.size > f.limit.maxBytes) msg = `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${f.limit.maxBytes / 1024 / 1024} MB.`
    }
    setFileErrs((p) => ({ ...p, [f.name]: msg }))
  }

  const pickType = (k: string) => { onQueryType(k); setFileErrs({}) }
  const blocked = Object.values(fileErrs).some(Boolean)

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

            {/* type of query — client-requested field; it also swaps the fields below */}
            <div className="sm:col-span-2">
              <label htmlFor="qtype" className={label}>Type of query *</label>
              <select
                id="qtype"
                required
                value={queryType}
                onChange={(e) => pickType(e.target.value)}
                className={field}
              >
                {QUERY_TYPES.map((q) => (
                  <option key={q.key} value={q.key}>{q.title}</option>
                ))}
              </select>
            </div>

            {/* keyed on the query type so switching gives every field a fresh,
                empty control rather than carrying a stale value across schemas */}
            {active.fields.map((f) => (
              <FormField key={`${active.key}-${f.name}`} f={f} err={fileErrs[f.name] || undefined} onFile={checkFile} />
            ))}

            <label className="flex items-start gap-2.5 text-[0.82rem] font-light text-slate-600 sm:col-span-2">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#0a6ed8]" />
              I agree that Eurogrip may use my details to respond to this enquiry.
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={blocked}
                className="group inline-flex items-center gap-2 rounded-[3px] bg-eurored px-6 py-3 font-display text-[0.86rem] font-extrabold uppercase italic tracking-[0.04em] text-white shadow-[0_10px_30px_-10px_rgba(237,28,36,.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
              >
                {active.key === "careers" ? "Send application" : "Send message"}{" "}
                <span className="transition-transform group-hover:translate-x-1">→</span>
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
  "Corporate & Marketing Office": "Corporate & Marketing",
  "Regional Offices": "Regional Offices",
  "Manufacturing Unit": "Manufacturing",
  "Design Centre": "Design Centre",
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L8.1 9.6a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2z" />
    </svg>
  )
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
          lede="From the Chennai corporate office to the Milan design centre — pick a location to view it on the map."
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
                {/* no exit animation — the incoming group must paint immediately,
                    otherwise a tab switch waits on an exit that may never finish */}
                <AnimatePresence>
                  <motion.div
                    key={group}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: ENTER }}
                  >
                    <span className="font-display text-[0.7rem] font-extrabold uppercase italic tracking-[0.14em] text-sky-300">{group}</span>
                    <div className="mt-4 space-y-2.5">
                      {groupOffices.map((of, i) => {
                        const on = i === Math.min(sel, groupOffices.length - 1)
                        return (
                          <button
                            key={of.tag + of.city}
                            onClick={() => setSel(i)}
                            aria-expanded={on}
                            className={`w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-300 ${
                              on
                                ? "border-eurored/70 bg-white/10 shadow-[0_18px_40px_-24px_rgba(0,0,0,.6)]"
                                : "border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.07]"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${on ? "bg-eurored text-white" : "bg-white/10 text-sky-300"}`}>
                                <PinIcon />
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="font-display text-[0.64rem] font-extrabold uppercase tracking-[0.1em] text-sky-300">{of.tag}</span>
                                <div className="font-display text-[1rem] font-extrabold uppercase italic leading-tight text-white">{of.city}</div>
                                {/* the full address only unfurls for the selected office, so a
                                    six-office region list still sits alongside the map */}
                                {on && (
                                  <>
                                    <p className="mt-1.5 text-[0.82rem] font-light leading-relaxed text-slate-300">
                                      {of.lines.map((l) => <span key={l} className="block">{l}</span>)}
                                    </p>
                                    {of.tel && (
                                      <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] font-medium text-white">
                                        <span className="text-sky-300"><PhoneIcon /></span>
                                        {of.tel.map((t, k) => (
                                          <span key={t + k} className="inline-flex items-center gap-2">
                                            {k > 0 && <span className="text-slate-500">·</span>}
                                            <a
                                              href={`tel:+91${t.replace(/\D/g, "").replace(/^0/, "")}`}
                                              onClick={(e) => e.stopPropagation()}
                                              className="underline-offset-4 hover:underline"
                                            >
                                              {t}
                                            </a>
                                          </span>
                                        ))}
                                      </span>
                                    )}
                                    {of.note && (
                                      <span className="mt-1.5 inline-block text-[0.72rem] font-medium text-slate-400">{of.note}</span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
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
