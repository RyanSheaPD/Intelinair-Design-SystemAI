# Intelinair Design System

**Overview & index:** [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)

Design system based on the **Variable Design System (test)** from Figma.

**Figma source:** [Variable Design System (test)](https://www.figma.com/design/0njyFuWX2qzunGeGrKHyHi/Variable-Design-System--test-?m=dev)

**Accessibility:** We target **WCAG 2.1 Level AA** for contrast and legibility. Exceptions are allowed when needed (e.g. tertiary or decorative UI) but should be documented and kept limited. See **design-tokens/README.md** for contrast tokens and guidance.

## Colors — brands

Brand colors are referred to by **brand name** then **color**. Examples:

- **MyFS Red**
- **PB Blue**
- **Argtrinsic Green** (shortened to **AG Green**)

## Structure

- **design-tokens/** – Design variables and tokens (colors, spacing, typography, etc.). Add your Figma exports here or paste them in chat for implementation.
- **components/** – Reusable UI (buttons, inputs, nav, filter pills, dropdowns, menus, modals, tabs, field cards, etc.).
- **index.html** – Visual design system: **System core** (how layers fit together), brands, components, icons, and **Example layouts**. Includes Legends and Charts.
- **pages/** – Product-area screens under `pages/<area>/` (e.g. `fields`, `weather`, `trials`, `yield`). App shell starter: `pages/_template.html`.
- **docs/cards.md** – Card and modal rules and callouts (radius, actions, tags). **docs/field-cards-design-system-instances.md** – Field card instances checklist for the design system.
- **docs/system-voice.md** – Voice and tone for UI strings; canonical copy for edge cases (e.g. MiTrials single zone).

## Legends and Charts

Map and chart legends used in Scouting View, analytics, and dashboard:

| Component | Location | Used In |
|-----------|----------|---------|
| TilesetLegendsComponent | map/components/tileset-legends/ | Retailer scouting, analytics, compare mode |
| LegendChartComponent | shared/components/legend-chart/ | Inside TilesetLegends (Canvas/Chart.js) |
| EmergenceLegendComponent | shared/components/emergence-legend/ | Dashboard map, compare mode |
| BadgeLegendComponent | shared/components/badge-legend/ | Dashboard map (badge selected) |
| WeatherLegendComponent | retailer/…/weather-legend/ | Retailer weather map view |

- **Tileset Legend:** Primary legend for NDVI, yield loss, soil, carbon overlays; Chart.js bar/line with percent/area switcher; glass-morphism panel at top:215px, left:15px over map (`backdrop-filter: blur(25px)`).
- **CIR / Disease / Thermal / NDVI:** Vertical color gradients with Low/High or Max/Mean/Min (hardcoded ranges).
- **Emergence Legend:** Color swatches with percent ranges and acreage (when flight provider is Emergence).
- **Badge Legend:** Color + label + value + unit for HeatSeeker, Precipitation, WeedWatch, RowTracer, YieldRisk.
- **Weather Legend:** Horizontal gradient bar with value labels and metric dropdown (Temperature, Clouds, Precipitation, etc.).
- **Disease badge icons (tabs only):** Use in tab icons for disease views. All: `https://intelinair-misc.s3.amazonaws.com/common/icons/disease_badges/all.svg`. Corn/soy PNGs: base `https://static.intelinair.com/disease_badges/` — `corn_blight.png`, `corn_gls.png`, `corn_sorust.png`, `corn_tarspot.png`, `soy_fls.png`, `soy_targetspot.png`

## Figma MCP

To push this design system into Figma using the Figma MCP (configured at `http://127.0.0.1:3845`), see **docs/figma-mcp.md** for steps (serve the repo, open the design system in the browser, then use the MCP/capture flow from Cursor or Figma).

## Next steps

1. Export Variables and Tokens from Figma (Dev Mode or a tokens plugin).
2. Share them here (paste in chat or add files under `design-tokens/`).
3. Tokens will be implemented as CSS variables and integrated into the design system.
