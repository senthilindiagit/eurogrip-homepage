/**
 * Technology page content.
 *
 * Sources, all from the client's own dump (content/, gitignored):
 *  - "Eurogrip Range Bee Wild 2026 LAUNCH (Refer for Technology Info)).pdf",
 *    pages 4-5 "TECHNOLOGY BEHIND THE PERFORMANCE" - the twelve technologies,
 *    each with its feature, its benefit and its cutaway diagram.
 *  - "Eurogrip Brand Profile.pdf" - the development pipeline, start to finish.
 *  - "Exports Sales Pitch Deck (1).pdf" - p5 the capability list, p6 the Italian
 *    centre, p32-33 the two casing families, p31 the compound zones, p36 the
 *    European test venues and the four testing photographs.
 *
 * Two rules this file exists to honour.
 *
 * **No short forms.** The client was explicit on the 2026-08-06 call: "we are
 * not allowed to use the short forms". The seven acronyms the homepage still
 * shows - DuCT, TriP, D2T, DrBond, OpT-Pad, A-SeT, RoBusT - come from an older
 * deck. The 2026 range deck names the same engineering in plain English, and
 * that is what is used here. Two of the old seven (dry bonding, air seal) do not
 * appear in the 2026 deck at all.
 *
 * **Names are not final.** The client is still to supply the final technology
 * names and revised text, and said the names differ by region - "TreadSmart" is
 * one regional name for what this deck calls the tri-polymer compound. So every
 * name lives here as data, one line each, and the page never hard-codes one.
 *
 * The feature and benefit lines are the deck's own content, tightened into the
 * site's voice; the deck's English is a translation ("Increased versatility of
 * employment in various terrains"). Nothing technical has been added or
 * changed, and the client's revised text supersedes all of it when it lands.
 */
import adaptiveLandSea from "@/assets/technology/tech/adaptive-land-sea-ratio.webp"
import optimisedTread from "@/assets/technology/tech/optimised-tread-pattern.webp"
import deepDesignTread from "@/assets/technology/tech/deep-design-tread.webp"
import bidirectionalKnobs from "@/assets/technology/tech/bidirectional-knobs.webp"
import capAndBase from "@/assets/technology/tech/cap-and-base.webp"
import triPolymer from "@/assets/technology/tech/tri-polymer-compound.webp"
import quadrazone from "@/assets/technology/tech/quadrazone.webp"
import steelBelt from "@/assets/technology/tech/steel-belt.webp"
import xPly from "@/assets/technology/tech/synthetic-fibres-x-ply.webp"
import rollBalanced from "@/assets/technology/tech/roll-balanced-structure.webp"
import variableRadius from "@/assets/technology/tech/variable-radius-profile.webp"
import lowRolling from "@/assets/technology/tech/low-rolling-resistance.webp"

import testProtorq from "@/assets/technology/test-protorq-track.webp"
import testRoadhound from "@/assets/technology/test-roadhound-wet.webp"
import testTrailhound from "@/assets/technology/test-trailhound-track.webp"
import testBeeConnect from "@/assets/technology/test-beeconnect-paved.webp"

export type Tech = {
  /** stable key — safe to reference when the name changes or is localised */
  id: string
  name: string
  feature: string
  benefit: string
  img: string
}

export type TechFamily = { k: string; d: string; items: Tech[] }

/**
 * Grouped into the four things a tyre is actually made of, rather than listed
 * flat. Twelve equal cards in a row is a wall; four families of two to four is
 * something a reader can hold.
 */
