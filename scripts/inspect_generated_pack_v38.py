from __future__ import annotations

import base64
import re
from pathlib import Path

from PIL import Image, ImageDraw
import pillow_avif  # noqa: F401

ROOT = Path(__file__).resolve().parents[1]
CHUNK_DIR = ROOT / "assets-v37"
OUT = ROOT / "pack-v38-output"
OUT.mkdir(exist_ok=True)

chunks: list[str] = []
for path in sorted(CHUNK_DIR.glob("c*.js")):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"\+'([^']*)'\s*;?\s*$", text)
    if not match:
        raise RuntimeError(f"Could not parse chunk: {path}")
    chunks.append(match.group(1))

if not chunks:
    raise RuntimeError("No generated image chunks found")

raw = base64.b64decode("".join(chunks), validate=True)
source = OUT / "generated-pack.avif"
source.write_bytes(raw)

with Image.open(source) as im:
    im.load()
    print(f"PACK_SIZE={im.width}x{im.height}")
    print(f"PACK_MODE={im.mode}")
    rgb = im.convert("RGB")
    rgb.save(OUT / "generated-pack.jpg", quality=94, optimize=True, progressive=True)

    preview = rgb.copy()
    draw = ImageDraw.Draw(preview)
    # Draw candidate grids to make the source composition easy to inspect.
    for cols, rows, color in [(2, 2, "red"), (4, 2, "lime"), (4, 3, "cyan")]:
        for c in range(1, cols):
            x = round(preview.width * c / cols)
            draw.line((x, 0, x, preview.height), fill=color, width=max(2, preview.width // 500))
        for r in range(1, rows):
            y = round(preview.height * r / rows)
            draw.line((0, y, preview.width, y), fill=color, width=max(2, preview.width // 500))
    preview.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
    preview.save(OUT / "generated-pack-grid-preview.jpg", quality=92, optimize=True)
