# Products page — the horizontal journey

`/products` is the global range page. It lists no SKUs: what is on sale differs
market by market and the client runs regional sites for India, Europe and the
USA, so each category says what it covers and hands off.

## The journey

The five categories are one **cinematic horizontal journey** (client direction,
2026-09-07):

- **Fixed tabs at the top** name all five, jump straight to one, and carry a
  single underline that slides between labels — the movement itself shows which
  way the journey went — over a hairline that fills with overall progress.
- Vertical scroll drives a pinned 100vh stage sideways. Each category occupies
  one full viewport of travel.
- **Tyres on the left, story on the right** — the product is the tyre, not the
  vehicle.
- **One continuous landscape**, travelled through in four layers at four
  speeds.
- **Large typography**: the category number, then the title at up to 3.7rem,
  then one line of supporting copy.

The journey is one pinned 100vh stage, GSAP ScrollTrigger converting vertical
scroll into a horizontal travel through the five categories. One `ScrollTrigger`
with `pin`, `scrub: 1` and `invalidateOnRefresh`, built inside a `gsap.context`
so a single `ctx.revert()` on unmount kills the tweens, destroys the trigger,
removes the pin spacer and clears the inline transforms off the layers.
Verified: exactly one instance after mount, so React's double mount in
development leaves nothing behind.

`scrub: 1` is what supplies the inertia — the stage takes about a second to
catch the scrollbar, so a flicked trackpad glides rather than snapping. There is
deliberately **no smooth-scroll library**: feedback from the Rampur build was
that scroll-hijacking failed on a Mac trackpad, so scrolling itself stays native
and the tabs remain the explicit route through.

### The four layers

Depth is the spread between the rates, not any one of them. Each layer must also
be wide enough to cover the viewport *plus its own travel*, or it runs out
before the last category — `LAYER_W` computes that from `RATE`, and getting it
wrong is how an earlier pass left 260px of bare sky down the right-hand edge of
Supergrip.

| layer | contents | rate | width | measured at 1440x900 |
|---|---|---|---|---|
| far | sky, mountains, distant city | 0.10 | 150vw | −720px = 10.0% |
| trees | the treeline and the parapet | 0.22 | 220vw | −1584px = 22.0% |
| apron | the terrace | 0.65 | 435vw | −4680px = 65.0% |
| foreground | the tyres and their copy | 1.00 | 600vw | −7200px = 100.0% |

All three environment layers are bands of one photograph — see **Artwork**. The
far band also scales 1.00 → 1.05 across the whole journey, which is the slow
camera push.

**`ScrollTrigger.refresh()` is called synchronously** right after the timeline is
built, and again on `load`. Both matter. ScrollTrigger otherwise measures the
pin on its next tick, which leaves the section pinned with *no scroll distance
at all* until a frame has painted — and this route is code-split, so it mounts
long after the page did. The `load` pass is because every panel is full of
images that settle late and each one moves the document under the trigger.
Verified: start 534 (exactly where the hero ends), end 5034, spacer 5400 with
4500px of pin padding.

### Steps, not categories

A category is no longer one screen (client direction 2026-09-08: a longer
horizontal scroll, because each category has more to say). `STEPS` in
`lib/products.ts` flattens the categories into a list of screens, and everything
downstream counts steps rather than categories — the travel, the pin length, the
layer widths, and the tab mapping via `STEP_OF_CATEGORY` / `CATEGORY_OF_STEP`.

Every category runs two:

| step | shows |
|---|---|
| `hero` | the tyres, the name, and **what it covers** as vehicle cutouts with names |
| `detail` | **why it holds** — the three points on cards — and **original fitment**, the category's own `oem` marques |

Supergrip's `hero` shows **its own wordmark in place of a typeset heading**
(client direction): it is a separate brand with its own logo, so the logo *is*
the title, and `name` carries the accessible text. The published file is white
for their dark site, so `supergrip-wordmark.webp` is recoloured to the heading
navy — lossless, because the mark is flat white and the alpha channel carries
all of its distressed edge detail, so repainting the ink and keeping the alpha
loses nothing. Source SVG kept in `content/products/`.

