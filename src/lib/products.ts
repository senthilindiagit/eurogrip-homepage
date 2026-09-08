/* ===========================================================================
   The range, for the global products page.

   This site is the brand layer, not a catalogue: what is actually on sale
   differs market by market, and the client already runs regional sites for
   India, Europe and the USA. So each category describes what it covers and
   who it is for, then hands off — no sizes, no SKUs, nothing that implies
   availability we cannot promise.

   Kept here so the page and the homepage rail can share one source.
   ======================================================================== */

export type Category = {
  id: string
  /** 01–05, shown as the section index */
  n: string
  name: string
  /** one line that says what it is for */
  claim: string
  body: string
  /** the journey panel wants one confident line, not a paragraph */
  short: string
  /** what the category covers — applications, never products */
  covers: string[]
  /** three things that matter about it */
  points: { k: string; d: string }[]
  /** where the detail lives, if it lives elsewhere */
  cta: { label: string; href: string; external?: boolean }
  img: string
  /** product cutouts need containing, machine renders fill the frame */
  fit?: "cover" | "contain"
  /** which brand colour the last word of the heading takes */
  accent?: "red" | "blue"
  /**
   * A brand wordmark to stand in for the typeset heading. Supergrip is its own
   * brand with its own logo, so on that panel the logo IS the title; the
   * `name` still carries the accessible text.
   */
  wordmark?: string
  /** the tyres themselves — first is the hero, the rest recede behind it */
  tyres: string[]
  /**
   * A single client-supplied line-up shot, cut out with its ground shadow
   * already baked in. Where one exists it replaces the assembled `tyres`
   * group: it is real product photography, lit and staged as one composition,
   * so nothing we arrange out of separate cutouts will beat it.
   */
  lineup?: string
  /**
   * What the category covers, as vehicles you can see. Where this exists the
   * journey shows a grid of cutouts with their names instead of the `covers`
   * text pills, and `covers` stays as the short form the rest of the site uses.
   */
  fleet?: { name: string; note: string; img: string }[]
  /**
   * The OEM marques this category is fitted to, by the names in LOGOS. Listed
   * per category rather than reusing the whole marquee, because the marquee is
   * two-wheeler makers and the other categories fit different machines.
   */
  oem?: string[]
  /** sub-categories, where the category has them */
  sub?: { name: string; body: string; img: string }[]
}

/** one screen of the journey */
export type StepKind = "hero" | "detail"
export type Step = { c: Category; kind: StepKind; index: number; last: boolean }

/* the studio renders already used on the About range section */
import twoWheeler from "@/assets/about/vehicles/twowheeler.webp"
import threeWheeler from "@/assets/about/vehicles/threewheeler.webp"
import lightTruck from "@/assets/about/vehicles/lighttruck.webp"
import tractor from "@/assets/about/vehicles/tractor.webp"
import forklift from "@/assets/about/vehicles/forklift.webp"
import otr from "@/assets/about/vehicles/otr.webp"
/* Supergrip is a brand, not a vehicle class — and the forklift render is
   already the Industrial & Construction sub-card, so it gets its own product
   shot, the same one the homepage rail uses for it */
import supergripTyre from "@/assets/tyre-mt63l.webp"

/* The environment, cut out of ONE generated plate by
   scripts/products/build_environment.py — an empty plaza terrace looking over a
   treeline to mountains and a hazy city. Every layer is a band of that same
   photograph, cut along an edge that already exists in it, so they share one
   light and one haze. The plate is a generated placeholder, not photography,
   and must not be presented as such; see docs/PRODUCTS-PAGE.md. */

/** sky, mountains and distant city, top feathered into the sky gradient */
import envFar from "@/assets/products/env-far.webp"
/** the treeline and the parapet, mirrored so it covers its own travel */
import envTrees from "@/assets/products/env-trees.webp"
/** the terrace, mirrored — it repeats seamlessly under the tyres */
import envApron from "@/assets/products/env-apron.webp"
/** the whole plate, for the stacked small-screen layout */
import envScene from "@/assets/products/env-scene.webp"

export const FAR = envFar
export const TREES = envTrees
export const APRON = envApron
export const SCENE = envScene

