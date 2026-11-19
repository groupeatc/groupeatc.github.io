#!/usr/bin/env python3
"""Compose every photo gallery (.gallery-grid) from its own photos.

Each tile gets a role from the photo's orientation and resolution:
  feature (2x2) = best landscape photo in high definition (>= 1000 px),
  tall (1x2)    = portrait photo,
  wide (2x1)    = panorama,
  (none)        = 1x1.
Small photos never get a big tile; galleries without a high-definition
landscape have no feature tile. The order/roles are chosen so the 4-column
grid (CSS grid-auto-flow: dense) is a full rectangle with no holes; a second
pass flattens a few spans on mobile (2 columns) when needed (--m-flat).

Usage: python3 tools/compose-galleries.py
Re-run after adding or removing photos in a gallery (width/height attributes
on each <img> must be the real file dimensions)."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
import re, itertools, glob

COLS = 4
SPANS = {"": (1, 1), "feature": (2, 2), "tall": (1, 2), "wide": (2, 1)}

def simulate(spans):
    """CSS dense auto-placement; returns (rows_used, holes)."""
    grid = {}
    def free(r, c, w, h):
        return c + w <= COLS and all((r + y, c + x) not in grid for y in range(h) for x in range(w))
    for w, h in spans:
        r = 0
        while True:
            placed = False
            for c in range(COLS):
                if free(r, c, w, h):
                    for y in range(h):
                        for x in range(w):
                            grid[(r + y, c + x)] = 1
                    placed = True
                    break
            if placed:
                break
            r += 1
    rows = max(r for r, _ in grid) + 1
    return rows, rows * COLS - len(grid)

def classify(w, h):
    ratio = w / h
    hi = w >= 1000
    if ratio < 0.87:
        return "tall"
    if ratio >= 1.9 and hi:
        return "wide"
    return ""

def plan(items):
    import random
    n = len(items)
    def opts(i, allow_feature):
        w, h = items[i]["w"], items[i]["h"]; r = w / h
        o = []
        if r >= 0.87 or w < 500:
            o.append("")                       # square-ish crop is fine
        if r <= 1.4:
            o.append("tall")
        if (w >= 900 and r >= 1.2) or (w >= 540 and r >= 1.9):
            o.append("wide")
        if allow_feature and w >= 1000 and 0.95 <= r <= 2.1:
            o.append("feature")
        return o or [""]
    heads = [i for i, it in enumerate(items) if it["w"] >= 1000 and 0.95 <= it["w"] / it["h"] <= 2.1] or [None]
    rng = random.Random(7)
    best = None
    for f in heads[:4]:
        rest = [i for i in range(n) if i != f]
        hi_ok = f is not None
        perms = list(itertools.permutations(rest)) if len(rest) <= 6 else [tuple(rng.sample(rest, len(rest))) for _ in range(400)] + [tuple(rest)]
        for perm in perms[:720]:
            option_lists = [opts(i, hi_ok) for i in perm]
            for k, combo in enumerate(itertools.product(*option_lists)):
                if k > 300:
                    break
                if combo.count("feature") > 1:
                    continue
                roles = dict(zip(perm, combo))
                order = list(perm)
                if f is not None:
                    roles[f] = "feature"
                    order = [f, *perm]
                rows, holes = simulate([SPANS[roles[i]] for i in order])
                natural = sum(1 for i in perm if roles[i] != ("tall" if items[i]["w"] / items[i]["h"] < 0.87 else ""))
                moved = sum(1 for a, b in zip(perm, rest) if a != b)
                score = (holes, natural, moved, rows)
                if best is None or score < best[0]:
                    best = (score, order, [roles[i] for i in range(n)])
        if best and best[0][0] == 0 and best[0][1] == 0:
            break
    return best[1], best[2], best[0]

ITEM_RE = re.compile(r'(\s*)<a class="gallery-grid__item[^"]*"(.*?)</a>\n', re.S)
report = []
# Pages live at <slug>/index.html; only those with a gallery are touched.
for path in sorted(glob.glob(str(ROOT / "*/index.html"))):
    s = open(path, encoding="utf-8").read()
    if "syama-gallery" in s:  # portrait series, laid out by css/pages/syama.css
        continue
    m = re.search(r'(<div class="gallery-grid[^"]*">\n)(.*?)(\n?\s*</div>\n\s*</div>\n\s*</section>)', s, re.S)
    if not m:
        continue
    body = m.group(2)
    blocks = [b for b in ITEM_RE.finditer(body + ("\n" if not body.endswith("\n") else ""))]
    items = []
    for b in blocks:
        html = b.group(0)
        wh = re.search(r'<img[^>]*width="(\d+)" height="(\d+)"', html)
        items.append({"w": int(wh.group(1)), "h": int(wh.group(2)), "html": html})
    if len(items) < 2:
        continue
    order, roles, score = plan(items)
    out = []
    for i in order:
        html = items[i]["html"]
        cls = "gallery-grid__item" + (f" gallery-grid__item--{roles[i]}" if roles[i] else "")
        html = re.sub(r'<a class="gallery-grid__item[^"]*"', f'<a class="{cls} js-reveal"', html, count=1)
        html = html.replace(" js-reveal js-reveal", " js-reveal")
        out.append(html if html.startswith("          ") else "          " + html.lstrip())
    new_open = re.sub(r'class="gallery-grid[^"]*"', 'class="gallery-grid gallery-grid--composed"', m.group(1))
    s = s[:m.start()] + new_open + "".join(out).rstrip("\n") + m.group(3) + s[m.end():]
    open(path, "w", encoding="utf-8").write(s)
    report.append((path.replace(str(ROOT) + "/", ""), len(items), score, [roles[i] or "·" for i in order]))
for r in report:
    print(f"{r[0]:48} n={r[1]:2} holes={r[2][0]} changes={r[2][1]} rows={r[2][2]}  {' '.join(r[3])}")


# ----- Mobile pass (2 columns) ----------------------------------------------

def simulate_cols(spans, cols):
    grid = set()
    for w, h in spans:
        w = min(w, cols); r = 0
        while True:
            ok = False
            for c in range(cols):
                if c + w <= cols and all((r + y, c + x) not in grid for y in range(h) for x in range(w)):
                    grid |= {(r + y, c + x) for y in range(h) for x in range(w)}; ok = True; break
            if ok: break
            r += 1
    rows = max(r for r, _ in grid) + 1
    return rows * cols - len(grid)

for path in sorted(glob.glob(str(ROOT / "*/index.html"))):
    s = open(path, encoding="utf-8").read()
    m = re.search(r'<div class="gallery-grid gallery-grid--composed">(.*?)\n\s*</div>\n\s*</div>\n\s*</section>', s, re.S)
    if not m:
        continue
    body = m.group(1).replace(" gallery-grid__item--m-flat", "")
    roles = [c[1] for c in re.findall(r'<a class="gallery-grid__item( gallery-grid__item--(\w+))?', body)]
    flat = ()
    if simulate_cols([SPANS[r] for r in roles], 2):
        idx = [i for i, r in enumerate(roles) if r]
        for k in range(1, len(idx) + 1):
            hit = next((sub for sub in itertools.combinations(idx, k)
                        if simulate_cols([SPANS["" if i in sub else r] for i, r in enumerate(roles)], 2) == 0), None)
            if hit:
                flat = hit
                break
    counter = [-1]
    def mark(mm):
        counter[0] += 1
        return mm.group(0) + (" gallery-grid__item--m-flat" if counter[0] in flat else "")
    body = re.sub(r'<a class="gallery-grid__item(?: gallery-grid__item--\w+)?', mark, body)
    open(path, "w", encoding="utf-8").write(s[:m.start(1)] + body + s[m.end(1):])
