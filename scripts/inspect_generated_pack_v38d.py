from __future__ import annotations

import base64
import re
from pathlib import Path

from PIL import Image, ImageDraw
import pillow_avif  # noqa: F401

ROOT = Path(__file__).resolve().parents[1]
CHUNK_DIR = ROOT / "assets-v37"
OUT = ROOT / "pack-v38d-output"
OUT.mkdir(exist_ok=True)

byte_chunks: list[bytes] = []
metadata: list[str] = []
for path in sorted(CHUNK_DIR.glob("c*.js")):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"\+'([^']*)'\s*;?\s*$", text)
    if not match:
        raise RuntimeError(f"Could not parse chunk: {path}")
    encoded = match.group(1)
    decoded = base64.b64decode(encoded)
    byte_chunks.append(decoded)
    metadata.append(f"{path.name}: base64={len(encoded)} bytes={len(decoded)}")

if not byte_chunks:
    raise RuntimeError("No generated image chunks found")

raw = b"".join(byte_chunks)
(OUT / "chunk-report.txt").write_text("\n".join(metadata) + f"\nTOTAL={len(raw)}\n", encoding="utf-8")
source = OUT / "generated-pack.avif"
source.write_bytes(raw)

with Image.open(source) as im:
    im.load()
    report = f"PACK_SIZE={im.width}x{im.height}\nPACK_MODE={im.mode}\n"
    (OUT / "image-report.txt").write_text(report, encoding="utf-8")
    print(report)
    rgb = im.convert("RGB")
    rgb.save(OUT / "generated-pack.jpg", quality=94, optimize=True, progressive=True)

    preview = rgb.copy()
    draw = ImageDraw.Draw(preview)
    for cols, rows, color in [(2, 2, "red"), (4, 2, "lime"), (4, 3, "cyan")]:
        for c in range(1, cols):
            x = round(preview.width * c / cols)
            draw.line((x, 0, x, preview.height), fill=color, width=max(2, preview.width // 500))
        for r in range(1, rows):
            y = round(preview.height * r / rows)
            draw.line((0, y, preview.width, y), fill=color, width=max(2, preview.width // 500))
    preview.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
    preview.save(OUT / "generated-pack-grid-preview.jpg", quality=92, optimize=True)
