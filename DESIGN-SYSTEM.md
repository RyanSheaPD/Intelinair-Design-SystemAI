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

**Figma (source of truth for variables):** [Variable Design System (test)](https://www.figma.com/design/0njyFuWX2qzunGeGrKHyHi/Variable-Design-System--test-?m=dev)

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
| `data-table.css` | Web data tables — MDC retailer parity; `.ds-data-table-shell` + optional top loading bar from `loading.css` |
| `ai-assistant-widget.css` | Floating LLM assistant: type or mic (STT); demo `pages/ai-assistant-widget-demo.html` |
| `header.css` | App / page headers |
| `nav.css` | Navigation patterns |
| `tabs.css` | Tabbed interfaces |
| `menu.css` | Menus and menu items |
| `dropdown.css` | Dropdown triggers and panels |
| `filter-pill.css` | Filter / tag pills |
| `modal.css` | Dialogs and overlays |
| `alert.css` | Inline alerts and banners |
| `empty-state.css` | Empty / zero-data states |
| `field-card.css` | Field list cards (summary + detail) — rules in [docs/cards.md](./docs/cards.md) |
| `counter-badge.css` | Numeric badges on tabs/icons |
| `triangle-icons.css` | Directional / status triangle icons |

Add new components here with a short description in this table when you introduce them.

---

## Demos and example pages

| Entry | Description |
|-------|-------------|
| `index.html` | Main gallery: colors, typography, components, example layouts |
| `pages/` | Standalone demos (scouting, wheat field card, analytics, disease risk, etc.) |
| Root HTML files | e.g. `yield-forecast-card.html`, `test-brand-cards.html`, brand-specific previews |
| `pages/ios-assistant-widget-screens.html` | iOS-style widget gallery + home placement + assistant sheet interaction |
| `pages/csv-data-table.html` | Default `data/adam_ford_s170.csv` (paginated, optional hide geometry cols); file picker or any CSV → `data-table.css` |

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
