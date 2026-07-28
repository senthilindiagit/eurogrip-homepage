import { Navbar } from "./components/site/Navbar"
import { RouterProvider, useRouter } from "./lib/router"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Careers } from "./pages/Careers"
import { CareersApply } from "./pages/CareersApply"
import { GlobalPresence } from "./pages/GlobalPresence"

function Outlet() {
  const { path } = useRouter()
  if (path === "/about") return <About />
  if (path === "/contact") return <Contact />
  if (path === "/careers") return <Careers />
  if (path === "/careers/apply") return <CareersApply />
  if (path === "/global-presence") return <GlobalPresence />
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