/**
 * The parapet's base, as a percentage of the viewport. It is where the far band
 * and the treeline both end and the terrace begins — a real architectural edge
 * running the full width of the plate, which is what lets three layers travel at
 * three rates without the seam between them reading as a mistake.
 */
export const HORIZON = 73

/**
 * The sky is a gradient rather than part of an image, because it is the one
 * thing that must be continuous with the page hero above it — and a flat
 * vertical ramp looks identical when translated, so it needs no parallax layer.
 * The far band's feathered top dissolves into it.
 *
 * Both ramps come from one smooth curve fitted to the plate's own sky, and the
 * hero's easing is *solved* so its final slope matches the stage's opening
 * slope (measured 0.225 vs 0.222 red units per pixel). Matching the colour at
 * the join is not enough: the eye reads a sudden change of slope as an edge
 * even when the colour either side is identical to the byte. The ease comes out
 * accelerating, which also keeps the hero deep blue through the band where the
 * navbar and its white heading sit.
 */
export const SKY = "#759cc7"
export const SKY_RGB = "117, 156, 199"
export const HERO_STOPS =
  "#2f5f9f 0%, #3464a2 25%, #4270aa 50%, #537eb4 70%, #638cbd 85%, #759cc7 100%"
export const SKY_STOPS =
  "#759cc7 0%, #8eaed0 12.5%, #a9c1d8 27.1%, #c3d1df 41.7%, #dce0e4 56.3%, #f6efe7 73%, #f6efe7 100%"

/* The products are the tyres, and these are the client's own cutouts. */
import tyre2w from "@/assets/tyre.webp"
/* the two-wheeler range as one staged line-up, supplied by the client: the
   backdrop and checkerboard floor removed, edge tint from the red floor
   neutralised, and a contact shadow rebuilt under each of the five tyres —
   see docs/PRODUCTS-PAGE.md */
import lineup2w from "@/assets/products/lineup-two-wheeler.webp"
/* the three-wheeler range staged from the client's own product cutouts —
   Badshah, Street King and Jaya, the same three patterns as their site's
   three-wheeler banner but at four times the resolution */
import lineup3w from "@/assets/products/lineup-three-wheeler.webp"
/* The two-wheeler applications, as vehicles you can see. Generated cutouts —
   placeholders, deliberately generic and unbranded, to be replaced with the
   client's own vehicle photography. See docs/PRODUCTS-PAGE.md. */
import fleetScooter from "@/assets/products/fleet/scooter.webp"
import fleetCommuter from "@/assets/products/fleet/commuter.webp"
import fleetSport from "@/assets/products/fleet/sport.webp"
import fleetCruiser from "@/assets/products/fleet/cruiser.webp"
import fleetAdventure from "@/assets/products/fleet/adventure.webp"
import fleetElectric from "@/assets/products/fleet/electric.webp"
/* Three-wheeler, ultra-light-truck, off-highway and Supergrip applications.
   The passenger auto, box van, tractor, dump truck and forklift are the
   project's own studio renders from the About range section, matted; the rest
   are generated placeholders. See docs/PRODUCTS-PAGE.md. */
import fleet3wAuto from "@/assets/products/fleet/3w-auto.webp"
import fleet3wCargo from "@/assets/products/fleet/3w-cargo.webp"
import fleet3wElectric from "@/assets/products/fleet/3w-electric.webp"
import fleetUltPickup from "@/assets/products/fleet/ult-pickup.webp"
import fleetUltVan from "@/assets/products/fleet/ult-van.webp"
import fleetUltMinibus from "@/assets/products/fleet/ult-minibus.webp"
import fleetOhtTractor from "@/assets/products/fleet/oht-tractor.webp"
import fleetOhtBackhoe from "@/assets/products/fleet/oht-backhoe.webp"
import fleetOhtDump from "@/assets/products/fleet/oht-dumptruck.webp"
import fleetSgForklift from "@/assets/products/fleet/sg-forklift.webp"
import fleetSgStacker from "@/assets/products/fleet/sg-stacker.webp"
import fleetSgTug from "@/assets/products/fleet/sg-tug.webp"
import fleetSgGolf from "@/assets/products/fleet/sg-golfcart.webp"
import fleetSgMini from "@/assets/products/fleet/sg-minitruck.webp"
import fleetSgLoader from "@/assets/products/fleet/sg-loader.webp"
/* Supergrip's own wordmark, taken from tvssupergriptires.com and recoloured to
   the heading navy — the published file is white for their dark site, and the
   alpha channel carries all the distressed edge detail, so repainting the ink
   and keeping the alpha is lossless. */
