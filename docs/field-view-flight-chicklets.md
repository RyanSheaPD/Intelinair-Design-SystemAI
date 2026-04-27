# Field map flight chicklets (retailer flight list)

Static HTML in `pages/scout/field-view-screen.html` mirrors the **Angular retailer field map** strip: `app-retailer-flight-list` + `app-flight-navigation` + optional `app-retailer-scouting`.

**Repeatable component:** put root class **`field-map-flight-strip`** on the strip host (e.g. `<footer>`). Legacy alias **`field-view__timeline`** still matches the same rules. **Stylesheet:** `components/field-map-flight-strip.css` (semantic tokens `--color-field-map-flight-strip-*`, `--color-field-map-flight-*` in `design-tokens/tokens.css`). Older links to `components/field-view-flight-chicklets.css` re-export the same file. **Strip-only demo:** `pages/scout/field-map-flight-strip-component.html`.

## Outer shell

| Live (Angular) | Role |
|----------------|------|
| `div.flight-actions-container` | Row: flight list + scouting actions |
| `app-retailer-flight-list` | Host for seasons, activity filter, horizontal flight strip |
| `div.flights-list-container.pointer-events-all.w-100` | Card-like strip (dark translucent in app) |

## Rows inside `flights-list-container`

1. **Season** — `div.seasons` + `span.flight-season-select.mat-mdc-menu-trigger` (opens season `mat-menu`).
2. **Activity filter** — `app-activities` → `div.providers-container` → `div.selection.mat-mdc-menu-trigger` (“All activities” menu).
3. **Flight navigation** — `app-flight-navigation` → `div.flight-navigation-container`:
   - `span.left-nav.cursor-pointer` — scroll left (chevron SVG / FA).
   - `div.flights-scroll-wrapper` — clips overflow.
   - `div.flights-list.position-relative.flight-slider.overflow-hidden` — horizontal flex of **flight elements**.
   - `span.right-nav.cursor-pointer` — scroll right (may be `invisible` when there is no overflow).

## Flight element (one “chicklet”)

| Live | Meaning |
|------|---------|
| `div.flight-element` | One activity / flight tile (static demo uses `<button type="button">` for focus + semantics). |
| `id` | Flight or activity code (e.g. `FZ3D7CYAF`, `67BCUZV16`). |
| Classes on same node | **Provider / type** token from app: `Equipment_Tillage`, `Main`, `Equipment_Planter`, `Equipment_Application`, `Scouting`, `Equipment_Harvest`, … |
| `selected` | Current tile (with `Equipment_*` / `Main` / `Scouting` as needed). |

Inner layout (live):

- `div.d-flex.flex-column.align-items-center.position-relative`
  - `div.d-flex.align-content-center` — holds `mat-icon.provider-icon` (SVG) + optional `span.resolution-index` (badge / index).
  - `span.activity-date` — short date label (e.g. `Apr 25`, `Oct 30`).

`mat-icon` uses `data-mat-icon-name` (e.g. `Equipment_Tillage`, `Main`, `Scouting`) for the correct glyph. **Canonical SVGs** live next to crop glyphs under [`assets/icons/crops/`](../assets/icons/crops/README.md) (root `<svg id="icon">`, paths use `fill="currentColor"`). **`pages/scout/field-view-screen.html`** inlines the same geometry (with `<!-- Source: assets/icons/crops/… -->` comments) so icons render reliably without a local HTTP server; edit the **`.svg` files first**, then sync the inline markup.

| `data-mat-icon-name` / flight class token | Canonical file |
|-------------------------------------------|----------------|
| `Equipment_Tillage` | [`equipment-tillage.svg`](../assets/icons/crops/equipment-tillage.svg) |
| `Main` | [`flight-main.svg`](../assets/icons/crops/flight-main.svg) |
| `Equipment_Planter` | [`equipment-planter.svg`](../assets/icons/crops/equipment-planter.svg) |
| `Equipment_Application` | [`equipment-spray.svg`](../assets/icons/crops/equipment-spray.svg) |
| `Scouting` | [`scouting-flight.svg`](../assets/icons/crops/scouting-flight.svg) |
| `Equipment_Harvest` | [`equipment-harvest.svg`](../assets/icons/crops/equipment-harvest.svg) |

**Clip paths:** live SVG sometimes uses `clip-path="url('/retailer/...#id')"` — invalid offline. Canonical planter art omits the redundant full-viewBox clip. For external `<use>`, use a local HTTP server if icons do not render under `file://` (see crops `README.md`).

## Scouting FAB (field map)

Sibling row: `div.d-flex.align-items-start` → `app-retailer-scouting` → `div.scout-button-container` → `button.mat-mdc-menu-trigger` + `mat-icon` (`scoutIcon`). Opens scout menu in app.

## Design-system mapping

| Live concept | Static demo |
|--------------|-------------|
| `flights-list-container` | Same class; styled in `field-map-flight-strip.css` on `:is(.field-map-flight-strip, .field-view__timeline)`. |
| `flight-element` + provider classes | Same; `selected` = active tile. |
| `activity-chicklet` / `activity-timeline__track` | **Not** the same DOM as live flight list; those classes are for simpler timeline mocks in `activity-chicklet.css`. Field view uses **flight-element** to match retailer map. |
