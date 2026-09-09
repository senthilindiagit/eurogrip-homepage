#!/usr/bin/env python3
"""
Pull the twelve technology diagrams out of the client's 2026 range deck.

Source: content/"Eurogrip Range Bee Wild 2026 LAUNCH (Refer for Technology
Info)).pdf", pages 4 and 5 ("TECHNOLOGY BEHIND THE PERFORMANCE"). Each entry is
a circular badge holding a cutaway render of the tyre, embedded as a ~292px
JPEG, and each one has **its name baked into the artwork**.

The names have to come off. The client said on the 2026-08-06 call that the
final technology names are still coming, and that they differ by region -
"TreadSmart" is one regional name for what this deck calls the tri-polymer
compound. A name baked into a picture means new artwork for every rename and
every region, and it is invisible to a screen reader and to a translator. So the
label band is cropped away here and the name is rendered as live text on the
page, out of TECHNOLOGIES in lib/technology.ts.

The crop is found rather than guessed: in every badge there is a run of clean
rows between the artwork and the label, so the script cuts through the first one
below the artwork. See `label_cut` for why it is the first and not the widest,
and why it is measured across the middle columns rather than the full width.

The badges are rendered off the page rather than lifted out as embedded
pictures, because one of the twelve is a stencil mask whose colour is drawn
separately as vector - extract that picture on its own and you get a black slab.
Rendering also beats the 292px originals, at 600dpi.

Usage:  python3 scripts/technology/tech_icons.py
"""
import sys
from pathlib import Path

import fitz
import numpy as np
from PIL import Image

PDF = Path("content/Eurogrip Range Bee Wild 2026 LAUNCH (Refer for Technology Info)).pdf")
OUT = Path("src/assets/technology/tech")

# xref -> slug, read off the badges themselves; the xref order in the file is
# not the order they appear on the slide, so this cannot be derived
DIAGRAMS = {
    178: "adaptive-land-sea-ratio",
    180: "bidirectional-knobs",
    182: "cap-and-base",
    184: "deep-design-tread",
    186: "low-rolling-resistance",
    188: "steel-belt",
    191: "optimised-tread-pattern",
    193: "quadrazone",
    195: "roll-balanced-structure",
    197: "tri-polymer-compound",
    199: "synthetic-fibres-x-ply",
    201: "variable-radius-profile",
}

WHITE = 238          # at or above this a pixel counts as background
TRIM_INK = 200       # ...but the disc's own hairline outline is lighter than this,
                     # and it must not be what sets the crop
INK_ROW = 0.012      # a row with less ink than this is part of a gap (jpeg noise)
MIN_GAP = 8          # a gap needs this many rows to be believable. Swept: every
                     # badge lands on the same crop for anything from 5 to 9, and
                     # only the variable-radius badge moves at 10, whose real gap
                     # is 9 rows. 8 sits in the middle of that stable band.
MID_COLS = 0.6       # fraction of the width the label is looked for in
SEARCH_FROM = 0.55   # only look for the label gap below this fraction
DPI = 600            # renders each ~104pt badge at about 870px
INSET = 6            # shave the disc's own hairline outline off with the corners
PAD = 0.05           # breathing room around the trimmed artwork
SIZE = 400


def mask_outside_disc(im: Image.Image) -> Image.Image:
    """Whiten everything outside the badge's disc.

    The disc is inscribed in the image's own box on the page - which the
    extracted rasters confirm, since their masked-off corners are exactly the
    outside of the circle - so this is geometry, not a colour key. It has to
    happen before anything is measured: the deck's blue banner runs behind these
    badges and shows in the corners, and left there it puts ink on every row so
    no label gap is ever found.
    """
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    r = min(h, w) / 2
    outside = ((xx - w / 2) ** 2 + (yy - h / 2) ** 2) > (r - INSET) ** 2
    a[outside] = 255
    print(f"      whitened {100 * outside.mean():.0f}% outside the disc")
    return Image.fromarray(a.astype(np.uint8))


def label_cut(gray: np.ndarray) -> int:
    """Row to cut at: the middle of the FIRST white gap below the artwork.

    Not the widest. A two-line label has a gap between its own lines, and on the
    roll-balanced badge that inner gap measured 8 rows against 9 for the real one
    above the label - close enough that "widest" picked it and left the words
    "ROLL BALANCED" baked into the crop. The label is always last, so the first
    clean gap under the artwork is the one that separates them.

    Ink is counted across the middle columns only, not the full width. On the
    adaptive land/sea badge the tyre's dark right-hand flank runs down past the
    top of the label, so measured full-width there is no clean row anywhere
    between artwork and label and the label survives the crop. A label is always
    set centred, so the middle of the badge is where it can be seen on its own.
    Measured, this changes nothing for the other eleven badges.
    """
    h, w = gray.shape
    edge = int(w * (1 - MID_COLS) / 2)
    ink = (gray[:, edge : w - edge] < WHITE).mean(axis=1)
    run = None
    for y in range(int(h * SEARCH_FROM), h):
        if ink[y] <= INK_ROW:
            if run is None:
                run = y
        else:
            if run is not None and y - run >= MIN_GAP:
                print(f"      label gap rows {run}-{y} of {h}")
                return (run + y) // 2
            run = None
    if run is not None:
        print(f"      nothing below row {run} of {h}")
        return run
    print("      no gap found - keeping the whole badge")
    return h


def main() -> None:
    if not PDF.exists():
        sys.exit(f"missing {PDF} - the client dump is gitignored, restore it first")
    OUT.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)

    # Where each badge sits on its page. The badges are *rendered* from the page
    # rather than pulled out as embedded pictures: one of the twelve is a stencil
    # mask whose colour is drawn separately as vector, so extracting the picture
    # alone gives a black slab. Rendering composites mask, vector and raster the
    # way the page does, and at 600dpi it also beats the 292px originals.
    where = {}
    for pno in (3, 4):
        for xref in DIAGRAMS:
            for rect in doc[pno].get_image_rects(xref):
                where[xref] = (pno, rect)
    missing = set(DIAGRAMS) - set(where)
    if missing:
        sys.exit(f"expected diagrams not in the deck: {sorted(missing)}")

    for xref, slug in DIAGRAMS.items():
        pno, rect = where[xref]
        pix = doc[pno].get_pixmap(clip=rect, dpi=DPI)
        im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        print(f"  {slug}: page {pno + 1}, rendered {im.width}x{im.height}")
        im = mask_outside_disc(im)
        gray = np.asarray(im.convert("L")).astype(np.int16)

        art = im.crop((0, 0, im.width, label_cut(gray)))

        # trim the white round the artwork, then pad back out to a square so
        # twelve diagrams of twelve different proportions align on the page
        a = np.asarray(art.convert("L")).astype(np.int16)
        ys, xs = np.where(a < TRIM_INK)
        if len(ys) == 0:
            sys.exit(f"{slug} came out blank")
        art = art.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        side = int(max(art.size) * (1 + 2 * PAD))
        square = Image.new("RGB", (side, side), (255, 255, 255))
        square.paste(art, ((side - art.width) // 2, (side - art.height) // 2))
        square = square.resize((SIZE, SIZE), Image.LANCZOS)
        square.save(OUT / f"{slug}.webp", "WEBP", quality=90, method=6)
        print(f"      wrote {OUT / f'{slug}.webp'}")

    print(f"\n{len(DIAGRAMS)} diagrams written to {OUT}")


if __name__ == "__main__":
    main()
