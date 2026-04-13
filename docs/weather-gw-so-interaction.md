# Ground Workability & Spray Outlook — explainability (Weather List + map)

Lightweight patterns to answer **why** a field shows its current **Ground Workability (GW)** or **Spray Outlook (SO)** without drill-in, scores, or prescriptive copy. Same data and HTML builders apply to **list**, **map popovers**, and **LLM** (`WeatherGroundSprayLogic`, `window.__WEATHER_LIST_EXPORT_FOR_LLM__()`).

## Status labels & colors

| GW | Color |
|----|--------|
| Good | Green `#15803d` |
| Mostly Fit | Yellow `#ca8a04` |
| Marginal | Orange `#ea580c` |
| Not Fit | Red `#c41e3a` |

| SO (consolidated + per-metric pills) | Color |
|--------------------------------------|--------|
| Good | Green |
| Marginal | Orange |
| At Risk | Red |

No composite “spray score” or numeric rank in the UI.

---

## Web — hover / focus (fine pointer + hover)

**Trigger:** Pointer hover or keyboard focus on the GW or SO cell (color bar + label).

**GW tooltip**

- Section label: Ground workability  
- Color swatch + **status** (colored type)  
- **Soil moisture index** (raw value, 3 decimals)  
- **Status** (repeat as text)  
- One factual sentence: IBM index band (threshold explanation)  
- Note: source + “values describe current band only”  
- **Last updated** (localized timestamp)

**SO tooltip**

- Section label: Spray outlook  
- Swatch + **consolidated status** + subline: AND across five metrics, no composite score  
- **Five rows** (wind 12h, daily high, daily low, precip 24h, humidity): each shows **value**, **Good / Marginal / At Risk pill** (color-coded), and one factual threshold line  
- Rows that are not **Good** use **limiting** styling (left accent)  
- **Limiting factor(s)** block:  
  - **All Good:** “All five metrics are Good.”  
  - **One not Good:** single heading “Limiting factor” + one line per item with pill + label  
  - **Several:** “Limiting factors” + list  
- Note: definitions of wind / temps / precip window  
- **Last updated**

**Copy rules:** Describe values and bands only. No “you should spray” / “wait until…” language.

**Reference:** `pages/weather/agmri-weather.html` + `pages/js/weather-list-init.js` (hover path) + `buildWorkabilityDetailHTML` / `buildSprayDetailHTML` in `pages/js/weather-ground-spray-logic.js`.

---

## Mobile (iOS + Android) — tap to expand

**Detection:** `html.weather-coarse-pointer` when `(hover: none)` or `(pointer: coarse)`.

**Trigger:** Tap GW or SO cell. **Affordance:** small chevron cue on the cell; `cursor: pointer`; `role="button"` + `aria-expanded`.

**Pattern:** **Bottom sheet** (design system `bottom-sheet.css`): drag handle, title = GW or SO, subtitle = **field name**, body = **same HTML** as web tooltip (inner brand line hidden in sheet to avoid duplicate title).

**Dismiss:** Scrim tap, close control, `Escape`. `aria-expanded` returns to `false` on the active cell.

**Reference:** `#gw-so-scrim`, `#gw-so-sheet` in `pages/weather/agmri-weather.html`.

---

## Map view

Use the **same** `buildWorkabilityDetailHTML` / `buildSprayDetailHTML` output inside the field pin / callout (web: anchored popover; mobile: same bottom sheet or full-width panel). Data must match list rows for that `field_id`.

---

## Acceptance states (design QA)

1. **SO — all Good**  
   - Five green pills; limiting block = “All five metrics are Good.”; consolidated Good + green swatch.

2. **SO — single limiting factor**  
   - One metric row with accent + non-Good pill; limiting block title singular; consolidated reflects AND (e.g. one At Risk → At Risk).

3. **SO — multiple limiting factors**  
   - Several accented rows; limiting list has multiple lines; consolidated matches rules (any At Risk → At Risk; else any Marginal → Marginal).

4. **GW**  
   - Index + status always visible; color matches band; no extra score.

---

## Files

| File | Role |
|------|------|
| `pages/js/weather-ground-spray-logic.js` | Thresholds, AND logic, `buildWorkabilityDetailHTML`, `buildSprayDetailHTML` |
| `pages/js/weather-list-init.js` | Hover vs coarse routing, sheet open/close |
| `pages/weather/agmri-weather.html` | Tooltip + sheet styles, sheet DOM |
| `data/weather-ground-spray-dataset.json` | Demo rows |
