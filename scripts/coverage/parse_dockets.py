#!/usr/bin/env python3
"""Explode the monthly/consolidated PR dockets into individual coverage items.

Every clipping page carries a header table
    Date | Publication | Headline | [Page] | Edition
followed by the clipping image; online pages also carry the article link.
The table is read with PyMuPDF's table finder, which keeps wrapped cell text
in the right column across all three docket templates (2024, 2025, 2026).
"""
import fitz, glob, json, os, re, sys, unicodedata

SKIP_MARKERS = ("MEDIA COVERAGE REPORT", "THANK YOU", "Total Coverage")
MIN_IMG_W = 300          # smaller images are the PR agency's logo watermark
# the merged "January 2025 to 2026" files duplicate the individual monthlies
SKIP_FILES = ("January 2025 to 2026",)

MONTHS = {m: i + 1 for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june",
     "july", "august", "september", "october", "november", "december"])}
MON_ABBR = {m[:3]: i + 1 for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june",
     "july", "august", "september", "october", "november", "december"])}


def norm(s):
    s = unicodedata.normalize("NFC", s or "")
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"')
    s = s.replace("­", "").replace("​", "")
    return re.sub(r"\s+", " ", s).strip()


def parse_date(raw, year, month):
    """'06- Jan-2026' / 'January 2024' / 'Dec 23 - Jan 24' -> ISO, best effort."""
    t = norm(raw).replace("- ", "-").replace(" -", "-")
    m = re.search(r"(\d{1,2})[-\s]*([A-Za-z]{3,})[-\s]*(\d{2,4})", t)
    if m:
        day, mon, yr = int(m.group(1)), m.group(2)[:3].lower(), m.group(3)
        if mon in MON_ABBR:
            y = int(yr) if len(yr) == 4 else 2000 + int(yr)
            try:
                return f"{y:04d}-{MON_ABBR[mon]:02d}-{day:02d}"
            except Exception:
                pass
    # month-first, e.g. "Jul 2, 2024"
    m = re.search(r"([A-Za-z]{3,})\s+(\d{1,2}),?\s*(\d{4})", t)
    if m and m.group(1)[:3].lower() in MON_ABBR:
        return f"{int(m.group(3)):04d}-{MON_ABBR[m.group(1)[:3].lower()]:02d}-{int(m.group(2)):02d}"
    m = re.search(r"([A-Za-z]{3,})\s*(\d{4})", t)
    if m and m.group(1)[:3].lower() in MON_ABBR:
        return f"{int(m.group(2)):04d}-{MON_ABBR[m.group(1)[:3].lower()]:02d}-01"
    # fall back to the docket's own month
    if year:
        return f"{year:04d}-{(month or 1):02d}-01"
    return ""


# The dockets use nine header spellings across the three templates; the title
# column is variously Headline / Link / Hyperlink, and the print page number is
# Page / Page No / Page No. / Page.No.
def canon(label):
    l = norm(label).lower().rstrip(".")
    if l in ("headline", "link", "hyperlink"):
        return "headline"
    if l in ("page", "page no", "page no.", "page.no", "page.no."):
        return "page"
    return l


def find_header_table(page):
    for t in page.find_tables().tables:
        rows = t.extract()
        if not rows:
            continue
        head = [canon(c) for c in rows[0]]
        if "date" in head and "publication" in head and "headline" in head:
            return head, rows[1:]
    return None, None


def parse_page(doc, page):
    text = page.get_text()
    if any(m in text for m in SKIP_MARKERS):
        return None

    imgs = []
    for im in page.get_images(full=True):
        info = doc.extract_image(im[0])
        if info["width"] >= MIN_IMG_W:
            imgs.append({"xref": im[0], "w": info["width"], "h": info["height"]})
    if not imgs:
        return None

    head, rows = find_header_table(page)
    if not head or not rows:
        return None
    # a clipping page carries exactly one data row; more means a summary table
    rows = [r for r in rows if any(norm(c) for c in r)]
    if len(rows) != 1:
        return None

    row = rows[0]
    cell = {}
    for name, val in zip(head, row):
        cell[name] = norm(val)

    pub, headline = cell.get("publication", ""), cell.get("headline", "")
    if not (pub or headline):
        return None
    # Some dockets fill the columns the other way round from their own labels
    # (August 2024 puts the headline under "Publication"). Publication names are
    # short; headlines are sentences — trust the content over the label.
    swapped = False
    if len(pub) > 45 and len(headline) < 45:
        pub, headline = headline, pub
        swapped = True

    # story heading: text above the table, if the page opens a new group
    tbl_top = min(t.bbox[1] for t in page.find_tables().tables)
    above = [w for w in page.get_text("words") if w[3] < tbl_top - 2]
    story = norm(" ".join(w[4] for w in sorted(above, key=lambda w: (round(w[1] / 4), w[0]))))

    uris = []
    for l in page.get_links():
        u = l.get("uri")
        if u and u not in uris:
            uris.append(u)

    return dict(date_raw=cell.get("date", ""), publication=pub, headline=headline,
                edition=cell.get("edition", ""), page_no=cell.get("page", ""),
                story=story, urls=uris, images=imgs, cols_swapped=swapped)


def docket_meta(path):
    base = os.path.basename(path)
    y = re.search(r"(20\d\d)", base)
    year = int(y.group(1)) if y else None
    mon = None
    for name, num in MONTHS.items():
        if re.search(name, base, re.I):
            mon = num
            break
    consolidated = bool(re.search(r"consolidate|Tread Talks|AD Campaign|acquires", base, re.I))
    return year, mon, consolidated, base


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    files = [f for f in sorted(glob.glob("dockets/*/*.pdf"))
             if not any(s in f for s in SKIP_FILES)]
    if only:
        files = [f for f in files if only.lower() in f.lower()]

    out = []
    for f in files:
        year, mon, consolidated, base = docket_meta(f)
        doc = fitz.open(f)
        kept = skipped = 0
        story = ""
        for pno in range(doc.page_count):
            try:
                rec = parse_page(doc, doc[pno])
            except Exception as e:
                print(f"    !! {base} p{pno+1}: {e}", flush=True)
                rec = None
            if not rec:
                skipped += 1
                continue
            if rec["story"]:
                story = rec["story"]
            iso = parse_date(rec["date_raw"], year, mon)
            # dockets occasionally mistype the year on a clipping ("05-Jan-2025"
            # inside the January 2026 report). Where the month matches the
            # docket's own month, trust the docket.
            fixed = False
            if iso and mon and not consolidated:
                py, pm = int(iso[:4]), int(iso[5:7])
                if pm == mon and py != year:
                    iso = f"{year:04d}-{pm:02d}-{iso[8:]}"
                    fixed = True
            rec.update(source=base, src_path=f, src_page=pno + 1,
                       docket_year=year, docket_month=mon,
                       consolidated=consolidated, group=story,
                       date=iso, year_corrected=fixed)
            out.append(rec)
            kept += 1
        print(f"{kept:>4} kept / {skipped:>3} skipped  {base[:62]}", flush=True)

    json.dump(out, open("coverage-raw.json", "w"), indent=1)
    online = sum(1 for r in out if r["urls"])
    multi = sum(1 for r in out if len(r["images"]) > 1)
    print(f"--- {len(out)} items from {len(files)} dockets; "
          f"{online} online, {len(out)-online} print; {multi} multi-image")


if __name__ == "__main__":
    main()
