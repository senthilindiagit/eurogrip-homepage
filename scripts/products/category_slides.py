#!/usr/bin/env python3
"""
Build the five category line-ups for the products hero carousel.

Sources are the client's own plates in content/products (gitignored), all five
already 1672x941:

    Two Wheeler.png        scooter + sport bike
    Three Wheeler 3.png    cargo three-wheeler + auto-rickshaw
    Ultra Light truck.png  box truck + pickup + van
    Half Highway.png       backhoe + dump truck + tractor   (off-highway)
    Super grip.png         forklift + telehandler + tow tractor

All five arrive with real alpha. The first three-wheeler plate the client sent
("Three Wheeler 2.png") did not — it was RGB with a checkerboard painted into the
pixels — and it is genuinely hard to cut automatically, because its silver
corrugated cargo box has almost exactly the checkerboard's local mean and its
ribs land on the checker's own two tones. "Three Wheeler 3.png" is the same
composition with transparency, which is why it is the one used here.

Two things this script is careful about, because they are what make a carousel
look either deliberate or cheap:

* **The canvas is kept, not trimmed.** Every slide stays on the shared 1672x941
  frame, so the vehicles remain registered to it and none of them jumps sideways
  relative to the others as the loop runs. Trimming each plate to its own
  bounding box would guarantee that jump.
* **Each slide is centred on that canvas**, horizontally and vertically, by its
  own content. The plates are not consistently composed — see the bbox
  diagnostic this prints — and without it one slide sits low or left and the
  travel reads as a wobble rather than a slide.

No ground shadows here, deliberately: the plates arrive without them, and the
carousel reads as a set of floating cutouts rather than vehicles on a floor.

Usage:  python3 scripts/products/category_slides.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path("content/products")
OUT = Path("src/assets/products/categories")

# (slug, file) — in the order the site lists the categories
SLIDES = [
    ("two-wheeler", "Two Wheeler.png"),
    ("three-wheeler", "Three Wheeler 3.png"),
    ("ultra-light-truck", "Ultra Light truck.png"),
    ("off-highway", "Half Highway.png"),
    ("supergrip", "Super grip.png"),
]

WIDTH = 1200      # the hero renders it about 590px wide; this is 2x for retina
ALPHA_MIN = 6     # feathered edges bottom out around here


def content_box(im: Image.Image) -> tuple[int, int, int, int]:
    a = np.asarray(im)[:, :, 3]
    ys, xs = np.where(a > ALPHA_MIN)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def centre_on_canvas(im: Image.Image) -> Image.Image:
    """Recentre the artwork on its own canvas without changing its scale."""
    x0, y0, x1, y1 = content_box(im)
    art = im.crop((x0, y0, x1, y1))
    canvas = Image.new("RGBA", im.size, (0, 0, 0, 0))
    canvas.paste(art, ((im.width - art.width) // 2, (im.height - art.height) // 2))
    return canvas


def main() -> None:
    if not SRC.exists():
        sys.exit(f"missing {SRC} — the client dump is gitignored, restore it first")
    OUT.mkdir(parents=True, exist_ok=True)

    total = 0
    for slug, name in SLIDES:
        path = SRC / name
        if not path.exists():
            print(f"  MISSING {path}")
            continue
        im = Image.open(path).convert("RGBA")
        print(f"  {slug}: {name}")

        x0, y0, x1, y1 = content_box(im)
        print(f"      content {x1 - x0}x{y1 - y0} at ({x0},{y0}) on a "
              f"{im.width}x{im.height} canvas — "
              f"offset from centre: x {(x0 + x1) // 2 - im.width // 2:+d}, "
              f"y {(y0 + y1) // 2 - im.height // 2:+d}")

        im = centre_on_canvas(im)
        if im.width != WIDTH:
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)

        dst = OUT / f"{slug}.webp"
        im.save(dst, "WEBP", quality=82, method=6)
        kb = dst.stat().st_size // 1024
        total += kb
        print(f"      -> {dst}  {im.width}x{im.height}  {kb} kB")

    print(f"\n{len(SLIDES)} slides, {total} kB in {OUT}")


if __name__ == "__main__":
    main()
