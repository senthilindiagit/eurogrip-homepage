#!/usr/bin/env python3
"""
Lift the four testing snapshots out of the client's export sales deck.

Source: content/"Exports Sales Pitch Deck (1).pdf", page 36, "TESTING &
DEVELOPMENT - SNAPSHOTS". Four photographs in a row, captioned on the slide, of
actual tyre tests. They replace the three cards the proving-ground section used
to carry, which were borrowed from the careers page and captioned with copy
nobody at the client had written.

They are small - three of the four are 285x190 - so the page renders them at
roughly native size and never blows them up. That is the honest trade against
the alternative, which is a generated placeholder standing in for a test that
really happened.

Usage:  python3 scripts/technology/test_photos.py
"""
import io
import sys
from pathlib import Path

import fitz
from PIL import Image

PDF = Path("content/Exports Sales Pitch Deck (1).pdf")
OUT = Path("src/assets/technology")
PAGE = 35

# xref -> slug, in the left-to-right order the captions run on the slide
PHOTOS = {
    533: "test-protorq-track",
    532: "test-roadhound-wet",
    536: "test-trailhound-track",
    531: "test-beeconnect-paved",
}
ASPECT = 3 / 2


def main() -> None:
    if not PDF.exists():
        sys.exit(f"missing {PDF} - the client dump is gitignored, restore it first")
    OUT.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)

    for xref, slug in PHOTOS.items():
        raw = doc.extract_image(xref)
        im = Image.open(io.BytesIO(raw["image"])).convert("RGB")
        w, h = im.size

        # centre-crop to one aspect so four photos of three sizes sit in a row
        if w / h > ASPECT:
            new = int(h * ASPECT)
            im = im.crop(((w - new) // 2, 0, (w - new) // 2 + new, h))
        else:
            new = int(w / ASPECT)
            im = im.crop((0, (h - new) // 2, w, (h - new) // 2 + new))

        im.save(OUT / f"{slug}.webp", "WEBP", quality=88, method=6)
        print(f"  {slug}: {w}x{h} -> {im.size[0]}x{im.size[1]}")

    print(f"\n{len(PHOTOS)} photos written to {OUT}")


if __name__ == "__main__":
    main()
