#!/usr/bin/env python3
"""Cut the products-journey environment out of one photograph.

The journey needs four layers travelling at four speeds. Earlier passes built
those layers out of separate sources and reassembled them, and it looked exactly
like what it was — a diagram. Individually defensible pieces, no shared light,
no shared perspective.

So this takes ONE generated plate (an empty plaza terrace looking out over a
treeline to mountains and a hazy city) and cuts it along boundaries that already
exist in the picture:

    rows 0     ── sky, mountains, distant city ─────────► the 10% layer
    rows ~872  ── the treeline ─────────────────────────► the 22% layer
    rows 1030  ── the parapet's base, i.e. the horizon
    rows 1030+ ── the terrace ──────────────────────────► the 65% layer

The parapet is what makes this work. It is a real architectural edge running the
full width of the frame, so the seam between the landscape and the ground plane
falls where the eye already expects a hard line, and every layer keeps the one
photograph's light and haze.

Two layers have to be wider than the plate to cover their own travel, and both
are mirrored to get there — `strip + reverse(strip)` ends on the column it
starts on, so it repeats with no seam. Mirroring is safe on foliage and on
paving, which carry no directional structure; it is what failed on converging
joints in an earlier pass, and there are none to speak of here because the
terrace band is shallow enough that its joints run close to horizontal.

    python3 scripts/products/build_environment.py

Sources live in content/products/ (untracked). The plate is AI-generated — a
placeholder, not photography, and it must not be presented as such. See
docs/PRODUCTS-PAGE.md.
"""
import os

import numpy as np
from PIL import Image

SRC = "content/products"
OUT = "src/assets/products"
PLATE = f"{SRC}/env-source-plate.jpg"

# --- where the plate's own edges are, measured off it ------------------------
FAR_BOT = 905       # bottom of the sky/mountain/city band
TREE_TOP = 872      # top of the treeline, overlapping the band above it
PARAPET_BOT = 1030  # the parapet's base — the horizon everything lines up on
FAR_FEATHER = 300   # rows of the far band's top faded out into the sky gradient
TREE_FEATHER = 26   # a soft top edge so the trees sit into the mountains

HORIZON = 73        # the parapet's base as a % of viewport — match products.ts
SKY_FIT_TO = 700    # fit the CSS sky ramp to the plate's sky above this row
HERO_PX = 534       # the hero's rendered height at 1440x900, for the slope check
SKY_STOPS = (0, 120, 260, 400, 540, 700)
# solved, not chosen — see hero_ramp()

# The plate's sky is flat and near-white, which is both paler than the client's
# reference and impossible for the hero above to hand over to: the hero has to
# stay blue where the navbar and its white heading sit. So the sky is graded back
# toward brand blue, strongest at the top of frame and gone by GRADE_TO — which
# also moves it closer to the reference, whose sky is a real blue up top fading
# to warm haze at the horizon.
GRADE = "#3f74b4"
GRADE_K = 0.56      # strength at row 0
GRADE_TO = 660      # graded to nothing by here, so the mountains stay untouched

# The mountains and the distant city are hazed almost to nothing in the plate,
# and once the far band is registered correctly they are the only thing in that
# gap between the treeline and the sky. So the band's lower rows get a contrast
# and saturation lift — windowed, and faded back out before LIFT_OUT, because
# the treeline layer that overlaps below is NOT lifted and a mismatch would show
# as a halo through its feathered top edge.
LIFT_FROM = 690     # ramp in
LIFT_FULL = 780     # full strength across the mountains and the skyline
LIFT_OUT = 878      # back to nothing by the time the treeline layer takes over
LIFT_CONTRAST = 0.9
LIFT_SAT = 0.55
LIFT_DARKEN = 0.05

FAR_W = 2600        # the far band asset width
FAR_SPAN_VW = 150   # ...rendered across this much viewport
BRAND = "#2f5f9f"   # the hero starts on brand blue; the nav needs the contrast
SCENE_W = 1600      # the flat composite for the stacked layout


def hexof(c):
    return "#%02x%02x%02x" % tuple(int(round(v)) for v in c)


def row(a, y):
    return a[y].mean(0)


