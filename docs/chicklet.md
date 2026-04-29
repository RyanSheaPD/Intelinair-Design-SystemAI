# Chicklet (`components/chicklet.css`)

Small **icon + date/label** tiles used in horizontal strips (field map flights, activity timelines).

## When to use which stylesheet

| Context | Stylesheet | Markup |
|--------|------------|--------|
| New static pages / DS demos | **`chicklet.css`** | `.chicklet` + `.chicklet__inner` + `.chicklet__icon-row` + `.chicklet__label` |
| Retailer field map bottom bar (Angular parity) | **`field-map-flight-strip.css`** | `button.flight-element` + `.flight-element__inner` — see [field-view-flight-chicklets.md](./field-view-flight-chicklets.md) |
| Material Symbols timeline mocks | **`activity-chicklet.css`** | `.activity-chicklet` on `<button>` inside `.activity-timeline` |

Tokens: `--color-field-map-flight-strip-chicklet-*` and `--color-field-map-flight-*` in `design-tokens/tokens.css`.

## Anatomy

- **Root** — `<button type="button" class="chicklet chicklet--scouting">` (or `<a>` with same classes). Use `aria-pressed` or `.chicklet--selected` for the active tile.
- **`chicklet__inner`** — bordered surface (44×44 default).
- **`chicklet__icon-row`** — optional **`chicklet__icon-wrap`** for **`chicklet__badge`** overlay.
- **`chicklet__icon`** — put **`<img src="assets/icons/timeline/*.svg" width="24" height="24" alt="">`** (filled 24×24 icons: satellite, scout, spray, planting, flight, drone, plant, field, pin) or Material / inline SVG if needed.
- **`chicklet__label`** — short text (e.g. `Apr 25`).

Modifiers: `--tillage`, `--aerial`, `--planter`, `--application`, `--scouting`, `--harvest`, **`chicklet--drone`** (same tint as harvest; use with `drone.svg`); **`chicklet--neutral`**, **`chicklet--satellite`**, **`chicklet--pin`** for map/timeline variants; **`chicklet--compact`** (smaller tile); **`chicklet-row`** on a parent for horizontal scrolling.
