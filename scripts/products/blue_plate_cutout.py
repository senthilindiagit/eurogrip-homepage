#!/usr/bin/env python3
"""
Strip an opaque blue backdrop out of an already-cut-out product shot, then hand
it to the normal line-up finishing pass.

The client's two-wheeler plate arrives with a real alpha channel, which looks
like a finished cutout — but it is not. It was cut off a #5778AC background and
the **drop shadow came with it, fully opaque** (measured #4C6388 over 9.7% of
the frame, one connected region wrapping the silhouettes because the blue fringe
along every edge joins it up). On the products hero's own blue that would read
as a hard-edged lighter blob, not as a shadow.

Keying on brightness is not safe here: the bike's smoked windscreen and its dark
plastics sit in the same range as the backdrop. What separates them is hue. The
backdrop family is one colour scaled up and down by the shadow, so its channel
*ratios* hold steady — r/b 0.56, g/b 0.73 — while a neutral dark part of the
bike sits near r/b 0.75. So the key is a distance to that ratio, not a level,
which leaves the windscreen alone.

The blue that survives as a blend along each edge is then pulled out by
`lineup_cutout.defringe`, whose `cold` branch exists for exactly this, and the
shadow is re-baked by `ground_shadow` so this plate grounds the same way as the
other line-ups on the page.

Usage:  python3 scripts/products/blue_plate_cutout.py <src.png> <out.webp>
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

from lineup_cutout import defringe, ground_shadow, proof

# the backdrop's own channel ratios, and how far a pixel may sit from them
RB, GB = 0.56, 0.73
RB_TOL, GB_TOL = 0.10, 0.08
MIN_BLUE = 40           # below this the channels are too small to have a ratio
MIN_COMP = 2000         # drop specks left behind once the backdrop is gone
HOLE_MAX = 1200         # repair chrome and glass the key mis-reads as backdrop
MAX_W = 1400            # the hero never renders it wider than ~600 CSS px


def keep_larger_than(mask: np.ndarray, n: int) -> np.ndarray:
    lab, count = ndi.label(mask)
    if not count:
        return mask
    sizes = ndi.sum(mask, lab, range(1, count + 1))
    return np.isin(lab, np.nonzero(sizes >= n)[0] + 1)


def main(src: str, out_path: str) -> None:
    rgba = np.asarray(Image.open(src).convert("RGBA")).astype(np.int16)
    a = rgba[:, :, 3]
    r, g, b = (rgba[:, :, i].astype(np.float64) for i in range(3))
    H, W = a.shape
    print(f"source {W}x{H}, {100 * (a > 8).mean():.1f}% of it already opaque")

    with np.errstate(invalid="ignore", divide="ignore"):
        rb, gb = r / np.maximum(b, 1), g / np.maximum(b, 1)
    backdrop = (
        (a > 8)
        & (b > MIN_BLUE)
        & (np.abs(rb - RB) < RB_TOL)
        & (np.abs(gb - GB) < GB_TOL)
    )
    print(f"  backdrop and its shadow: {100 * backdrop.mean():.1f}% of frame")

    subject = keep_larger_than((a > 8) & ~backdrop, MIN_COMP)
    holes = ndi.binary_fill_holes(subject) & ~subject
    small = keep_larger_than(holes, 1) & ~keep_larger_than(holes, HOLE_MAX)
    subject |= small
    _, pieces = ndi.label(subject)
    print(f"  subject: {pieces} pieces, {100 * subject.mean():.1f}% of frame; "
          f"repaired {int(small.sum())} px of glass and chrome")

    rgba[:, :, 3] = np.where(subject, a, 0)
    arr, hot, cold = defringe(rgba.astype(np.uint8))
    print(f"  de-fringed {hot} warm / {cold} cold edge pixels")

    im = Image.fromarray(arr)
    box = im.getbbox()
    im = im.crop(box)
    print(f"  trimmed to {im.size[0]}x{im.size[1]} from {box}")

    out = ground_shadow(im)
    if out.width > MAX_W:
        out = out.resize((MAX_W, round(out.height * MAX_W / out.width)), Image.LANCZOS)
    out.save(out_path, "WEBP", quality=88, method=6)
    print(f"  wrote {out_path} at {out.size[0]}x{out.size[1]}")
    proof(out, out_path.rsplit(".", 1)[0] + "-proof.png")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