import supergripMark from "@/assets/products/supergrip-wordmark.webp"
import tyre3w from "@/assets/tyre-badshah.webp"
import tyreUlt from "@/assets/tyre-toofan.webp"
import tyreOht from "@/assets/tyre-hs1000.webp"
import tyreOht2 from "@/assets/tyre-el09.webp"
import tyreSg from "@/assets/tyre-mt63l.webp"

export const CATEGORIES: Category[] = [
  {
    id: "two-wheeler",
    n: "01",
    name: "Two Wheeler Tyres",
    claim: "Built for every ride",
    body:
      "Four decades of two-wheeler engineering, from commuter scooters to litre-class sport bikes. The premium global range is designed at our Milan centre and tested in Indian, European and Japanese road conditions before it earns the Eurogrip name.",
    short:
      "Four decades of two-wheeler engineering, from commuter scooters to litre-class sport bikes.",
    covers: ["Motorcycles", "Scooters", "Performance riding"],
    points: [
      { k: "Superior grip", d: "Steel-belted radials and silica compounds that hold on wet tarmac as well as dry." },
      { k: "Longer life", d: "Tread patterns tuned for even wear, so the last thousand kilometres feel like the first." },
      { k: "All-weather performance", d: "Tested in Indian, European and Japanese conditions before it earns the name." },
    ],
    cta: { label: "Talk to us about this range", href: "/contact" },
    img: twoWheeler,
    accent: "red",
    tyres: [tyre2w],
    lineup: lineup2w,
    fleet: [
      { name: "Scooters", note: "City automatics, 10\u201314 inch", img: fleetScooter },
      { name: "Commuters", note: "The 100\u2013150cc daily ride", img: fleetCommuter },
      { name: "Sport & track", note: "Faired machines to litre class", img: fleetSport },
      { name: "Cruisers", note: "Long wheelbase, two up", img: fleetCruiser },
      { name: "Adventure & touring", note: "On tarmac and off it, loaded", img: fleetAdventure },
      { name: "Electric", note: "Instant torque, heavier kerb weight", img: fleetElectric },
    ],
    /* every marque on the fitment marquee is a two-wheeler maker, so this
       category takes the full list; the others fit different machines and will
       carry their own */
    oem: ["Aprilia", "Bajaj", "BMW Motorrad", "Hero", "Honda", "Piaggio", "Suzuki", "TVS", "Yamaha"],
  },
  {
    id: "three-wheeler",
    n: "02",
    name: "Three Wheeler Tyres",
    claim: "Built for every mile, every day",
    body:
      "Passenger and cargo three-wheelers earn their keep by never stopping. These tyres are built for kerb strikes, overload, potholes and heat — the conditions that decide whether an operator's week is profitable.",
    short:
      "Built for the kerb strikes, overload and heat that decide an operator's week.",
    covers: ["Passenger auto", "Cargo three-wheeler", "Electric three-wheeler"],
    points: [
      { k: "Carcass strength", d: "Built to carry more than the rating suggests, because operators always will." },
      { k: "Cut & chip resistance", d: "Compounds that survive kerbs, debris and unmade roads." },
      { k: "Cost per kilometre", d: "The number the operator actually buys on." },
    ],
    cta: { label: "Talk to us about this range", href: "/contact" },
    img: threeWheeler,
    accent: "blue",
    tyres: [tyre3w],
    lineup: lineup3w,
    fleet: [
      { name: "Passenger auto", note: "City taxi duty, kerb to kerb", img: fleet3wAuto },
      { name: "Cargo three-wheeler", note: "Load bed, routinely over rating", img: fleet3wCargo },
      { name: "Electric three-wheeler", note: "Instant torque, heavier pack", img: fleet3wElectric },
    ],
  },
  {
    id: "ultra-light-truck",
    n: "03",
    name: "Ultra Light Truck Tyres",
    claim: "Built for business on the move",
    body:
      "The last mile is unforgiving: constant stop-start, kerbing, full loads and no downtime. Our ultra-light truck range is built around casing durability and even wear, for pick-ups and small commercial fleets.",
    short:
      "Casing durability and even wear, for the last mile that never stops.",
    covers: ["Light commercial vehicles", "Delivery vehicles", "Urban transport"],
    points: [
      { k: "High durability", d: "Reinforced casings for sustained full-load, stop-start duty." },
      { k: "Better mileage", d: "Low rolling resistance where every litre counts against the margin." },
      { k: "Reliable control", d: "Stable under load, predictable when the van is empty again." },
    ],
    cta: { label: "Talk to us about this range", href: "/contact" },
    img: lightTruck,
    accent: "blue",
    tyres: [tyreUlt],
    fleet: [
      { name: "Light commercial", note: "Pick-ups on full load, all day", img: fleetUltPickup },
      { name: "Delivery vehicles", note: "Stop-start, kerbing, no downtime", img: fleetUltVan },
      { name: "Urban transport", note: "Passengers, city speeds, tight turns", img: fleetUltMinibus },
    ],
  },
  {
    id: "off-highway",
    n: "04",
    name: "Off Highway Tyres",
    claim: "Built for tough terrain",
    body:
      "Our off-highway business runs as TVS Eurogrip OHT, with its own range across agriculture, construction, industrial and earthmoving. Machines are specified by the job they do, so that range is organised by segment and machine type rather than by size.",
    short:
      "Agriculture, construction, industrial and earthmoving, specified by the job the machine does.",
    covers: ["Construction", "Mining", "Agriculture", "Industrial applications"],
    points: [
      { k: "Superior traction", d: "Lug geometry that finds grip in mud, soil and loose rock." },
      { k: "Rugged durability", d: "Owners report 4,000-plus operating hours at half tread wear." },
      { k: "High load capacity", d: "Radial and bias constructions rated for the heaviest duty cycles." },
    ],
    cta: { label: "Explore the off-highway range", href: "https://www.tvseurogripoht.com/", external: true },
    img: tractor,
    accent: "blue",
    tyres: [tyreOht, tyreOht2],
    fleet: [
      { name: "Agriculture", note: "Tractor drive and front, implements", img: fleetOhtTractor },
      { name: "Construction", note: "Backhoe, loader, grader, telehandler", img: fleetOhtBackhoe },
      { name: "Mining", note: "Rigid and articulated dump trucks", img: fleetOhtDump },
    ],
    sub: [
      {
        name: "Agricultural",
        body: "Tractor drive and front, agri transport and implement, sprayer, power tiller, reaper, lawn and garden.",
        img: tractor,
      },
      {
        name: "Industrial & Construction",
        body: "Backhoe loader, skid steer, motor grader, soil compactor, telehandler, paver, wheeled excavator, forklift.",
        img: forklift,
      },
      {
        name: "OTR",
        body: "Earthmoving and surface mining — rigid and articulated dump trucks, loaders and graders at scale.",
        img: otr,
      },
    ],
  },
  {
    id: "supergrip",
    n: "05",
    name: "Supergrip Tyres",
    claim: "Engineered for extra confidence",
    body:
      "Supergrip is our industrial and speciality brand and a global original-equipment supplier — solid resilients, pneumatics and speciality tyres for material handling, ports, ground support, mining and agriculture, sold in more than 85 countries.",
    short:
      "Our industrial and speciality brand, and a global original-equipment supplier in 85 countries.",
    /* the six applications the Supergrip site itself publishes */
    covers: ["Material handling", "Ports & container", "Ground support", "Golf & turf", "Mining", "Mini truck"],
    points: [
      { k: "Maximum grip", d: "More rubber on the ground, in the places the load actually goes." },
      { k: "Smooth ride", d: "Solid resilients tuned to take the shock out of a hard working day." },
      { k: "Longer mileage", d: "Deeper tread and greater rubber volume for a longer working life." },
    ],
    cta: { label: "Explore Supergrip", href: "https://tvssupergriptires.com/", external: true },
    img: supergripTyre,
    fit: "contain",
    accent: "red",
    tyres: [tyreSg],
    fleet: [
      { name: "Material handling", note: "Forklifts on solid resilients", img: fleetSgForklift },
      { name: "Ports & container", note: "Reach stackers and yard handlers", img: fleetSgStacker },
      { name: "Ground support", note: "Airside tugs and baggage dollies", img: fleetSgTug },
      { name: "Golf & turf", note: "Low ground pressure, no scuffing", img: fleetSgGolf },
      { name: "Mining", note: "Loaders on cut-resistant compounds", img: fleetSgLoader },
      { name: "Mini truck", note: "Small load carriers, long duty cycles", img: fleetSgMini },
    ],
    wordmark: supergripMark,
  },
]

