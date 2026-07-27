import { Navbar } from "./components/site/Navbar"
import { RouterProvider, useRouter } from "./lib/router"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"

function Outlet() {
  const { path } = useRouter()
  if (path === "/about") return <About />
  if (path === "/contact") return <Contact />
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
