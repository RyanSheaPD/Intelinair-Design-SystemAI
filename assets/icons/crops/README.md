# `assets/icons/crops/`

Shared **crop** glyphs and **field map / flight strip** activity icons (retailer `mat-icon` parity). Use these files as the canonical source for Figma, exports, and `<svg><use href="…#icon"/></svg>` in static pages.

## Crop column

| File | Notes |
|------|--------|
| [`soybean.svg`](soybean.svg) | Soybean crop glyph. See `docs/scout-list-table-pills-crop-icons.md`. |
| [`hay.svg`](hay.svg) | Hay crop glyph (`viewBox="0 0 24 24"`, `fill="currentColor"`). |
| [`alfalfa.svg`](alfalfa.svg) | Alfalfa crop glyph (`viewBox="0 0 18 24"`, clipped group `id="ag-crop-alfalfa"`, `fill="currentColor"`). |
| [`canola.svg`](canola.svg) | Canola crop glyph (`viewBox="0 0 22 22"`, `id="ag-crop-canola"`, `fill="currentColor"`). |
| [`cotton.svg`](cotton.svg) | Cotton crop glyph (`viewBox="0 0 22 22"`, `id="ag-crop-cotton"`, `fill="currentColor"`). |
| [`barley.svg`](barley.svg) | Barley crop glyph (`viewBox="0 0 22 22"`, `id="ag-crop-barley"`, `fill="currentColor"`). Currently same path as `cotton.svg`; replace with distinct barley art when available. |
| [`oats.svg`](oats.svg) | Oats crop glyph (tight `viewBox`, `id="ag-crop-oats"`, `fill="currentColor"`). |

## Field map flight chicklets (`flight-element`)

Each root `<svg>` has **`id="icon"`** for reuse (sprites, design tools). Paths use **`fill="currentColor"`**; set **`color`** on `.provider-icon` (see `components/field-map-flight-strip.css`).

**Field view page** (`pages/scout/field-view-screen.html`) inlines this artwork (with HTML comments pointing here) so chicklets work under `file://` and all browsers. After changing a file below, update the matching inline block in that HTML.

| File | `mat-icon` / class token |
|------|---------------------------|
| [`equipment-tillage.svg`](equipment-tillage.svg) | `Equipment_Tillage` |
| [`flight-main.svg`](flight-main.svg) | `Main` |
| [`equipment-planter.svg`](equipment-planter.svg) | `Equipment_Planter` |
| [`equipment-spray.svg`](equipment-spray.svg) | `Equipment_Application` |
| [`scouting-flight.svg`](scouting-flight.svg) | `Scouting` |
| [`equipment-harvest.svg`](equipment-harvest.svg) | `Equipment_Harvest` (partial; extend with remaining paths for full combine art) |

### Local preview

External SVG `<use>` may require a **local HTTP server** (e.g. `npx serve` from repo root) instead of `file://` depending on browser. If icons are blank, open the page through a static server.
