import { Navbar } from "./components/site/Navbar"
import { Cine } from "./components/site/Cine"
import { Hero } from "./components/site/Hero"
import { Promise as BrandPromise } from "./components/site/Promise"
import { ProductRange } from "./components/site/ProductRange"
import { Technology } from "./components/site/Technology"
import { Racing } from "./components/site/Racing"
import { AboutGroup } from "./components/site/AboutGroup"
import { GlobalPresence } from "./components/site/GlobalPresence"
import { Newsroom } from "./components/site/Newsroom"
import { CtaFooter } from "./components/site/CtaFooter"

export default function App() {
  return (
    <div className="bg-midnight">
      <Navbar />
      <main>
        <div className="relative overflow-x-clip">
          <Hero />
          <Cine><BrandPromise /></Cine>
        </div>
        <Cine><ProductRange /></Cine>
        <Cine><Technology /></Cine>
        <Cine><Racing /></Cine>
        <Cine><AboutGroup /></Cine>
        <Cine><GlobalPresence /></Cine>
        {/* Newsroom stays untransformed — its lightbox modal is position:fixed */}
        <Newsroom />
        <Cine><CtaFooter /></Cine>
      </main>
    </div>
  )
}
