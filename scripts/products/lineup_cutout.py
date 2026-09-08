#!/usr/bin/env python3
"""Ground shadows for the products page tyre line-ups, and the matte clean-up.

Two things live here:

  `ground_shadow` — the shadow builder both line-up paths use. A tyre line-up
  puts several tyres at several depths, so their contact patches sit at several
  different heights. One CSS ellipse, or a mirrored-and-squashed copy of the
  whole image, detaches from all but one of them. This reads the silhouette's
  lowest pixel per column instead, flattens that into a pool under each contact
  patch, and lays a tight core blur over a broad ambient one — which is how a
  floor shadow under a big softbox actually falls. A single blur reads as a
  decal.

  `main` — the supplied-photo path. Run it on the MATTED png, not the original:
  the background has to come off first (Freepik/Magnific
  `images_remove_background` did the two-wheeler line-up; it cleared the
  checkerboard floor, the navy backdrop and the banner type in the corner while
  keeping the wheel-spoke gaps and the tread edges). This then neutralises the
  colour the floor and backdrop left on the anti-aliased rim, trims to the alpha
  box so the box bottom IS the contact line, and bakes the shadow.

      python3 scripts/products/lineup_cutout.py matte.png out.webp

  For a line-up staged out of separate product shots, see lineup_stage.py.
"""
import sys

import numpy as np
from PIL import Image, ImageFilter

PAD = 72          # room under the group for the shadow to fall into
POOL = 104        # width of the contact patch a shadow pools under
FALLOFF = 46.0    # how fast the pool fades as the silhouette lifts off the floor
BLUR = 10         # the tight core of the shadow
SPREAD = 30       # the broad ambient half
DARK = 0.46       # peak shadow opacity
INK = (18, 32, 54)  # shadows on this site are navy-black, never neutral grey


def defringe(rgba, thresh=14):
    """Pull the coloured rim a background leaves on an anti-aliased edge back to
    neutral. Safe here because nothing in a tyre shot is legitimately saturated
    — black rubber, white lettering, grey steel."""
    rgb = rgba[:, :, :3].astype(np.int16)
    a = rgba[:, :, 3]
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    edge = (a > 0) & (a < 250)
    hot = edge & (r - np.maximum(g, b) > thresh)
    r[hot] = np.maximum(g, b)[hot]
    cold = edge & (b - np.maximum(r, g) > thresh)
    b[cold] = np.maximum(r, g)[cold]
    rgba[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    return rgba, int(hot.sum()), int(cold.sum())


def _maxfilt(v, w):
    """running max over a window, so the ground line flattens under each tyre"""
    out = v.copy()
    for s in range(1, w // 2 + 1):
        out = np.maximum(out, np.concatenate([v[s:], np.full(s, -1)]))
        out = np.maximum(out, np.concatenate([np.full(s, -1), v[:-s]]))
    return out


def shadow_mask(alpha, pad=PAD, pool=POOL, falloff=FALLOFF, blur=BLUR, spread=SPREAD):
    """0..1 shadow field for a silhouette, `pad` rows taller than it."""
    h, w = alpha.shape
    solid = alpha > 40
    has = solid.any(axis=0)
    if not has.any():
        return np.zeros((h + pad, w), np.float32)
    ybot = np.where(has, (h - 1) - np.argmax(solid[::-1], axis=0), -1)

    ground = _maxfilt(np.where(has, ybot, -1), pool)
    lift = np.where(has, ground - ybot, 1e9)
    strength = np.exp(-(lift / falloff) ** 2)

    sh = np.zeros((h + pad, w), np.float32)
    xs = np.nonzero(has)[0]
    for dy in range(-3, 15):
        fade = np.exp(-((dy - 4) / 7.0) ** 2)
        ys = ground[xs] + dy
        ok = (ys >= 0) & (ys < h + pad)
        np.maximum.at(sh, (ys[ok], xs[ok]), strength[xs][ok] * fade)

    raw = Image.fromarray((np.clip(sh, 0, 1) * 255).astype(np.uint8))
    core = np.array(raw.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255.0
    ambient = np.array(raw.filter(ImageFilter.GaussianBlur(spread)), np.float32) / 255.0
    return np.clip(core * 0.86 + ambient * 0.62, 0, 1)


def ground_shadow(im, dark=DARK, **kw):
    """The tyre standing on its own shadow, as one RGBA image `pad` taller."""
    sh = shadow_mask(np.array(im)[:, :, 3], **kw)
    canvas = np.zeros((sh.shape[0], sh.shape[1], 4), np.uint8)
    canvas[:, :, :3] = INK
    canvas[:, :, 3] = np.clip(sh * dark * 255, 0, 255).astype(np.uint8)
    out = Image.fromarray(canvas)
    out.alpha_composite(im, (0, 0))
    return out


def proof(im, path="lineup-preview.png"):
    """a proof on the plate's own sky colour, to check the shadow and the edges"""
    bg = Image.new("RGBA", im.size, (196, 218, 240, 255))
    bg.alpha_composite(im)
    bg.convert("RGB").save(path)
    print("proof written to", path)


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "cut-raw.png"
    out_path = sys.argv[2] if len(sys.argv) > 2 else "src/assets/products/lineup.webp"

    arr, hot, cold = defringe(np.array(Image.open(src).convert("RGBA")))
    print(f"de-fringed {hot} red / {cold} blue edge pixels")

    im = Image.fromarray(arr)
    box = im.getbbox()
    im = im.crop(box)
    print("trimmed to", im.size, "from", box)

    out = ground_shadow(im)
    if out.width > 1200:
        out = out.resize((1200, round(out.height * 1200 / out.width)), Image.LANCZOS)
    out.save(out_path, "WEBP", quality=84, method=6)
    print("wrote", out_path, out.size)
    proof(out)


if __name__ == "__main__":
    main()