/**
 * The journey as a flat list of screens.
 *
 * A category is no longer one screen. Each runs two — what it covers, then why
 * it holds and who fits it. Everything downstream counts
 * STEPS rather than CATEGORIES: the travel, the pin length, the layer widths
 * and the tab mapping.
 */
const STEP_PLAN: Record<string, StepKind[]> = {
  "two-wheeler": ["hero", "detail"],
  "three-wheeler": ["hero", "detail"],
  "ultra-light-truck": ["hero", "detail"],
  "off-highway": ["hero", "detail"],
  supergrip: ["hero", "detail"],
}

export const STEPS: Step[] = CATEGORIES.flatMap((c) => {
  const kinds = STEP_PLAN[c.id] ?? ["hero"]
  return kinds.map((kind, i) => ({ c, kind, index: i, last: i === kinds.length - 1 }))
})

/* ---------------------------------------------------------- far band fit ---
   The far band is a single unrepeated photograph, so how fast it can travel is
   limited by how much of it is spare: it must be the viewport plus its own
   travel wide. Every screen added lengthens the journey, so the span is derived
   from the step count rather than fixed — otherwise the 10% rate the brief asks
   for quietly collapses (at ten screens a fixed 150vw span would only sustain
   5.6%). What grows with it is the apparent size of the landscape, which is the
   honest trade for having one plate: a longer journey shows it larger. Capped,
   because past ~220vw the plate is being upscaled far enough to soften.

   `FAR_LIFT_VW` scales with the span because it is the same measurement in the
   same units: the gap between the row the far band ends on and the row the
   treeline band ends on, which both bottom-align to the horizon. */
