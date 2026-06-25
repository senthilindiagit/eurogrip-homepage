import { Navbar } from "./components/site/Navbar"
import { HeroTyre } from "./components/site/HeroTyre"
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
    <div className="bg-asphalt">
      <Navbar />
      <main>
        <div className="relative">
          <Hero />
          <BrandPromise />
          <HeroTyre />
        </div>
        <ProductRange />
        <Technology />
        <Racing />
        <AboutGroup />
        <GlobalPresence />
        <Newsroom />
        <CtaFooter />
      </main>
    </div>
  )
}
