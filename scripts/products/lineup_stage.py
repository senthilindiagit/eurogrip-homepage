#!/usr/bin/env python3
"""Stage a tyre line-up out of separate product shots.

The client's own site publishes each three-wheeler pattern as a 1200px cutout
with alpha already clean — four times the resolution of the banner those tyres
appear in, and no matting needed. So rather than cut the banner out, this
rebuilds the same line-up from the originals.

Depth is carried by four things together, because any one of them alone reads as
a paste-up: scale, a base line that rises toward the back, a little blur, and a
touch of atmospheric lift. Every tyre gets its own contact shadow at its own
base before it is composited, so the tyre in front occludes the shadow of the
one behind it — which is what a photograph does.

    python3 scripts/products/lineup_stage.py out.webp a.png b.png c.png

First file is the front of the line-up, last is the back.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

from lineup_cutout import DARK, PAD, ground_shadow, proof

WIDTH = 1200      # asset width; the panel column is ~700 CSS px at 1440
FRONT_H = 940     # height of the front tyre, before its shadow pad
STEP = 0.885      # each tyre back is this much of the one in front
OVERLAP = 0.60    # how far along the previous tyre the next one starts
LIFT = 26         # px each tyre back stands higher up the ground plane
BLUR = 1.15       # px of depth blur per step back
HAZE = 0.045      # atmospheric lift per step back


def prep(path, height, blur, haze):
    im = Image.open(path).convert("RGBA")
    im = im.crop(im.getbbox())
    im = im.resize((round(im.width * height / im.height), height), Image.LANCZOS)
    if haze:
        im = ImageEnhance.Color(im).enhance(1 - haze * 3)
        im = ImageEnhance.Brightness(im).enhance(1 + haze)
    if blur:
        # blur the colour but keep the alpha crisp, or the cutout grows a halo
        a = im.getchannel("A")
        im = im.filter(ImageFilter.GaussianBlur(blur))
        im.putalpha(a)
    return im


def main():
    out_path, srcs = sys.argv[1], sys.argv[2:]
    assert srcs, __doc__

    # front to back
    tyres = [
        prep(p, round(FRONT_H * STEP**i), BLUR * i, HAZE * i)
        for i, p in enumerate(srcs)
    ]

    xs, x = [], 0
    for t in tyres:
        xs.append(x)
        x += round(t.width * OVERLAP)
    ground = FRONT_H                                    # the front tyre's base
    ys = [ground - t.height - LIFT * i for i, t in enumerate(tyres)]

    canvas = Image.new(
        "RGBA", (max(x + t.width for x, t in zip(xs, tyres)), ground + PAD), (0, 0, 0, 0)
    )
    # back to front, so a tyre in front covers the shadow of the one behind it
    for i in range(len(tyres) - 1, -1, -1):
        lit = ground_shadow(tyres[i], dark=DARK * (1 - 0.12 * i))
        canvas.alpha_composite(lit, (xs[i], ys[i]))

    out = canvas.crop(canvas.getbbox())
    if out.width != WIDTH:
        out = out.resize((WIDTH, round(out.height * WIDTH / out.width)), Image.LANCZOS)
    out.save(out_path, "WEBP", quality=86, method=6)
    print("wrote", out_path, out.size, os.path.getsize(out_path), "bytes")
    proof(out)


if __name__ == "__main__":
    main()
