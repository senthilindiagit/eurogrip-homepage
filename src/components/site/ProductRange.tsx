import ProductRangeCard from "@/components/ui/productrangecard"
import { PRODUCTS } from "@/lib/site-data"
import { Reveal, SectionHead } from "./ui"
import tyreImg from "@/assets/tyre.webp"
import tyreBadshah from "@/assets/tyre-badshah.webp"
import tyreToofan from "@/assets/tyre-toofan.webp"
import tyreHs1000 from "@/assets/tyre-hs1000.webp"
import tyreMt63l from "@/assets/tyre-mt63l.webp"
import tyreEl09 from "@/assets/tyre-el09.webp"
import motorbikeSvg from "@/assets/products/motorbike.svg?raw"
import tuktukSvg from "@/assets/products/tuktuk.svg?raw"
import truckSvg from "@/assets/products/truck.svg?raw"
import tractorSvg from "@/assets/products/tractor.svg?raw"
import forkliftSvg from "@/assets/products/forklift.svg?raw"
import dumptruckSvg from "@/assets/products/dumptruck.svg?raw"

// client-supplied vehicle icons, converted to currentColor so they take
// the card's --egp-brand blue (and any future colour) automatically
const svgIcon = (raw: string) => (
  <span aria-hidden className="block h-full w-full [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: raw }} />
)

const ICONS = [
  svgIcon(motorbikeSvg),
  svgIcon(tuktukSvg),
  svgIcon(truckSvg),
  svgIcon(tractorSvg),
  svgIcon(forkliftSvg),
  svgIcon(dumptruckSvg),
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
          title={<span className="whitespace-nowrap text-[clamp(1.2rem,3.6vw,2.9rem)]">One specialist. Six worlds of grip.</span>}
          lede={<>Six specialist ranges, engineered for the way each machine works. <em>Hover a category to preview it.</em></>}
          className="mb-[clamp(40px,6vh,64px)] max-w-none"
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
