# Intelinair Design System

A static HTML/CSS design system aligned with the **Variable Design System (test)** in Figma. Use this document as the **overview and index**; detailed rules live in linked files below.

| Resource | Purpose |
|----------|---------|
| [README.md](./README.md) | Repo intro, legends/charts notes, Figma MCP pointer |
| [design-tokens/README.md](./design-tokens/README.md) | Token files, WCAG contrast guidance |
| [docs/cards.md](./docs/cards.md) | Field cards, modals, radius, actions, tags |
| [docs/field-cards-design-system-instances.md](./docs/field-cards-design-system-instances.md) | Field card instances checklist |
| [docs/empty-states.md](./docs/empty-states.md) | Empty state patterns |
| [docs/figma-mcp.md](./docs/figma-mcp.md) | Figma MCP workflow |
| [docs/myfs-trials-treatments-flow.md](./docs/myfs-trials-treatments-flow.md) | **MyFS MiTrials / treatments** — canonical shell, CSS, naming for new screens |
| [docs/system-voice.md](./docs/system-voice.md) | **Voice & tone** for UI strings (warnings, education); canonical copy for edge cases |

**Figma (source of truth for variables):** [Variable Design System (test)](https://www.figma.com/design/0njyFuWX2qzunGeGrKHyHi/Variable-Design-System--test-?m=dev)

---

## System core (what belongs where)

The **core** is the layered contract for this repo—not a single folder, but how the pieces stack:

| Layer | Role | Where it lives |
|-------|------|----------------|
| **Visual design system** | Tokens, type, components, and icon gallery in one scrollable reference. | [`index.html`](./index.html) — start at **System core** (`#core`) in the in-page nav |
| **Application shell** | Default nav + header + main regions for app-like pages. | [`pages/_template.html`](./pages/_template.html) |
| **Composable implementation** | Variables and reusable styles; shared SVGs. | [`design-tokens/tokens.css`](./design-tokens/tokens.css), [`components/`](./components/), [`assets/icons/`](./assets/icons/) |
| **Product surfaces** | Full-screen or flow demos tied to an app area (Home, Fields, Weather, Scout, Trials, Yield, …). | [`pages/<area>/`](./pages/) — use [`pages/demos/`](./pages/demos/) for experiments |
| **Figma / export captures** | Disposable HTML for MCP or html.to.design; not part of product IA. | [`figma-exports/`](./figma-exports/) — optional; merge policy in [`figma-exports/README.md`](./figma-exports/README.md) |

**Authoring rule:** UI that maps to a primary product destination should live under the matching `pages/<area>/` folder (not loose in `pages/` root). Figma-only or html.to.design capture pages belong in **`figma-exports/`**, not under `pages/<area>/`. Extend tokens and `components/*.css` before inventing parallel styles in a demo.

**Product vocabulary** (how terms map to screens): [`pages/system/product-language.html`](./pages/system/product-language.html). **Voice & tone** (how we phrase UI copy): [`docs/system-voice.md`](./docs/system-voice.md).

---

## Principles

- **Accessibility:** Target **WCAG 2.1 Level AA** for contrast and legibility. Document intentional exceptions (e.g. tertiary or decorative UI). Use paired tokens such as `--color-text-on-brand`, `--color-text-on-success`, etc., when placing text on colored backgrounds. See [design-tokens/README.md](./design-tokens/README.md).
- **Brands:** Refer to colors by **brand name + role** (e.g. **MyFS Red**, **PB Blue**, **Argtrinsic / AG Green**). In CSS, brand-specific ramps are defined in `tokens.css` (e.g. `--color-myfs-*`, `--color-brand-*`).
- **Primitives vs brand:** Use the **primitive blue ramp** for generic UI accents (pills, filters, focus) where the spec calls for “system blue.” Use **brand ramps** for primary CTAs and nav brand areas; swap brand tokens per product.

---

## Design tokens

| File | Use |
|------|-----|
| `design-tokens/tokens.css` | **Primary for apps:** CSS custom properties (`--color-*`, `--spacing-*`, etc.) |
| `design-tokens/tokens.json` | Build tools, documentation, or JS (subset of semantic tokens) |

### Token categories (summary)

- **Color:** Neutrals (0–900), surfaces, text, borders, semantic status (success, warning, error, info), primary/brand primitives, MyFS ramp, cyan ramp, “text on *” pairs for accessible overlays.
- **Spacing:** `xs` (4px) through `5xl` (64px) — see `tokens.json` → `spacing`.
- **Radius:** `sm` through `2xl`, `pill`, `button`, `input` — see `tokens.json` → `radius`.
- **Border width:** `0`–`4` — see `tokens.json` → `border`.
- **Shadow:** `xs`–`xl` — see `tokens.json` → `shadow`.
- **Typography:** Font stack (**Figtree**, system-ui, sans-serif), pixel scale (8–52), line heights, callout defaults — see `tokens.json` → `typography`.
- **Counter badge:** Min width, height, padding, radius, typography, overflow rules (`999+`, hide when zero) — see `tokens.json` → `counterBadge`.

### Web font: Figtree (avoid Inter on export)

The canonical web face is **Figtree** (`--font-family-web` in `tokens.css`, `typography.fontFamily` in `tokens.json`). Figma often defaults to **Inter** for UI kits and Dev Mode CSS—if your exports still show Inter:

1. In **Figma**, set file or style defaults (and any text variables) to **Figtree**; add Figtree via **Fonts** if it is not installed.
2. Re-run **Export** / copy CSS and replace any `Inter` reference with `Figtree`.
3. In hand-written HTML, load Figtree and match the stack used elsewhere:

```html
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

```css
body { font-family: 'Figtree', system-ui, sans-serif; }
```

**Consuming tokens in HTML:**

```html
<link rel="stylesheet" href="design-tokens/tokens.css" />
```

Then reference variables in your CSS, e.g. `color: var(--color-text);`, `padding: var(--spacing-l);`.

---

## Components

CSS lives in **`components/`**. Compose pages by linking `tokens.css` first, then the components you need.

| Stylesheet | Typical use |
|------------|-------------|
| `typography.css` | Type scale, headings, body, muted text |
| `button.css` | Primary, secondary, destructive actions |
| `input.css` | Text fields, labels, validation hints |
| `checkbox.css` | Material-style checkbox (18px, primary + checkmark) |
| `radio.css` | Material-style radio (20px ring, inner dot) |
| `switch.css` | Material-style switch (52×32 track, thumb) |
| `loading.css` | **Spinner** (indeterminate): modals, widgets, panels — not on tables. **Linear bar** + `.loading-linear--table`: **only** above `<table>` (with `data-table.css` shell). Native: system UI (see demo) |
| `progress.css` | Optional determinate **circular** ring (`--progress-indicator-progress` 0–1); not the table bar |
| `data-table.css` | Web data tables — MDC retailer parity; `.ds-data-table-shell` + optional top loading bar from `loading.css` — [docs/data-tables.md](./docs/data-tables.md) |
| `scouting-pill.css` | Scout **category** chips + **combined status** pills (Angular DOM shape); load after Material bundle — [docs/scout-list-table-pills-crop-icons.md](./docs/scout-list-table-pills-crop-icons.md) |
| `ai-assistant-widget.css` | Floating LLM assistant: type or mic (STT); demo `pages/demos/ai-assistant-widget-demo.html` |
| `header.css` | App / page headers |
| `nav.css` | **Web left navigation** — AgMRI retailer **left rail** (`aside.app-nav` + vertical `nav.nav`, SVG icons + labels) and **mobile bottom bar** (`.nav--bottom`). Uses `--nav-*` tokens. Shell / scroll: [docs/primary-pages-layout.md](./docs/primary-pages-layout.md); gold DOM + `href` rules: [.cursor/skills/agmri-left-navigation/SKILL.md](./.cursor/skills/agmri-left-navigation/SKILL.md) |
| `tabs.css` | Tabbed interfaces |
| `view-switcher.css` | Fields toolbar view menu (map / list / thumbnail) — AGMRI `mapViewIcon` + `arrowCollapseIcon` trigger, `mat-menu`–style panel; see `pages/fields/map-view.html` |
| `menu.css` | Menus and menu items |
| `dropdown.css` | Dropdown triggers and panels |
| `filter-pill.css` | Filter / tag pills |
| `modal.css` | Dialogs and overlays |
| `alert.css` | Inline alerts and banners |
| `empty-state.css` | Empty / zero-data states |
| `field-card.css` | Field list cards (summary + detail) — rules in [docs/cards.md](./docs/cards.md) |
| `counter-badge.css` | Numeric badges on tabs/icons |
| `triangle-icons.css` | Directional / status triangle icons |
| `myfs-trials-flow-shell.css` | **MyFS trials / treatments:** MyFS `:root` (incl. map field brand), `.myfs-trials-flow*` — pair with `field-map-view-shell.css` — [docs/myfs-trials-treatments-flow.md](./docs/myfs-trials-treatments-flow.md) |
| `field-map-view-shell.css` | **Fields map view:** `.page-shell`, toolbar, `.map-container`, timeline, controls — shared by `pages/fields/map-view.html` and MyFS MiTrials |

Add new components here with a short description in this table when you introduce them.

---

## Demos and example pages

| Entry | Description |
|-------|-------------|
| `index.html` | Main gallery: **System core** (`#core`), brands, typography, components, example layouts |
| `pages/<area>/` | Standalone demos by app area (`home`, `fields`, `weather`, `scout`, `trials`, `yield`, …) |
| `pages/demos/` | Scratch / variable parity demos |
| `figma-exports/` | Figma / HTML→Design export targets (optional; see folder README) |
| `pages/demos/ios-assistant-widget-screens.html` | iOS-style widget gallery + home placement + assistant sheet interaction |
| `pages/analytics/csv-data-table.html` | Default `data/adam_ford_s170.csv` (paginated, optional hide geometry cols); file picker or any CSV → `data-table.css` |
| `pages/scout/scout-list-view.html` | **Scout list reference:** `data-table` + `scout-farm-table` + category pills + crop SVGs — [docs/scout-list-table-pills-crop-icons.md](./docs/scout-list-table-pills-crop-icons.md) |
| `pages/trials/myfs-mitrials.html` | **Default starter** for MyFS MiTrials (4th layer chip + inline trials SVG replaces grid; Fields toolbar) + `myfs-trials-flow-shell.css` + `field-map-view-shell.css` |

Link new demos from `index.html` when they represent approved patterns.

---

## Workflow

1. **Design in Figma** using the linked file; export or sync variables as needed.
2. **Update tokens** in `tokens.css` / `tokens.json` when Figma variables change; keep JSON and CSS in sync for documented semantic keys.
3. **Style components** in `components/*.css` using token variables — avoid hard-coded hex except rare one-offs (prefer new tokens if reused).
4. **Document** non-obvious behavior in `docs/` and add a row to the Components table above.

---

## Related product UI (reference)

The main README lists **map/chart legend** implementations in the app codebase (`TilesetLegendsComponent`, `LegendChartComponent`, etc.). Those are **not** duplicated as static CSS in this repo; use README for file paths and behavior notes.

---

*Last aligned with repo structure and `tokens.json` — extend this file when you add tokens, components, or major demos.*
