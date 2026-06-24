import { Reveal, Eyebrow, Btn, Arrow } from "./ui"
import logoWhite from "@/assets/logo-white.png"

const FOOT = {
  Products: ["Two-Wheeler", "Three-Wheeler", "Ultra-Light Truck", "Agricultural", "Industrial", "OTR"],
  Company: ["About Eurogrip", "Technology", "Racing & Partnership", "Global Presence", "Newsroom", "Careers"],
  Connect: ["Find a Dealer", "Become a Distributor", "OEM Enquiries", "Contact Us"],
}

export function CtaFooter() {
  return (
    <>
      <section id="contact" className="relative overflow-hidden text-center text-white"
        style={{ background: "linear-gradient(110deg,#0054a6,#003a73)" }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ background: "repeating-conic-gradient(#fff 0 25%,transparent 0 50%) 0 0/40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-[clamp(70px,11vh,130px)] sm:px-8">
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
          <div className="mt-12 flex flex-wrap items-center justify-between gap-3.5 border-t border-white/10 pt-6 text-[0.82rem] text-slate-600">
            <span>© 2026 TVS Srichakra Limited · Eurogrip is a registered trademark.</span>
            <div className="flex gap-3.5">
              {["Instagram", "YouTube", "LinkedIn"].map((s) => (
                <a key={s} href="#" aria-label={s} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-eurored hover:bg-eurored hover:text-white">
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
