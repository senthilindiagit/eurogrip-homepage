import { Navbar } from "./components/site/Navbar"
import { RouterProvider, useRouter } from "./lib/router"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Careers } from "./pages/Careers"
import { CareersApply } from "./pages/CareersApply"
import { GlobalPresence } from "./pages/GlobalPresence"
import { Newsroom } from "./pages/Newsroom"
import { NewsroomList } from "./pages/NewsroomList"
import { NewsroomStory } from "./pages/NewsroomStory"
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
  if (parts.length === 1) return <NewsroomList type={type} />
  const item = NEWS_SORTED.find(
    (n) => n.type === type && n.id.replace(/^(event|coverage|newsletter)-/, "") === parts[1]
  )
  return item ? <NewsroomStory item={item} /> : <NewsroomList type={type} />
}

function Outlet() {
  const { path } = useRouter()
  if (path === "/about") return <About />
  if (path === "/contact") return <Contact />
  if (path === "/careers") return <Careers />
  if (path === "/careers/apply") return <CareersApply />
  if (path === "/global-presence") return <GlobalPresence />
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
