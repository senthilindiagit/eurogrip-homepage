import ProductRangeCard from "@/components/ui/productrangecard"
import { PRODUCTS } from "@/lib/site-data"
import { Reveal, SectionHead } from "./ui"
import tyreImg from "@/assets/tyre.webp"
import tyreBadshah from "@/assets/tyre-badshah.webp"
import tyreToofan from "@/assets/tyre-toofan.webp"
import tyreHs1000 from "@/assets/tyre-hs1000.webp"
import tyreMt63l from "@/assets/tyre-mt63l.webp"
import tyreEl09 from "@/assets/tyre-el09.webp"
import { Bike, Truck, Tractor, Forklift } from "lucide-react"

const ICON = 48
const SW = 1.6
// auto-rickshaw (three-wheeler) — domed cabin with one front + two rear wheels
const Rickshaw = (
  <svg viewBox="0 0 24 24" width={ICON} height={ICON} fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 15v-3a5 5 0 0 1 5-5h3l4 4v4" />
    <path d="M3 15h2m3 0h3m3 0h3" />
    <circle cx="6" cy="17" r="1.8" />
    <circle cx="13.6" cy="17" r="1.8" />
    <circle cx="17" cy="17" r="1.8" />
  </svg>
)
// OTR dump truck — big bed + cab on heavy wheels
const DumpTruck = (
  <svg viewBox="0 0 24 24" width={ICON} height={ICON} fill="none" stroke="currentColor" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 8h8v6h-8z" />
    <path d="M10.5 14v-3h3l3 3v3" />
    <path d="M2.5 14.5h2m4.5 0h4.5m4 0h2" />
    <circle cx="6.5" cy="17.4" r="2.1" />
    <circle cx="16.5" cy="17.4" r="2.1" />
  </svg>
)

const ICONS = [
  <Bike size={ICON} strokeWidth={SW} />,
  Rickshaw,
  <Truck size={ICON} strokeWidth={SW} />,
  <Tractor size={ICON} strokeWidth={SW} />,
  <Forklift size={ICON} strokeWidth={SW} />,
  DumpTruck,
]

// per-category hover pop-out — two-wheeler keeps the generic tyre,
// every other category reveals its real Eurogrip product shot
const POP = [tyreImg, tyreBadshah, tyreToofan, tyreHs1000, tyreMt63l, tyreEl09]
// even out the on-hover sizes — tall narrow tyres (3-wheeler, truck) shrink,
// the near-square two-wheeler tyre grows
const POP_SCALE = [1.32, 0.8, 0.85, 1, 1, 1]

export function ProductRange() {
  return (
    <section id="products" className="bg-[#f5f6f8] py-[clamp(84px,13vh,150px)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHead
          light
          eyebrow="The range"
          title="One specialist. Six worlds of grip."
          lede="From a city commute to a quarry haul, Eurogrip engineers a specialist tyre for the way each machine actually works. Hover a category to preview its line-up."
          className="mb-[clamp(40px,6vh,64px)]"
        />
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.title} i={i % 3}>
              <ProductRangeCard index={i + 1} {...p} icon={ICONS[i]} popImage={POP[i]} popScale={POP_SCALE[i]} popFrom="top" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
