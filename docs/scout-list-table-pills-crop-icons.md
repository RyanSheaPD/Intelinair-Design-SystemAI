# Scout list UI reference — tables, category pills, crop icons

**Purpose:** One place to look up how **AgMRI-style scout list** (and similar retailer grids) combine **data tables**, **scouting category pills**, and **crop column SVGs**. Use this when building or updating static mocks so they stay aligned with live Angular patterns and design tokens.

**Canonical example page:** [`pages/scout/scout-list-view.html`](../pages/scout/scout-list-view.html)  
**Cursor / shell rules:** [`.cursor/rules/agmri-retailer-screen-shell.mdc`](../.cursor/rules/agmri-retailer-screen-shell.mdc)

---

## 1. Tables (list grid)

### Layers

| Layer | File | Role |
|--------|------|------|
| Base table contract | [`components/data-table.css`](../components/data-table.css) | `.ds-data-table-region`, `.ds-data-table-shell`, `.ds-data-table-shell__scroll`, `.ds-data-table`, `.ds-data-table--fixed-height`, cell inner / text truncation, row height tokens. |
| Farm / scout grid chrome | [`components/scout-farm-table.css`](../components/scout-farm-table.css) | Pinned **thumb**, **field**, **farm**, **grower** columns; horizontal rules; `min-width` for wide multi-column lists; modifiers `.scout-farm-table--scout-list`, `.scout-farm-table-shell`, `.scout-farm-table-shell--scroll-xy`. |
| Narrative / structure | [`docs/data-tables.md`](./data-tables.md) | When to use the pattern, generic markup skeleton, Angular parity notes. |

### Markup expectations

- Table classes: `ds-data-table scout-farm-table` (+ `scout-farm-table--scout-list` when the scout list column set is used).
- Sticky pin cells: `scout-list-table__td scout-farm-table__pin scout-farm-table__pin--thumb|field|farm|grower`.
- Body rows: `scout-list-table__row` (and Material-style sort headers in thead where needed).
- **Test harness:** [`test/scout-farm-table.html`](../test/scout-farm-table.html) for the grid without full app chrome.

### Stylesheet load order (typical)

1. `design-tokens/tokens.css`  
2. `components/data-table.css`  
3. `components/scout-farm-table.css`  
4. Other page chrome (`nav.css`, `header.css`, …)  
5. If the page uses Angular Material markup from the workspace bundle: `components/agmri-analysis-workspace-bundle/styles.cef64a1bc5706731.css` **before** scouting pills (below).

---

## 2. Scouting category pills (Categories column)

### Stylesheet

[`components/scouting-pill.css`](../components/scouting-pill.css) — category chips **and** combined workflow status pills (`app-combined-status-pill`).

**Critical:** Link `scouting-pill.css` **after** `styles.cef64a1bc5706731.css` when both are present so pill rules win over Bootstrap / MDC generics.

### Category chip DOM (static mock)

```html
<app-scouting-pill class="margin-right-4">
  <div class="scouting-pill f-14 scouting-pill--accent">
    <div class="title">
      <div class="d-flex align-items-center">
        Stand Count <span class="count">1</span>
      </div>
    </div>
  </div>
</app-scouting-pill>
```

- **Base:** `.scouting-pill.f-14` — cyan surface, interactive-colored label (`--color-interactive`), `padding: 5px 10px`, `border-radius: 20px`, no border.
- **Accent:** `.scouting-pill--accent` — stronger emphasis (border + mixed background); count chip filled with interactive color and white numerals.
- **Count:** `.scouting-pill .count` — small rounded badge on the cyan ramp.

### Tokens (see `design-tokens/tokens.css`)

| Token | Typical use |
|--------|----------------|
| `--color-scouting-category-pill-bg` | Pill background (`#d9f4fd` default). |
| `--color-interactive` | Label and accent affordances (`#04b8f1`). |
| `--color-scouting-category-pill-bg-accent` | Optional override for `.scouting-pill--accent` fill. |

### Status column (separate from category pills)

Same CSS file: `app-combined-status-pill` + `.status.f-14.APPROVED.active` (etc.) + `.status-name`. Do not reuse scouting category classes for workflow status.