Only two-wheeler carries an `oem` list, because the fitment marquee's nine
marques are all two-wheeler makers and the project holds no other manufacturer
logos. `StepDetail` omits the row when the list is empty.

**Do not populate `oem` by guesswork** — which manufacturer fits which category
as original equipment is a factual claim about the client's business. Checked
2026-09-08: tvseurogripoht.com publishes no OEM mention and no partner logos at
all, and tvssupergriptires.com states "Super Grip is a global OEM supplier" but
names no partners. So the relationships exist and are simply not public. The
logos and their category mapping are an **open item for the client**; dropping
names into a category's `oem` list is all the code needs.

Ten screens, so the journey is 9 viewports of travel where it was 4: pin spacer
9000px, verified start 534 and end 8634.

**A fade belongs at a category boundary, not between the screens of one
category** (client direction 2026-09-08: it has to be continuous content, the
transition should not be category to category). Fading one screen of a category
out while the next fades in reads as two separate things — which is exactly what
it looked like. So `enters` / `leaves` are computed from `CATEGORY_OF_STEP`, and
within a category the horizontal travel *is* the transition. Verified by driving
the timeline to the midpoint of the two-wheeler pair: both screens read opacity
1, and the only cross-fade left in the journey is at two-wheeler → three-wheeler.

**Text sits on cards; logos do not** (client direction 2026-09-08). The three
points and the six `fleet` vehicles are on white-at-55% backdrop-blur cards.
That is not decoration: over a photographic scene plain text is fine on sky and
unreadable on a treeline, which otherwise leaves the copy hostage to whatever
the parallax happens to have parked behind it. The **fitment logos carry no panel** and instead sit **on the parapet wall**
(client direction). That is the one clean, uniform surface in the scene —
measured off the plate, the wall runs 155 to 193 in luminance against the
mountains' 61 to 251 — so the whole row reads consistently there, which it never
did over the treeline. On the wall the marks come back down to 0.68 opacity
(4.0:1 against its darkest tenth) from the 0.75 the mountains needed.

`lg:pt-[5vh]` is what places them, not `pb`: with `items-center` a top inset
moves the block down by half of it. Verified the row's centre lands within 4px
of the wall's centre at 1440x900 (603 against 599) and within 4px at 1920x1000
(657 against 653), with the whole row inside the wall at both.

The label reads **"Original fitment partners"** rather than "Original fitment",
because the row is company logos and the label should name what you are looking
at.

There is **no CTA** on any journey screen — the page's three routes section
below it carries that.

Only the `hero` screen keeps the tyres-left / story-right split; `detail` goes
full width. Both sit **within the same container** — `max-w-[1340px]`, gutters
`lg:px-[5vw]`, measured 1296px at 1440x900 — and both are **vertically centred**,
because a screen that sat high against a neighbour that sat centred read as two
separate slabs during the travel between them, which is the opposite of
continuous. A wider measure was tried to close the dead band between adjacent
panels and rejected: it stretched both screens end to end for a gap that is only
ever the two panels' own margins meeting.

**`FAR_SPAN_VW` is derived from the step count, not fixed.** The far band is a
single unrepeated photograph, so how fast it can travel is limited by how much
of it is spare — it must be the viewport plus its own travel wide. Every screen
added lengthens the journey, so a fixed span quietly collapses the rate: at ten
screens 150vw would only sustain 5.6% against the brief's 10%. The span is
therefore `min(220, max(150, 100 + 0.10 x travel))`, which at ten screens is
190vw and holds the rate at exactly 0.100 — verified 10.0%.

What grows with it is the apparent size of the landscape: 190vw renders the
plate 27% larger than 150vw did. That is the honest trade for having one plate
— a longer journey shows it bigger — and it is capped at 220vw because past
that the plate is upscaled far enough to soften. `FAR_LIFT_VW` is derived from
the same span, since it is the same measurement in the same units.

