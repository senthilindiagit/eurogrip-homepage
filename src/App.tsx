import { Navbar } from "./components/site/Navbar"
import { RouterProvider, useRouter } from "./lib/router"
import { Home } from "./pages/Home"
import { About } from "./pages/About"

function Outlet() {
  const { path } = useRouter()
  if (path === "/about") return <About />
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
