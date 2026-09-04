#!/usr/bin/env python3
"""Turn coverage-raw.json into webp clippings + src/lib/coverage.ts."""
import fitz, json, os, re, unicodedata, collections, io
from PIL import Image

APP = "/Users/senthil/Claude/eurogrip-app"
OUT = f"{APP}/public/newsroom/coverage"
# Print clippings are read in the viewer, so they keep resolution. Online and
# social pieces only ever serve as a thumbnail — the article itself is a click
# away at the publisher — so they are stored small.
LONG_EDGE_PRINT = 1200
LONG_EDGE_WEB = 760
QUALITY = 72

SOCIAL = ("instagram", "facebook", "twitter", " x ", "youtube", "linkedin", "social")


def slug(s, n=44):
    s = unicodedata.normalize("NFKD", s or "")
    s = re.sub(r"[^\w\s-]", "", s).strip().lower()
    return re.sub(r"[\s_]+", "-", s)[:n].strip("-") or "item"


def kind_of(r):
    ed = (r["edition"] or "").lower()
    if any(k in ed for k in SOCIAL):
        return "social"
    if r["urls"]:
        return "online"
    return "print"


def clean_url(u):
    # the dockets append Google text fragments to every link
    return u.split("#:~:")[0].split("#")[0] if u else ""


def main():
    raw = json.load(open("coverage-raw.json"))

    # ---- dedupe: same article can appear in a monthly and a campaign docket ---
    def key(r):
        u = clean_url(r["urls"][0] if r["urls"] else "")
        if u:
            return ("u", u)
        return ("t", r["publication"].lower(),
                re.sub(r"\W+", "", r["headline"].lower())[:60], r["date"])

    best = {}
    for r in raw:
        k = key(r)
        prev = best.get(k)
        # keep the richest copy (most images), preferring a monthly docket
        if prev is None or (len(r["images"]), not r["consolidated"]) > (len(prev["images"]), not prev["consolidated"]):
            if prev is not None:
                r = dict(r)
                r["also_in"] = sorted(set(prev.get("also_in", []) + [prev["source"]]))
            best[k] = r
        else:
            prev.setdefault("also_in", [])
            if r["source"] not in prev["also_in"]:
                prev["also_in"].append(r["source"])
    items = sorted(best.values(), key=lambda r: (r["date"], r["publication"]), reverse=True)
    print(f"{len(raw)} raw -> {len(items)} unique")

    # ---- ids ----------------------------------------------------------------
    used = collections.Counter()
    docs = {}
    written = 0
    out = []
    for r in items:
        base = f"{r['date']}-{slug(r['publication'], 30)}"
        used[base] += 1
        iid = base if used[base] == 1 else f"{base}-{used[base]}"
        ym = r["date"][:7].replace("-", "/")

        path = r["src_path"]
        if path not in docs:
            docs[path] = fitz.open(path)
        doc = docs[path]

        imgs = []
        edge = LONG_EDGE_PRINT if kind_of(r) == "print" else LONG_EDGE_WEB
        for n, im in enumerate(r["images"], start=1):
            try:
                info = doc.extract_image(im["xref"])
            except Exception as e:
                print("  !! extract", iid, e)
                continue
            try:
                pic = Image.open(io.BytesIO(info["image"])).convert("RGB")
            except Exception as e:
                print("  !! open", iid, e)
                continue
            w, h = pic.size
            if max(w, h) > edge:
                s = edge / max(w, h)
                pic = pic.resize((round(w * s), round(h * s)), Image.LANCZOS)
            dest = f"{OUT}/{ym}/{iid}-{n:02d}.webp"
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            pic.save(dest, "WEBP", quality=QUALITY, method=5)
            imgs.append(f"/newsroom/coverage/{ym}/{iid}-{n:02d}.webp")
            written += 1

        if not imgs:
            continue

        out.append(dict(
            id=iid, date=r["date"], publication=r["publication"],
            headline=r["headline"], kind=kind_of(r),
            edition=r["edition"], pageNo=r["page_no"],
            url=clean_url(r["urls"][0]) if r["urls"] else "",
            images=imgs, group=r["group"], source=r["source"],
        ))
        if written % 150 == 0:
            print(f"  {written} images written", flush=True)

    json.dump(out, open("coverage-items.json", "w"), indent=1)
    by_year = collections.Counter(o["date"][:4] for o in out)
    kinds = collections.Counter(o["kind"] for o in out)
    print(f"--- {len(out)} items, {written} images")
    print("    years:", dict(sorted(by_year.items())), " kinds:", dict(kinds))


if __name__ == "__main__":
    main()
