from __future__ import annotations

import re
import string
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "pack-v38f-output"
OUT.mkdir(exist_ok=True)
allowed = set(string.ascii_letters + string.digits + "+/=_-")
lines: list[str] = []
for path in sorted((ROOT / "assets-v37").glob("c*.js")):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"\+'([^']*)'\s*;?\s*$", text)
    if not match:
        lines.append(f"{path.name}: PARSE_FAIL len={len(text)} tail={text[-120:]!r}")
        continue
    chunk = match.group(1)
    invalid = [(i, ch, ord(ch)) for i, ch in enumerate(chunk) if ch not in allowed]
    lines.append(f"{path.name}: chars={len(chunk)} equals={chunk.count('=')} invalid={len(invalid)}")
    for i, ch, code in invalid[:30]:
        lines.append(f"  at {i}: {ch!r} code={code} context={chunk[max(0,i-20):i+21]!r}")
(OUT / "diagnostic.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(lines))
