import { useState } from "react"
import { Reveal, Eyebrow, Btn, Arrow } from "./ui"
import logoWhite from "@/assets/logo-white.png"
import ctaBg from "@/assets/yt-masterclass.webp"

const FOOT = {
  Products: ["Two-Wheeler", "Three-Wheeler", "Ultra-Light Truck", "Agricultural", "Industrial", "OTR"],
  Company: ["About Eurogrip", "Technology", "Racing & Partnership", "Global Presence", "Newsroom", "Careers"],
  Connect: ["Find a Dealer", "Become a Distributor", "OEM Enquiries", "Contact Us"],
}

const CERTS = [
  { fam: "ISO", num: "9001", year: "2015" },
  { fam: "IATF", num: "16949", year: "2016" },
  { fam: "ISO", num: "14001", year: "2015" },
  { fam: "ISO", num: "45001", year: "2018" },
]

function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  return (
    <div className="w-full lg:max-w-[360px]">
      <h5 className="mb-3 text-center font-display text-[0.82rem] font-extrabold uppercase italic tracking-[0.08em] text-white md:text-left">Subscribe to our newsletter</h5>
      {done ? (
        <p className="text-[0.9rem] text-slate-400">Thanks — you’re on the list. Watch your inbox for tyre tech, racing and product news.</p>
      ) : (
        <>
          <p className="mb-3 text-[0.9rem] text-slate-500">Tyre technology, racing and product news — straight to your inbox.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) setDone(true) }}
            className="flex flex-col gap-2.5 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-[3px] border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-eurored focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-[3px] bg-eurored px-5 py-2.5 font-display text-[0.82rem] font-extrabold uppercase italic tracking-wide text-white transition-transform hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>
        </>
      )}
    </div>
  )
}

function CertSeal({ fam, num, year }: { fam: string; num: string; year: string }) {
  return (
    <div className="relative grid h-[92px] w-[92px] shrink-0 place-items-center rounded-full border border-racing/70 bg-[#0b1622] shadow-[inset_0_0_0_4px_rgba(255,255,255,.04)]">
      <span className="absolute inset-[6px] rounded-full border border-dashed border-white/15" />
      <div className="text-center leading-none">
        <div className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-sky-300">{fam}</div>
        <div className="font-display text-[1.05rem] font-black italic text-white">{num}</div>
        <div className="mt-0.5 text-[0.58rem] tracking-[0.18em] text-slate-400">{year}</div>
      </div>
    </div>
  )
}

export function CtaFooter() {
  return (
    <>
      <section id="contact" className="relative overflow-hidden text-center text-white">
        <img src={ctaBg} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover" style={{ filter: "blur(5px) brightness(0.6)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(0,70,140,.9), rgba(0,22,52,.92))" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ background: "repeating-conic-gradient(#fff 0 25%,transparent 0 50%) 0 0/40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-[clamp(80px,12vh,150px)] sm:px-8">
          <Reveal><Eyebrow className="text-sky-300 [&::before]:bg-sky-300">Get in touch</Eyebrow></Reveal>
          <Reveal i={1}><h2 className="italic-display mt-3 text-white text-[clamp(2.2rem,6vw,4.4rem)]">Find your Eurogrip</h2></Reveal>
          <Reveal i={2}>
            <p className="mx-auto mt-4 max-w-[60ch] text-[clamp(1.05rem,1.7vw,1.3rem)] text-sky-100">
              Locate a distributor, request an OEM partnership, or talk to our team about the right specialist tyre for your fleet or your next ride.
            </p>
          </Reveal>
          <Reveal i={3} className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Btn href="#contact" variant="red">Find a dealer <Arrow /></Btn>
            <Btn href="#contact" variant="line">Partner with us</Btn>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#070a0d] pb-8 pt-[74px]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <img src={logoWhite} alt="Eurogrip" className="mb-4 h-7 w-auto" />
              <p className="max-w-[34ch] text-[0.9rem] text-slate-500">
                Specialist tyre technology, engineered to outperform. A TVS Mobility Group company.
              </p>
            </div>
            {Object.entries(FOOT).map(([head, links]) => (
              <div key={head}>
                <h5 className="mb-4 font-display text-[0.82rem] font-extrabold uppercase italic tracking-[0.08em] text-white">{head}</h5>
                {links.map((l) => (
                  <a key={l} href="#" className="block py-1.5 text-[0.9rem] text-slate-500 transition-colors hover:text-white">{l}</a>
                ))}
              </div>
            ))}
          </div>

          {/* certifications + newsletter */}
          <div className="mt-12 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <h5 className="mb-5 text-center font-display text-[0.82rem] font-extrabold uppercase italic tracking-[0.08em] text-white md:text-left">Certifications</h5>
              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-5 md:justify-start">
                {CERTS.map((c) => <CertSeal key={c.fam + c.num} {...c} />)}
              </div>
            </div>
            <Newsletter />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3.5 border-t border-white/10 pt-6 text-[0.82rem] text-slate-600">
            <span>© 2026 TVS Srichakra Limited · Eurogrip is a registered trademark.</span>
            <div className="flex gap-3.5">
              {[["Instagram", "#"], ["YouTube", "https://www.youtube.com/@eurogriptyres"], ["LinkedIn", "#"]].map(([s, href]) => (
                <a key={s} href={href} target={href === "#" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={s} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-eurored hover:bg-eurored hover:text-white">
                  <span className="text-[0.7rem] font-bold">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
