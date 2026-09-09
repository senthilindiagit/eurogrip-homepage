# Technology page

`/technology` — `src/pages/Technology.tsx`, content in `src/lib/technology.ts`,
asset build scripts in `scripts/technology/`. Lazy-loaded, because it carries
GSAP.

Seven sections: a full-bleed hero on a real tread macro, the two design centres
as photographs, the twelve technologies as a sticky scroll sequence, an
interactive tread inspector, the two casing families, the eight-step pipeline
with the line drawn by the scroll, and the proving ground. Every fact on it
comes from the client's own dump; nothing is invented.

## The first build was wrong, and why

The first version put the twelve technologies in twelve identical rounded cards
— diagram, heading, two paragraphs — and had almost no photography. The client's
verdict was "looking exactly like an AI slop website", which was fair: a
uniform card grid carries no hierarchy, tells the reader nothing about what
matters most, and a technical page with no pictures of the thing it describes
has no authority.

What changed:

* **Real photography, found in the dump.** `Corporate Media/Factory` holds four
  5272x3948 drone shots — the solar roof, two production halls, racks of green
  tyres. `content/reviews/` holds press photography including tread and sidewall
  macros at 4032x3024. None of it was being used anywhere on the site.
* **The card grid is gone.** The twelve are now a scroll sequence against a
  sticky diagram — one thing at a time, in a stated order, with a progress rail.
* **One real interaction**, not a page of hover states: the compound zones are
  hotspots on an actual tyre.
* **Scroll-driven motion** on the hero frame, the panel wipes, the step
  sequence and the pipeline rail.

The benchmark for the category is Vredestein's "New Horizons" (Ronin Amsterdam
and 51North), which took Awwwards SOTD and an FWA for a tyre brand — cinematic
full-bleed media driven by GSAP, editorial type, one strong idea carried the
whole way through. It leans on WebGL, which this site has no business adding for
a client who has asked repeatedly for lighter and less heavy; the transferable
part is the art direction and the scroll choreography, not Three.js.

## Where the content came from

| Section | Source in `content/` (gitignored) |
| --- | --- |
| The twelve technologies | "Eurogrip Range Bee Wild 2026 LAUNCH (Refer for Technology Info)).pdf" pp. 4–5, *Technology behind the performance* — the feature, the benefit and the cutaway diagram for each |
| Two centres | "Eurogrip Brand Profile.pdf"; "Exports Sales Pitch Deck (1).pdf" p. 6 |
| Capability chips | Exports deck p. 5, *Designed globally, manufactured in India, tested & sold worldwide* |
| Four tread zones | Exports deck p. 31 (Roadhound and Trailhound STR) |
| Radial vs x-ply | Exports deck pp. 32–33 |
| The eight steps | Brand profile, the development-process passage |
| Venues and test photos | Exports deck p. 36, *Testing & development — snapshots* |

The range deck is the file the client themselves marked "Refer for Technology
Info", so it is treated as authoritative wherever it disagrees with the older
export deck.

## The acronyms are gone

The client was explicit on the 2026-08-06 call: **"we are not allowed to use the
short forms"**, and that included the oversized code sitting behind the homepage
panel as a watermark. Seven of them were still live on the homepage — DuCT, TriP,
D2T, DrBond, OpT-Pad, A-SeT, RoBusT — so `TECH` has been deleted from
`lib/site-data.ts`, the seven icons with it, and both the homepage section and
this page now run on the twelve plain-English technologies the 2026 deck names.
`cap and base` is there as the client asked; it is what the old deck called dual
compound technology.

Two of the old seven — **dry bonding** and **air seal technology** — do not
appear in the 2026 deck at all, so they are not on the site. Worth confirming
whether they are retired or simply missing from that deck.

The client also asked us to come back on what should fill the space the watermark
left. The answer on the homepage is their own artwork: the cutaway diagram for
whichever technology is up, large and faint behind the copy. It describes the
thing instead of labelling it, and costs nothing to load because the same file is
already the icon.

**Names are not final.** The client is still to send final technology names and
revised text, and said the names differ by region — "TreadSmart" is one regional
name for what this deck calls the tri-polymer compound. So each name is one line
of data in `lib/technology.ts` with a stable `id` beside it, and no name is
hard-coded in a component. A rename, or a per-region set, is a data edit.

## The diagrams

`scripts/technology/tech_icons.py` cuts the twelve cutaways out of the range
deck. Four things it had to get right, all of them documented in the script:

* **The names are baked into the artwork.** Since the names are still changing
  and differ by region, a name in a picture means new artwork per rename and per
  region, and it is invisible to a screen reader and a translator. So the label
  band is cropped off and the name is rendered as live text.
