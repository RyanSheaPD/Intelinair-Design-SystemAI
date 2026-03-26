# Field cards — design system instances checklist

Use this list to add instances to your design system (Figma or other). Everything below was created for the **Field cards** and **Field information card** components.

---

## Components

| Item | Description |
|------|--------------|
| **Field card** | Base card: white surface, border, `radius-lg`, `shadow-sm`. Contains optional image block, body (title, subtitle, meta, dividers, row, status/pills, actions). |
| **Field card (detail)** | Variant: `.field-card--detail`. Same as above with optional top image + caption, larger title/body padding, GDD line, and status pills (danger style). |
| **Field card — image block** | Optional top section: square aspect-ratio image + caption text (e.g. map copyright). |
| **Field card — title row** | Title (e.g. field name) with optional star icon (favorite). |
| **Field card — subtitle** | Secondary line (e.g. farm/grower) with optional star. |
| **Field card — meta row** | Horizontal line: acreage, flight (airplane icon + date), crop (icon + label), GDD. Separators between items. |
| **Field card — divider** | Thin horizontal rule (`1px` neutral border) between sections. |
| **Field card — row** | Two-column row (e.g. flight date left, report ID + document icon right). |
| **Field card — status message** | Single line of muted/action-colored text (e.g. "No scouting report"). |
| **Field card — tag (outline)** | Pill/tag: `.field-card__tag`. Light blue border, white background, primary/action text. Used for "Stand count 1", "Weeds 2", "Reports 15", optional "| 13 ac". Clickable. |
| **Field card — status pill (danger)** | `.field-card__status-pill`. Light red background, red border/text, optional icon + value (e.g. "2 ac | 3%"). Used for "Harvest ready", "Replant". |
| **Field card — actions** | Bottom row: two text-only links (e.g. "Field card", "Virtual scout" with binoculars icon). |

---

## Icons (inline SVGs used in demos)

| Icon | Use |
|------|-----|
| **Star (filled)** | Favorite on title and subtitle. Warning color. |
| **Airplane** | Flight date in meta and row. |
| **Corn / crop** | Crop type in meta. |
| **Document** | Report ID. |
| **Binoculars** | "Virtual scout" action. |
| **Network / nodes** | Optional metric in detail card (e.g. 5/15). |
| **Rocket / seedling** | Soy in metrics. |
| **Wheat** | Spring wheat in metrics. |
| **Tractor** | "Harvest ready" status pill. |
| **Refresh / redo** | "Replant" status pill. |

---

## Tokens (already in design-tokens)

- **Surfaces:** `--color-surface`, `--color-neutral-100`
- **Borders:** `--color-border`, `--color-border-strong`
- **Text:** `--color-text`, `--color-text-muted`, `--color-action`
- **Status:** `--color-warning-500`, `--color-primitive-100/300/400`, `--color-danger-100/400/500/900`
- **Spacing:** `--spacing-xs` through `--spacing-l`
- **Radius:** `--radius-lg`, `--radius-pill`
- **Shadow:** `--shadow-sm`
- **Typography:** `--font-family`, `--font-size-11`, `--font-size-12`, `--font-size-14`, `--font-size-16`, `--font-size-18`, `--line-height-tight`

---

## Variants to document

1. **Summary card** — no image; title (optional star); optional subtitle; meta; divider; row (flight + ID); status message **or** tags **or** dates + tags; actions (e.g. Field card + Virtual scout, or Last reports + Virtual scout, or Grower card + View fields).
2. **Detail card** — image + caption; long title + star; long subtitle + star; metrics row (ac, flight, corn, soy, spring wheat); GDD; dividers; row (flight + ID); **status pills** (Harvest ready, Replant); actions.

---

## Files

- **Component:** `components/field-card.css`
- **Demos:** `index.html` → section **Field cards** (6 summary cards + 1 detail card)