def grade_sky(img):
    """blend the sky toward brand blue, strongest at the top of frame"""
    a = np.array(img).astype(np.float32)
    tint = np.array([int(GRADE[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
    k = np.clip(1 - np.arange(img.height) / GRADE_TO, 0, 1) ** 1.25 * GRADE_K
    a = a * (1 - k[:, None, None]) + tint[None, None, :] * k[:, None, None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def lift_distance(img):
    """Pull the hazed mountains and skyline back out of the haze.

    Contrast is expanded about each row's own mean rather than a fixed pivot, so
    the lift adds separation without shifting the band's overall tone away from
    the sky it has to sit in.
    """
    a = np.array(img).astype(np.float32)
    y = np.arange(img.height)
    k = np.clip((y - LIFT_FROM) / (LIFT_FULL - LIFT_FROM), 0, 1)
    k *= np.clip((LIFT_OUT - y) / (LIFT_OUT - LIFT_FULL), 0, 1)
    k = k[:, None, None]

    pivot = a.mean(axis=(1, 2), keepdims=True)
    a = pivot + (a - pivot) * (1 + LIFT_CONTRAST * k)
    grey = a.mean(axis=2, keepdims=True)
    a = grey + (a - grey) * (1 + LIFT_SAT * k)
    a *= 1 - LIFT_DARKEN * k
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def feather_top(img, rows, power=1.35):
    a = np.array(img.convert("RGBA"))
    alpha = a[:, :, 3].astype(float)
    ramp = np.clip(np.arange(img.height) / max(rows, 1), 0, 1) ** power
    a[:, :, 3] = (alpha * ramp[:, None]).astype(np.uint8)
    return Image.fromarray(a)


def mirror(img):
    out = Image.new(img.mode, (img.width * 2, img.height))
    out.paste(img, (0, 0))
    out.paste(img.transpose(Image.FLIP_LEFT_RIGHT), (img.width, 0))
    return out


def save(img, name, quality=88):
    path = f"{OUT}/{name}"
    img.save(path, "WEBP", quality=quality, method=6)
    print(f"{name:22s} {str(img.size):14s} {os.path.getsize(path):>8d} bytes")
    return img


def build(plate):
    w = plate.width

    far = feather_top(lift_distance(grade_sky(plate.crop((0, 0, w, FAR_BOT)))), FAR_FEATHER)
    far = far.resize((FAR_W, round(far.height * FAR_W / w)), Image.LANCZOS)
    save(far, "env-far.webp")

    trees = feather_top(plate.crop((0, TREE_TOP, w, PARAPET_BOT)), TREE_FEATHER)
    trees = trees.resize((FAR_W, round(trees.height * FAR_W / w)), Image.LANCZOS)
    save(mirror(trees), "env-trees.webp", 90)

    apron = plate.crop((0, PARAPET_BOT, w, plate.height))
    save(mirror(apron), "env-apron.webp", 90)

    flat = plate.copy()
    flat.paste(lift_distance(grade_sky(plate.crop((0, 0, w, FAR_BOT)))), (0, 0))
    scene = flat.resize((SCENE_W, round(flat.height * SCENE_W / w)), Image.LANCZOS)
    save(scene, "env-scene.webp", 86)


def sky(a):
    """A smooth ramp fitted to the plate's sky, sampled for both gradients.

    Fitted rather than sampled point by point: the hero and the pinned stage
    meet mid-sky, and approximating either side with a coarse ramp makes the
    slope jump where they join — the eye reads a change of slope as an edge even
    when the colour either side is identical to the byte.
    """
    ys = np.arange(0, SKY_FIT_TO)
    obs = np.array([row(a, y) for y in ys])
    fit = [np.polyfit(ys, obs[:, c], 2) for c in range(3)]
    resid = max(float(np.abs(np.polyval(fit[c], ys) - obs[:, c]).max()) for c in range(3))

    def at(y):
        return hexof([np.clip(np.polyval(fit[c], y), 0, 255) for c in range(3)])

    print(f"\nsky fit residual {resid:.1f}/255 max")

    top = np.array([int(at(0)[i:i + 2], 16) for i in (1, 3, 5)], float)
    brand = np.array([int(BRAND[i:i + 2], 16) for i in (1, 3, 5)], float)

    stage = [(round(y / SKY_FIT_TO * HORIZON, 1), at(y)) for y in SKY_STOPS]
    r = lambda h: int(h[1:3], 16)

    # The stage's sky ramps fast just under the handover. For the join to
    # disappear the hero's final slope has to match it, so the ease is solved
    # for rather than chosen: an accelerating ramp, which also keeps the hero
    # deep blue through the band where the navbar and its white heading sit and
    # only lightens in the last stretch.
    want = abs(r(stage[1][1]) - r(stage[0][1])) / ((stage[1][0] - stage[0][0]) / 100 * 900)
    d_red = top[0] - brand[0]

    def hero_at(t, e):
        return hexof(brand + (top - brand) * t ** e)

    def seg_slope(e):
        return abs(d_red * (1 - 0.8 ** e)) / (0.2 * HERO_PX)

    ease = min(np.arange(0.4, 4.0, 0.01), key=lambda e: abs(seg_slope(e) - want))
    print(f"hero ease solved: {ease:.2f}  (target slope {want:.3f} red/px)")

    hero = [(round(t * 100, 1), hero_at(t, ease)) for t in (0, 0.25, 0.5, 0.7, 0.85, 1.0)]

    print("export const HERO_STOPS =")
    print('  "' + ", ".join(f"{c} {p}%" for p, c in hero) + '"')
    print("export const SKY_STOPS =")
    print('  "' + ", ".join(f"{c} {p}%" for p, c in stage) + f', {stage[-1][1]} 100%"')
    print(f'export const SKY = "{at(0)}"')
    c = [int(at(0)[i:i + 2], 16) for i in (1, 3, 5)]
    print(f'export const SKY_RGB = "{c[0]}, {c[1]}, {c[2]}"')

    h1 = abs(r(hero[-1][1]) - r(hero[-2][1])) / ((hero[-1][0] - hero[-2][0]) / 100 * HERO_PX)
    s1 = abs(r(stage[1][1]) - r(stage[0][1])) / ((stage[1][0] - stage[0][0]) / 100 * 900)
    print(f"slope across the join: hero {h1:.3f} vs stage {s1:.3f} red/px"
          f"  (ratio {max(h1, s1) / max(min(h1, s1), 1e-6):.2f}, want < 1.3)")


def main():
    plate = Image.open(PLATE).convert("RGB")
    print(f"plate {plate.size}\n")
    build(plate)

    # The far band ends on row FAR_BOT but the treeline band ends on
    # PARAPET_BOT. Bottom-aligning both to the horizon would push the far band
    # down by the difference and bury the mountains behind the parapet, so the
    # far band is lifted by exactly that gap, expressed in vw because the band
    # is sized in vw and the offset has to scale with it.
    lift = (PARAPET_BOT - FAR_BOT) * FAR_SPAN_VW / plate.width
    print(f'\nexport const FAR_SPAN_VW = {FAR_SPAN_VW}')
    print(f'export const FAR_LIFT_VW = {lift:.2f}')
    sky(np.array(grade_sky(plate)).astype(float))


if __name__ == "__main__":
    main()
