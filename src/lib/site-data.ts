export const PRODUCTS = [
  {
    title: "Two-Wheeler Tyres",
    description:
      "Sport, street, scooter, commuter and off-road — grip engineered for every kind of rider.",
    iconPath: "M5 17a4 4 0 108 0M11 17a4 4 0 108 0M5 17h6",
    previews: [{ label: "Sport" }, { label: "Scooter" }],
  },
  {
    title: "Three-Wheeler Tyres",
    description:
      "Built to carry, built to last — durability and load stability for auto-rickshaws and cargo.",
    iconPath: "M4 17a3 3 0 106 0M14 17a3 3 0 106 0M4 17h4m6 0h-2V8h6l2 4",
    previews: [{ label: "Cargo" }, { label: "Passenger" }],
  },
  {
    title: "Ultra-Light Truck Tyres",
    description:
      "High-mileage, high-load tyres for last-mile commercial fleets that can’t stop.",
    iconPath: "M3 7h11v9H3zM14 10h4l3 3v3h-7M6 18a2 2 0 104 0m4 0a2 2 0 104 0",
    previews: [{ label: "Highway" }, { label: "Mixed" }],
  },
  {
    title: "Agricultural Tyres",
    description:
      "Deep-lug traction for fields and farms — pulling power that respects the soil.",
    iconPath: "M6 16a4 4 0 108 0M3 16h2m11 0h5M9 4v8",
    previews: [{ label: "Tractor Rear" }, { label: "Front" }],
  },
  {
    title: "Industrial Tyres",
    description:
      "Forklifts, handlers and plant — engineered for relentless duty cycles indoors and out.",
    iconPath: "M4 18V8h7v10M11 12h6v6M4 18h13M7 6V4",
    previews: [{ label: "Forklift" }, { label: "Solid" }],
  },
  {
    title: "OTR Tyres",
    description:
      "Off-the-road giants for mining, construction and quarry — built for the toughest ground.",
    iconPath: "M6 16a5 5 0 1010 0 5 5 0 10-10 0M2 16h3m13 0h3M11 5l1 3",
    previews: [{ label: "Loader" }, { label: "Grader" }],
  },
]

export const TECH = [
  {
    n: "01",
    title: "Advanced Compound Platform",
    tbc: true,
    body: "Silica-rich compounds tuned for wet grip without trading away tread life — confidence in the first corner and the ten-thousandth.",
  },
  {
    n: "02",
    title: "Precision Casing Architecture",
    tbc: true,
    body: "Optimised carcass construction for stability under load, sharper steering response and a planted feel at lean.",
  },
  {
    n: "03",
    title: "Adaptive Tread Design",
    tbc: true,
    body: "Computational groove patterns evacuate water fast and bite into loose surfaces — engineered per terrain, not per size.",
  },
  {
    n: "04",
    title: "Sustainable Materials Roadmap",
    tbc: false,
    body: "A dedicated programme advancing renewable and recovered materials across the range — now with its own home on the site.",
  },
]

export const RIDERS = [
  { who: "Aarav", tag: "Touring", quote: "12,000 km across the Himalayas and the grip never blinked.", hue: 205 },
  { who: "Lena", tag: "Adventure", quote: "Alpine passes, every kind of weather. Planted and predictable.", hue: 219 },
  { who: "Diego", tag: "Track Days", quote: "Lap after lap, the same edge confidence. No drop-off.", hue: 233 },
  { who: "Priya", tag: "Daily Ride", quote: "Monsoon commute, zero drama. That's all I ask of a tyre.", hue: 247 },
]

export const PARTNERS = [
  "MotoGP · Test", "Dakar · Spirit", "OEM · Fitment", "CSK", "National C'ships",
  "Adventure Series", "Endurance Cup",
]

export const NEWS = [
  { tag: "Technology", date: "June 2026", title: "Inside the lab: how a tread pattern is born", excerpt: "From simulation to road — the pipeline behind every Eurogrip groove.", big: true },
  { tag: "Racing", date: "May 2026", title: "Podium finish at the national championship", excerpt: "Eurogrip-shod riders take the top step." },
  { tag: "Sustainability", date: "Apr 2026", title: "Our renewable-materials roadmap", excerpt: "The next chapter for greener tyres." },
  { tag: "Partnership", date: "Mar 2026", title: "New OEM fitment announced", excerpt: "Factory-fit confidence, straight from the line." },
]

/** Eurogrip markets for the interactive globe — [lat, lng]. */
export const MARKETS = [
  { id: "in", location: [13.08, 80.27] as [number, number], name: "India — HQ", users: 0 },
  { id: "it", location: [45.46, 9.19] as [number, number], name: "Italy", users: 0 },
  { id: "de", location: [51.0, 10.0] as [number, number], name: "Germany", users: 0 },
  { id: "uk", location: [52.5, -1.5] as [number, number], name: "United Kingdom", users: 0 },
  { id: "ae", location: [25.2, 55.27] as [number, number], name: "UAE", users: 0 },
  { id: "th", location: [13.7, 100.5] as [number, number], name: "Thailand", users: 0 },
  { id: "id", location: [-6.2, 106.8] as [number, number], name: "Indonesia", users: 0 },
  { id: "za", location: [-26.2, 28.0] as [number, number], name: "South Africa", users: 0 },
  { id: "br", location: [-15.8, -47.9] as [number, number], name: "Brazil", users: 0 },
  { id: "us", location: [38.0, -95.0] as [number, number], name: "United States", users: 0 },
  { id: "au", location: [-25.0, 133.0] as [number, number], name: "Australia", users: 0 },
]
