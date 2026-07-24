import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

/**
 * Minimal path-based router — no dependency, History API only.
 * Routes: "/" (home) and "/about". A shared Navbar sits above the outlet.
 * Internal links use <Link>; homepage section anchors ("#products") are
 * handled route-aware: on home they smooth-scroll, off home they route to
 * "/#anchor" and scroll after the home page mounts.
 */

type RouterCtx = { path: string; navigate: (to: string) => void }
const Ctx = createContext<RouterCtx>({ path: "/", navigate: () => {} })

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname)

  const navigate = useCallback((to: string) => {
    const [rawPath, hash] = to.split("#")
    const nextPath = rawPath || "/"
    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, "", to)
      setPath(nextPath)
      if (hash) {
        // let the new page mount, then scroll to the anchor
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
          })
        )
      } else {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
      }
    } else if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>
}

export function useRouter() {
  return useContext(Ctx)
}

/** Internal link that respects the router. External/hash-only links pass through. */
export function Link({
  href,
  children,
  className,
  onClick,
}: {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const { navigate } = useRouter()
  const isInternal = href.startsWith("/") || href.startsWith("#")
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (isInternal && !e.metaKey && !e.ctrlKey) {
          e.preventDefault()
          onClick?.()
          navigate(href.startsWith("#") ? `/${href}` : href)
        } else {
          onClick?.()
        }
      }}
    >
      {children}
    </a>
  )
}