* **The badges are rendered off the page, not extracted.** One of the twelve is a
  stencil mask whose colour is drawn separately as vector — pull that image on
  its own and you get a black slab. Rendering composites it correctly, and at
  600dpi it beats the 292px embedded originals.
* **Each badge is a white disc on a black square** that the PDF masks away on
  render. Left in, those corners put ink on every row and no label gap is ever
  findable, so the outside of the disc is whitened geometrically first.
* **The cut is the first clean gap below the artwork, measured across the middle
  columns.** Not the widest gap: a two-line label has a gap between its own
  lines, and on the roll-balanced badge that inner gap measured 8 rows against 9
  for the real one, close enough that "widest" picked it and left the words "ROLL
  BALANCED" in the crop. And not full-width: on the adaptive land/sea badge the
  tyre's dark flank runs down past the top of the label, so full-width there is
  no clean row anywhere and the label survives. The gap threshold was swept —
  every badge lands on the same crop for anything from 5 to 9 rows, and only the
  variable-radius badge (whose real gap is 9) moves at 10.

`scripts/technology/test_photos.py` lifts the four testing photographs. They are
small — three of the four are 285×190 in the deck — so the page renders them at
roughly native size and never blows them up. That is the honest trade against a
generated placeholder standing in for a test that really happened.

## The proving ground moved here

At the client's direction ("move the testing/proving-ground unit to the
Technology page"), and rebuilt rather than transplanted. What it replaced on
Global Presence was three cards of borrowed careers photography under copy nobody
at the client had written — "India's everyday roads are the hardest durability
test we have". It now carries the client's own **named venues** (IDIADA, ÖAMTC
Fahrtechnik Zentrum, Cervesina & Vairano, Mores, motocross and enduro tracks,
open road loops) and their four real test photographs. Specific places doing
specific jobs beat any adjective we could write about testing.

`src/assets/about/rd-milano.webp` — a real photograph of an engineer briefing two
motocross riders trackside, previously unused anywhere in the build — now leads
that section. It went in the hero first, but it is a testing photograph, so it
belongs with the testing; and as a hero aside it narrowed the copy column enough
to break the headline over four lines.

## Second pass, from the client's mark-up

Four notes came back on the redesign, all of them layout rather than content.

* **The banner was ugly.** It was the dusty tread macro, which went grey under a
  scrim. Now it is `Eurogrip-03` — a GS hard over into a bend, the strongest
  frame in the press set. It needed **two** scrims, not one: the vertical one
  for the navbar and the section join, and a *horizontal* one so the copy column
  has its own dark ground. Without the second, the headline landed straight on
  the bike and the eyebrow pill vanished into the fork.
* **Overlaps.** Two, both fixed. The oversized index in the sticky stage sat
  behind the diagram and read as a rendering fault — it now has its own row
  above it (measured: 8px clear, no intersection). And the red role line on the
  centre panels was surfacing over a rider's jersey and a solar roof.
* **Captions need their own floor, not a bigger scrim.** Tuning the panel-wide
  gradient was the wrong tool: the caption block's top edge lands at a different
  fraction of the panel at every viewport height, so the role line kept
  reappearing over the picture. The gradient is now anchored to the text block
  itself and reaches 94% opacity before the first line of type, which is
  deterministic whatever the photograph is doing.
* **"Across one tread" was too tall.** It ran over a full screen for four short
  facts, because the section heading stacked above a square photograph which
  stacked above the list. The heading now sits *beside* the picture and the photo
  is 3:2 rather than square: **590px on desktop, down from ~890px**. The tyre
  changed too — `Eurogrip-07`, which shows the crown running from centre out to
  the shoulder, the one thing the four zones need a reader to be able to see.
  The hotspot coordinates follow that diagonal rather than a neat grid; verified
  4/4 landing on rubber at both 1440 and 375.
* **The centres section had no title.** It now carries "Where it is designed /
  Two centres, one tyre" above the diptych.

## The scroll work

All of it is GSAP ScrollTrigger, in `Technology.tsx`. Four things worth knowing
before changing any of it.

**The twelve use `position: sticky`, not ScrollTrigger's `pin`.** Pinning
rewrites the document height and has to be refreshed by hand on a code-split
route — which is exactly the trap the products page fell into, where the section
pinned with zero scroll distance because the pin measured on the next frame.
Sticky needs no measurement and cannot desync. ScrollTrigger is used only to
decide *which* step is live (`start: "top 62%"`, `end: "bottom 38%"` — the band
a reader is actually looking at), and that sets React state.

**Below `lg` the sticky column is dropped** and each step carries its own
diagram inline. A sticky stage in a 375px column leaves room for neither the
picture nor the words. Verified: sticky stage hidden, twelve inline diagrams
shown, no overflow.

