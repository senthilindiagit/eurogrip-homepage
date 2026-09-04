/* ===========================================================================
   Press coverage — one record per article, not per docket.

   The client's PR agency issues monthly and per-campaign "coverage docket"
   PDFs: a cover page, an index, then one page per clipping carrying a small
   table (date, publication, headline, edition, print page) plus the clipping
   image and, for online pieces, the article link.

   Those pages are exploded into the records in `coverage-data.ts` so the site
   can list the individual articles. The dockets themselves stay downloadable
   per month — see DOCKET_PDF.

   Shape mirrors a CMS collection, so this can become a fetch() later.
   ======================================================================== */

/** how the piece was published — drives the card's action */
export type CoverageKind = "online" | "print" | "social"

export type CoverageItem = {
  id: string
  /** ISO date of publication */
  date: string
  publication: string
  headline: string
  kind: CoverageKind
  /** "National", a city edition, or the social platform */
  edition?: string
  /** print page number(s), e.g. "31" or "90-93" */
  pageNo?: string
  /** live article — present for online and social pieces */
  url?: string
  /** clipping images; more than one means a multi-page print spread */
  images: string[]
  /** the release or campaign this piece covered */
  group?: string
  /** docket file it was compiled in */
  source?: string
}

export const KIND_LABEL: Record<CoverageKind, string> = {
  online: "Online",
  print: "Print",
  social: "Social",
}

export const MONTH_LABEL = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
