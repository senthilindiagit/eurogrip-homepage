import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import logoWhite from "@/assets/logo-red-white.png"
import logoAllWhite from "@/assets/logo-white.png"
import { LanguageSelect, CountrySelectCompact } from "./widgets"
import { useRouter } from "@/lib/router"

const LINKS: [string, string][] = [
  ["About", "/about"],
  ["Products", "/products"],
  ["Technology", "/#technology"],
  ["Partnerships", "/partnerships"],
  ["Global Presence", "/global-presence"],
  ["Newsroom", "/newsroom"],
  ["Contact", "/contact"],
]

/* Routes whose hero starts on a light canvas — the bar needs its solid dark
   treatment immediately, or white nav text lands on white. */
const LIGHT_TOP = new Set(["/careers", "/careers/apply", "/careers/openings"])
/** the newsroom tree is light-topped too */
const LIGHT_PREFIX = ["/newsroom"]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { navigate, path } = useRouter()
  const go = (href: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return
    e.preventDefault()
    navigate(href)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const solid = scrolled || LIGHT_TOP.has(path) || LIGHT_PREFIX.some((p) => path.startsWith(p))
  /* the Reviews hero is brand red — the red checks vanish on it, so run the
     all-white mark there until the bar goes solid dark */
  const logoSrc = path === "/reviews" && !solid ? logoAllWhite : logoWhite

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 0.84, 0.34, 1], delay: 1.55 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "bg-midnight/85 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,.08)] py-2.5" : "py-4"
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <a href="/" onClick={go("/")} aria-label="Eurogrip home" className="shrink-0">
          <img src={logoSrc} alt="Eurogrip" className={cn("w-auto transition-all", solid ? "h-6" : "h-7")} />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map(([label, href]) => {
            /* a section link stays lit on its inner pages too (/newsroom/events/…) */
            const active = href === path || (href.startsWith("/") && !href.includes("#") && path.startsWith(href + "/"))
            return (
              <a
                key={href}
                href={href}
                onClick={go(href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative text-[0.86rem] font-semibold transition-colors hover:text-white",
                  active ? "text-white" : "text-slate-200"
                )}
              >
                {label}
                <span className={cn("absolute -bottom-0.5 left-0 h-0.5 bg-eurored transition-all duration-300", active ? "w-full" : "w-0 group-hover:w-full")} />
              </a>
            )
          })}
          <LanguageSelect />
          <CountrySelectCompact />
        </nav>

        <button
          className="flex flex-col gap-[5px] p-2 lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={cn("h-0.5 w-6 bg-white transition-all", open && "translate-y-[7px] rotate-45")} />
          <span className={cn("h-0.5 w-6 bg-white transition-all", open && "opacity-0")} />
          <span className={cn("h-0.5 w-6 bg-white transition-all", open && "-translate-y-[7px] -rotate-45")} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 0.84, 0.34, 1] }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[min(320px,84vw)] flex-col justify-center gap-1 bg-midnight/95 p-10 shadow-[-20px_0_60px_rgba(10,25,50,.5)] backdrop-blur-md lg:hidden"
          >
            {LINKS.map(([label, href]) => {
              const active = href === path || (href.startsWith("/") && !href.includes("#") && path.startsWith(href + "/"))
              return (
                <a key={href} href={href} onClick={(e) => { setOpen(false); go(href)(e) }} className={cn("py-2.5 text-lg font-semibold", active ? "text-eurored" : "text-slate-100")}>
                  {label}
                </a>
              )
            })}
            <div className="mt-3"><CountrySelectCompact /></div>
            <div className="mt-5 border-t border-white/10 pt-5"><LanguageSelect /></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
