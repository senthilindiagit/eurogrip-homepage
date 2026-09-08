#!/usr/bin/env python3
"""
Cut the client's six-vehicle line-up off its baked checkerboard.

The supplied PNG *looks* transparent but carries no alpha at all: the
checkerboard is painted into the pixels — 22.37 x 22.67px squares alternating
243 and 254. Two things make it awkward:

* One of the six vehicles is a **white truck**. Any knockout that thresholds on
  brightness deletes it, because its bodywork is the same value as the light
  squares it sits on.
* The plate is not a rendering of a transparent image. It is a checkerboard with
  an **opaque light ground plane** laid over it, the vehicles standing on that,
  and their shadows painted onto it. Measured, those shadows carry none of the
  checker's contrast, which is how we know they are paint and not transparency.
  So "how far is this pixel from white" is not a reliable background test either.

What *is* reliable is the checker itself. The pattern is known exactly, so the
backdrop can be predicted per pixel and subtracted. Two details have to be right
or the whole thing collapses:

* **Sub-pixel grid fit.** The square is not an integer. Fitting it to a tenth of
  a pixel drifts by half a square across a 2035px plate, which inverts the model
  on one side. It is fitted from the sub-pixel zero crossings of a clean
  background row and column by least squares, to ~0.001px.
* **An anti-aliased model.** The plate's square boundaries are smoothed over a
  pixel, so predicting hard steps leaves a one-pixel error grid across the
  frame. That grid alone is enough to fence every square off from its
  neighbours and defeat the background flood fill. So the model is supersampled
  4x4, and seam pixels are additionally allowed the full contrast.

Separating the vehicles from that ground plane is the harder half, because the
plane, its glow and the truck's grey cab all land in the same band of light
neutral tones. Brightness cannot split them and neither can enclosure — measured,
the four ground bands and the cab all sit at a rim ratio of 0.50-0.54, since a
band running along the wheels touches as much structure as bodywork does. What
does split them is shape and place: a ground plane is wide and shallow, and
whatever rests on it is below its top edge. See `main` for the figures.

The plate's shadows are then thrown away and re-baked with `lineup_cutout`'s
`ground_shadow`, the same navy contact shadow the two tyre line-ups already on
the products page use, so the three read as one set.

Usage:  python3 scripts/products/dechecker_lineup.py <src.png> <out.webp>
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

from lineup_cutout import ground_shadow

SQ_LIGHT, SQ_DARK = 254.0, 243.0
MID = (SQ_LIGHT + SQ_DARK) / 2      # 248.5
BG_TOL = 4.0                        # "this pixel is bare backdrop"
SEAM_TOL = SQ_LIGHT - SQ_DARK + 2.0  # ...but a smoothed seam may be anywhere
SS = 4                              # supersampling for the backdrop model
SPECK = 60                          # drop not-backdrop blobs smaller than this
STRUCTURE_CHROMA = 14               # saturated enough to be paint, not glow
STRUCTURE_DARK = 130                # dark enough to be structure, not glow
AMB_MIN = 400                       # smaller ambiguous scraps are not worth keeping
AMB_MAX_GRAY = 243.0                # glow is brighter than this; shaded paint is not
AMB_ENCLOSED = 0.25                 # below this a region is not touching a vehicle at all
FLOOR_ASPECT = 3.0                  # a ground band is at least this much wider than tall
FLOOR_MIN = 4000                    # ...and this big, before it can define the ground line
HOLE_MAX = 900                      # a checker square is ~507px; real gaps are bigger
FEATHER = 0.7                       # anti-aliasing on the final silhouette


def fit_axis(profile: np.ndarray, name: str) -> tuple[float, float]:
    """Period and phase of the square wave, from its sub-pixel zero crossings."""
    v = profile - MID
    sign = np.sign(v)
    idx = np.where(sign[:-1] * sign[1:] < 0)[0]
    pos = idx + v[idx] / (v[idx] - v[idx + 1])          # linear interpolation
    k = np.arange(len(pos))
    p_half, c0 = np.polyfit(k, pos, 1)                  # crossings are one square apart
    resid = np.abs(pos - (c0 + p_half * k)).max()
    print(f"  {name}: {len(pos)} crossings, square {p_half:.4f}px, "
          f"first at {c0:.2f}, max residual {resid:.2f}px")
    return p_half, c0


def parity_coverage(H: int, W: int, px: float, cx: float, py: float, cy: float):
    """Fraction of each pixel covered by one parity of the checker, 4x4 sampled."""
    off = (np.arange(SS) + 0.5) / SS - 0.5
    acc = np.zeros((H, W))
    ys = np.arange(H)[:, None].astype(np.float64)
    xs = np.arange(W)[None, :].astype(np.float64)
    for dy in off:
        ky = np.floor((ys + dy - cy) / py)
        for dx in off:
            acc += (np.floor((xs + dx - cx) / px) + ky) % 2
    return acc / (SS * SS)


def keep_larger_than(mask: np.ndarray, n: int) -> np.ndarray:
    lab, count = ndi.label(mask)
    if not count:
        return mask
    sizes = ndi.sum(mask, lab, range(1, count + 1))
    keep = np.nonzero(sizes >= n)[0] + 1
    return np.isin(lab, keep)


def main(src: str, out: str) -> None:
    rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.float64)
    H, W, _ = rgb.shape
    gray = rgb.mean(2)
    chroma = rgb.max(2) - rgb.min(2)
    print(f"source {W}x{H}")

    # --- the backdrop, predicted exactly ----------------------------------
    px, cx = fit_axis(gray[:20].mean(0), "x")            # top rows are bare
    py, cy = fit_axis(gray[:, :20].mean(1), "y")         # so is the left edge
    cov = parity_coverage(H, W, px, cx, py, cy)
    err_a = np.abs(gray[:20] - (SQ_DARK + (SQ_LIGHT - SQ_DARK) * cov[:20])).mean()
    err_b = np.abs(gray[:20] - (SQ_LIGHT - (SQ_LIGHT - SQ_DARK) * cov[:20])).mean()
    if err_b < err_a:                                    # the two have equal means,
        cov = 1.0 - cov                                  # only per-pixel error tells
    B = SQ_DARK + (SQ_LIGHT - SQ_DARK) * cov
    resid = np.abs(gray[:20] - B[:20])
    print(f"  parity {'flipped' if err_b < err_a else 'as-is'}; "
          f"model error on bare strip: mean {resid.mean():.2f}px-value")

    # --- sharp silhouette --------------------------------------------------
    dev = np.abs(rgb - B[..., None]).max(2)
    seam = (cov > 0.02) & (cov < 0.98)
    bare = dev <= np.where(seam, SEAM_TOL, BG_TOL)
    print(f"  bare backdrop: {bare.mean() * 100:.1f}% of frame")

    # Grow the mask from what is unambiguous: anything saturated, or anything
    # dark. Neither can be the plate's light neutral ground plane or its glow.
    structure = ~bare & ((chroma >= STRUCTURE_CHROMA) | (gray <= STRUCTURE_DARK))
    structure = keep_larger_than(structure, SPECK)
    print(f"  confident structure (coloured or dark): {structure.mean() * 100:.1f}%")

    # Everything left over is the ambiguous class: light neutral tones that are
    # not bare checker. Some of it is bodywork — the truck's cab reads 227 grey —
    # and the rest is the plate's ground plane, its glow and its painted shadows.
    #
    # Neither brightness nor perimeter separates those. Measured, the four ground
    # bands and the truck's cab all sit at a rim ratio of 0.50-0.54, because a
    # ground band runs along the wheels and so touches as much structure as
    # bodywork does. What does separate them is shape and place, and both are
    # physical: a ground plane is wide and shallow, and everything resting on it
    # is below its top edge. Bodywork is compact and above it. So the ground is
    # identified from its own wide bands, and then anything centred at or below
    # where that ground starts belongs to it.
    amb = ndi.binary_opening(~bare & ~structure, np.ones((3, 3)))   # break bridges
    lab_a, n_a = ndi.label(amb)
    comps = []
    for i in range(1, n_a + 1):
        comp = lab_a == i
        size = int(comp.sum())
        if size < AMB_MIN:
            continue
        ys_, xs_ = np.where(comp)
        h = ys_.max() - ys_.min() + 1
        aspect = (xs_.max() - xs_.min() + 1) / h
        rim = ndi.binary_dilation(comp, ndi.generate_binary_structure(2, 1), 2) & ~comp
        on_s, on_b = int((rim & structure).sum()), int((rim & bare).sum())
        comps.append({
            "mask": comp, "size": size, "aspect": aspect, "top": int(ys_.min()),
            "mid": float(ys_.mean()),
            "rim": on_s / max(on_s + on_b, 1),
            "gray": float(np.median(gray[comp])),
        })

    seeds = [c for c in comps if c["aspect"] >= FLOOR_ASPECT and c["size"] >= FLOOR_MIN]
    floor_top = min((c["top"] for c in seeds), default=H)
    print(f"  ground plane: {len(seeds)} wide bands, starting at row {floor_top} "
          f"of {H}")

    keep_amb = np.zeros_like(amb)
    dropped = 0
    for c in comps:
        bodywork = (
            c["mid"] < floor_top                    # above the ground plane
            and c["aspect"] < FLOOR_ASPECT          # compact, not a band
            and c["rim"] >= AMB_ENCLOSED            # actually attached to a vehicle
            # and darker than the backdrop: the glow runs 246-255 where real
            # light bodywork sits under its own shading (the cab reads 227)
            and c["gray"] <= AMB_MAX_GRAY
        )
        if bodywork:
            keep_amb |= c["mask"]
        else:
            dropped += c["size"]
    for c in sorted(comps, key=lambda c: -c["size"])[:8]:
        print(f'    {c["size"]:7d}px  aspect {c["aspect"]:4.1f}  mid-row {c["mid"]:5.0f}  '
              f'rim {c["rim"]:.2f}  gray {c["gray"]:5.1f}  '
              f'{"KEPT" if (c["mask"] & keep_amb).any() else "dropped"}')
    print(f"  ambiguous regions: {n_a}; kept {keep_amb.sum()} px of light "
          f"bodywork, dropped {dropped} px of ground, glow and shadow")

    solid = keep_larger_than(structure | keep_amb, 800)
    # bodywork sitting at the backdrop's own value leaves holes, but only ever
    # one square wide: the two parities cannot both match, since white paint at
    # 250 is 4 off the light squares and 7 off the dark ones
    holes = ndi.binary_fill_holes(solid) & ~solid
    solid |= keep_larger_than(holes, 1) & ~keep_larger_than(holes, HOLE_MAX)
    _, n = ndi.label(solid)
    print(f"  vehicles: {n} pieces, {solid.mean() * 100:.1f}% of frame")

    # --- assemble ----------------------------------------------------------
    alpha = ndi.gaussian_filter(solid.astype(np.float64), FEATHER)
    alpha = np.clip((alpha - 0.5) * 2.4 + 0.5, 0, 1)     # keep the edge crisp
    fg = np.where(solid[..., None], rgb, 0.0)

    ys_, xs_ = np.where(alpha > 0.02)
    y0, y1 = max(ys_.min() - 2, 0), min(ys_.max() + 3, H)
    x0, x1 = max(xs_.min() - 2, 0), min(xs_.max() + 3, W)
    rgba = np.dstack([fg, alpha * 255.0])[y0:y1, x0:x1].round().astype(np.uint8)
    print(f"  trimmed to {x1 - x0}x{y1 - y0}")

    # --- fresh shadows, matching the other line-ups ------------------------
    im = ground_shadow(Image.fromarray(rgba))
    im.save(out, "WEBP", quality=92, method=6)
    print(f"  wrote {out} at {im.size[0]}x{im.size[1]}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