---

## 3. Crop column SVGs (Crop / crop type)

### Behavior

- **Color:** The crop **label and icon** follow the active **brand** ramp at the 500 step. In mocks, `.scout-list-table .crop-list` sets `color: var(--color-brand-500, …)`; SVG paths use **`fill="currentColor"`** (not fixed greens) so Pioneer / AgMRI themes apply consistently.
- **Size:** `.scout-list-table .mat-icon.crop-image` uses **`width` / `height: calc(14px * 1.25)`** to match `.f-14` text line box (`font-size: 14px`, `line-height: 1.25`). Inner `<svg>` is `width: 100%; height: 100%`; omit fixed `width`/`height` attributes on the SVG element.

### Canonical assets (repo)

| Crop | Asset | Notes |
|------|--------|--------|
| Soybean | [`assets/icons/crops/soybean.svg`](../assets/icons/crops/soybean.svg) | `viewBox="0 0 22 22"`, `fill="currentColor"`. |
| Hay | [`assets/icons/crops/hay.svg`](../assets/icons/crops/hay.svg) | `viewBox="0 0 24 24"`, path `id="ag-crop-hay"`, `fill="currentColor"`. |
| Alfalfa | [`assets/icons/crops/alfalfa.svg`](../assets/icons/crops/alfalfa.svg) | `viewBox="0 0 18 24"`, group `id="ag-crop-alfalfa"`, local `clipPath` id `ag-crop-alfalfa-clip`, `fill="currentColor"`. |
| Canola | [`assets/icons/crops/canola.svg`](../assets/icons/crops/canola.svg) | `viewBox="0 0 22 22"`, path `id="ag-crop-canola"`, `fill="currentColor"`. |
| Cotton | [`assets/icons/crops/cotton.svg`](../assets/icons/crops/cotton.svg) | `viewBox="0 0 22 22"`, path `id="ag-crop-cotton"`, `fill-rule` / `clip-rule` evenodd, `fill="currentColor"`. |
| Barley | [`assets/icons/crops/barley.svg`](../assets/icons/crops/barley.svg) | `viewBox="0 0 22 22"`, path `id="ag-crop-barley"`, same geometry as cotton until a dedicated barley path ships. |
| Oats | [`assets/icons/crops/oats.svg`](../assets/icons/crops/oats.svg) | Tight `viewBox` (`7.15 0.2 6.5 9.85`) around the glyph; path `id="ag-crop-oats"`, `fill="currentColor"`. |

Corn and wheat / winter wheat glyphs in **`scout-list-view.html`** are inlined with the same `currentColor` + `viewBox` conventions (corn `0 0 22 22`; wheat glyph uses tight `viewBox="11.85 -0.05 10.25 21.1"`). Keep inline `d` values in sync with product exports when icons change.

### Crop chips (yield / analytics)

[`pages/yield/yield-forecast-card.html`](../pages/yield/yield-forecast-card.html) — `.crop-chip__surface` uses brand tokens with app-primary fallbacks; icons share the **14px × 1.25** box with labels.

---

## 4. Quick index (by question)

| Question | Where to look |
|----------|----------------|
| Full-page scout list mock | `pages/scout/scout-list-view.html` |
| Table shell + row height | `docs/data-tables.md`, `components/data-table.css` |
| Pinned farm columns + scroll | `components/scout-farm-table.css` |
| Category pill colors / DOM | `components/scouting-pill.css`, §2 above |
| Crop icon color / size | This doc §3; `scout-list-view.html` embedded `<style>` for `.crop-list` / `.mat-icon.crop-image` |
| Crop SVG files (repo) | `soybean.svg`, `hay.svg`, `alfalfa.svg`, `canola.svg`, `cotton.svg`, `barley.svg`, `oats.svg` under `assets/icons/crops/` |
| App shell + nav parity | `.cursor/rules/agmri-retailer-screen-shell.mdc`, `docs/primary-pages-layout.md` |

---

## Related documentation

- [Data tables](./data-tables.md) — default table layout and tokens.
- [Primary pages layout](./primary-pages-layout.md) — shell and scroll ownership.
- [Cards](./cards.md) — field cards (different surface than list tables).
