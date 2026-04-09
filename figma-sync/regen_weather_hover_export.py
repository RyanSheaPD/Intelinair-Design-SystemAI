#!/usr/bin/env python3
"""Regenerate pages/weather-hover-states-export.html from data/weather-hover-states.json."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    with open(ROOT / "data/weather-hover-states.json", encoding="utf-8") as f:
        data = json.load(f)
    states = data["states"]

    toc_items = []
    sections = []
    for i, s in enumerate(states, 1):
        label = html.escape(s["label"])
        q = s["query"].replace("&", "&amp;")
        sid = html.escape(s.get("id", ""))
        toc_items.append(f'      <li><a href="#state-{i:02d}">{i:02d}. {label}</a></li>')
        sections.append(
            f'''    <section class="hover-export-slab" id="state-{i:02d}" data-state-id="{sid}">
      <header class="hover-export-slab__head">
        <span class="hover-export-slab__num">{i:02d}</span>
        <h2 class="hover-export-slab__title">{label}</h2>
        <code class="hover-export-slab__query">agmri-weather.html?{q}</code>
      </header>
      <div class="hover-export-slab__frame">
        <iframe title="{label}" loading="lazy" src="agmri-weather.html?{q}"></iframe>
      </div>
    </section>'''
        )

    toc = "\n".join(toc_items)
    body_sections = "\n\n".join(sections)

    out_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AgMRI Weather — hover states export</title>
  <link rel="stylesheet" href="../design-tokens/tokens.css" />
  <link rel="stylesheet" href="css/weather-hover-states-export.css" />
</head>
<body>
  <div class="hover-export-doc">
    <h1 class="hover-export-doc__title">AgMRI Weather — hover states (export document)</h1>
    <p class="hover-export-doc__lede">
      Each block embeds the live weather page with a frozen hover visual (<code>figmaHover</code>).
      Use this page for PDF print, long-scroll screenshots, or HTML→Design capture of the whole document.
    </p>
    <p class="hover-export-doc__note">
      <strong>Serve over HTTP</strong> (e.g. <code>python3 -m http.server</code> from the repo root), then open
      <code>pages/weather-hover-states-export.html</code>. Iframes will not load from <code>file://</code>.
      Manifest: <code>data/weather-hover-states.json</code> · frozen styles: <code>pages/css/weather-hover-export.css</code>
      (loaded by <code>agmri-weather.html</code>). Regenerate this file after editing the manifest:
      <code>python3 figma-sync/regen_weather_hover_export.py</code>
    </p>

    <nav class="hover-export-toc" aria-label="Hover states">
      <h2>Contents</h2>
      <ol>
{toc}
      </ol>
    </nav>

    <main>
{body_sections}
    </main>
  </div>
</body>
</html>
'''

    path = ROOT / "pages/weather-hover-states-export.html"
    path.write_text(out_html, encoding="utf-8")
    print("Wrote", path)


if __name__ == "__main__":
    main()
