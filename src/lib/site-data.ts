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

import riderSaggar from "@/assets/rider-saggar.webp"
import clipSaggar from "@/assets/rider-saggar.mp4"
import riderGracias from "@/assets/rider-gracias.webp"
import clipGracias from "@/assets/rider-gracias.mp4"
import riderLeo from "@/assets/rider-leo.webp"
import clipLeo from "@/assets/rider-leo.mp4"
import riderYasir from "@/assets/rider-yasir.webp"
import clipYasir from "@/assets/rider-yasir.mp4"

export const RIDERS = [
  { who: "Saggar", tag: "Touring", quote: "12,000 km across the Himalayas and the grip never blinked.", img: riderSaggar, clip: clipSaggar, url: "https://www.instagram.com/reels/DQoby5BEoTU/" },
  { who: "Gracias", tag: "Adventure", quote: "Alpine passes, every kind of weather. Planted and predictable.", img: riderGracias, clip: clipGracias, url: "https://www.instagram.com/p/DZIGogIqusR/" },
  { who: "Leo Beretta", tag: "Track Days", quote: "Lap after lap, the same edge confidence. No drop-off.", img: riderLeo, clip: clipLeo, url: "https://www.youtube.com/shorts/GwABkNM3G1Q" },
  { who: "Yasir", tag: "Daily Ride", quote: "Monsoon commute, zero drama. That's all I ask of a tyre.", img: riderYasir, clip: clipYasir, url: "https://www.instagram.com/reels/DZNGKcGBdGQ/" },
]

export const PARTNERS = [
  "MotoGP · Test", "Dakar · Spirit", "OEM · Fitment", "CSK", "National C'ships",
  "Adventure Series", "Endurance Cup",
]

import thumbDhoni from "@/assets/yt-dhoni.webp"
import thumbTread from "@/assets/yt-treadtalks.webp"
import thumbAutomechanika from "@/assets/yt-automechanika.webp"
import thumbColombo from "@/assets/yt-colombo.webp"
import thumbDiwali from "@/assets/yt-diwali.webp"
import thumbExpo from "@/assets/yt-expomoto.webp"

export type NewsItem = {
  type: "video" | "article"
  tag: string
  date: string
  title: string
  excerpt: string
  img: string
  videoId?: string
  url?: string
}

export const NEWS: NewsItem[] = [
  { type: "video", tag: "Brand", date: "2025", title: "M S Dhoni — behind the scenes", excerpt: "On set with our brand ambassador.", img: thumbDhoni, videoId: "Dxe4CF49qgc" },
  { type: "article", tag: "Global", date: "2025", title: "Eurogrip at Automechanika Dubai 2025", excerpt: "Innovation unleashed at the region’s biggest trade show.", img: thumbAutomechanika, url: "https://www.youtube.com/watch?v=3_gkR_ZCmNE" },
  { type: "article", tag: "Events", date: "2025", title: "Colombo Motor Show 2025 — highlights", excerpt: "Eurogrip on the floor in Sri Lanka.", img: thumbColombo, url: "https://www.youtube.com/watch?v=IEfBrQaLB3c" },
  { type: "article", tag: "Community", date: "2024", title: "Celebrating delivery heroes this Diwali", excerpt: "A salute to the riders who keep moving.", img: thumbDiwali, url: "https://www.youtube.com/watch?v=Ku7TVwjt7jM" },
  { type: "video", tag: "Technology", date: "2025", title: "TreadTalks: the tubeless advantage", excerpt: "9th edition — why tubeless changes the ride.", img: thumbTread, videoId: "4rfEaS_Jm48" },
  { type: "article", tag: "Events", date: "2025", title: "Eurogrip rides into Expo Moto, Caracas", excerpt: "An incredible reception in Venezuela.", img: thumbExpo, url: "https://www.youtube.com/watch?v=VTFXL6-_knI" },
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
