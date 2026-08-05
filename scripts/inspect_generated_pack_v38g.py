from __future__ import annotations

import base64
import re
from pathlib import Path

from PIL import Image, ImageDraw
import pillow_avif  # noqa: F401

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "pack-v38g-output"
OUT.mkdir(exist_ok=True)

chunks: list[str] = []
for path in sorted((ROOT / "assets-v37").glob("c*.js")):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"\+'([^']*)'\s*;?\s*$", text)
    if not match:
        raise RuntimeError(f"Could not parse {path}")
    chunks.append(match.group(1))

segments = "".join(chunks).split("|")
report: list[str] = [f"SEGMENTS={len(segments)}"]
for index, segment in enumerate(segments, start=1):
    segment = segment.strip()
    segment += "=" * ((4 - len(segment) % 4) % 4)
    raw = base64.b64decode(segment, validate=True)
    source = OUT / f"generated-{index}.avif"
    source.write_bytes(raw)
    with Image.open(source) as im:
        im.load()
        report.append(f"IMAGE_{index}={im.width}x{im.height} mode={im.mode} bytes={len(raw)}")
        rgb = im.convert("RGB")
        rgb.save(OUT / f"generated-{index}.jpg", quality=95, optimize=True, progressive=True)
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
        preview.save(OUT / f"generated-{index}-grid.jpg", quality=92, optimize=True)

(OUT / "report.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
print("\n".join(report))