export const TECH_FAMILIES: TechFamily[] = [
  {
    k: "Tread & pattern",
    d: "What meets the road, and how it changes as the bike leans.",
    items: [
      {
        id: "adaptive-land-sea-ratio",
        name: "Adaptive land/sea ratio tread design",
        feature:
          "Groove geometry and layout change with their position across the tread, so the pattern adapts to the angle the motorcycle is leaning at.",
        benefit: "More grip wet or dry, and better mileage",
        img: adaptiveLandSea,
      },
      {
        id: "optimised-tread-pattern",
        name: "Optimised tread pattern",
        feature:
          "Tread pattern and contact patch optimised under finite element analysis, for even pressure distribution and the right groove-to-rubber ratio at every lean angle.",
        benefit: "Better water drainage, durability and even wear",
        img: optimisedTread,
      },
      {
        id: "deep-design-tread",
        name: "Deep design tread",
        feature:
          "Computer-aided knob design, tuned to balance off-road traction against resistance to wear and tearing.",
        benefit: "One tyre that holds across more terrain",
        img: deepDesignTread,
      },
      {
        id: "bidirectional-knobs",
        name: "Bidirectional knobs layout",
        feature:
          "Knob shape and placement are symmetrical, so the tyre can be reversed on the rim.",
        benefit: "Longer service life, and better value for it",
        img: bidirectionalKnobs,
      },
    ],
  },
  {
    k: "Compound",
    d: "The rubber itself, layered and varied across the tread.",
    items: [
      {
        id: "cap-and-base",
        name: "Cap and base",
        feature:
          "A middle layer of compound bonds the tyre's structure to the tread pattern.",
        benefit: "More stability, grip and durability",
        img: capAndBase,
      },
      {
        id: "tri-polymer-compound",
        name: "Tri-polymer tread compound",
        feature:
          "A blend of silica-rich fillers with high-structure carbon, varied from the centre ribbon out to the shoulders.",
        benefit: "Balanced grip across wet and cold, dry and hot",
        img: triPolymer,
      },
      {
        id: "quadrazone",
        name: "Quadrazone",
        feature:
          "Several specific compounds layered through the tread and the layers beneath it, working as one.",
        benefit: "Markedly more mileage and grip",
        img: quadrazone,
      },
    ],
  },
  {
    k: "Structure",
    d: "The casing under the rubber, and what keeps its shape.",
    items: [
      {
        id: "steel-belt",
        name: "0° steel belt",
        feature:
          "A steel belt running under the tread holds the tyre's profile at any rotational speed.",
        benefit: "More agility, predictability and control at speed",
        img: steelBelt,
      },
      {
        id: "synthetic-fibres-x-ply",
        name: "Synthetic fibres x-ply structure",
        feature:
          "The casing is built from high-quality synthetic fibres in cross-plied layers.",
        benefit: "More stability, comfort and resistance to bumps",
        img: xPly,
      },
      {
        id: "roll-balanced-structure",
        name: "Roll balanced structure",
        feature:
          "Casing layers and cord parameters tuned so the tyre still performs under the weight of a heavy motorcycle.",
        benefit: "Better stability, agility and control",
        img: rollBalanced,
      },
    ],
  },
  {
    k: "Profile & efficiency",
    d: "The shape it holds, and what it costs to turn.",
    items: [
      {
        id: "variable-radius-profile",
        name: "Variable radius profile",
        feature:
          "The cap contour varies in steepness across the tyre, shaping the contact patch to the motorcycle's position — upright, mid-lean, full lean.",
        benefit: "More agility and control through a corner",
        img: variableRadius,
      },
      {
        id: "low-rolling-resistance",
        name: "Low rolling resistance",
        feature:
          "A package across compound, structure, tread pattern and materials, aimed squarely at how much energy the tyre costs to roll.",
        benefit: "More durability, and more range on an electric bike",
        img: lowRolling,
      },
    ],
  },
]

export const TECH_COUNT = TECH_FAMILIES.reduce((n, f) => n + f.items.length, 0)

/** The same twelve, flat, each carrying the family it came from. */
export const TECHNOLOGIES: (Tech & { family: string })[] = TECH_FAMILIES.flatMap((f) =>
  f.items.map((t) => ({ ...t, family: f.k }))
)

/* ------------------------------------------------------------- where ------ */
/**
 * Two centres, not three. The brand profile is explicit that the range is
 * "developed jointly by the product development centre in Italy alongside the
 * Indian headquarter R&D centre", which is also the correction the client made
 * on the 2026-08-06 call.
 */
export const CENTRES = [
  {
    k: "Milan, Italy",
    role: "Product development centre",
    d: "Established 2019. Engineers and consultants with decades in the tyre industry, drawn from Pirelli, Metzeler, Bridgestone and Michelin. It designs the international range and reads the market it is designed for.",
  },
  {
    k: "Madurai, India",
    role: "R&D centre, factory and proving grounds",
    d: "The headquarters R&D team, the plant that builds the prototypes, and the ground they are first run on. Built out specifically to carry Eurogrip into high-performance markets.",
  },
]

/** Exports deck p5, verbatim in substance. */
export const CAPABILITIES = [
  "Tyre technology developed in Europe",
  "R&D centre and proving grounds in Madurai",
  "Japanese and European expertise in product and process",
  "A panel of Japanese, European and Indian test riders",
  "Models that predict tyre, road and vehicle as one system",
  "Silica technology, and research into advanced nano materials",
]

