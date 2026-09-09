#!/usr/bin/env python3
"""
Prepare the real photography for the technology page.

Everything here comes out of the client's dump (content/, gitignored) at full
resolution - the factory drone shots are 5272x3948 and the tyre macros are
4032x3024 - and goes out as web-sized webp. The page was originally built on
twelve diagrams in twelve cards, which read as generic; these are the pictures
that fix that.

Two provenance notes worth carrying:

* `Corporate Media/Factory/*` and `Corporate Media/R&D Milano/*` are the
  client's own material.
* The tyre macros and the riding shots come from `content/reviews/` - they were
  shot by the journalists who reviewed the tyres (RoadBook, Cervone). The
  subject is Eurogrip's product but the photographs are not Eurogrip's to
  license by default, so they are flagged in docs/TECHNOLOGY-PAGE.md as needing
  clearance before this goes live.

EXIF orientation matters here: several of these are portrait-flagged and come
out on their side without `exif_transpose`.

Usage:  python3 scripts/technology/photos.py
"""
from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

OUT = Path("src/assets/technology")
DUMP = Path("content")
FACTORY = DUMP / "Corporate Media" / "Factory"
ROADBOOK = DUMP / "reviews" / "Review by RoadBook"

# slug -> (source, target width, crop aspect or None to keep the frame)
JOBS = [
    # the client's own factory, Madurai
    ("factory-aerial", FACTORY / "DJI_20231012075648_0076_D.jpg", 2200, 16 / 9),
    ("factory-hall", FACTORY / "DJI_20231012104436_0133_D.jpg", 2000, 4 / 3),
    ("factory-greens", FACTORY / "DJI_20231012121018_0193_D.jpg", 2000, 3 / 2),
    # riding and tyre detail, from the press reviews - clearance pending.
    # 03 is the banner: the strongest frame in the set, and it carries its own
    # dark band of tarmac along the bottom for the headline to sit on.
    ("hero-ride", ROADBOOK / "Eurogrip-03.jpg", 2600, 16 / 9),
    # 07 shows the crown running away from centre to shoulder, which is the one
    # thing the four compound zones need a reader to be able to see
    ("tread-crown", ROADBOOK / "Eurogrip-07.jpg", 1800, 3 / 2),
    ("sidewall", ROADBOOK / "Eurogrip-09.jpg", 1800, 3 / 2),
    ("proving-ride", ROADBOOK / "Eurogrip-05.jpg", 2000, 16 / 9),
    ("ride-road", ROADBOOK / "Eurogrip-04.jpg", 1800, 3 / 2),
]

# the R&D shot is a HEIC, which Pillow will not open here; sips converts it
HEIC = DUMP / "Corporate Media" / "R&D Milano" / "IMG_4058.HEIC"


def prep(im: Image.Image, width: int, aspect: float | None) -> Image.Image:
    im = ImageOps.exif_transpose(im).convert("RGB")
    if aspect:
        w, h = im.size
        if w / h > aspect:
            new = int(h * aspect)
            im = im.crop(((w - new) // 2, 0, (w - new) // 2 + new, h))
        else:
            new = int(w / aspect)
            im = im.crop((0, (h - new) // 2, w, (h - new) // 2 + new))
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    return im


def main() -> None:
    if not FACTORY.exists():
        sys.exit(f"missing {FACTORY} - the client dump is gitignored, restore it first")
    OUT.mkdir(parents=True, exist_ok=True)

    jobs = list(JOBS)
    tmp = None
    if HEIC.exists():
        tmp = Path(tempfile.mkdtemp()) / "rd.jpg"
        subprocess.run(["sips", "-s", "format", "jpeg", str(HEIC), "--out", str(tmp)],
                       check=True, capture_output=True)
        jobs.append(("rd-track", tmp, 2000, 4 / 3))
    else:
        print(f"  note: {HEIC} not found, skipping the R&D shot")

    total = 0
    for slug, src, width, aspect in jobs:
        if not Path(src).exists():
            print(f"  MISSING {src}")
            continue
        im = Image.open(src)
        before = im.size
        im = prep(im, width, aspect)
        dst = OUT / f"{slug}.webp"
        im.save(dst, "WEBP", quality=82, method=6)
        kb = dst.stat().st_size // 1024
        total += kb
        print(f"  {slug:16s} {before[0]}x{before[1]} -> {im.size[0]}x{im.size[1]}  {kb} kB")

    print(f"\n{total} kB of photography written to {OUT}")
    if tmp:
        tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
