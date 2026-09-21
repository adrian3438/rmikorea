#!/usr/bin/env python3
"""Regenerate app/favicon.ico from the RMI wordmark.

Needs Pillow, which is not a project dependency — this runs by hand when the logo
changes, not as part of the build:

    python3 -m venv /tmp/venv && /tmp/venv/bin/pip install Pillow
    /tmp/venv/bin/python scripts/make-favicon.py

The logo is 1287x551, far wider than a square icon slot, so it is scaled to fit and
centred on a transparent square canvas rather than squashed. The tradeoff is known
and deliberate: at 32px and up the wordmark reads, at 16px it is a red smudge.
Cropping to the "R" alone would stay legible at 16px if that is ever preferred.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public/img/rmi-logo.png"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "app/favicon.ico"

SIZES = [16, 32, 48, 64, 128, 256]
MARGIN = 0.06  # fraction of the canvas left empty on each side

src = Image.open(SRC).convert("RGBA")
# Trim transparent borders first, so the margin is measured from the ink itself
# rather than from whatever padding the source file happens to carry.
bbox = src.getbbox()
if bbox:
    src = src.crop(bbox)

frames = []
for n in SIZES:
    inner = max(1, int(round(n * (1 - 2 * MARGIN))))
    scale = min(inner / src.width, inner / src.height)
    w = max(1, int(round(src.width * scale)))
    h = max(1, int(round(src.height * scale)))
    mark = src.resize((w, h), Image.LANCZOS)

    canvas = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    canvas.paste(mark, ((n - w) // 2, (n - h) // 2), mark)
    frames.append(canvas)

# Pillow's ICO writer drops any requested size larger than the base image, so the
# largest frame has to be the one passed to save(); the rest ride along as
# append_images, each rendered at its own size rather than downscaled from 256.
frames.sort(key=lambda f: f.width, reverse=True)
frames[0].save(
    OUT,
    format="ICO",
    sizes=[(f.width, f.height) for f in frames],
    append_images=frames[1:],
)
print(f"wrote {OUT} ({', '.join(f'{n}x{n}' for n in SIZES)})")
