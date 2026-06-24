import ProductRangeCard from "@/components/ui/productrangecard"
import { PRODUCTS } from "@/lib/site-data"
import { Reveal, SectionHead } from "./ui"
import tyreImg from "@/assets/tyre.webp"

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
              <ProductRangeCard index={i + 1} {...p} popImage={tyreImg} popFrom="top" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