`images_expand` cannot help here: it caps at 21:9 and the plate is already that
ratio, so there is no wider version of it to generate. The alternatives were both worse: mirroring the
band puts a flipped duplicate of the city in view near the end of the journey,
and widening it in place would scale the whole photograph up and undo the
composition. **If more screens are added, widen the source plate** (the plate is
generated, so `images_expand` can extend it) rather than letting the rate fall
further — the depth is the spread between the layers, and the far band is the
one holding the far end of it.

### Per category

Three stages, placed on the same scrubbed timeline at one time unit per
category, so category *i* sits at time *i*: the tyres arrive from the right
(`xPercent: 34`, `scale: .94`) and settle, the copy slides up beside them, then
both leave to the left. First category has no entrance and last has no exit.
Single cutouts also get a small rotation on the way in and out plus a slow
ambient drift; **line-ups get neither**, because a line-up is several tyres lit
as one composition with their shadows baked in, and tilting it would tilt every
shadow off its contact patch. The drift runs on the image rather than the
wrapper so it never fights the scrubbed transform.

Below 1024px, or under `prefers-reduced-motion`, **no ScrollTrigger is created
at all** — the panels stack and the tabs still work. Verified at 375px: 0
triggers, no pin spacer, 5 panels, no horizontal overflow.

Products is `React.lazy`-loaded in `App.tsx` because GSAP + ScrollTrigger is
around 136kB that no other route needs. Main bundle 791kB (246kB gzipped) with
the route in its own 136kB chunk; inlining GSAP put main at 928kB.

## Artwork

**The tyres are the client's own cutouts** — `tyre.webp`, `tyre-badshah`,
`tyre-toofan`, `tyre-hs1000`, `tyre-el09`, `tyre-mt63l`, all already RGBA with
alpha. Nothing generated.

**Two-wheeler uses a supplied line-up shot** — `lineup-two-wheeler.webp`, five
tyres staged and lit as one composition. Real product photography, so it beats
anything assembled from separate cutouts, and where a category has one the
`lineup` field takes precedence over `tyres`. Provenance and both intermediate
files are in `content/products/` (untracked); the processing is repeatable:

1. background off with Freepik/Magnific `images_remove_background` — it cleared
   the checkerboard floor, the navy backdrop and the banner type still in the
   top-left corner, and kept the wheel-spoke gaps and tread edges,
2. then `scripts/products/lineup_cutout.py <matte.png> <out.webp>`, which
   neutralises the red rim the floor left on the anti-aliased edge (815 px) and
   the blue rim the backdrop left (3,620 px), trims to the alpha box so the box
   bottom *is* the contact line, and bakes a ground shadow per tyre.

**Three-wheeler is staged from the client's own product cutouts** —
`lineup-three-wheeler.webp`, built from Badshah, Street King and Jaya. The
client's site publishes each pattern as a 1200px PNG with alpha already clean
(`assets/images/static-pages/{badshah,street-king,jaya}.png`), which is four
times the resolution of the banner those same three tyres appear in — so this
rebuilds the line-up from the originals instead of matting the banner:

    python3 scripts/products/lineup_stage.py out.webp badshah.png street-king.png jaya.png

First file is the front of the line-up, last is the back. Depth comes from four
things at once, because any one alone reads as a paste-up: scale (88.5% per step
back), a base line that rises 26px per step, 1.15px of blur per step, and a
touch of atmospheric lift. Each tyre gets its own contact shadow *before* it is
composited, so the tyre in front occludes the shadow of the one behind it.

The shadow is baked rather than done in CSS because the tyres stand at several
different depths: their contact patches are at several different heights, so one
CSS ellipse — or a mirrored-and-squashed copy of the whole image — would detach
from all but one of them. `shadow_mask` in `lineup_cutout.py` reads the
silhouette's lowest pixel per column, flattens that into a pool under each
contact patch, and lays a tight core blur over a broad ambient one. `TyreLineup`
therefore adds no shadow of its own; a `drop-shadow` on top would cast a second
shadow off the first.

