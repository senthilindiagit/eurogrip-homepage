import { useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Reveal, Eyebrow } from "./ui"
import { Link } from "@/lib/router"

export type AppliedRole = { title: string; dept?: string; place?: string }

const field =
  "w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-[0.92rem] text-asphalt placeholder:text-slate-400 focus:border-racing focus:outline-none focus:ring-2 focus:ring-racing/20"
const label = "mb-1.5 block text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-slate-500"
const MAX_MB = 5

export const DEPARTMENTS = [
  "Engineering / R&D", "Manufacturing & Quality", "Sales & Distribution",
  "Marketing & Brand", "Supply Chain", "Finance & HR", "Internship / Graduate", "Other",
]

const PROMISES = [
  "Every application is read by a person",
  "We respond within two weeks",
  "Graduates and interns welcome",
]

/**
 * Open-application form with CV upload. Self-contained so any page can drop
 * it in — currently the dedicated /careers/apply page.
 */
export function ApplyForm({ appliedRole }: { appliedRole?: AppliedRole }) {
  const [sent, setSent] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  const pick = (f: File | null) => {
    if (!f) { setFile(null); setFileError(null); return }
    if (!/\.(pdf|doc|docx)$/i.test(f.name)) { setFile(null); setFileError("Please upload a PDF or Word document."); return }
    if (f.size > MAX_MB * 1024 * 1024) { setFile(null); setFileError(`Keep the file under ${MAX_MB} MB.`); return }
    setFileError(null)
    setFile(f)
  }

  return (
    <div className="grid items-start gap-[clamp(28px,4vw,56px)] lg:grid-cols-[0.85fr_1.15fr]">
      {/* intro */}
      <div>
        <Reveal><Eyebrow>Apply</Eyebrow></Reveal>
        <Reveal i={1}>
          <h1 className="italic-display mt-3 text-asphalt text-[clamp(1.8rem,4vw,3rem)] leading-[1.04]">
            Tell us where<br />you fit
          </h1>
        </Reveal>
        <Reveal i={2}>
          <p className="mt-4 max-w-[42ch] text-[clamp(0.92rem,1.25vw,1.05rem)] font-light leading-relaxed text-slate-600">
            {appliedRole
              ? <>You're applying for a listed opening — send your details and CV and our talent team will take it from there.</>
              : <>We keep an open application list. Send your details and CV — if there's a fit now or later, our talent team will reach out.</>}
          </p>
        </Reveal>
        <Reveal i={3}>
          <ul className="mt-7 space-y-3">
            {(appliedRole ? PROMISES.filter((t) => t !== "Graduates and interns welcome") : PROMISES).map((t) => (
              <li key={t} className="flex items-center gap-3 text-[0.9rem] font-light text-slate-700">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eurored text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        {/* generic form — point candidates at the live openings */}
        {!appliedRole && (
          <Reveal i={4}>
            <Link
              href="/careers/openings"
              className="group mt-8 block rounded-2xl border border-black/10 bg-white p-5 shadow-[0_24px_55px_-40px_rgba(16,35,70,.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-racing/40"
            >
              <span className="font-display text-[0.68rem] font-extrabold uppercase italic tracking-[0.16em] text-eurored">We're hiring</span>
              <div className="mt-1 font-display text-[1.05rem] font-extrabold uppercase italic leading-tight text-asphalt">Browse open positions</div>
              <p className="mt-1 text-[0.86rem] font-light text-slate-600">Filter by region and department — find the exact role before you apply.</p>
              <span className="mt-2.5 inline-flex items-center gap-1.5 font-display text-[0.78rem] font-extrabold uppercase italic tracking-wide text-racing transition-colors group-hover:text-eurored">
                View openings <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>
        )}
      </div>

      {/* form card */}
      <Reveal i={1}>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_36px_80px_-50px_rgba(6,18,38,.55)] sm:p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-racing text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <h2 className="mt-5 font-display text-[1.3rem] font-extrabold uppercase italic text-asphalt">Application received</h2>
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
                <div className="sm:col-span-2"><Eyebrow>{appliedRole ? "Application" : "Open application"}</Eyebrow></div>

                {/* which position this application is for */}
                {appliedRole && (
                  <div className="rounded-xl border border-racing/30 bg-racing/[0.06] px-4 py-3 sm:col-span-2">
                    <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-racing">Applying for</span>
                    <span className="mt-0.5 block font-display text-[1.02rem] font-extrabold uppercase italic leading-tight text-asphalt">{appliedRole.title}</span>
                    {(appliedRole.dept || appliedRole.place) && (
                      <span className="mt-0.5 block text-[0.8rem] font-light text-slate-600">
                        {[appliedRole.dept, appliedRole.place].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                )}

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
                {/* area & location only make sense on the open application —
                    a listed role already carries its department and location */}
                {!appliedRole && (
                  <div>
                    <label htmlFor="c-dept" className={label}>Area of interest *</label>
                    <select id="c-dept" required defaultValue="" className={field}>
                      <option value="" disabled>Select an area…</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}
                <div className={appliedRole ? "sm:col-span-2" : undefined}>
                  <label htmlFor="c-exp" className={label}>Years of experience</label>
                  <select id="c-exp" defaultValue="" className={field}>
                    <option value="">Select…</option>
                    {["Student / fresher", "0–2 years", "3–5 years", "6–10 years", "10+ years"].map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </div>
                {!appliedRole && (
                  <div className="sm:col-span-2">
                    <label htmlFor="c-loc" className={label}>Preferred location</label>
                    <input id="c-loc" className={field} placeholder="Madurai, Pantnagar, Milan…" />
                  </div>
                )}

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
  )
}
