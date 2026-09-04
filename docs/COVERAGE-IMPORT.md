# Press coverage — how the archive is built

`/newsroom/coverage` used to list the PR agency's **monthly coverage dockets**
as cards: one card per PDF, its thumbnail a crop of the docket's cover page.
Per client feedback (2026-09-04) it now lists **the individual articles inside
those dockets** — 825 of them.

## The pipeline

The dockets are consistently structured: a cover, an index, then one page per
clipping carrying a small table (date, publication, headline, edition, print
page), the clipping image, and — for online pieces — the article link.

Two scripts in `scripts/coverage/` do the work. Run them from a directory
holding a `dockets/` folder of the source PDFs:

```bash
python3 parse_dockets.py            # -> coverage-raw.json
python3 build_coverage.py           # -> webp clippings + coverage-items.json
```

Then regenerate `src/lib/coverage-data.ts` from `coverage-items.json`.
`parse_dockets.py` needs PyMuPDF; `build_coverage.py` also needs Pillow.

**Source**: 31 dockets (2024, 2025, 2026 monthlies plus the Tread Talks, ad
campaign, Rajkot store and SI Air Springs consolidated dockets), from the
client's `pr-docket-2024-to-2026` WeTransfer bundle. The two
"January 2025 to 2026-merged" files are skipped — they duplicate the monthlies.

**Result**: 911 clipping pages parsed, deduplicated to **825 articles** —
542 online, 241 print, 42 social — with **907 images, 43 MB** as webp under
`public/newsroom/coverage/<year>/<month>/`.

## Quirks the parser has to absorb

The dockets are hand-assembled, and the templates drifted over three years:

- **Nine header spellings.** The title column is variously `Headline`, `Link`
  or `Hyperlink`; the print page is `Page`, `Page No`, `Page No.` or `Page.No`.
  All are normalised in `canon()`.
- **Columns filled against their own labels.** The August 2024 docket puts the
  headline under "Publication" and vice versa. Publication names are short and
  headlines are sentences, so the parser trusts length over the label — this
  fires on **87** rows.
- **Mistyped years.** Clippings dated `05-Jan-2025` sit inside the January
  **2026** report. Where the month matches the docket's own month but the year
  does not, the docket wins.
- **Three date formats**: `06-Jan-2026`, `Jul 2, 2024`, `January 2024`.
- **Duplicate clippings**: an article appears in both a monthly and a campaign
  docket. Deduplicated on the article URL, falling back to
  publication + headline + date; the copy with the most images wins.
- **Google text fragments** appended to every link (`#:~:text=…`) are stripped.

## On the page

- **Online and social** pieces open at the publisher in a new tab
  (`rel="noreferrer noopener"`), labelled "View online".
- **Print** pieces open in a clipping viewer that scrolls, since a newspaper
  page is a document to read rather than a picture to fit. Multi-page spreads
  (39 of them, e.g. a 4-page Forbes India feature) get arrows, keyboard
  navigation and a page counter.
- **Filters** (revised 2026-09-04): a **year dropdown and a month dropdown**,
  both always set — twelve month chips plus an "all" pill crowded the bar and
  buried the year. The control is `components/site/YearMonthPicker.tsx`, shared
  so other listing sections can reuse it. Type chips and a free-text search sit
  beside it; 24 cards at a time behind "Load more".
- **The month lists only periods that hold articles**, with the count against
  each, so a selection can never land on an empty page. Switching year moves to
  the latest month that year actually has (2024 has no December docket, so
  choosing 2024 lands on November).
- **A search spans the whole archive**, not the selected month — with a month
  always set, searching inside it would miss almost everything. The count line
  says "· all years" while a search is active.
- Where the compiled monthly report has been published, selecting that month
  also offers it as a PDF download.

## Open items

- **The default period is the newest month that has articles, not today's
  month.** Today is September 2026 but the dockets stop at May 2026, so
  defaulting to the literal current month would open on an empty page. Once the
  client's dockets are current, the default *is* the current month.

- **Only the five 2026 monthly reports are published** under
  `public/newsroom/pdf/coverage/`, so only those months offer the "download the
  full report" link. Publishing the 2024/2025 reports too would add ~130 MB.
- **Print clipping resolution is whatever the docket contained** — typically
  600–850px on the long edge. Some small-print clippings are hard to read at
  that size; only better source scans would fix it.
- **Editions are as recorded**: "National" plus many city editions (Jammu,
  Ahmedabad, Chennai, Patna…). They are shown but not filterable — worth adding
  if the client wants to report by edition.
## Where the cards appear

The newsroom landing's "Campaigns & coverage" rail shows **the real coverage
articles**, not the newsroom items — same card, same behaviour (online opens
the publisher, print opens the clipping viewer).

To keep the 344 KB archive out of the main bundle, the card and viewer live in
`components/site/CoverageCard.tsx` (types only), and the landing reads
`lib/coverage-latest.ts` — a generated slice of the newest six records plus the
archive total. Regenerate it whenever `coverage-data.ts` is regenerated. The
full archive still loads only on `/newsroom/coverage`, as its own lazy chunk
(~50 KB gzipped).

## Filter convention

Three or fewer choices stay as pills; **more than three become a dropdown** —
`components/site/FilterSelect.tsx`. Applied on the newsroom list pages, where
year (4 values) and region (up to 5) were rows of pills and are now dropdowns;
the coverage page's type filter keeps its three pills.