`TyreLineup` caps the image at 76% of the column height. That cap is what keeps
tyres the same size from panel to panel: a five-tyre line-up is a wide
composition and fits by width, whereas a three-tyre one is nearly square and
would otherwise fill the column and render half again as large. Measured at
1440x900: two-wheeler 683x438, three-wheeler 615x406.

The client's site has no further individual cutouts to harvest — ultra-light
truck carries only `toofan.png`, which is the tyre we already use (though the
site's copy is 1200x1200 against our 410x620, so it is an available upgrade),
and there is no two-wheeler equivalent.

**The environment is one photograph, cut into four layers** (client direction,
2026-09-08, with a reference image: the platform and background looked
"pathetic"). Earlier passes generated the pieces separately and reassembled
them, and it looked exactly like what it was — individually defensible pieces
with no shared light and no shared perspective. This one takes a single
generated plate (Freepik/Magnific Seedream 5 Pro, 21:9: an empty plaza terrace
looking over a treeline to mountains and a hazy city) and cuts it along edges
that already exist in the picture. `scripts/products/build_environment.py` does
it; the source is in `content/products/` (untracked). **The plate is AI
generated — a placeholder, not photography, and must not be presented as such.**
Replace before launch.

| plate rows | contents | asset | rate |
|---|---|---|---|
| 0–905 | sky, mountains, distant city | `env-far.webp` | 0.10 |
| 872–1030 | the treeline and the parapet | `env-trees.webp` | 0.22 |
| 1030 | the parapet's base — the horizon | — | — |
| 1030–1296 | the terrace | `env-apron.webp` | 0.65 |

**The two upper bands need registering, not just bottom-aligning** (client
direction 2026-09-08: bring the mountains and buildings up so they read). They
are cut from the same plate but end on different rows of it — the far band at
the foot of the mountains (905), the treeline band at the parapet's base (1030).
Bottom-aligning both to `HORIZON` pushes the far band down by that 125-row gap
and buries the mountains and the whole city skyline behind the parapet: measured
0px of mountain visible above the treeline, and the faint ridge that showed was
only bleed through the treeline band's 26-row feathered top edge.

`FAR_LIFT_VW` corrects it — the gap expressed in vw, because the band is sized
in vw and the offset has to scale with it. `build_environment.py` prints the
value so the two cannot drift apart. Verified after: the far band's plate row
872 lands at 543px against the treeline band's top at 544px, and 66px of
mountain is visible above the treeline.

The mountains and skyline also get a **windowed contrast and saturation lift**
in the far band only (`lift_distance`), ramped in from row 690 and faded back
out by 878 — the treeline band that overlaps below is not lifted, and a mismatch
would show as a halo through its feathered edge. Contrast is expanded about each
row's own mean rather than a fixed pivot, so the lift adds separation without
shifting the band's tone away from the sky it sits in. The sky ramp is refit
after it and comes out unchanged to a decimal, so the hero handover is untouched.

**The parapet is what makes this work.** It is a real architectural edge running
the full width of the frame, so the seam between the landscape and the ground
plane falls where the eye already expects a hard line, and every layer keeps the
one photograph's light and haze. `HORIZON = 73` is that edge, and the far band,
the treeline and the apron all line up on it.

Every band renders at the same scale — the far band spans `FAR_SPAN_VW` (150vw)
and the mirrored treeline band is twice the asset width, so it spans 300vw at
that same scale — which is what keeps the photograph's proportions intact across
three layers moving at three speeds. **Do not size the treeline band from its
own travel.** Doing that rendered it at 0.81 against the far band's 1.11, which
put a second, 27%-undersized treeline below the one already inside the far band;
its width is fixed at `FAR_SPAN_VW * 2` and only has to be checked against the
travel it needs (100 + 0.22 x travel = 210vw, well inside 300vw). The apron is
a repeating background sized by its layer's *height*, so its scale is set that
way and its width really can follow the travel.

Verified at 1440x900: both bands at scale 0.831, and the far band's plate row
872 lands on the treeline band's top edge with **0px** misalignment. Widths
against what each needs: far 2160 vs 2160, trees 4320 vs 3024, apron 6264 vs
6120.
Mirroring is safe on foliage and paving, which carry no directional structure;
it is what failed on converging joints in an earlier pass, and the terrace band
is shallow enough here that its joints run close to horizontal.

**The sky is a CSS gradient**, not part of any image, because it is the one
thing that has to be continuous with the page hero above it — and a flat
vertical ramp looks identical when translated, so it needs no parallax layer.
The far band's top is feathered over 300 plate rows so it dissolves into it.

Both ramps come from one smooth quadratic fitted to the plate's own sky, and the
**hero's easing is solved, not chosen**, so its final slope matches the stage's
opening slope: measured 0.225 vs 0.222 red units per pixel. Matching the colour
at the join is not sufficient — an earlier pass had both sides ending on the
identical byte and still showed a band, because the eye reads a sudden change of
*slope* as an edge. The solved ease comes out accelerating, which conveniently
keeps the hero deep brand blue through the band where the navbar and its white
heading sit, only lightening in the last stretch.

The plate's own sky was flatter and paler than the reference, and impossible for
a blue hero to hand over to, so it is graded back toward brand blue — strongest
at the top of frame, gone by row 660 so the mountains are untouched.

One faint vignette sits over the scene and nothing else. An earlier pass carried
a white bloom to lift navy copy off a much darker blue sky; over this high-key
plate that bloom bleached the mountains and the terrace out of the picture.

Two approaches were tried and rejected before this, both worth not repeating.
Warping a photographed floor to a single vanishing point **over**-corrected it
(the joints bowed outward — the render carries lens curvature), and detecting
the joints per row to warp them onto a uniform grid shredded the image, because
the slabs are not laid at a uniform pitch. Synthesising the plane from a grain
patch failed too: the patch contained a joint, which smeared into diagonals.

A note on reviewing this in the Browser pane: it returns screenshots at 800x500,
so a 1440x900 stage comes back at 0.56 scale and the distant city, the parapet
line and the terrace joints all disappear into the downscale. Composite the
layers at true geometry and inspect a 1:1 crop instead, or the scene will look
far flatter than it is.



`SKY` in `lib/products.ts` is sampled from the plates (#a7cbf0); the hero
gradient above the journey ends on it so the two meet without a seam.

The brief asks for 2-4 tyres per category at varied angles. Two-wheeler has
three (the hero plus two rotation frames, so the angles genuinely differ) and
off-highway has two. **Three-wheeler, ultra-light truck and Supergrip still
have one each** — there simply are no more renders for them in the project.
`tyres: string[]` takes as many as arrive and the stage places, turns, blurs
and shadows them automatically.

An earlier pass generated placeholder *vehicle* line-ups; those were deleted
when the direction moved to tyres.

### The hero carousel

The hero's top right cycles the **five category line-ups**, one at a time,
through `PageHero`'s `aside` slot. `CategoryCarousel` in `components/site`; the
images are `slide` on each category in `lib/products`, so the set is data, not
markup. On a phone that slot stacks under the lede, which is why the slot was
used rather than an absolutely positioned decoration.

It also answers a note that had been open here: the headline reads "One
specialist. Five categories." and the hero used to show a single two-wheeler
pair. Now it shows all five.

**The motion.** Each slide enters from the left at zero opacity, settles at
centre, then carries on out to the right as it fades — and the next one starts
its entrance at the same moment, so the two cross rather than alternate. That
simultaneity is the effect the client asked for, and it is why this uses
`AnimatePresence` in **`sync`** mode; the default `wait` holds the incoming slide
until the outgoing one has finished and the hero sits empty between categories.
3.6s dwell, 1.15s cross-over, a long asymmetric ease so a slide is quick to
leave the edge and almost stopped by the time it reaches centre.

**Registration is what makes it look deliberate.**
`scripts/products/category_slides.py` keeps all five on the one shared 1672x941
canvas and centres each by its own content. The plates are not consistently
composed — measured, they sit up to 54px off centre vertically and 38px
horizontally — and without that step one slide arrives low or left and the
travel reads as a wobble rather than a slide. Trimming each plate to its own
bounding box, the obvious thing to do, would guarantee it.

**Two things it has to get right beyond looking nice.** Content that moves on its
own for more than five seconds needs a way to stop it (WCAG 2.2.2), so the ticks
are buttons: picking a category stops the rotation and stays put. And the ticks
are 6px tall because that is what looks right, so the button around each one is
padded out to a 27x29 target rather than the bar being enlarged (WCAG 2.5.8).
The interval also does not run while the document is hidden, and restarts on
`visibilitychange`.

The label deliberately has **no** `AnimatePresence`. In `wait` mode it holds the
incoming name until the outgoing one has left, so a stalled exit animation
strands the label on the wrong category permanently — which is exactly what
happened in the review pane. Remounting on the key animates the new name in and
needs no exit, so the worst case is a name that appears without a transition
rather than one that never appears.

The hero previously showed an Aprilia RS 457 and a TVS iQube, and before that a
six-vehicle line-up. Both plates and the scripts that cut them are documented
below, because the techniques are worth keeping; the sources are still in the
untracked `content/products/`.

### All five ranges now have a tyre line-up

`lineup-ult`, `lineup-off-highway`, `lineup-supergrip` and `lineup-three-wheeler`
all came from the client as clean cutouts and went through `lineup_cutout.py` —
defringe, trim and a baked navy contact shadow — so the journey's five hero
screens carry one treatment instead of two categories having staged line-ups and
three having a single tyre render.

Three-wheeler was rebuilt from the client's own `3 Wheeler tyre.png`, replacing a
version staged out of three separate product cutouts. Worth the swap for
consistency: the supplied plate is lit as one photograph, on the same white rims
and at the same angle as the ULT plate, where the staged one had the three tyres
receding at an angle and read as a different photographer.

**The bleed has to be a negative margin, not extra width.** The hero's grid is
`1.05fr 1fr`, so a wider image feeds back into the fr sizing, and widening it to
660px narrowed the copy column enough to rewrap the headline onto three lines.
`lg:w-[calc(100%+2rem)] lg:-mr-8` keeps the outer size at exactly one column and
reaches only into the container's own right padding, so nothing crosses the
viewport edge at any width. Measured with the two-wheeler pair: 590x324 at 1440,
570x313 at 1280 (right edge at 1267, inside the viewport), 335x184 stacked under
the copy at 375, no horizontal overflow at any of them. `max-w-none` is needed
too — Tailwind's preflight caps images at 100% and silently ignored the width
until it was there.

**The two-wheeler plate needed its shadow removed**, by
`scripts/products/blue_plate_cutout.py`. It arrives with a real alpha channel,
which looks like a finished cutout, but it was cut off a #5778AC background and
the drop shadow came with it **fully opaque** — #4C6388 over 9.7% of the frame,
one connected region, because the blue fringe along every edge joins it up. On
the hero's own blue that reads as a hard-edged lighter blob rather than a shadow.
Keying on brightness would have taken the bike's smoked windscreen with it,
since the two sit in the same range; the backdrop is one colour scaled up and
down by the shadow, so its channel *ratios* hold steady (r/b 0.56, g/b 0.73)
where a neutral dark plastic sits near r/b 0.75. Keying on distance from those
ratios leaves the windscreen alone. `lineup_cutout.defringe` then pulls the
blue blend off the edges — its `cold` branch exists for exactly this — and
`ground_shadow` re-bakes the contact shadow so this plate grounds like the rest.

#### The six-vehicle plate (superseded, technique worth keeping)

`scripts/products/dechecker_lineup.py` cut the earlier line-up. It *looked*
transparent but carried no alpha at all: the checkerboard was painted into the
pixels, and behind the vehicles sat an **opaque light ground plane** with their
shadows painted on it. Its own docstring carries the method; the four findings
worth keeping:

* **A white truck rules out every brightness threshold.** Its panels read 250
  against squares of 243 and 254, so any "how far from white" test deletes it.
  The checker is the way in, because it is known exactly and can be predicted
  per pixel — fitted from the sub-pixel zero crossings of a clean row and column
  to 22.3734 x 22.6711px. Fitting it to a tenth of a pixel is not enough: that
  drifts half a square across a 2035px plate and inverts the model down one side.
* **The model must be anti-aliased.** Predicting the square boundaries as hard
  steps leaves a one-pixel error grid over the whole frame, and that grid alone
  fences every square off from its neighbours and defeats a background flood
  fill — 92.7% of the frame came back as "subject" on the first attempt.
* **Flood filling and hole filling both backfire.** The ground plane walls the
  backdrop pockets — inside the tractor's canopy, between its wheels — off from
  the border, so treating "unreachable" as "subject" turns them opaque and the
  checker shows through. There is a screenshot's worth of evidence for this: the
  checker was plainly visible inside the canopy.
* **Ground plane versus grey bodywork is settled by shape and place, not tone.**
  The plane, its glow and the truck's cab all land in 227-255. Enclosure does not
  separate them either — measured, the four ground bands and the cab all sit at a
  rim ratio of 0.50-0.54, because a band running along the wheels touches as much
  structure as bodywork does. What separates them is that a ground plane is wide
  and shallow (aspect 3.5-10.1) and everything resting on it is below its top
  edge (row 528), while bodywork is compact (aspect 1.2) and above it.

The plate's shadows are discarded and re-baked with `lineup_cutout`'s
`ground_shadow`, so this line-up grounds the same way as the two tyre line-ups.

**Flagged to the client, and still open on the two-wheeler pair.** Both plates
are AI-generated rather than photography. The six-vehicle one carried
approximations of other manufacturers' trade dress — a green tractor in John
Deere's livery, a yellow backhoe in JCB's, a truck badged "ACE". The two-wheeler
pair is cleaner on that count, since the iQube is TVS's own product and Eurogrip
is genuinely OE on the RS 457, but it still renders Aprilia's badging and model
name from a generated image rather than Piaggio's press shot. That is a
trademark question rather than a rendering one, so it stays a placeholder until
the client confirms it or supplies the official photography.

## The review wall

The reviews sit **on the inside of a sphere with the copy standing still at its
centre**, and you **drag to turn it**. The "Made with Squarespace" pattern the
client referenced, arrived at over three passes; `ReviewWall` in
`components/site/ReviewCard.tsx`.

**You are inside the sphere, not outside it** (client correction) — and that
one fact drives every number here. `PERSPECTIVE` and `RADIUS` are equal, which
puts the eye exactly at the sphere's centre:

    scene  perspective: 900px
    world  translateZ(900px) rotateX(tilt) rotateY(turn)
    tile   rotateY(lon) rotateX(-lat) translateZ(-900px)

The `translateZ(900px)` on the world is what moves the sphere's centre onto the
eye. Every visible tile is then exactly `RADIUS` away, so they all render at
their CSS size — **that even sizing is the giveaway in the reference**, and it
is impossible from outside the ball, where near tiles are large and far ones
small. Each tile's `rotateY(lon)` is also where the skew comes from: a tile out
at 40 degrees is not randomly rotated, it is pointing back at you from the side
of the wall.

Three passes got this wrong before, all worth not repeating: columns drifting on
a marquee; a flat grid with an arbitrary angle per tile; and then the right
geometry with the eye *outside* the ball, looking at its convex face.

**Tiles are culled by longitude, and the arc is derived from the viewport.**
CSS projects on z alone, so a tile at angle *a* scales by `1/cos(a)` and lands
at `P·tan(a)`: by 78° that is a 6000px-wide element parked off-screen, and at
90° it is on the eye plane and infinite. So `paint()` hides anything past
`atan(halfWidth / PERSPECTIVE) + 12°` — 50.7° at 1440px, 66.9° at 2560px. Of
80 tiles, 22 survive the cull and 18 are actually on screen at 1440x900; before
the fix the widest rendered element was 6297px, after it 403px.

**Four rings, at latitudes chosen against the projection rather than by eye.**
A ring lands at `P·tan(lat)`, so `RINGS = [-22, -11, 11, 22]` puts the inner
pair 175px off centre and the outer pair 363px — measured back at 180 and 370,
the difference being that a tile out at longitude also projects further
vertically. That leaves a clear ±180px band through the middle for copy about
180px tall, and a 190px gap between the two rows on each side. No ring sits on
the equator, and the scene is `clamp(560px,90vh,860px)` tall on desktop so the
outer pair is fully in frame rather than clipped.

An earlier pass ran six rings at ±13/±26/±40. The ±40 pair never appeared at any
sensible viewport height — `900·tan(40°)` is 755px, past the half-height of even
an 860px scene — so it was paying for 48 tiles nobody could see, and the client
asked for four rows. Removing it is what let the remaining rows spread out.

**Card spacing comes from pitch against angular width, not from a gap value.**
A tile `TILE_W` wide at `RADIUS` subtends `2·atan(TILE_W/2 / RADIUS)`, and
`PER_RING` sets the pitch at `360/PER_RING`. At 220px and 24 per ring that was a
14° tile on a 15° pitch — a 1° gap, which is what read as cards touching. Now
180px and 20 per ring: an 11.5° tile on an 18° pitch, so the gap is 6.5°, 36% of
the pitch. Widening the pitch alone would have thinned the wall out; shrinking
the tile with it keeps the wall dense while separating the cards.

- **Drag to turn.** Horizontal unbounded — 1800px of drag gives
  `rotateY(396deg)`, so it goes all the way round and keeps going. Vertical
  clamped to ±14°, verified stopping exactly there; past that you are looking at
  the poles and the illusion goes.
- **Grab cursor everywhere except on a card**, which is what says the whole
  thing turns. Verified `grab` at rest, `grabbing` mid-drag via a
  `data-dragging` attribute, `grab` again on release; cards stay `pointer`.
- **A drag that ends on a card does not open it** — movement past 4px sets a
  flag the card's click checks.
- **Every card goes somewhere on click**: a film opens the lightbox, and the
  four cards without one route to `/reviews`, so nothing on the wall is inert.

**The drag must not use pointer capture.** `setPointerCapture` on the scene was
the reason clicking a card did nothing: capture retargets the eventual `click`
at the capturing element, so the card's own button never saw it — the pointer
events all arrived, which is why the drag worked and only the click was dead. The
drag now binds `pointermove`/`pointerup`/`pointercancel` on `window` for its
duration instead. That keeps a drag alive when the pointer leaves the section,
which is what capture was there for, without touching click delivery.
- **No autoplay.** Measured off the client's recording: frame-to-frame
  difference is 0.00 for the first 4.2s and the last 5.4s, all change confined
  to where the pointer was moving.
- The release **glide** is the only thing on a frame loop (velocity decaying at
  0.94). The drag writes the transform straight to the element so it tracks the
  finger exactly, and the cull runs in the same pass.

`touch-action: pan-y`, not `none`: the section is most of a phone screen, so a
vertical swipe has to keep scrolling the page past it while horizontal swipes
still reach the handler. Verified at 375x812 — 10 tiles survive the cull, 6 are
in frame, a tap opens the lightbox, and the document is exactly 375px wide so
nothing overflows. The scene is shorter on a phone, `clamp(420px,64vh,540px)`:
cards-across is only viewport width over card width, so 375px will show two
whatever the height, and the extra height bought nothing but scrolling past it.
Off entirely under `prefers-reduced-motion`.

The section is dark and sits directly above the dark `SiteFooter`, so it hands
over cleanly. That is also the reference's own answer to putting white copy over
imagery, and it is a deliberate departure from the light palette used elsewhere
on the page.

Reviewing this in the Browser pane needs two workarounds. The `Reveal` wrappers
are framer-motion `whileInView`, which never completes here, so the centred copy
sits at ~0.3 opacity and reads as a contrast bug — force them to `opacity: 1`
before judging it. And the pane's cursor actions do not emit `pointermove`, so
the drag looks dead: dispatch synthetic `PointerEvent`s with `clientX`/`clientY`
to exercise it, which is how the rotation figures above were measured.