/* ---------------------------------------------------------- pipeline ------ */
/**
 * The development process, start to finish, from the brand profile. This is the
 * most ownable content the client has on technology: eight steps, each with a
 * checkpoint, ending at a stamp on an individual tyre.
 */
export const PIPELINE = [
  {
    k: "Specification",
    d: "Performance attributes and the size portfolio are set first, from an evaluation of what a market needs — checked with OEMs, media, retailers, regulators, racers and riders.",
  },
  {
    k: "Design",
    d: "Tread pattern concepts are drawn and put through modelling and finite element analysis, simulating how the pattern interacts with structure, profile and compound.",
  },
  {
    k: "Prototyping",
    d: "Prototypes are built at Madurai, in a plant equipped specifically for high-performance work.",
  },
  {
    k: "Indoor testing",
    d: "Laboratory trials on sensor-equipped machinery, measuring what a rider cannot feel and a track cannot isolate.",
  },
  {
    k: "Fine tuning",
    d: "Numerous prototypes go through intensive trials, and only the most promising are singled out and shipped for outdoor work.",
  },
  {
    k: "Proving ground",
    d: "Independent professional testers take the prototypes to their limits on selected tracks, where dry grip, wet grip, handling, comfort and stability are assessed in controlled conditions.",
  },
  {
    k: "Road testing",
    d: "Long road trials across different roads and traffic, for durability, versatility, and consistency over the tyre's whole service life.",
  },
  {
    k: "Certification & release",
    d: "Legal certifications including REACH are obtained and production starts. Every tyre off the line is checked for visual defects, unbalance and runout, and is only released once it carries the quality stamp.",
  },
]

/* ------------------------------------------------------- construction ----- */
/** Exports deck p32-33 — the two casing families, and when each is the answer. */
export const CASINGS = [
  {
    k: "Radial",
    d: "Up to two layers of synthetic fibre wrapped by a 0° steel belt, over bead and bead fillers. Between them the tyre holds its profile even under hard braking, hard acceleration and high speed.",
    points: [
      "Best high-speed handling, control and stability",
      "Sharper handling and response",
      "Lower rolling resistance and less heat",
      "Less self-righting effect and less vibration",
    ],
  },
  {
    k: "X-ply",
    d: "Ply cords laid at alternating angles of about ±40° to the tyre's circumference — also called bias, cross-ply or conventional. A breaker layer can be added under the tread for extra sturdiness.",
    points: [
      "Carries more load",
      "High resistance to shocks and bumps",
      "Strong directional support",
      "Cord density, end count and crossing angle all tuned in R&D",
    ],
  },
]

/**
 * Exports deck p31 — the four zones across a Roadhound or Trailhound STR tread.
 * Numbered as the client numbers them.
 */
export const COMPOUND_ZONES = [
  { n: 1, k: "Centre ribbon", d: "A harder compound down the middle, for mileage and straight-line stability." },
  { n: 2, k: "Shoulders", d: "A softer compound out at the edges, for grip through mid and full lean." },
  { n: 3, k: "Wings", d: "Triangular strips at the sides, resilient to deflection, controlling how heat builds." },
  { n: 4, k: "Middle layer", d: "A layer between tread and casing that steadies the whole tyre in every condition." },
]

/* ---------------------------------------------------------- testing ------- */
/**
 * Named venues, from the map on Exports deck p36. Real places doing specific
 * jobs — worth more than any adjective we could write about testing.
 */
export const VENUES = [
  { k: "IDIADA proving ground", where: "Spain", d: "Wet and dry behaviour" },
  { k: "ÖAMTC Fahrtechnik Zentrum", where: "Austria", d: "Wet and dry behaviour" },
  { k: "Cervesina & Vairano", where: "Italy", d: "Dry behaviour and stability" },
  { k: "Mores track", where: "Sardinia", d: "Dry behaviour" },
  { k: "Motocross & enduro tracks", where: "Italy", d: "Off-road performance" },
  { k: "Open road loops", where: "Europe", d: "Mileage in real conditions" },
]

/**
 * The four testing photographs and the client's own captions for them.
 * Deliberately small on the page: three of the four are 285x190 in the deck, and
 * they are real tests rather than something generated to look like one.
 */
export const TEST_SHOTS = [
  { img: testProtorq, k: "Protorq Extreme", d: "On the racetrack" },
  { img: testRoadhound, k: "Roadhound", d: "Wet track, controlled watering" },
  { img: testTrailhound, k: "Trailhound STR", d: "Racetrack test" },
  { img: testBeeConnect, k: "Bee Connect", d: "Stone-paved roads" },
]
