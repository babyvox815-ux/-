from __future__ import annotations

import base64
import re
from pathlib import Path

from PIL import Image
import pillow_avif  # noqa: F401

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "pack-v38h-output"
OUT.mkdir(exist_ok=True)

chunks: list[str] = []
for path in sorted((ROOT / "assets-v37").glob("c*.js")):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"\+'([^']*)'\s*;?\s*$", text)
    if not match:
        raise RuntimeError(f"Could not parse {path}")
    chunks.append(match.group(1))

segments = "".join(chunks).split("|")
report = [f"SEGMENTS={len(segments)}"]
for index, segment in enumerate(segments, 1):
    clean = segment.strip().rstrip("=")
    clean += "=" * ((4 - len(clean) % 4) % 4)
    raw = base64.b64decode(clean, validate=True)
    source = OUT / f"generated-{index}.avif"
    source.write_bytes(raw)
    with Image.open(source) as im:
        im.load()
        report.append(f"IMAGE_{index}={im.width}x{im.height} mode={im.mode} bytes={len(raw)}")
        rgb = im.convert("RGB")
        rgb.save(OUT / f"generated-{index}.jpg", quality=95, optimize=True, progressive=True)
        preview = rgb.copy()
        preview.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
        preview.save(OUT / f"generated-{index}-preview.jpg", quality=93, optimize=True)
(OUT / "report.txt").write_text("\n".join(report)+"\n", encoding="utf-8")
print("\n".join(report))
