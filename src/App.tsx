import { Suspense, lazy } from "react"
import { Navbar } from "./components/site/Navbar"
import { RouterProvider, useRouter } from "./lib/router"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Careers } from "./pages/Careers"
import { CareersApply } from "./pages/CareersApply"
import { CareersOpenings } from "./pages/CareersOpenings"
import { GlobalPresence } from "./pages/GlobalPresence"
import { Reviews } from "./pages/Reviews"
import { Partnerships } from "./pages/Partnerships"
import { Newsroom } from "./pages/Newsroom"
import { NewsroomList } from "./pages/NewsroomList"
import { NewsroomStory } from "./pages/NewsroomStory"
/* The press archive ships ~825 records; lazy-loading keeps that weight off
   every other page. */
const NewsroomCoverage = lazy(() =>
  import("./pages/NewsroomCoverage").then((m) => ({ default: m.NewsroomCoverage }))
)
/* Products carries GSAP + ScrollTrigger for the pinned journey — around 155 kB
   that no other route needs. */
const Products = lazy(() =>
  import("./pages/Products").then((m) => ({ default: m.Products }))
)
import { NEWS_SORTED, TYPE_SLUG, type NewsType } from "./lib/newsroom"

const SLUG_TO_TYPE = Object.fromEntries(
  Object.entries(TYPE_SLUG).map(([t, s]) => [s, t as NewsType])
) as Record<string, NewsType>

/** /newsroom · /newsroom/<category> · /newsroom/<category>/<slug> */
function newsroomRoute(path: string) {
  const parts = path.replace(/^\/newsroom\/?/, "").replace(/\/$/, "").split("/").filter(Boolean)
  if (parts.length === 0) return <Newsroom />
  const type = SLUG_TO_TYPE[parts[0]]
  if (!type) return <Newsroom />
  /* coverage is an article-level archive with its own filters and viewer */
  if (parts.length === 1)
    return type === "coverage" ? (
      <Suspense fallback={<PageLoading />}>
        <NewsroomCoverage />
      </Suspense>
    ) : (
      <NewsroomList type={type} />
    )
  const item = NEWS_SORTED.find(
    (n) => n.type === type && n.id.replace(/^(event|coverage|newsletter)-/, "") === parts[1]
  )
  return item ? <NewsroomStory item={item} /> : <NewsroomList type={type} />
}

function PageLoading() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-white">
      <span className="font-display text-[0.8rem] font-extrabold uppercase italic tracking-[0.14em] text-slate-400">
        Loading…
      </span>
    </main>
  )
}

function Outlet() {
  const { path } = useRouter()
  if (path === "/about") return <About />
  if (path === "/contact") return <Contact />
  if (path === "/products")
    return (
      <Suspense fallback={<PageLoading />}>
        <Products />
      </Suspense>
    )
  if (path === "/careers") return <Careers />
  if (path === "/careers/apply") return <CareersApply />
  if (path === "/careers/openings") return <CareersOpenings />
  if (path === "/global-presence") return <GlobalPresence />
  if (path === "/reviews") return <Reviews />
  if (path === "/partnerships") return <Partnerships />
  if (path === "/newsroom" || path.startsWith("/newsroom/")) return newsroomRoute(path)
  return <Home />
}

export default function App() {
  return (
    <RouterProvider>
      <div className="bg-midnight">
        <Navbar />
        <Outlet />
      </div>
    </RouterProvider>
  )
}
