#!/usr/bin/env python3
"""
Encode the client's master films down to web banners, and cut a poster for each.

The masters live in the (gitignored) dump and are nowhere near shippable:
"Video banner V5.mp4" is 1920x1080 at 15.6 Mbps, 53s, 104MB, and "Tyre
closeup.mp4" is the same bitrate over 13.5s, 26MB. Both carry an AAC track that
is pure weight on a muted banner.

Settings, and why:

* **1600px wide, preset slow, CRF per film.** Width was checked rather than
  assumed: at 1280 the fine knurling on a "BEE WILD" sidewall mushes, and the
  hero is scaled 1.16x by the scroll transform on top of being full-bleed, so it
  needs the pixels. The 53s banner gets CRF 33, which is indistinguishable from
  the master at 1:1 on that same detail frame and lands at 10.8MB - parity with
  the 10MB file it replaces. The 13s closeup stays at CRF 30 because it is all
  tread detail and only costs 3MB either way.
* **`-an`.** The audio is stripped, not muted. A banner has to be muted anyway
  for browsers to autoplay it, so the track is dead weight.
* **`-movflags +faststart`.** Moves the moov atom to the front so the browser can
  start playing before the whole file is down. Without it a hero video is a
  blank rectangle until the last byte lands.
* **yuv420p.** Safari will refuse to decode 4:2:2 or 4:4:4 H.264 in a `<video>`.
* **A poster from the film's own first frame.** Not a nicer frame from further in
  — the poster is what sits there until playback starts, so it has to be the
  frame playback starts on, or the hero visibly jumps.

ffmpeg comes from the `ffmpeg-static` npm package; there is no system ffmpeg on
this machine.

Usage:  python3 scripts/media/web_video.py
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

MEDIA = Path("content/Corporate Media")

# slug -> (master, video out, poster out, poster timestamp, crf)
JOBS = [
    ("homepage banner", MEDIA / "Video banner V5.mp4",
     Path("public/hero-banner.mp4"), Path("public/hero-banner-poster.webp"), 0.1, "33"),
    ("technology hero", MEDIA / "Tyre closeup.mp4",
     Path("public/tech-hero.mp4"), Path("public/tech-hero-poster.webp"), 0.1, "30"),
    # The exploded-tyre build on the homepage. This one's "master" is the file
    # that used to ship: 1440x1440 at 12.9 Mbps plus a 316 kbps audio track, for
    # 12.8MB of an 8s clip rendered in a card about 320px wide. At 1080px CRF 28
    # it is 1.16MB and indistinguishable from it — checked on the spoke
    # gradients, which are what would band first. The master is kept in the
    # gitignored dump rather than the repo so this stays re-runnable.
    ("homepage tyre build", MEDIA / "tech-banner-master.mp4",
     Path("src/assets/tech-banner.mp4"), None, 0.1, "28"),
]

WIDTH = 1600
NARROW = {"homepage tyre build": 1080}   # square source, rendered in a ~320px card


def ffmpeg_bin() -> str:
    out = subprocess.run(["node", "-p", "require('ffmpeg-static')"],
                         capture_output=True, text=True)
    path = out.stdout.strip()
    if out.returncode or not path or not Path(path).exists():
        sys.exit("ffmpeg-static not installed — run: npm install --save-dev ffmpeg-static")
    return path


def mb(p: Path) -> float:
    return p.stat().st_size / 1_048_576


def main() -> None:
    ff = ffmpeg_bin()

    for name, src, out, poster, at, crf in JOBS:
        if not src.exists():
            print(f"  MISSING {src}")
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        print(f"  {name}: {src.name} ({mb(src):.0f}MB master)")

        subprocess.run([
            ff, "-y", "-v", "error", "-i", str(src),
            "-vf", f"scale={NARROW.get(name, WIDTH)}:-2",
            "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
            "-crf", crf, "-preset", "slow",
            "-an",
            "-movflags", "+faststart",
            str(out),
        ], check=True)
        print(f"      -> {out}  {mb(out):.1f}MB")

        if poster is None:
            continue
        subprocess.run([
            ff, "-y", "-v", "error", "-ss", str(at), "-i", str(src),
            "-frames:v", "1", "-vf", f"scale={WIDTH}:-2",
            "-quality", "80", str(poster),
        ], check=True)
        print(f"      -> {poster}  {poster.stat().st_size // 1024}kB")


if __name__ == "__main__":
    main()
