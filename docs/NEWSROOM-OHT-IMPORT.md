# Off-highway news & events import

On 2026-09-04 the 17 articles on
<https://www.tvseurogripoht.com/news-and-events/> were imported into the
newsroom. They are the `oht-*` items at the end of `NEWS` in
`src/lib/newsroom.ts`, all carrying an **Off-highway** tag so they can be
filtered apart from the two-wheeler content.

## What came across

| Type | Count | Notes |
| --- | --- | --- |
| `event` | 11 | 6 of them with photo galleries |
| `coverage` | 6 | press reprints — The Hindu, BusinessLine, ETAuto, DT Next |

**141 gallery photos** in total (13 MB as webp, long edge 1500, quality 74),
under `public/newsroom/events/<id>/`, plus a cover per item. Nothing failed to
download.

Galleries: CII EXCON 2025 (66), Agritechnica 2025 (21), Agrishow 2025 (19),
global expos 2024 (16), World Ag Expo 2025 (12), Agrotech 2025 (7).

## Decisions worth knowing

- **`place` on coverage items holds the publication**, not a city — it renders
  as "31 Aug 2023 · The Hindu · Americas", which is what a reader wants there.
- **A new `americas` region** was added to the newsroom region filter; the
  US, Brazil and Panama events had nowhere to sit before.
- **Captions**: `NewsItem` gained an optional `captions[]`, positionally
  matched to `images[]`. Used on two items — the 16-expo round-up (each photo
  names its expo) and EXCON 2025 (Day one / two / three).
- **Two photo-only items** (Agrotech 2025, World Ag Expo 2025) carry no body
  copy, because the source page had none beyond a filler line. They open
  straight into the carousel instead of getting a story page.
- **Three EXCON 2023 articles and three Farm Progress Show articles** exist on
  the source site — the event write-up plus separate press reprints. All are
  kept, with the reprints filed under coverage so the events list doesn't read
  as duplicated.

## Discrepancy in the source

The 16-expo round-up page contradicts itself. Its intro list includes **The
Livestock Summit** (1–4 Oct 2024, Clermont-Ferrand) and the **SEMA Show**
(5–8 Nov 2024, Las Vegas), but its caption list omits both and instead names
Automechanika Dubai, Automechanika Riyadh, Agro Show Bednary, a Polish customer
meet, the MEA Conclave and LAMMA. There are 16 photos, matching the caption
list, so that is what shipped. **Worth confirming with the client** whether the
Livestock Summit and SEMA Show should also be listed.

## Duplicate cover images (fixed 2026-09-04)

The source site reuses one stock photo across several press reprints, so three
coverage cards showed the identical picture side by side. Where an item's cover
was a duplicate of another item's — or plainly the wrong event — the cover was
removed rather than repeated:

| Item | Source cover | Why dropped |
| --- | --- | --- |
| World Ag Expo 2024 (event) | `automechanika-2024.jpg` | An indoor Automechanika stand, not World Ag Expo |
| Shines at World Ag Expo & FIMA (coverage) | dtnext Farm Progress photo | Wrong event, and shared with two other items |
| Agri radial tyres in the U.S. (coverage) | dtnext Farm Progress photo | Shared with the Farm Progress item |
| Presents construction range at Excon (coverage) | `excon-2023-image1.jpg` | Shared with the EXCON 2023 event item |

Cards with no cover now render a brand plate naming the publication ("ETAUTO ·
AS REPORTED") instead of the old grey placeholder — see `NewsCard.tsx`.

Note three **pre-existing** pairs also share a cover path — the EICMA 2025,
EICMA 2024 and Tire Cologne 2024 press releases each reuse their event photo.
They sit in different categories so they never appear side by side, and were
left alone.