**Every `from()` tween needs `immediateRender: false`.** Without it, `from()`
writes the start state — `opacity: 0`, or a 14% inset clip — the moment it is
created, and the element only becomes visible once the ticker runs. Any stall
leaves content blank. This was live and provable: in the review pane the whole
pipeline sat at `opacity: 0` and both centre panels stayed clipped. With
`immediateRender: false` the degraded state is the natural one (measured:
opacity 1, clip none) and each element animates only when its own trigger fires.

**Reduced motion** early-returns out of the hero, the wipes and the pipeline
rail. The step sequence still runs, because it changes which diagram is shown
rather than animating anything.

## Photography, and its provenance

`scripts/technology/photos.py` prepares it all from full resolution.

* **The client's own**: `Corporate Media/Factory/*` (the plant at Madurai) and
  `Corporate Media/R&D Milano/*` (a test session in Italy — a HEIC, converted
  with `sips`, since Pillow will not open it here).
* **Not the client's**: the tread macros, the sidewall and the riding shots come
  out of `content/reviews/`, shot by the journalists who reviewed the tyres
  (RoadBook, Cervone). The subject is Eurogrip's product; the photographs are
  not Eurogrip's to license by default. **This needs clearance before the page
  goes live** — it is the same class of problem as the generated artwork on the
  products page, and the hero depends on one of them.

Several are portrait-flagged in EXIF and come out on their side without
`ImageOps.exif_transpose`.

## Things to raise with the client

* **Final technology names and revised text**, per the call. Also whether the
  regional name sets should ship as a locale switch or as separate builds.
* **Dry bonding and air seal** — retired, or missing from the 2026 deck?
* **Country count.** Three figures are in play: "over 86 countries" (export deck
  p. 4), "over 400 distributors in 90 countries" (range deck p. 2) and the 130+
  the client corrected us to. No count appears on this page for that reason; it
  belongs on Global Presence once one number is agreed.
* **The 20% claim.** The old homepage data carried "20% better than
  single-compound tyres", from export deck p. 30, and it has come off with the
  acronyms. It is a comparative performance claim, which needs substantiation to
  run in EU markets, and the 2026 deck does not repeat it in the feature/benefit
  grid. Easy to reinstate with a test reference behind it. The same page's
  "industry's best tyre, highest mileage" is unsubstantiated superlative and is
  deliberately not used anywhere.
* **The named testers.** Export deck p. 36 names two independent testers with
  their credentials. The page describes them as independent professionals without
  naming them, because a sales deck is a controlled document and a public website
  is not. Their names can go in once the client confirms they are cleared.
* **Sustainability content** — 80% renewable energy, 5.4MW of roof solar, water
  harvesting, a biomass generator, rice-husk-fired boilers — sits in the same
  range deck (p. 15) and is deliberately left for the Sustainability page.

## Things to raise with the client, part two

* **Photo clearance** for the press-review photography, as above.
* The hero headline is ours, not theirs: "Everything a rider never has to think
  about". It goes with the revised copy when that lands.

## Notes for the next person

This page does not use `PageHero`. It needs a full-bleed photographic hero with
type sitting on the image, which that component is not shaped for, so the
breadcrumb and eyebrow are rebuilt inline. Any change to the shared hero will
not reach this page.

Reviewing scroll work in the Browser pane needs care, because the pane runs with
`document.visibilityState` permanently `"hidden"`:

* **`requestAnimationFrame` never fires** — measured, 0 ticks in 700ms — so
  GSAP's ticker never runs and no ScrollTrigger ever updates on its own. The
  page therefore exposes `window.ScrollTrigger` under `import.meta.env.DEV`:
  set a scroll position, call `ScrollTrigger.update()`, then read the DOM. That
  is how the step sequence (01→03→05→07→08→10→12), the hero scrub (scale
  1.12→1.0) and the pipeline rail (scaleY 0.17→1.0) were actually verified.
* **`window.scrollTo` silently stalls**, because the site sets
  `scroll-behavior: smooth` and smooth scrolling is itself rAF-driven — it
  stopped 107px into an 837px jump. Assign `document.documentElement.scrollTop`
  instead.
* CSS transitions do not progress either, so read `className` rather than
  `getComputedStyle().backgroundColor` when checking active states.
* Screenshots come back stale or composited wrong once the page is scrolled.
  The hero is the only reliable one; verify the rest numerically.

Also, `innerText` applies `text-transform`, so a case-sensitive search for
"Centre ribbon" fails against the rendered "CENTRE RIBBON" — and a
case-insensitive search for the old acronyms false-positives on "**produ**ct"
and "s**trip**s". Match with word boundaries.
