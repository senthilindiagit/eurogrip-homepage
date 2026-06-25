import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/* ---------- icons ---------- */
export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" />
    </svg>
  )
}
function Chevron({ open }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" className={cn("transition-transform duration-300", open && "rotate-180")} aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey) }
  }, [open])
  return { open, setOpen, ref }
}

/* ---------- Language selector (top nav) ---------- */
const LANGS = [
  { c: "ENG", l: "English" },
  { c: "हिन्", l: "हिन्दी" },
  { c: "ESP", l: "Español" },
  { c: "POR", l: "Português" },
  { c: "ARA", l: "العربية" },
]
export function LanguageSelect({ className }: { className?: string }) {
  const { open, setOpen, ref } = useDropdown()
  const [lang, setLang] = useState(LANGS[0])
  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox" aria-expanded={open}
        className="flex items-center gap-1.5 text-[0.86rem] font-semibold text-slate-200 transition-colors hover:text-white"
      >
        <GlobeIcon className="text-eurored" /> {lang.c} <Chevron open={open} />
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 top-[calc(100%+12px)] z-50 min-w-[150px] overflow-hidden rounded-md border border-white/10 bg-asphalt/95 py-1.5 shadow-2xl backdrop-blur-xl">
          {LANGS.map((l) => (
            <li key={l.c}>
              <button onClick={() => { setLang(l); setOpen(false) }} className={cn("block w-full px-4 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white", l.c === lang.c && "text-eurored")}>
                {l.l}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------- Country / region selector (footer) ---------- */
const REGIONS = ["Global (English)", "India", "Europe", "Middle East", "Asia Pacific", "Latin America", "Africa", "North America"]
export function CountrySelect() {
  const { open, setOpen, ref } = useDropdown()
  const [region, setRegion] = useState(REGIONS[0])
  return (
    <div className="relative" ref={ref}>
      <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.14em] text-slate-500">Select country / region</span>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox" aria-expanded={open}
        className="flex w-full min-w-[240px] items-center justify-between gap-4 rounded-md border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-200 transition-colors hover:border-white/35"
      >
        <span className="flex items-center gap-2.5"><GlobeIcon className="text-eurored" /> {region}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul role="listbox" className="absolute bottom-[calc(100%+8px)] left-0 z-50 max-h-64 w-full overflow-auto rounded-md border border-white/10 bg-asphalt/97 py-1.5 shadow-2xl backdrop-blur-xl">
          {REGIONS.map((r) => (
            <li key={r}>
              <button onClick={() => { setRegion(r); setOpen(false) }} className={cn("block w-full px-4 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white", r === region && "text-eurored")}>
                {r}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------- Social icons ---------- */
const SOCIALS = [
  { name: "X", href: "#", icon: (<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>) },
  { name: "Instagram", href: "#", icon: (<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" /></svg>) },
  { name: "YouTube", href: "https://www.youtube.com/@eurogriptyres", icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.2-.41-4.73a2.4 2.4 0 0 0-1.69-1.7C19.36 5.16 12 5.16 12 5.16s-7.36 0-8.9.41a2.4 2.4 0 0 0-1.69 1.7C1 8.8 1 12 1 12s0 3.2.41 4.73a2.4 2.4 0 0 0 1.69 1.7c1.54.41 8.9.41 8.9.41s7.36 0 8.9-.41a2.4 2.4 0 0 0 1.69-1.7C23 15.2 23 12 23 12Zm-13 3.27V8.73L15.5 12 10 15.27Z" /></svg>) },
  { name: "Facebook", href: "#", icon: (<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M14 8.5h2.5V5.3C16.1 5.25 14.8 5 13.6 5 11 5 9.3 6.57 9.3 9.4v2.1H6.5v3.2h2.8V22h3.4v-7.3h2.7l.43-3.2h-3.13V9.7c0-.92.26-1.2 1.2-1.2Z" /></svg>) },
]
export function Socials() {
  return (
    <div className="flex gap-3">
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target={s.href === "#" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={s.name}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white/90 transition-colors hover:border-eurored hover:bg-eurored hover:text-white"
        >
          {s.icon}
        </a>
      ))}
    </div>
  )
}
