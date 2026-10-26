#!/usr/bin/env python3
"""Start a film project from the engine template.

  python new_film.py films/coffee-app-explainer

Creates the folder with engine.js, engine.css, composition.html (the starter
explainer), brief.md and an assets/ folder. Edit composition.html from there.
"""
import shutil, sys
from pathlib import Path

ENGINE = Path(__file__).resolve().parent.parent / "engine"

BRIEF = """# Director's brief

## Film in one line
<logline: what the viewer must remember>

## Facts (cannot be invented)
- Product / topic:
- Real assets (logo, screenshots, URLs):
- Claims and numbers allowed on screen:

## Choices (the studio may propose)
- Style id (references/styles.md):
- Aspect ratio(s):
- Duration:
- Palette: bg / surface / ink / accent
- Fonts:
- Music mood + BPM:
- Voiceover: yes/no, voice, words-per-second budget

## Unacceptable
- e.g. fake UI standing in for the real product, centered-text-on-gradient defaults

## Beat sheet (entry state -> exit state -> why it exists)
| # | time | viewer knows | on screen | transition out | sound |
|---|------|--------------|-----------|----------------|-------|
"""


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    dst = Path(sys.argv[1])
    dst.mkdir(parents=True, exist_ok=True)
    for f in ("engine.js", "engine.css", "composition.html"):
        target = dst / f
        if target.exists() and f == "composition.html":
            print("keeping existing", target)
            continue
        shutil.copy2(ENGINE / f, target)
    (dst / "assets").mkdir(exist_ok=True)
    if not (dst / "brief.md").exists():
        (dst / "brief.md").write_text(BRIEF, encoding="utf-8")
    print(f"film project ready: {dst.resolve()}")


if __name__ == "__main__":
    main()