const PLATE_W = 3024
const FAR_BAND_BOTTOM_ROW = 905
const PARAPET_BOTTOM_ROW = 1030
const FAR_TARGET_RATE = 0.1

export const FAR_SPAN_VW = Math.min(
  220,
  Math.max(150, 100 + FAR_TARGET_RATE * (STEPS.length - 1) * 100)
)
export const FAR_LIFT_VW =
  ((PARAPET_BOTTOM_ROW - FAR_BAND_BOTTOM_ROW) * FAR_SPAN_VW) / PLATE_W

/** where each category starts, so a tab can jump to it */
export const STEP_OF_CATEGORY = CATEGORIES.map((c) => STEPS.findIndex((s) => s.c === c))
/** which category each step belongs to, so the active tab follows the scroll */
export const CATEGORY_OF_STEP = STEPS.map((s) => CATEGORIES.indexOf(s.c))

/* the three honest routes to a buying decision, in place of a catalogue */
export const ROUTES = [
  {
    k: "Choose your market",
    d: "Availability, sizes and pricing are set regionally. Our India, Europe and USA sites carry the range on sale in each.",
    cta: { label: "See where we operate", href: "/global-presence" },
    icon: "globe",
  },
  {
    k: "Talk to a distributor",
    d: "Fleet, OEM or trade enquiry? Tell us the market and the application and we will route it to the right team.",
    cta: { label: "Make an enquiry", href: "/contact" },
    icon: "chat",
  },
  {
    k: "Ask for the catalogue",
    d: "Full technical data — sizes, load and speed ratings, rim recommendations — for the range in your market.",
    cta: { label: "Request a catalogue", href: "/contact" },
    icon: "doc",
  },
]
